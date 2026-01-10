import { NextRequest, NextResponse } from 'next/server';
import { login, createSession } from '@/lib/auth';
import { checkRateLimit, RateLimitPresets } from '@/lib/security/rate-limit';

export async function POST(request: NextRequest) {
    // 速率限制：防止暴力破解
    const rateLimitResponse = checkRateLimit(request, RateLimitPresets.LOGIN);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        const body = await request.json();
        const { identifier, password } = body;

        if (!identifier || !password) {
            return NextResponse.json(
                { error: '账号和密码不能为空' },
                { status: 400 }
            );
        }

        const user = await login(identifier, password);

        if (!user) {
            return NextResponse.json(
                { error: '账号或密码错误' },
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
