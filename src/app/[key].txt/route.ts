import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: { key: string } }
) {
    const key = params.key;

    try {
        // 查找是否有匹配该 Token 的 IndexNow 配置
        const config = await db.sEOPushConfig.findFirst({
            where: {
                platform: 'indexnow',
                token: key,
                isActive: true,
            },
        });

        if (!config) {
            return new NextResponse('Not Found', { status: 404 });
        }

        // IndexNow 验证文件的内容必须正是该 Key 本身
        return new NextResponse(key, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
            },
        });
    } catch (error) {
        console.error('IndexNow verification error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
