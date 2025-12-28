import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/authors/[id] - 公开获取作者信息
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const author = await db.user.findUnique({
            where: {
                id,
                isPublicAuthor: true, // 只返回公开作者
            },
            select: {
                id: true,
                name: true,
                avatar: true,
                bio: true,
                expertise: true,
                website: true,
                twitter: true,
                linkedin: true,
                github: true,
                articles: {
                    where: { status: 'PUBLISHED' },
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        summary: true,
                        createdAt: true,
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                }
            }
        });

        if (!author) {
            return NextResponse.json({ error: 'Author not found' }, { status: 404 });
        }

        return NextResponse.json(author);
    } catch (error: any) {
        console.error('Error fetching author:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
