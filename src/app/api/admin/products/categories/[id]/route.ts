import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

// GET /api/admin/products/categories/[id] - 获取分类详情
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

        const category = await db.productCategory.findUnique({
            where: { id },
            include: {
                parent: true,
                _count: {
                    select: { products: true }
                }
            }
        });

        if (!category) {
            return NextResponse.json({ error: '分类不存在' }, { status: 404 });
        }

        return NextResponse.json({ category });
    } catch (error) {
        console.error('Get category error:', error);
        return NextResponse.json(
            { error: '获取分类失败' },
            { status: 500 }
        );
    }
}

// PUT /api/admin/products/categories/[id] - 更新分类
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
        const { name, slug, description, parentId, sortOrder, lang, translationGroupId } = body;

        // 检查分类是否存在
        const existingCategory = await db.productCategory.findUnique({
            where: { id },
        });

        if (!existingCategory) {
            return NextResponse.json({ error: '分类不存在' }, { status: 404 });
        }

        // 如果修改了slug，检查新slug是否已被使用
        if (slug && slug !== existingCategory.slug) {
            const slugExists = await db.productCategory.findUnique({
                where: { slug },
            });

            if (slugExists) {
                return NextResponse.json(
                    { error: 'URL别名已存在' },
                    { status: 400 }
                );
            }
        }

        // 防止将自己设为父分类
        if (parentId === id) {
            return NextResponse.json(
                { error: '不能将分类设为自己的父分类' },
                { status: 400 }
            );
        }

        const category = await (db.productCategory as any).update({
            where: { id },
            data: {
                name,
                slug,
                description,
                parentId: parentId || null,
                sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : existingCategory.sortOrder,
                lang: lang || (existingCategory as any).lang || 'zh',
                translationGroupId: translationGroupId || (existingCategory as any).translationGroupId || null,
            },
        });

        return NextResponse.json({ category });
    } catch (error) {
        console.error('Update category error:', error);
        return NextResponse.json(
            { error: '更新分类失败' },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/products/categories/[id] - 删除分类
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

        const category = await db.productCategory.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        products: true,
                        children: true,
                    }
                }
            }
        });

        if (!category) {
            return NextResponse.json({ error: '分类不存在' }, { status: 404 });
        }

        if (category._count.products > 0) {
            return NextResponse.json(
                { error: '该分类下还有产品，无法删除' },
                { status: 400 }
            );
        }

        if (category._count.children > 0) {
            return NextResponse.json(
                { error: '该分类下还有子分类，无法删除' },
                { status: 400 }
            );
        }

        await db.productCategory.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete category error:', error);
        return NextResponse.json(
            { error: '删除分类失败' },
            { status: 500 }
        );
    }
}
