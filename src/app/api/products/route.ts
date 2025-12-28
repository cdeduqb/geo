import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/products - 获取已发布产品列表（公开API）
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const categoryId = searchParams.get('categoryId');
        const featured = searchParams.get('featured') === 'true';
        const lang = searchParams.get('lang') || 'zh';

        const skip = (page - 1) * limit;

        // 构建查询条件 - 只返回已发布的产品
        const where: any = {
            status: 'PUBLISHED',
            lang,
        };

        if (categoryId) {
            where.categoryId = categoryId;
        }

        const categorySlug = searchParams.get('category');
        if (categorySlug) {
            where.category = {
                slug: categorySlug
            };
        }

        if (featured) {
            where.isFeatured = true;
        }

        // 查询产品
        const [products, total] = await Promise.all([
            db.product.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    description: true,
                    price: true,
                    comparePrice: true,
                    coverImage: true,
                    images: true,
                    isFeatured: true,
                    viewCount: true,
                    salesCount: true,
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                },
            }),
            db.product.count({ where }),
        ]);

        return NextResponse.json({
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get products error:', error);
        return NextResponse.json(
            { error: '获取产品列表失败' },
            { status: 500 }
        );
    }
}
