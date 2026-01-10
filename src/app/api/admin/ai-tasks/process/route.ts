import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { getAIService } from '@/lib/ai/service';
import { sanitizeHTML } from '@/lib/security/sanitize';

// POST /api/admin/ai-tasks/process - Process pending tasks
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { taskId } = body;

        if (!taskId) {
            return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
        }

        // Get the task
        const task = await db.aICreationTask.findUnique({
            where: { id: taskId },
            include: { strategy: true },
        });

        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        if (task.status !== 'PENDING') {
            return NextResponse.json({ error: 'Task is not pending' }, { status: 400 });
        }

        // Update task status to PROCESSING
        await db.aICreationTask.update({
            where: { id: taskId },
            data: { status: 'PROCESSING' },
        });

        try {
            // Build prompt from strategy template
            const prompt = task.strategy.prompt
                .replace(/{topic}/g, task.topic)
                .replace(/{keywords}/g, task.keywords || '')
                .replace(/{length}/g, '1000字');

            // Get AI service and generate content
            const aiService = await getAIService();
            const result = await aiService.generateArticle({
                topic: task.topic,
                keywords: task.keywords || undefined,
                length: 'medium',
                customPrompt: prompt,
            });

            // 🔒 安全关键：清理 AI 生成的内容
            const cleanContent = sanitizeHTML(result.content, 'standard');
            const rawSummary = extractSummary(result.content);
            const cleanSummary = sanitizeHTML(rawSummary, 'strict');

            // 🔍 检测是否有恶意内容被清理
            const contentWasCleaned = cleanContent !== result.content;
            if (contentWasCleaned) {
                console.warn(`[AI Security API] ⚠️ Malicious content detected in task ${taskId}`);
            }

            // Create article
            const article = await db.article.create({
                data: {
                    title: task.topic,
                    slug: generateSlug(task.topic),
                    content: cleanContent,  // ✅ 已清理
                    summary: cleanSummary,  // ✅ 已清理
                    status: 'DRAFT',  // 🔒 草稿状态
                    authorId: user.id,
                    aiGenerated: true,
                    aiPrompt: prompt,
                },
            });

            // 📋 安全审核日志
            console.log(`[AI Security API] ✅ Article ${article.id} created, sanitized: ${contentWasCleaned}`);

            // Update task status to COMPLETED
            await db.aICreationTask.update({
                where: { id: taskId },
                data: {
                    status: 'COMPLETED',
                    articleId: article.id,
                    completedAt: new Date(),
                },
            });

            return NextResponse.json({ success: true, articleId: article.id });
        } catch (error: any) {
            // Update task status to FAILED
            await db.aICreationTask.update({
                where: { id: taskId },
                data: {
                    status: 'FAILED',
                    error: error.message || 'Unknown error',
                },
            });

            throw error;
        }
    } catch (error) {
        console.error('Error processing AI task:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Helper functions
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 50) + '-' + Date.now();
}

function extractSummary(content: string): string {
    // Remove HTML tags and get first 200 characters
    const text = content.replace(/<[^>]*>/g, '');
    return text.substring(0, 200);
}
