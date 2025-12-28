import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

// 获取留言列表
export async function GET(request: Request) {
    try {
        await requireAdmin();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const isRead = searchParams.get('isRead');
        const search = searchParams.get('search') || '';

        const where: any = {};
        if (isRead !== null && isRead !== '') {
            where.isRead = isRead === 'true';
        }
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { email: { contains: search } },
                { subject: { contains: search } },
                { content: { contains: search } },
            ];
        }

        const [messages, total] = await Promise.all([
            db.message.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            db.message.count({ where }),
        ]);

        // 获取未读数量
        const unreadCount = await db.message.count({ where: { isRead: false } });

        return NextResponse.json({
            messages,
            total,
            unreadCount,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('获取留言列表失败:', error);
        return NextResponse.json({ error: '获取留言列表失败' }, { status: 500 });
    }
}

// 批量操作
export async function PUT(request: Request) {
    try {
        await requireAdmin();

        const { ids, action } = await request.json();

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: '请选择留言' }, { status: 400 });
        }

        if (action === 'markRead') {
            await db.message.updateMany({
                where: { id: { in: ids } },
                data: { isRead: true },
            });
        } else if (action === 'markUnread') {
            await db.message.updateMany({
                where: { id: { in: ids } },
                data: { isRead: false },
            });
        } else if (action === 'delete') {
            await db.message.deleteMany({
                where: { id: { in: ids } },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('批量操作失败:', error);
        return NextResponse.json({ error: '操作失败' }, { status: 500 });
    }
}
