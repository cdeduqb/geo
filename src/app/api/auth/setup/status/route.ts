import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        // 检查数据库中是否存在任何用户
        const userCount = await db.user.count();

        return NextResponse.json({
            setupRequired: userCount === 0,
            installed: userCount > 0
        });
    } catch (error) {
        console.error('[Setup Status] Error:', error);
        // 如果数据库连接失败，我们也认为需要设置（或者显示错误）
        return NextResponse.json({
            setupRequired: true,
            error: '数据库连接异常'
        }, { status: 500 });
    }
}
