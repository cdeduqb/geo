import cron from 'node-cron';
import { db } from '@/lib/db';
import { getAIService } from '@/lib/ai/service';
import { sanitizeHTML } from '@/lib/security/sanitize';

// Helper functions
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 50) + '-' + Date.now();
}

function extractSummary(content: string): string {
    const text = content.replace(/<[^>]*>/g, '');
    return text.substring(0, 200);
}

// Process a single task
async function processTask(task: any, adminUserId: string) {
    try {
        // Update status to PROCESSING
        await db.aICreationTask.update({
            where: { id: task.id },
            data: { status: 'PROCESSING' },
        });

        // Build prompt from strategy template
        const prompt = task.strategy.prompt
            .replace(/{topic}/g, task.topic)
            .replace(/{keywords}/g, task.keywords || '')
            .replace(/{length}/g, '1000字');

        // Generate content
        const aiService = await getAIService();
        const result = await aiService.generateArticle({
            topic: task.topic,
            keywords: task.keywords || undefined,
            length: 'medium',
        });

        // 🔒 安全关键：清理 AI 生成的内容
        const cleanContent = sanitizeHTML(result.content, 'standard');
        const rawSummary = extractSummary(result.content);
        const cleanSummary = sanitizeHTML(rawSummary, 'strict');

        // 🔍 检测是否有恶意内容被清理
        const contentWasCleaned = cleanContent !== result.content;
        if (contentWasCleaned) {
            console.warn(`[AI Security] ⚠️ Malicious content detected and cleaned in task ${task.id}`);
            console.warn(`[AI Security] Original length: ${result.content.length}, Cleaned length: ${cleanContent.length}`);
        }

        // Create article
        const article = await db.article.create({
            data: {
                title: task.topic,
                slug: generateSlug(task.topic),
                content: cleanContent,  // ✅ 已清理
                summary: cleanSummary,  // ✅ 已清理
                status: 'DRAFT',  // 🔒 改为草稿，需要人工审核后发布
                authorId: adminUserId,
                categoryId: task.project?.categoryId || task.categoryId || null,
                aiGenerated: true,
                aiPrompt: prompt,
                automationProjectId: task.projectId || null,
            },
        });

        // 📋 安全审核日志
        console.log(`[AI Security] ✅ Article ${article.id} created from AI task ${task.id}`);
        console.log(`[AI Security] Content sanitized: ${contentWasCleaned ? 'YES (threats removed)' : 'NO (clean)'}`);
        console.log(`[AI Security] Status: DRAFT (requires manual review)`);


        // Update task status
        await db.aICreationTask.update({
            where: { id: task.id },
            data: {
                status: 'COMPLETED',
                articleId: article.id,
                completedAt: new Date(),
            },
        });

        console.log(`[Cron] Task ${task.id} completed, article ${article.id} created`);
        return true;
    } catch (error: any) {
        // Update task status to FAILED
        await db.aICreationTask.update({
            where: { id: task.id },
            data: {
                status: 'FAILED',
                error: error.message || 'Unknown error',
            },
        });

        console.error(`[Cron] Task ${task.id} failed:`, error.message);
        return false;
    }
}

// Main cron job function
async function processPendingTasks() {
    try {
        console.log('[Cron] Starting batch task processing...');

        // ===== 首先处理自动化工厂任务 (使用完整管线) =====
        try {
            // 使用数据库配置的 site_url，确保与系统设置一致
            const { getSiteUrl } = await import('@/lib/system-settings');
            const baseUrl = await getSiteUrl();

            // 如果是 localhost，尝试使用内部地址直接调用
            const apiUrl = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')
                ? 'http://localhost:3000/api/admin/articles/automation/process'
                : `${baseUrl}/api/admin/articles/automation/process`;

            console.log(`[Cron] Calling automation API: ${apiUrl}`);

            const factoryRes = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (factoryRes.ok) {
                const factoryResult = await factoryRes.json();
                if (factoryResult.processed > 0) {
                    console.log(`[Cron] Factory pipeline processed ${factoryResult.processed} tasks`);
                }
            } else {
                console.error(`[Cron] Factory API returned status: ${factoryRes.status}`);
            }
        } catch (factoryErr) {
            console.error('[Cron] Factory pipeline call failed:', factoryErr);
        }


        // ===== 然后处理独立任务 (没有关联项目的任务) =====
        // Get the first admin user (fallback for authorId)
        const admin = await db.user.findFirst({
            where: { role: 'ADMIN' },
        });

        if (!admin) {
            console.error('[Cron] No admin user found, skipping standalone task processing');
            return;
        }

        // Get pending standalone tasks (not part of any project)
        const tasks = await db.aICreationTask.findMany({
            where: {
                status: 'PENDING',
                projectId: null, // 只处理独立任务
                OR: [
                    { scheduledAt: null },
                    { scheduledAt: { lte: new Date() } }
                ]
            },
            include: {
                strategy: true,
                project: true,
            },
            orderBy: [{ scheduledAt: 'asc' }, { createdAt: 'asc' }],
            take: 5,
        });

        if (tasks.length === 0) {
            // console.log('[Cron] No pending standalone tasks found at this time');
            return;
        }

        console.log(`[Cron] Found ${tasks.length} standalone tasks ready to process`);

        // Process tasks sequentially
        let successCount = 0;
        for (const task of tasks) {
            const success = await processTask(task, admin.id);
            if (success) successCount++;

            // Add a small delay between tasks to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        console.log(`[Cron] Completed: ${successCount}/${tasks.length} standalone tasks successful`);
    } catch (error) {
        console.error('[Cron] Error processing pending tasks:', error);
    }
}

// Initialize cron jobs
export function initCronJobs() {
    // Prevent multiple initializations in dev mode
    if ((global as any)._aiCronInitialized) {
        console.log('[Cron] AI task processor already initialized');
        return;
    }

    // Run every 10 minutes by default
    // Cron format: second minute hour day month weekday
    const schedule = process.env.AI_TASK_CRON_SCHEDULE || '*/10 * * * *';

    console.log(`[Cron] Initializing AI task processor with schedule: ${schedule}`);

    cron.schedule(schedule, processPendingTasks, {
        timezone: 'Asia/Shanghai',
    });

    (global as any)._aiCronInitialized = true;
    console.log('[Cron] AI task processor initialized');

    // Optional: Run once on startup (after 30 seconds)
    if (process.env.RUN_CRON_ON_STARTUP === 'true') {
        setTimeout(() => {
            console.log('[Cron] Running initial task processing...');
            processPendingTasks();
        }, 30000);
    }
}

// Manual trigger function (can be called from API)
export async function triggerManualProcessing() {
    await processPendingTasks();
}
