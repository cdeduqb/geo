import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// Create a new page
export async function POST(request: NextRequest) {
    try {
        const user = await requireAuth();

        if (user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: '需要管理员权限' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { title, slug, type, status, content, sections, editorMode } = body;

        if (!title || !slug) {
            return NextResponse.json(
                { error: '缺少必要字段: title, slug' },
                { status: 400 }
            );
        }

        const page = await db.page.create({
            data: {
                title,
                slug,
                type: type || 'CUSTOM',
                status: status || 'DRAFT',
                content: content || '',
                sections: sections || null,
                editorMode: editorMode || null,
            },
        });

        return NextResponse.json({ page });
    } catch (error) {
        console.error('Create page error:', error);
        return NextResponse.json(
            { error: '创建页面失败', details: (error as Error).message },
            { status: 500 }
        );
    }
}

// List all pages
export async function GET() {
    try {
        const pages = await db.page.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ pages });
    } catch (error) {
        console.error('Fetch pages error:', error);
        return NextResponse.json(
            { error: '获取页面列表失败' },
            { status: 500 }
        );
    }
}
