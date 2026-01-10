import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

// GET /api/admin/products/categories - 获取分类列表（树形结构）
export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: '未授权' }, { status: 401 });
        }

        // 获取所有分类
        const categories = await db.productCategory.findMany({
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
            include: {
                children: {
                    orderBy: [{ sortOrder: 'asc' }],
                },
                _count: {
                    select: {
                        products: true,
                    },
                },
            },
        });

        // 构建树形结构
        const rootCategories = categories.filter(cat => !cat.parentId);

        return NextResponse.json({ categories: rootCategories });
    } catch (error) {
        console.error('Get categories error:', error);
        return NextResponse.json(
            { error: '获取分类失败' },
            { status: 500 }
        );
    }
}

// POST /api/admin/products/categories - 创建分类
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: '未授权' }, { status: 401 });
        }

        const body = await request.json();
        const { name, slug, description, parentId, sortOrder, lang, translationGroupId } = body;

        if (!name || !slug) {
            return NextResponse.json(
                { error: '缺少必填字段' },
                { status: 400 }
            );
        }

        // 检查slug是否已存在
        const existingCategory = await db.productCategory.findUnique({
            where: {
                slug_lang: {
                    slug,
                    lang: lang || 'zh'
                }
            },
        });

        if (existingCategory) {
            return NextResponse.json(
                { error: 'URL别名已存在' },
                { status: 400 }
            );
        }

        const category = await db.productCategory.create({
            data: {
                name,
                slug,
                description,
                parentId,
                sortOrder: sortOrder || 0,
                lang: lang || 'zh',
                translationGroupId: translationGroupId || null,
            },
        });

        return NextResponse.json({ category });
    } catch (error) {
        console.error('Create category error:', error);
        return NextResponse.json(
            { error: '创建分类失败', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
