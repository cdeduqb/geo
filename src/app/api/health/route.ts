import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * 健康检查端点
 * 用于负载均衡器和运维监控
 */
export async function GET() {
    const health: {
        status: 'healthy' | 'unhealthy';
        timestamp: string;
        checks: {
            database: 'ok' | 'error';
            memory: {
                used: string;
                total: string;
            };
        };
    } = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        checks: {
            database: 'ok',
            memory: {
                used: '0 MB',
                total: '0 MB',
            },
        },
    };

    // 检查数据库连接
    try {
        await db.$queryRaw`SELECT 1`;
        health.checks.database = 'ok';
    } catch {
        health.checks.database = 'error';
        health.status = 'unhealthy';
    }

    // 内存使用情况
    if (typeof process !== 'undefined' && process.memoryUsage) {
        const mem = process.memoryUsage();
        health.checks.memory = {
            used: `${Math.round(mem.heapUsed / 1024 / 1024)} MB`,
            total: `${Math.round(mem.heapTotal / 1024 / 1024)} MB`,
        };
    }

    const statusCode = health.status === 'healthy' ? 200 : 503;
    return NextResponse.json(health, { status: statusCode });
}
