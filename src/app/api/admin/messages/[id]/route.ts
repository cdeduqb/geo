import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// 获取单条留言
export async function GET(
    request: Request,
    { params }: RouteParams
) {
    try {
        await requireAdmin();
        const { id } = await params;

        const message = await db.message.findUnique({
            where: { id },
        });

        if (!message) {
            return NextResponse.json({ error: '留言不存在' }, { status: 404 });
        }

        // 自动标记为已读
        if (!message.isRead) {
            await db.message.update({
                where: { id },
                data: { isRead: true },
            });
        }

        return NextResponse.json(message);
    } catch (error) {
        console.error('获取留言失败:', error);
        return NextResponse.json({ error: '获取留言失败' }, { status: 500 });
    }
}

// 更新留言状态
export async function PUT(
    request: Request,
    { params }: RouteParams
) {
    try {
        await requireAdmin();
        const { id } = await params;

        const { isRead } = await request.json();

        const message = await db.message.update({
            where: { id },
            data: { isRead },
        });

        return NextResponse.json(message);
    } catch (error) {
        console.error('更新留言失败:', error);
        return NextResponse.json({ error: '更新留言失败' }, { status: 500 });
    }
}

// 删除留言
export async function DELETE(
    request: Request,
    { params }: RouteParams
) {
    try {
        await requireAdmin();
        const { id } = await params;

        await db.message.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('删除留言失败:', error);
        return NextResponse.json({ error: '删除留言失败' }, { status: 500 });
    }
}
