
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        await requireAdmin();

        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const crawler = searchParams.get('crawler'); // 可选筛选
        const onlyAbnormal = searchParams.get('abnormal') === 'true';

        const where: any = {};
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
