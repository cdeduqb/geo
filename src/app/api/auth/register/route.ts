import { NextRequest, NextResponse } from 'next/server';
import { register, createSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, name } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: '邮箱和密码不能为空' },
                { status: 400 }
            );
        }

        // 检查邮箱是否已存在
        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: '该邮箱已被注册' },
                { status: 409 }
            );
        }

        // 创建用户
        const user = await register(email, password, name);

        // 创建会话
        await createSession(user.id);

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('注册错误:', error);
        return NextResponse.json(
            { error: '注册失败，请稍后重试' },
            { status: 500 }
        );
    }
}
