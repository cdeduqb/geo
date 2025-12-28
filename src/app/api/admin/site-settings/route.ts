import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET - 获取站点设置
export async function GET() {
    try {
        // 获取或创建默认设置
        let settings = await db.siteSettings.findFirst();

        if (!settings) {
            // 创建默认设置
            settings = await db.siteSettings.create({
                data: {
                    primaryColor: '#2563eb',
                    siteName: '企业官网',
                }
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('获取站点设置失败:', error);
        return NextResponse.json(
            { error: '获取站点设置失败' },
            { status: 500 }
        );
    }
}

// PUT - 更新站点设置
export async function PUT(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: '无权限' }, { status: 403 });
        }

        const data = await request.json();

        // 获取现有设置
        let settings = await db.siteSettings.findFirst();

        if (settings) {
            // 更新现有设置
            settings = await db.siteSettings.update({
                where: { id: settings.id },
                data: {
                    headerSections: data.headerSections,
                    footerSections: data.footerSections,
                    logo: data.logo,
                    favicon: data.favicon,
                    siteName: data.siteName,
                    primaryColor: data.primaryColor,
                    secondaryColor: data.secondaryColor,
                    phone: data.phone,
                    email: data.email,
                    address: data.address,
                    socialLinks: data.socialLinks,
                    copyright: data.copyright,
                }
            });
        } else {
            // 创建新设置
            settings = await db.siteSettings.create({
                data: {
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
                }
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('更新站点设置失败:', error);
        return NextResponse.json(
            { error: '更新站点设置失败' },
            { status: 500 }
        );
    }
}
