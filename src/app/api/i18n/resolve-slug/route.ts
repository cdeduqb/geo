import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('groupId');
    const lang = searchParams.get('lang');

    if (!groupId || !lang) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    try {
        // Try to find a page in the same group with the target language
        const page = await db.page.findFirst({
            where: {
                translationGroupId: groupId,
                lang: lang,
                status: 'PUBLISHED'
            },
            select: { slug: true }
        });

        if (page) {
            return NextResponse.json({ slug: page.slug });
        }

        // Also check articles
        const article = await db.article.findFirst({
            where: {
                translationGroupId: groupId,
                lang: lang,
                status: 'PUBLISHED'
            },
            select: { slug: true }
        });

        if (article) {
            return NextResponse.json({ slug: article.slug, isArticle: true });
        }

        return NextResponse.json({ slug: null });
    } catch (error) {
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}
