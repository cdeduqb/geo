import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { generateSlug } from '@/lib/utils';

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { title, content, status } = await request.json();

        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
        }

        // Generate a unique slug
        let slug = generateSlug(title);
        let counter = 1;
        while (await db.article.findUnique({ where: { slug } })) {
            slug = `${generateSlug(title)}-${counter}`;
            counter++;
        }

        const article = await db.article.create({
            data: {
                title,
                slug,
                content,
                status: status || 'DRAFT',
                authorId: user.id,
                seo: {
                    create: {
                        title: title,
                        description: content.substring(0, 160).replace(/<[^>]*>/g, ''), // Simple strip tags
                    }
                }
            },
        });

        return NextResponse.json(article);
    } catch (error: any) {
        console.error('Error creating draft article:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
