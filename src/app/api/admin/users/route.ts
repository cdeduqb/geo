import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser, hashPassword } from '@/lib/auth';

// GET /api/admin/users - 列出所有协作账号 (仅超级管理员可操作)
export async function GET() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || currentUser.role !== 'ADMIN') {
            return NextResponse.json({ error: '未经授权' }, { status: 401 });
        }

        const users = await db.user.findMany({
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                role: true,
                permissions: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error('获取账号列表失败:', error);
        return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
    }
}

// POST /api/admin/users - 创建协作账号 (仅超级管理员可操作)
export async function POST(request: NextRequest) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || currentUser.role !== 'ADMIN') {
            return NextResponse.json({ error: '未经授权' }, { status: 401 });
        }

        const body = await request.json();
        const { email, username, password, name, role, permissions } = body;

        if (!email || !password || !role) {
            return NextResponse.json({ error: '邮箱、密码和角色为必填项' }, { status: 400 });
        }

        // 校验唯一性
        const existingEmail = await db.user.findUnique({
            where: { email },
        });
        if (existingEmail) {
            return NextResponse.json({ error: '该邮箱已被注册' }, { status: 400 });
        }

        if (username) {
            const existingUsername = await db.user.findUnique({
                where: { username },
            });
            if (existingUsername) {
                return NextResponse.json({ error: '该用户名已被使用' }, { status: 400 });
            }
        }

        // 哈希密码
        const hashedPassword = await hashPassword(password);

        const newUser = await db.user.create({
            data: {
                email,
                username: username || null,
                password: hashedPassword,
                name: name || null,
                role,
                permissions: permissions || [],
            },
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                role: true,
                permissions: true,
            }
        });

        return NextResponse.json(newUser);
    } catch (error) {
        console.error('创建账号失败:', error);
        return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
    }
}

// PUT /api/admin/users - 更新协作账号 (仅超级管理员可操作)
export async function PUT(request: NextRequest) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || currentUser.role !== 'ADMIN') {
            return NextResponse.json({ error: '未经授权' }, { status: 401 });
        }

        const body = await request.json();
        const { id, email, username, password, name, role, permissions } = body;

        if (!id) {
            return NextResponse.json({ error: '账号ID是必填项' }, { status: 400 });
        }

        // 查找目标用户
        const targetUser = await db.user.findUnique({
            where: { id },
        });

        if (!targetUser) {
            return NextResponse.json({ error: '找不到该账号' }, { status: 404 });
        }

        // 校验邮箱冲突
        if (email && email !== targetUser.email) {
            const existingEmail = await db.user.findUnique({
                where: { email },
            });
            if (existingEmail) {
                return NextResponse.json({ error: '该邮箱已被其他账号使用' }, { status: 400 });
            }
        }

        // 校验用户名冲突
        if (username && username !== targetUser.username) {
            const existingUsername = await db.user.findUnique({
                where: { username },
            });
            if (existingUsername) {
                return NextResponse.json({ error: '该用户名已被其他账号使用' }, { status: 400 });
            }
        }

        const dataToUpdate: any = {
            email,
            username: username || null,
            name: name || null,
            role,
            permissions: permissions || [],
        };

        // 如果输入了密码，则进行哈希并更新
        if (password && password.trim() !== '') {
            dataToUpdate.password = await hashPassword(password);
        }

        const updatedUser = await db.user.update({
            where: { id },
            data: dataToUpdate,
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                role: true,
                permissions: true,
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('修改账号失败:', error);
        return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
    }
}

// DELETE /api/admin/users - 删除协作账号 (仅超级管理员可操作)
export async function DELETE(request: NextRequest) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || currentUser.role !== 'ADMIN') {
            return NextResponse.json({ error: '未经授权' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: '账号ID是必填项' }, { status: 400 });
        }

        // 自我保护：禁止超级管理员注销自身账号
        if (id === currentUser.id) {
            return NextResponse.json({ error: '禁止注销您当前登录的超级管理员账号' }, { status: 400 });
        }

        await db.user.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('删除账号失败:', error);
        return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
    }
}
