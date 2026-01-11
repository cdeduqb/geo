import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

// GET /api/admin/products/[id] - 获取产品详情
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: '未授权' }, { status: 401 });
        }

        const product = await db.product.findUnique({
            where: { id },
            include: {
                category: true,
            },
        });

        if (!product) {
            return NextResponse.json({ error: '产品不存在' }, { status: 404 });
        }

        return NextResponse.json({ product });
    } catch (error) {
        console.error('Get product error:', error);
        return NextResponse.json(
            { error: '获取产品失败' },
            { status: 500 }
        );
    }
}

// PUT /api/admin/products/[id] - 更新产品
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
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
            sortOrder,
        } = body;

        // 检查产品是否存在
        const existingProduct = await db.product.findUnique({
            where: { id },
        });

        if (!existingProduct) {
            return NextResponse.json({ error: '产品不存在' }, { status: 404 });
        }

        // 如果修改了slug，检查新slug是否已被使用
        if (slug && slug !== existingProduct.slug) {
            const slugExists = await db.product.findFirst({
                where: {
                    slug,
                    lang: existingProduct.lang,
                    id: { not: id }
                },
            });

            if (slugExists) {
                return NextResponse.json(
                    { error: 'URL别名已存在' },
                    { status: 400 }
                );
            }
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

        // 更新产品
        const product = await db.product.update({
            where: { id },
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
                categoryId: categoryId === "" ? null : categoryId,
                attributes: attributes ?? null,
                specifications: specifications ?? null,
                metaTitle,
                metaDescription,
                metaKeywords,
                status,
                isFeatured,
                sortOrder: safeSortOrder,
            },
            include: {
                category: true,
            },
        });

        // 刷新缓存
        revalidatePath('/admin/products');
        revalidatePath('/', 'layout');
        revalidatePath('/');
        if (product.lang) {
            revalidatePath(`/${product.lang}`);
            revalidatePath(`/${product.lang}/products`);
            revalidatePath(`/${product.lang}/products/${product.slug}`);
        }

        return NextResponse.json({ product });
    } catch (error) {
        console.error('Update product error:', error);
        return NextResponse.json(
            { error: '更新产品失败', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/products/[id] - 删除产品
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: '未授权' }, { status: 401 });
        }

        const product = await db.product.findUnique({
            where: { id },
        });

        if (!product) {
            return NextResponse.json({ error: '产品不存在' }, { status: 404 });
        }

        await db.product.delete({
            where: { id },
        });

        // 刷新缓存
        revalidatePath('/admin/products');
        revalidatePath('/', 'layout');
        revalidatePath('/');
        if (product.lang) {
            revalidatePath(`/${product.lang}`);
            revalidatePath(`/${product.lang}/products`);
            revalidatePath(`/${product.lang}/products/${product.slug}`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete product error:', error);
        return NextResponse.json(
            { error: '删除产品失败' },
            { status: 500 }
        );
    }
}
