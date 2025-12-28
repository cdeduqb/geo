import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json(
                { success: false, error: '需要管理员权限' },
                { status: 403 }
            );
        }

        const { id } = await params;
        const body = await request.json();
        const { name, description, content, style, moduleType, type } = body;

        if (!name || !content || !moduleType || !type) {
            return NextResponse.json(
                { success: false, error: '缺少必填字段' },
                { status: 400 }
            );
        }

        const template = await db.pageTemplate.update({
            where: { id },
            data: {
                name,
                description: description || null,
                content,
                style: style || null,
                moduleType,
                type,
            } as any,
        });

        return NextResponse.json({ success: true, data: template });
    } catch (error) {
        console.error('更新模板失败:', error);
        return NextResponse.json(
            { success: false, error: '更新模板失败' },
            { status: 500 }
        );
    }
}
