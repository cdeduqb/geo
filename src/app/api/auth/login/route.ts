import { NextRequest, NextResponse } from 'next/server';
import { login, createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: '邮箱和密码不能为空' },
                { status: 400 }
            );
        }

        const user = await login(email, password);

        if (!user) {
            return NextResponse.json(
                { error: '邮箱或密码错误' },
                { status: 401 }
            );
        }

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
        console.error('登录错误:', error);
        return NextResponse.json(
            { error: '登录失败，请稍后重试' },
            { status: 500 }
        );
    }
}
