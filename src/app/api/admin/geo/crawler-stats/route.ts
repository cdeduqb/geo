
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
    try {
        await requireAdmin();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);

        // 并行查询统计数据
        const [
            todayCount,
            weekCount,
            crawlerDistribution,
            dailyTrend,
            pathDistribution,
            abnormalCount
        ] = await Promise.all([
            // 今日抓取量
            db.crawlerLog.count({
                where: { createdAt: { gte: today } }
            }),
            // 本周抓取量
            db.crawlerLog.count({
                where: { createdAt: { gte: weekAgo } }
            }),
            // 爬虫分布 (Top 5)
            db.crawlerLog.groupBy({
                by: ['crawler'],
                _count: { crawler: true },
                orderBy: { _count: { crawler: 'desc' } },
                take: 5
            }),
            // 每日趋势 (最近 7 天) - 由于 Prisma groupby date 不方便，这里用原生查询或 JS 处理
            // 为简化，这里获取最近 7 天所有数据然后在内存聚合（如果数据量很大建议手写 SQL）
            db.crawlerLog.findMany({
                where: { createdAt: { gte: weekAgo } },
                select: { createdAt: true }
            }),
            // 热门页面 (Top 5)
            db.crawlerLog.groupBy({
                by: ['path'],
                _count: { path: true },
                orderBy: { _count: { path: 'desc' } },
                take: 5
            }),
            // 今日异常抓取
            db.crawlerLog.count({
                where: {
                    createdAt: { gte: today },
                    isAbnormal: true
                }
            })
        ]);

        // 处理每日趋势数据
        const trendMap = new Map<string, number>();
        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            trendMap.set(d.toISOString().split('T')[0], 0);
        }

        dailyTrend.forEach(log => {
            const date = log.createdAt.toISOString().split('T')[0];
            if (trendMap.has(date)) {
                trendMap.set(date, (trendMap.get(date) || 0) + 1);
            }
        });

        const trend = Array.from(trendMap.entries())
            .map(([date, count]) => ({ date, count }))
            .reverse();

        return NextResponse.json({
            todayCount,
            weekCount,
            abnormalCount,
            crawlers: crawlerDistribution.map(c => ({ name: c.crawler, value: c._count.crawler })),
            trend,
            topPaths: pathDistribution.map(p => ({ path: p.path, count: p._count.path }))
        });

    } catch (error) {
        console.error('Failed to fetch crawler stats:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
