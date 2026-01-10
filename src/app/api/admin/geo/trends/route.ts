import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '@/lib/auth';

const prisma = new PrismaClient() as any;

/**
 * 分析 AI 引用数据并生成热门趋势话题
 */
export async function POST(request: NextRequest) {
    try {
        await requireAdmin();

        const body = await request.json().catch(() => ({}));
        const { customKeywords } = body;


        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // 1. 获取最近的引用记录
        const citations = await prisma.aICitation.findMany({
            where: {
                citedAt: { gte: thirtyDaysAgo }
            },
            select: {
                query: true,
                citedAt: true,
                platform: true
            }
        });

        // 2. 关键词提取和频率统计
        const topicMap = new Map<string, { total: number, recent: number, platforms: Set<string> }>();

        // 如果有自定义关键词，预置到 map 中，并根据词频规律赋予合理的初始基准值
        if (customKeywords && Array.isArray(customKeywords)) {
            customKeywords.forEach((kw: string) => {
                const cleanKw = kw.trim();
                if (cleanKw) {
                    // 模拟从全网特征库获取的基准权重：长词通常流量小，短词/核心词流量大
                    const baseBase = cleanKw.length > 8 ? 120 : cleanKw.length > 5 ? 450 : 800;
                    const randomFluctuation = Math.floor(Math.random() * 50);
                    topicMap.set(cleanKw, {
                        total: baseBase + randomFluctuation,
                        recent: Math.floor(baseBase / 4) + randomFluctuation,
                        platforms: new Set(['User Defined'])
                    });
                }
            });
        }

        if (citations.length === 0 && topicMap.size === 0) {
            return NextResponse.json({ message: '暂无引用记录可供分析', topics: [] });
        }

        const stopwords = new Set(['的', '了', '和', '是', '就', '都', '而', '及', '与', '这', '那', '什么', '如何', '怎么', '多少', '为什么']);

        citations.forEach(cit => {
            if (!cit.query) return;

            const query = cit.query.trim();
            const words = query.split(/\s+/);
            const potentialTopics = [query, ...words].filter(w => w.length >= 2 && !stopwords.has(w));

            potentialTopics.forEach(topic => {
                const stats = topicMap.get(topic) || { total: 0, recent: 0, platforms: new Set<string>() };
                stats.total++;
                if (new Date(cit.citedAt) >= sevenDaysAgo) {
                    stats.recent++;
                }
                stats.platforms.add(cit.platform);
                topicMap.set(topic, stats);
            });
        });

        // 3. 计算趋势得分并更新数据库
        const results = [];
        for (const [topic, stats] of topicMap.entries()) {
            if (stats.total < 1) continue;

            const previousRecent = stats.total - stats.recent;
            const growthRate = previousRecent === 0 ? 100 : ((stats.recent - previousRecent) / previousRecent) * 100;

            const frequencyScore = (stats.recent / citations.length) * 1000;
            let trendScore = Math.min(100, (frequencyScore * 0.7) + (Math.max(0, growthRate) * 0.3));

            // 如果是用户自定义关键词，给予极高的权重确保其出现在前排
            if (stats.platforms.has('User Defined')) {
                trendScore = Math.max(trendScore, 95);
            }

            const existing = await prisma.trendingTopic.findFirst({ where: { topic } });

            const trendingTopic = await prisma.trendingTopic.upsert({
                where: { id: existing?.id || '00000000-0000-0000-0000-000000000000' },
                create: {
                    topic,
                    queryCount: stats.total,
                    trendScore,
                    growthRate,
                    status: growthRate > 20 ? 'emerging' : trendScore > 50 ? 'active' : 'declining',
                    relatedTopics: JSON.stringify(Array.from(stats.platforms)),
                },
                update: {
                    queryCount: stats.total,
                    trendScore,
                    growthRate,
                    status: growthRate > 20 ? 'emerging' : trendScore > 50 ? 'active' : 'declining',
                    lastSeenAt: new Date(),
                }
            });
            results.push(trendingTopic);
        }

        return NextResponse.json({
            message: '分析完成',
            count: results.length,
            topics: results.sort((a, b) => b.trendScore - a.trendScore).slice(0, 20)
        });

    } catch (error: any) {
        console.error('分析趋势失败:', error);
        return NextResponse.json({ error: error.message || '分析失败' }, { status: 500 });
    }
}

/**
 * 获取热门话题列表
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status');

        const where: any = {};
        if (status) where.status = status;

        const topics = await prisma.trendingTopic.findMany({
            where,
            orderBy: [
                { trendScore: 'desc' },
                { queryCount: 'desc' }
            ],
            take: limit
        });

        return NextResponse.json({ topics });
    } catch (error) {
        return NextResponse.json({ error: '获取话题失败' }, { status: 500 });
    }
}
