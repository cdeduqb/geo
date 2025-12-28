'use server';

import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const PageSchema = z.object({
    title: z.string().min(1, '标题不能为空'),
    slug: z.string().min(1, 'URL 路径不能为空'),
    content: z.string().optional().default(''),
    type: z.enum(['HOME', 'ARTICLE_LIST', 'PRODUCT_LIST', 'ABOUT', 'CONTACT', 'CUSTOM']),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
    templateId: z.string().optional().nullable(),
    headerTemplateId: z.string().optional().nullable(),
    footerTemplateId: z.string().optional().nullable(),
    // SEO Fields
    seoTitle: z.string().optional().nullable(),
    seoKeywords: z.string().optional().nullable(),
    seoDescription: z.string().optional().nullable(),
    lang: z.string().default('zh'),
    translationGroupId: z.string().optional().nullable(),
});

export async function createPage(formData: FormData) {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error('未授权');
    }

    const rawData = {
        title: formData.get('title')?.toString() || '',
        slug: formData.get('slug')?.toString() || '',
        content: formData.get('content')?.toString() || '',
        type: formData.get('type')?.toString() || 'CUSTOM',
        status: formData.get('status')?.toString() || 'DRAFT',
        templateId: formData.get('templateId')?.toString() || null,
        headerTemplateId: formData.get('headerTemplateId')?.toString() || null,
        footerTemplateId: formData.get('footerTemplateId')?.toString() || null,
        seoTitle: formData.get('seoTitle')?.toString() || null,
        seoKeywords: formData.get('seoKeywords')?.toString() || null,
        seoDescription: formData.get('seoDescription')?.toString() || null,
        lang: formData.get('lang')?.toString() || 'zh',
        translationGroupId: formData.get('translationGroupId')?.toString() || null,
    };

    const validatedData = PageSchema.parse(rawData);

    // Separate SEO data from Page data
    const { seoTitle, seoKeywords, seoDescription, ...pageData } = validatedData;

    try {
        await (db.page as any).create({
            data: {
                ...pageData,
                seo: {
                    create: {
                        title: seoTitle,
                        keywords: seoKeywords,
                        description: seoDescription,
                    }
                }
            },
        });
    } catch (error) {
        console.error('创建页面失败:', error);
        return { error: '创建页面失败，可能是 URL 路径重复' };
    }

    revalidatePath('/admin/pages');
    redirect('/admin/pages');
}

export async function updatePage(formData: FormData) {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error('未授权');
    }

    const id = formData.get('id') as string;

    if (!id) {
        throw new Error('页面 ID 不能为空');
    }

    const rawData = {
        title: formData.get('title')?.toString() || '',
        slug: formData.get('slug')?.toString() || '',
        content: formData.get('content')?.toString() || '',
        type: formData.get('type')?.toString() || 'CUSTOM',
        status: formData.get('status')?.toString() || 'DRAFT',
        templateId: formData.get('templateId')?.toString() || null,
        headerTemplateId: formData.get('headerTemplateId')?.toString() || null,
        footerTemplateId: formData.get('footerTemplateId')?.toString() || null,
        seoTitle: formData.get('seoTitle')?.toString() || null,
        seoKeywords: formData.get('seoKeywords')?.toString() || null,
        seoDescription: formData.get('seoDescription')?.toString() || null,
        lang: formData.get('lang')?.toString() || 'zh',
        translationGroupId: formData.get('translationGroupId')?.toString() || null,
    };

    console.log('Update Page Raw Data:', rawData);

    const validatedData = PageSchema.parse(rawData);

    // Separate SEO data from Page data
    const { seoTitle, seoKeywords, seoDescription, ...pageData } = validatedData;

    try {
        await (db.page as any).update({
            where: { id },
            data: {
                ...pageData,
                seo: {
                    upsert: {
                        create: {
                            title: seoTitle,
                            keywords: seoKeywords,
                            description: seoDescription,
                        },
                        update: {
                            title: seoTitle,
                            keywords: seoKeywords,
                            description: seoDescription,
                        }
                    }
                }
            },
        });
    } catch (error) {
        console.error('更新页面失败:', error);
        return { error: '更新页面失败' };
    }

    revalidatePath('/admin/pages');
    redirect('/admin/pages');
}

export async function deletePage(id: string) {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error('未授权');
    }

    try {
        await db.page.delete({
            where: { id },
        });
    } catch (error) {
        console.error('删除页面失败:', error);
        return { error: '删除页面失败' };
    }

    revalidatePath('/admin/pages');
}
