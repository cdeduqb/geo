import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/articles - 获取已发布文章列表（公开API）
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const categoryId = searchParams.get('categoryId');
        const categorySortOrder = searchParams.get('categorySortOrder');
        const lang = searchParams.get('lang') || 'zh';

        const skip = (page - 1) * limit;

        // 构建查询条件 - 只返回已发布的文章
        const where: any = {
            status: 'PUBLISHED',
            lang,
        };

        // 支持通过分类ID或分类编号(sortOrder)筛选
        if (categoryId) {
            where.categoryId = categoryId;
        } else if (categorySortOrder) {
            // 先查找分类
            const category = await db.category.findFirst({
                where: { sortOrder: parseInt(categorySortOrder) }
            });
            if (category) {
                where.categoryId = category.id;
            } else {
                // 如果指定了分类编号但找不到分类，则不返回任何文章
                return NextResponse.json({
                    articles: [],
                    pagination: {
                        page,
                        limit,
                        total: 0,
                        totalPages: 0,
                    },
                });
            }
        }

        // 查询文章
        const [articles, total] = await Promise.all([
            db.article.findMany({
                where,
                orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
                skip,
                take: limit,
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    summary: true,
                    coverImage: true,
                    createdAt: true,
                    views: true,
                    author: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                        },
                    },
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                },
            }),
            db.article.count({ where }),
        ]);

        return NextResponse.json({
            articles,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get articles error:', error);
        return NextResponse.json(
            { error: '获取文章列表失败' },
            { status: 500 }
        );
    }
}
