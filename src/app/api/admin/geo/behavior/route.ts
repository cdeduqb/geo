import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

/**
 * GET /api/admin/geo/behavior
 * 获取并触发深度爬虫行为分析
 */
export async function GET() {
    try {
        await requireAdmin();

        // 查找所有活跃爬虫
        const crawlers = await db.crawlerLog.groupBy({
            by: ['crawler'],
        });

        const behaviors = [];

        for (const { crawler } of crawlers) {
            const logs = await db.crawlerLog.findMany({
                where: { crawler },
                orderBy: { createdAt: 'desc' },
                take: 1000 // 最近 1000 条进行分析
            });

            if (logs.length === 0) continue;

            // 1. 平均访问时间（小时）
            const hours = logs.map(l => l.createdAt.getHours());
            const avgVisitHour = Math.round(hours.reduce((a, b) => a + b, 0) / hours.length);

            // 2. 高峰时段 (取出现次数前三的小时)
            const hourCounts: { [key: number]: number } = {};
            hours.forEach(h => hourCounts[h] = (hourCounts[h] || 0) + 1);
            const peakHours = Object.entries(hourCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([h]) => parseInt(h));

            // 3. 访问路径偏好
            const pathCounts: { [key: string]: number } = {};
            logs.forEach(l => pathCounts[l.path] = (pathCounts[l.path] || 0) + 1);
            const preferredPaths = Object.entries(pathCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([p]) => p);

            // 4. 访问频率（次/天）
            const firstDate = logs[logs.length - 1].createdAt;
            const lastDate = logs[0].createdAt;
            const diffDays = Math.max(1, (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
            const visitFrequency = logs.length / diffDays;

            // 更新到数据库
            const behavior = await (db as any).crawlerBehavior.upsert({
                where: { crawler },
                update: {
                    avgVisitHour,
                    peakHours: JSON.stringify(peakHours),
                    preferredPaths: JSON.stringify(preferredPaths),
                    visitFrequency,
                    lastAnalyzed: new Date(),
                },
                create: {
                    crawler,
                    avgVisitHour,
                    peakHours: JSON.stringify(peakHours),
                    preferredPaths: JSON.stringify(preferredPaths),
                    visitFrequency,
                    lastAnalyzed: new Date(),
                }
            });

            behaviors.push(behavior);
        }

        return NextResponse.json({ behaviors });
    } catch (error) {
        console.error('[CrawlerBehavior] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
