import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const template = await db.pageTemplate.findUnique({
            where: { id },
        });

        if (!template) {
            return NextResponse.json(
                { error: '模板不存在' },
                { status: 404 }
            );
        }

        return NextResponse.json({ template });
    } catch (error) {
        console.error('Fetch template error:', error);
        return NextResponse.json(
            { error: '获取模板失败' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await requireAuth();

        if (user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: '需要管理员权限' },
                { status: 403 }
            );
        }

        const { id } = await params;
        const body = await request.json();

        const template = await db.pageTemplate.update({
            where: { id },
            data: body,
        });

        return NextResponse.json({ template });
    } catch (error) {
        console.error('Update template error:', error);
        return NextResponse.json(
            { error: '更新模板失败', details: (error as Error).message },
            { status: 500 }
        );
    }
}
