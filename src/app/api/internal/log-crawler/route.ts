
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { crawler, userAgent, path, ip, referer, statusCode } = body;

        // 简单的安全检查：只允许本机调用（可选）
        // 在生产环境中，建议使用更严格的 shared secret 验证

        if (!crawler || !path) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 异常检测逻辑 (简化版)
        // 检查同一 IP 在过去 1 分钟内的访问次数
        const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
        const recentLogs = await db.crawlerLog.count({
            where: {
                ip,
                createdAt: { gt: oneMinuteAgo }
            }
        });

        const isAbnormal = recentLogs > 60; // 超过 1次/秒 视为异常

        await db.crawlerLog.create({
            data: {
                crawler,
                userAgent,
                path,
                ip,
                referer,
                statusCode: statusCode || 200,
                isAbnormal
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Crawler log error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
