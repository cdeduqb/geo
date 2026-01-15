import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// POST - 保存站点设置 (替代 PUT 方法以解决潜在的 405 问题)
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: '无权限' }, { status: 403 });
        }

        const data = await request.json();

        // 获取现有设置
        let settings = await db.siteSettings.findFirst();

        const updateData = {
            headerSections: data.headerSections,
            footerSections: data.footerSections,
            logo: data.logo,
            favicon: data.favicon,
            siteName: data.siteName,
            primaryColor: data.primaryColor || '#2563eb',
            secondaryColor: data.secondaryColor,
            phone: data.phone,
            email: data.email,
            address: data.address,
            socialLinks: data.socialLinks,
            copyright: data.copyright,
        };

        if (settings) {
            // 更新现有设置
            settings = await db.siteSettings.update({
                where: { id: settings.id },
                data: updateData
            });
        } else {
            // 创建新设置
            settings = await db.siteSettings.create({
                data: updateData
            });
        }

        // 同时更新 SystemSetting 中的 site_settings 键
        try {
            await db.systemSetting.upsert({
                where: { key: 'site_settings' },
                update: {
                    value: JSON.stringify(updateData)
                },
                create: {
                    key: 'site_settings',
                    value: JSON.stringify(updateData),
                    description: '全局站点设置（包含页眉页脚）'
                }
            });
        } catch (syncError) {
            console.error('同步更新 SystemSetting 失败:', syncError);
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('保存站点设置失败:', error);
        return NextResponse.json(
            { error: '保存站点设置失败' },
            { status: 500 }
        );
    }
}
