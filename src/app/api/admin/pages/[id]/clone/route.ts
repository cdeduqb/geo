import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// POST - 克隆页面
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: '未授权' }, { status: 401 });
        }

        const { id } = await params;

        // 获取原页面
        const originalPage = await db.page.findUnique({
            where: { id },
            include: { seo: true },
        });

        if (!originalPage) {
            return NextResponse.json({ error: '页面不存在' }, { status: 404 });
        }

        // 生成新的 slug
        const newSlug = `${originalPage.slug}-copy-${Date.now()}`;

        // 创建克隆页面
        const clonedPage = await db.page.create({
            data: {
                title: `${originalPage.title} (副本)`,
                slug: newSlug,
                content: originalPage.content,
                type: originalPage.type,
                status: 'DRAFT',
                templateId: originalPage.templateId,
                headerTemplateId: originalPage.headerTemplateId,
                footerTemplateId: originalPage.footerTemplateId,
                sections: originalPage.sections || undefined,
                editorMode: originalPage.editorMode,
            },
        });

        // 如果原页面有 SEO 设置，也复制
        if (originalPage.seo) {
            await db.sEOSetting.create({
                data: {
                    pageId: clonedPage.id,
                    title: originalPage.seo.title,
                    keywords: originalPage.seo.keywords,
                    description: originalPage.seo.description,
                    ogImage: originalPage.seo.ogImage,
                    canonical: originalPage.seo.canonical,
                },
            });
        }

        return NextResponse.json(clonedPage);
    } catch (error) {
        console.error('克隆页面失败:', error);
        return NextResponse.json(
            { error: '克隆页面失败', details: (error as Error).message },
            { status: 500 }
        );
    }
}
