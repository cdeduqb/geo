import { NextResponse } from 'next/server';

/**
 * GET /api/time
 * 获取服务器时间（用于时间同步）
 */
export async function GET() {
    return NextResponse.json({
        timestamp: Date.now(),
        iso: new Date().toISOString()
    });
}
