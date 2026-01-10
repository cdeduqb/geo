import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { getAIServiceForUseCase } from '@/lib/ai/service';

/**
 * POST /api/admin/geo/bulk-optimize
 * 批量优化内容，自动生成 FAQ 和 HowTo 的增强元数据
 */
export async function POST(req: NextRequest) {
    try {
        await requireAdmin();
        const { articleIds = [] } = await req.json();

        if (articleIds.length === 0) {
            return NextResponse.json({ error: 'No articles selected' }, { status: 400 });
        }

        const aiService = await getAIServiceForUseCase('WRITING');
        const results = [];

        // 为了防止请求超时，我们只处理前 5 篇，或通过队列处理（这里演示同步处理 3 篇）
        const targets = articleIds.slice(0, 3);

        for (const id of targets) {
            const article = await db.article.findUnique({
                where: { id },
                select: { title: true, content: true, entities: true }
            });

            if (!article) continue;

            const prompt = `
                你是一个 GEO (生成式引擎优化) 专家。请分析以下文章，并提取 2-3 个核心 FAQ (问答) 和 1 个 HowTo (操作步骤，如果适用)。
                
                文章标题: ${article.title}
                内容预览: ${article.content.substring(0, 2000)}
                
                请返回 JSON 格式：
                {
                    "faq": [{ "q": "问题", "a": "答案" }],
                    "howto": { "name": "步骤名称", "steps": ["步骤1", "步骤2"] }
                }
            `;

            try {
                const response = await aiService.generateContent(prompt, { response_format: { type: 'json_object' } });
                const analysis = JSON.parse(response.replace(/```json|```/g, '').trim());

                // 将优化后的数据存入文章的 entities 或自定义扩展字段
                // 这里我们将 FAQ 存入特殊的字段或作为 entities 的一部分
                const currentEntities = article.entities ? (typeof article.entities === 'string' ? JSON.parse(article.entities) : article.entities) : {};

                await db.article.update({
                    where: { id },
                    data: {
                        entities: {
                            ...currentEntities,
                            geoOptimization: {
                                faq: analysis.faq || [],
                                howto: analysis.howto || null,
                                optimizedAt: new Date().toISOString()
                            }
                        }
                    }
                });

                results.push({ id, status: 'success' });
            } catch (e) {
                console.error(`Failed to optimize article ${id}:`, e);
                results.push({ id, status: 'failed' });
            }
        }

        return NextResponse.json({ results });
    } catch (error) {
        console.error('[BulkOptimize] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
