import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// 公开 API：获取激活的 SEO 脚本配置
// 这个 API 不需要认证，因为脚本需要在前台页面执行
export async function GET() {
    try {
        const configs = await db.sEOPushConfig.findMany({
            where: {
                isActive: true,
                script: { not: null }
            },
            select: {
                platform: true,
                script: true
            }
        });

        return NextResponse.json(configs);
    } catch (error) {
        console.error('Failed to fetch SEO scripts:', error);
        return NextResponse.json([]);
    }
}
