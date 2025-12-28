import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

// GET /api/admin/products - 获取产品列表
export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: '未授权' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const status = searchParams.get('status');
        const categoryId = searchParams.get('categoryId');
        const lang = searchParams.get('lang');
        const search = searchParams.get('search');

        const skip = (page - 1) * limit;

        // 构建查询条件
        const where: any = {};

        if (status) {
            where.status = status;
        }

        if (categoryId) {
            where.categoryId = categoryId;
        }

        if (lang) {
            where.lang = lang;
        }

        if (search) {
            where.OR = [
                { name: { contains: search } },
                { description: { contains: search } },
                { sku: { contains: search } },
            ];
        }

        // 查询产品
        const [products, total] = await Promise.all([
            db.product.findMany({
                where,
                orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
                skip,
                take: limit,
                include: {
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

// POST /api/admin/products - 创建产品
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: '未授权' }, { status: 401 });
        }

        const body = await request.json();
        const {
            name,
            slug,
            description,
            content,
            price,
            comparePrice,
            costPrice,
            stock,
            sku,
            coverImage,
            images,
            categoryId,
            attributes,
            specifications,
            metaTitle,
            metaDescription,
            metaKeywords,
            status,
            isFeatured,
            lang,
            translationGroupId,
            sortOrder,
        } = body;

        // 验证必填字段
        if (!name || !slug || price === undefined) {
            return NextResponse.json(
                { error: '缺少必填字段' },
                { status: 400 }
            );
        }

        // 检查slug是否已存在
        const existingProduct = await db.product.findUnique({
            where: { slug },
        });

        if (existingProduct) {
            return NextResponse.json(
                { error: 'URL别名已存在' },
                { status: 400 }
            );
        }

        // 数据类型安全处理
        if (isNaN(Number(price))) {
            return NextResponse.json({ error: '价格格式不正确' }, { status: 400 });
        }

        const safePrice = Number(price);
        const safeComparePrice = (comparePrice !== null && comparePrice !== undefined && !isNaN(Number(comparePrice))) ? Number(comparePrice) : null;
        const safeCostPrice = (costPrice !== null && costPrice !== undefined && !isNaN(Number(costPrice))) ? Number(costPrice) : null;
        const safeStock = (stock !== null && stock !== undefined && !isNaN(Number(stock))) ? Number(stock) : 0;
        const safeSortOrder = (sortOrder !== null && sortOrder !== undefined && !isNaN(Number(sortOrder))) ? Number(sortOrder) : 0;

        // 创建产品
        const product = await (db.product as any).create({
            data: {
                name,
                slug,
                description,
                content,
                price: safePrice,
                comparePrice: safeComparePrice,
                costPrice: safeCostPrice,
                stock: safeStock,
                sku,
                coverImage,
                images: images ?? null,
                categoryId: categoryId === "" ? undefined : categoryId,
                attributes: attributes ?? null,
                specifications: specifications ?? null,
                metaTitle,
                metaDescription,
                metaKeywords,
                status: status || 'DRAFT',
                isFeatured: isFeatured || false,
                lang: lang || 'zh',
                translationGroupId: translationGroupId || null,
                sortOrder: safeSortOrder,
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json({ product });
    } catch (error) {
        console.error('Create product error:', error);
        return NextResponse.json(
            { error: '创建产品失败', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
