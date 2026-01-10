import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, hashPassword, verifyPassword } from '@/lib/auth';
import { db } from '@/lib/db';

// GET /api/admin/profile - 获取当前管理员资料
export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 获取最新数据
        const profile = await (db.user as any).findUnique({
            where: { id: user.id },
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                role: true,
                avatar: true,
                bio: true,
                expertise: true,
                website: true,
                twitter: true,
                linkedin: true,
                github: true,
                createdAt: true,
            }
        });

        if (!profile) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(profile);
    } catch (error: any) {
        console.error('Error fetching profile:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PUT /api/admin/profile - 更新个人资料或修改密码
export async function PUT(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            name,
            username,
            avatar,
            bio,
            expertise,
            website,
            twitter,
            linkedin,
            github,
            currentPassword,
            newPassword,
        } = body;

        // 如果包含密码修改请求
        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json({ error: '请输入当前密码以验证身份' }, { status: 400 });
            }

            // 验证当前密码
            const dbUser = await db.user.findUnique({
                where: { id: user.id },
            });

            if (!dbUser) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            const isValid = await verifyPassword(currentPassword, dbUser.password);
            if (!isValid) {
                return NextResponse.json({ error: '当前密码不正确' }, { status: 400 });
            }

            // 更新密码
            const hashedPassword = await hashPassword(newPassword);
            await db.user.update({
                where: { id: user.id },
                data: { password: hashedPassword },
            });
        }

        // 更新其他信息
        const updatedUser = await (db.user as any).update({
            where: { id: user.id },
            data: {
                name,
                username,
                avatar,
                bio,
                expertise,
                website,
                twitter,
                linkedin,
                github,
            },
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                role: true,
                avatar: true,
                bio: true,
                expertise: true,
                website: true,
                twitter: true,
                linkedin: true,
                github: true,
                updatedAt: true,
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error: any) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
