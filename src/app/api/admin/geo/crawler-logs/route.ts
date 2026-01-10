
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        await requireAdmin();

        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '100');
        const crawler = searchParams.get('crawler');
        const onlyAbnormal = searchParams.get('abnormal') === 'true';

        // 计算 7 天前的时间
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // 自动清理 7 天之前的日志
        try {
            await db.crawlerLog.deleteMany({
                where: {
                    createdAt: { lt: sevenDaysAgo }
                }
            });
        } catch (cleanupError) {
            console.error('Failed to cleanup old crawler logs:', cleanupError);
        }

        const where: any = {
            createdAt: { gte: sevenDaysAgo }
        };
        if (crawler) where.crawler = crawler;
        if (onlyAbnormal) where.isAbnormal = true;

        const [logs, total] = await Promise.all([
            db.crawlerLog.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            db.crawlerLog.count({ where })
        ]);

        return NextResponse.json({
            logs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Failed to fetch crawler logs:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
