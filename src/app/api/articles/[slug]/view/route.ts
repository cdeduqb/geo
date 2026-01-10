import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await context.params;

        if (!slug) {
            return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
        }

        // 查找文章
        const article = await db.article.findFirst({
            where: { slug, status: 'PUBLISHED' },
            select: { id: true }
        });

        if (!article) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        // 增加浏览量
        await db.article.update({
            where: { id: article.id },
            data: { views: { increment: 1 } }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error incrementing view count:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
