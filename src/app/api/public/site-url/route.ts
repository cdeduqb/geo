import { NextResponse } from 'next/server';
import { getSiteUrl } from '@/lib/system-settings';

/**
 * 公共 API：获取系统配置的站点 URL
 * 用于前端组件获取正确的基础 URL（如 SEO 推送）
 */
export async function GET() {
    try {
        const siteUrl = await getSiteUrl();

        return NextResponse.json({
            siteUrl,
            // 提供额外的诊断信息（可选）
            isLocalhost: siteUrl.includes('localhost') || siteUrl.includes('127.0.0.1'),
        });
    } catch (error) {
        console.error('[API] Failed to get site URL:', error);
        return NextResponse.json({
            siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
            isLocalhost: true,
            error: 'Failed to fetch from database'
        });
    }
}
