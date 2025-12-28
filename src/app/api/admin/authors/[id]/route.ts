import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

// GET /api/admin/authors/[id] - 获取作者详细信息
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // 只有管理员或本人可以查看
        if (user.role !== 'ADMIN' && user.id !== id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const author = await db.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatar: true,
                bio: true,
                expertise: true,
                website: true,
                twitter: true,
                linkedin: true,
                github: true,
                isPublicAuthor: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: { articles: true }
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

// PUT /api/admin/authors/[id] - 更新作者信息
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // 只有管理员或本人可以更新
        if (user.role !== 'ADMIN' && user.id !== id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const {
            name,
            bio,
            expertise,
            avatar,
            website,
            twitter,
            linkedin,
            github,
            isPublicAuthor,
        } = body;

        const updatedAuthor = await db.user.update({
            where: { id },
            data: {
                name,
                bio,
                expertise,
                avatar,
                website,
                twitter,
                linkedin,
                github,
                isPublicAuthor,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatar: true,
                bio: true,
                expertise: true,
                website: true,
                twitter: true,
                linkedin: true,
                github: true,
                isPublicAuthor: true,
                updatedAt: true,
            }
        });

        return NextResponse.json(updatedAuthor);
    } catch (error: any) {
        console.error('Error updating author:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
