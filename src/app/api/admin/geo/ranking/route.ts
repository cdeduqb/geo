import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { getAIServiceForUseCase } from '@/lib/ai/service';

/**
 * GET /api/admin/geo/ranking
 * 获取 AI 搜索排名数据
 */
export async function GET(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const keyword = searchParams.get('keyword');

    try {
        const rankings = await (prisma as any).aISearchRanking.findMany({
            where: keyword ? { keyword: { contains: keyword } } : {},
            include: { article: { select: { title: true, slug: true } } },
            orderBy: { checkedAt: 'desc' },
            take: limit,
        });

        // 聚合最近排名
        const latestRankings = await (prisma as any).aISearchRanking.findMany({
            distinct: ['keyword', 'platform'],
            orderBy: [{ keyword: 'asc' }, { platform: 'asc' }, { checkedAt: 'desc' }],
            include: { article: { select: { title: true, slug: true } } },
        });

        return NextResponse.json({ rankings, latestRankings });
    } catch (error) {
        console.error('[GEORanking] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

/**
 * POST /api/admin/geo/ranking
 * 触发 AI 排名检查
 */
export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { keyword, platforms = ['ChatGPT', 'Perplexity', 'Gemini', 'Claude', '文心一言', '通义千问', 'Kimi', 'DeepSeek', '腾讯混元', '豆包', '智谱清言', '讯飞星火'] } = await req.json();

    if (!keyword) {
        return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
    }

    try {
        const aiService = await getAIServiceForUseCase('GENERAL');

        // 1. 查找最相关的本地文章
        // 优先完全匹配标题，其次包含关键词
        let article = await (prisma as any).article.findFirst({
            where: { title: { equals: keyword } },
            select: { id: true, title: true, content: true, slug: true }
        });

        if (!article) {
            article = await (prisma as any).article.findFirst({
                where: {
                    OR: [
                        { title: { contains: keyword } },
                        { content: { contains: keyword } }
                    ]
                },
                select: { id: true, title: true, content: true, slug: true }
            });
        }

        const results = [];

        if (!article) {
            // 如果没找到相关文章，记录低分
            for (const platform of platforms) {
                await (prisma as any).aISearchRanking.create({
                    data: {
                        keyword,
                        platform,
                        ranking: 100, // Not found
                        mentionRate: 0,
                        context: '未找到相关内容，难以被 AI 引擎收录。建议创建相关文章。',
                        articleId: null,
                        checkedAt: new Date(),
                    }
                });
            }
            return NextResponse.json({ message: 'No relevant articles found', results: [] });
        }

        // 2. 使用 AI 分析内容质量 (GEO Score)
        for (const platform of platforms) {
            const analyzePrompt = `
                你是一位 GEO (Generative Engine Optimization) 专家。
                请详细分析以下文章内容对于关键词 "${keyword}" 在 ${platform} 这种 AI 搜索引擎中的表现潜力。
                
                文章标题: ${article.title}
                文章内容摘要: ${article.content.substring(0, 1500)}...

                评估标准：
                1. 权威性 (Authority)
                2. 结构清晰度 (Structure)
                3. 事实准确性 (Facts)
                4. 对问题的直接回答能力 (Answerability)

                请返回严格的 JSON 格式:
                {
                    "score": number, // 0-100 的评分，代表被 AI 引用或推荐的概率
                    "rankEstimate": number, // 1-20 的预估排名 (分数越高排名越靠前，90分+对应1-3名)
                    "reason": "简短分析原因",
                    "suggestion": "一条具体的优化建议"
                }
            `;

            try {
                const response = await aiService.generateContent(analyzePrompt, { response_format: { type: 'json_object' } });
                const jsonStr = response.replace(/```json|```/g, '').trim();
                const analysis = JSON.parse(jsonStr);

                // 3. 保存更可靠的分析结果
                const ranking = await (prisma as any).aISearchRanking.create({
                    data: {
                        keyword,
                        platform,
                        ranking: analysis.rankEstimate || Math.max(1, Math.floor((100 - (analysis.score || 0)) / 5)),
                        mentionRate: analysis.score || 0,
                        context: `${analysis.reason} | 建议: ${analysis.suggestion}`,
                        articleId: article.id,
                        checkedAt: new Date(),
                    }
                });

                results.push(ranking);
            } catch (e: any) {
                console.warn(`[GEORanking] Analysis failed for ${platform}:`, e);
                // Fallback record
                results.push(await (prisma as any).aISearchRanking.create({
                    data: {
                        keyword,
                        platform,
                        ranking: 50,
                        mentionRate: 0,
                        context: `分析失败: ${e.message}`,
                        articleId: article.id,
                        checkedAt: new Date(),
                    }
                }));
            }
        }

        return NextResponse.json({ message: 'GEO Analysis completed', results });
    } catch (error) {
        console.error('[GEORanking] Check Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

/**
 * DELETE /api/admin/geo/ranking
 * 清空所有排名记录
 */
export async function DELETE(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await (prisma as any).aISearchRanking.deleteMany({});
        return NextResponse.json({ message: 'All rankings cleared' });
    } catch (error) {
        console.error('[GEORanking] Delete Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
