import { NextResponse } from 'next/server';
import { logout } from '@/lib/auth';

export async function POST() {
    try {
        await logout();

        return NextResponse.json({
            success: true,
            message: '已成功退出登录',
        });
    } catch (error) {
        console.error('登出错误:', error);
        return NextResponse.json(
            { error: '登出失败' },
            { status: 500 }
        );
    }
}
