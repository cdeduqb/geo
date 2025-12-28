import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { getAIServiceForUseCase } from '@/lib/ai/service';

// POST /api/admin/ai-tasks/process-batch - Process all pending tasks
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { limit = 10 } = body; // Process up to 10 tasks at a time

        // Get pending tasks
        const tasks = await db.aICreationTask.findMany({
            where: { status: 'PENDING' },
            include: { strategy: true },
            orderBy: { createdAt: 'asc' },
            take: limit,
        });

        if (tasks.length === 0) {
            return NextResponse.json({ message: 'No pending tasks', processed: 0 });
        }

        const aiService = await getAIServiceForUseCase('WRITING');

        // Process tasks sequentially
        const results = [];
        for (const task of tasks) {
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

                // 1. Generate core content
                console.log(`[BatchAI] Generating article for: ${task.topic}`);
                const result = await aiService.generateArticle({
                    topic: task.topic,
                    keywords: task.keywords || undefined,
                    length: 'medium',
                    customPrompt: prompt
                });

                let content = result.content;

                // 1.1 One-click GEO Optimization
                console.log(`[BatchAI] Optimizing content for GEO: ${task.topic}`);
                const optimizePrompt = `
你是一位专业的 GEO (Generative Engine Optimization) 优化专家。
请对以下文章内容进行深度优化，以提升其在 AI 搜索引擎中的可见度和权重。

文章标题：${task.topic}
关键词：${task.keywords || ''}

待优化内容：
${content}

优化要求：
1. **直接回答 (Direct Answer)**：在文章开头增加一个 50-100 字的摘要段，直接回答文章的核心问题，使用 <strong> 强调核心结论。
2. **结构化数据 (Structured Data)**：增加列表 (ul/ol) 和表格 (table)。
3. **Q&A 模块**：在文章末尾增加一个 "常见问题 (FAQ)" 章节。
4. **格式要求**：只输出 HTML，不要 Markdown 代码块。
`;
                const optimizedContent = await aiService.generateContent(optimizePrompt);
                if (optimizedContent && optimizedContent.length > 100) {
                    content = optimizedContent.replace(/```html/g, '').replace(/```/g, '').trim();
                }

                // 2. Extract GEO Citations (Generative Engine Optimization)
                console.log(`[BatchAI] Extracting citations for: ${task.topic}`);
                const citationPrompt = `
请分析以下文章内容，提取所有值得引用的外部资料、研究、工具、平台和信息来源。
文章内容：
${content}
请识别并提取信息，返回 JSON 格式：{"citations": [{"title": "...", "author": "...", "url": "...", "description": "..."}]}
`;
                const citationRes = await aiService.generateContent(citationPrompt, { response_format: { type: 'json_object' } });
                let citations = [];
                try {
                    citations = JSON.parse(citationRes).citations || [];
                } catch (e) { console.error('Failed to parse citations', e); }

                // 3. Extract GEO Entities
                console.log(`[BatchAI] Extracting entities for: ${task.topic}`);
                const entityPrompt = `
请分析以下文章内容，识别并提取所有关键实体（人物、组织、品牌、技术、地理位置）。
文章内容：
${content}
请识别并提取信息，返回 JSON 格式：{"entities": [{"name": "...", "type": "...", "description": "...", "url": "..."}]}
`;
                const entityRes = await aiService.generateContent(entityPrompt, { response_format: { type: 'json_object' } });
                let entities = [];
                try {
                    entities = JSON.parse(entityRes).entities || [];
                } catch (e) { console.error('Failed to parse entities', e); }

                // Create article
                const article = await db.article.create({
                    data: {
                        title: task.topic,
                        slug: generateSlug(task.topic),
                        content: content,
                        summary: extractSummary(content),
                        status: 'DRAFT',
                        authorId: user.id,
                        aiGenerated: true,
                        aiPrompt: prompt,
                        citations: citations as any,
                        entities: entities as any,
                        seo: {
                            create: {
                                title: task.topic,
                                description: extractSummary(content),
                            }
                        }
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

                results.push({ taskId: task.id, success: true, articleId: article.id });
            } catch (error: any) {
                console.error(`[BatchAI] Failed to process task ${task.id}:`, error);
                // Update task status to FAILED
                await db.aICreationTask.update({
                    where: { id: task.id },
                    data: {
                        status: 'FAILED',
                        error: error.message || 'Unknown error',
                    },
                });

                results.push({ taskId: task.id, success: false, error: error.message });
            }
        }

        const successCount = results.filter(r => r.success).length;
        const failCount = results.filter(r => !r.success).length;

        return NextResponse.json({
            processed: tasks.length,
            success: successCount,
            failed: failCount,
            results,
        });
    } catch (error) {
        console.error('Error processing batch tasks:', error);
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
    // 优先寻找摘要段落或直接回答段落
    const text = content.replace(/<[^>]*>/g, '').trim();
    if (text.length > 200) {
        return text.substring(0, 200) + '...';
    }
    return text;
}

