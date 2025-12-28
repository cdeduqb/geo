import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

// GET /api/admin/authors - 获取所有作者列表
export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;
        const showOnlyAuthors = searchParams.get('authorsOnly') === 'true';

        const where = showOnlyAuthors ? { isPublicAuthor: true } : {};

        const [authors, total] = await Promise.all([
            db.user.findMany({
                where,
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
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            db.user.count({ where }),
        ]);

        return NextResponse.json({
            authors,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            }
        });
    } catch (error: any) {
        console.error('Error fetching authors:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
