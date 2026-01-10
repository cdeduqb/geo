import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/public/copyright - 获取公开的版权信息（无需登录）
export async function GET() {
    try {
        // 尝试从 systemSetting 获取版权信息
        const copyrightSetting = await db.systemSetting.findUnique({
            where: { key: 'copyright' }
        });

        if (copyrightSetting?.value) {
            return NextResponse.json({ copyright: copyrightSetting.value });
        }

        // 尝试从 site_settings JSON 获取
        const siteSettings = await db.systemSetting.findUnique({
            where: { key: 'site_settings' }
        });

        if (siteSettings?.value) {
            try {
                const parsed = JSON.parse(siteSettings.value);
                if (parsed.copyright) {
                    return NextResponse.json({ copyright: parsed.copyright });
                }
            } catch (e) {
                console.error('Failed to parse site_settings:', e);
            }
        }

        // 返回默认版权信息
        const currentYear = new Date().getFullYear();
        return NextResponse.json({
            copyright: `© ${currentYear} 企业官网. All rights reserved.`
        });
    } catch (error) {
        console.error('Error fetching copyright:', error);
        const currentYear = new Date().getFullYear();
        return NextResponse.json({
            copyright: `© ${currentYear} 企业官网. All rights reserved.`
        });
    }
}
