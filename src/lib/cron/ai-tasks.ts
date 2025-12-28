import cron from 'node-cron';
import { db } from '@/lib/db';
import { getAIService } from '@/lib/ai/service';

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

        // Create article
        const article = await db.article.create({
            data: {
                title: task.topic,
                slug: generateSlug(task.topic),
                content: result.content,
                summary: extractSummary(result.content),
                status: 'DRAFT',
                authorId: adminUserId,
                aiGenerated: true,
                aiPrompt: prompt,
            },
        });

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

        // Get the first admin user (fallback for authorId)
        const admin = await db.user.findFirst({
            where: { role: 'ADMIN' },
        });

        if (!admin) {
            console.error('[Cron] No admin user found, skipping task processing');
            return;
        }

        // Get pending tasks (limit to 5 at a time to avoid overwhelming the system)
        const tasks = await db.aICreationTask.findMany({
            where: { status: 'PENDING' },
            include: { strategy: true },
            orderBy: { createdAt: 'asc' },
            take: 5,
        });

        if (tasks.length === 0) {
            console.log('[Cron] No pending tasks found');
            return;
        }

        console.log(`[Cron] Processing ${tasks.length} pending tasks`);

        // Process tasks sequentially
        let successCount = 0;
        for (const task of tasks) {
            const success = await processTask(task, admin.id);
            if (success) successCount++;

            // Add a small delay between tasks to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        console.log(`[Cron] Completed: ${successCount}/${tasks.length} tasks successful`);
    } catch (error) {
        console.error('[Cron] Error processing pending tasks:', error);
    }
}

// Initialize cron jobs
export function initCronJobs() {
    // Run every hour at minute 0
    // Cron format: second minute hour day month weekday
    // '0 * * * *' = every hour at minute 0
    const schedule = process.env.AI_TASK_CRON_SCHEDULE || '0 * * * *';

    console.log(`[Cron] Initializing AI task processor with schedule: ${schedule}`);

    cron.schedule(schedule, processPendingTasks, {
        timezone: 'Asia/Shanghai',
    });

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
