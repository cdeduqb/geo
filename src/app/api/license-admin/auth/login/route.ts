import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient as LicenseClient } from '@prisma/client-license';
import crypto from 'crypto';

const licenseDb = new LicenseClient();

/**
 * POST /api/license-admin/auth/login
 * 授权系统管理员登录
 */
export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: '用户名和密码不能为空' },
                { status: 400 }
            );
        }

        // 查找管理员
        const admin = await licenseDb.admin.findFirst({
            where: {
                OR: [
                    { username },
                    { email: username }
                ]
            }
        });

        if (!admin) {
            return NextResponse.json(
                { error: '用户名或密码错误' },
                { status: 401 }
            );
        }

        // 验证密码
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        if (hashedPassword !== admin.password) {
            return NextResponse.json(
                { error: '用户名或密码错误' },
                { status: 401 }
            );
        }

        // 检查账户状态
        if (admin.status !== 'active') {
            return NextResponse.json(
                { error: '账户已被禁用' },
                { status: 403 }
            );
        }

        // 更新最后登录时间
        await licenseDb.admin.update({
            where: { id: admin.id },
            data: {
                lastLoginAt: new Date(),
                lastLoginIp: request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    'unknown'
            }
        });

        // 生成简单的token（实际生产环境应使用JWT）
        const token = Buffer.from(
            JSON.stringify({
                id: admin.id,
                username: admin.username,
                role: admin.role,
                timestamp: Date.now()
            })
        ).toString('base64');

        return NextResponse.json({
            success: true,
            token,
            admin: {
                id: admin.id,
                username: admin.username,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: '登录失败' },
            { status: 500 }
        );
    }
}
