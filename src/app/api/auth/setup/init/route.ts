import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        // 安全检查：只有当系统中没有任何用户时，才允许运行初始化
        const userCount = await db.user.count();
        if (userCount > 0) {
            return NextResponse.json(
                { error: '系统已经安装，禁止重复初始化' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { email, username, password, siteName } = body;

        if (!email || !password || !siteName) {
            return NextResponse.json(
                { error: '必要信息缺失' },
                { status: 400 }
            );
        }

        // 1. 创建管理员账户
        const hashedPassword = await hashPassword(password);
        const admin = await db.user.create({
            data: {
                email,
                username: username || 'admin',
                password: hashedPassword,
                name: '超级管理员',
                role: 'ADMIN',
            }
        });

        // 2. 初始化核心系统设置
        const defaultSettings = [
            { key: 'site_name', value: siteName, description: '网站名称' },
            { key: 'site_url', value: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000', description: '网站域名' },
            { key: 'primaryColor', value: '#2563eb', description: '主题主色调' },
        ];

        for (const s of defaultSettings) {
            await db.systemSetting.upsert({
                where: { key: s.key },
                update: { value: s.value },
                create: s
            });
        }

        // 3. 初始化站点设置 (SiteSettings 模型)
        await db.siteSettings.upsert({
            where: { id: 'default-settings' }, // 虽然没有唯一约束，但我们可以先查再建
            update: { siteName },
            create: {
                id: 'default-settings',
                siteName,
                primaryColor: '#2563eb',
            }
        });

        return NextResponse.json({
            success: true,
            message: '系统初始化成功',
            admin: {
                id: admin.id,
                email: admin.email
            }
        });
    } catch (error) {
        console.error('[Setup Init] Error:', error);
        return NextResponse.json(
            { error: '初始化失败，产生内部错误' },
            { status: 500 }
        );
    }
}
