import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        await requireAdmin();

        const { searchParams } = new URL(request.url);
        const days = parseInt(searchParams.get('days') || '30');

        const since = new Date();
        since.setDate(since.getDate() - days);

        // 总引用数
        const totalCitations = await prisma.aICitation.count({

            where: { citedAt: { gte: since } },
        });

        // 按平台统计
        const byPlatform = await prisma.aICitation.groupBy({
            by: ['platform'],
            where: { citedAt: { gte: since } },
            _count: true,
            orderBy: {
                _count: {
                    platform: 'desc',
                },
            },
        });

        const platformStats = byPlatform.map(item => ({
            platform: item.platform,
            count: item._count,
        }));

        // 按日期趋势 (最近7天)
        const trendDays = 7;
        const trendSince = new Date();
        trendSince.setDate(trendSince.getDate() - trendDays);

        const trendData = [];
        for (let i = trendDays - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const startOfDay = new Date(date.setHours(0, 0, 0, 0));
            const endOfDay = new Date(date.setHours(23, 59, 59, 999));

            const count = await prisma.aICitation.count({
                where: {
                    citedAt: {
                        gte: startOfDay,
                        lte: endOfDay,
                    },
                },
            });

            trendData.push({
                date: startOfDay.toISOString().split('T')[0],
                count,
            });
        }

        // 最受AI关注的文章
        const topArticlesData = await prisma.aICitation.groupBy({
            by: ['articleId'],
            where: { citedAt: { gte: since } },
            _count: true,
            orderBy: {
                _count: {
                    articleId: 'desc',
                },
            },
            take: 10,
        });

        const topArticles = await Promise.all(
            topArticlesData.map(async (item) => {
                const article = await prisma.article.findUnique({
                    where: { id: item.articleId },
                    select: { id: true, title: true, slug: true },
                });
                return {
                    article,
                    citations: item._count,
                };
            })
        );

        // 按引用类型统计
        const byType = await prisma.aICitation.groupBy({
            by: ['citationType'],
            where: { citedAt: { gte: since } },
            _count: true,
        });

        const typeStats = byType.map(item => ({
            type: item.citationType,
            count: item._count,
        }));

        return NextResponse.json({
            totalCitations,
            byPlatform: platformStats,
            trend: trendData,
            topArticles,
            byType: typeStats,
        });
    } catch (error) {
        console.error('获取统计数据失败:', error);
        return NextResponse.json(
            { error: '获取统计数据失败' },
            { status: 500 }
        );
    }
}
