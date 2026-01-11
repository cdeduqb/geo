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
    type: z.enum(['HOME', 'ARTICLE_LIST', 'PRODUCT_LIST', 'ABOUT', 'CONTACT', 'CUSTOM', 'HEADER', 'FOOTER', 'GENERAL']),
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
    isDefault: z.boolean().default(false),
});

export async function createPage(formData: FormData) {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error('未授权');
    }

    const type = formData.get('type')?.toString() || 'CUSTOM';
    const lang = formData.get('lang')?.toString() || 'zh';
    const isDefault = formData.get('isDefault') === 'true';

    const rawData = {
        title: formData.get('title')?.toString() || '',
        slug: formData.get('slug')?.toString() || '',
        content: formData.get('content')?.toString() || '',
        type: type as any,
        status: formData.get('status')?.toString() || 'DRAFT',
        templateId: formData.get('templateId')?.toString() || null,
        headerTemplateId: formData.get('headerTemplateId')?.toString() || null,
        footerTemplateId: formData.get('footerTemplateId')?.toString() || null,
        seoTitle: formData.get('seoTitle')?.toString() || null,
        seoKeywords: formData.get('seoKeywords')?.toString() || null,
        seoDescription: formData.get('seoDescription')?.toString() || null,
        lang: lang,
        translationGroupId: formData.get('translationGroupId')?.toString() || null,
        isDefault: isDefault,
    };

    const validatedData = PageSchema.parse(rawData);
    console.log('Creating Page with data:', JSON.stringify(validatedData, null, 2));

    // 只有首页类型(HOME)才处理 isDefault
    const shouldBeDefault = isDefault && validatedData.type === 'HOME';

    // If setting as default for HOME type, unset others of same type and lang
    if (shouldBeDefault) {
        console.log(`Setting default homepage for ${validatedData.lang}. Unsetting others...`);
        await (db.page as any).updateMany({
            where: { type: 'HOME', lang: validatedData.lang, isDefault: true },
            data: { isDefault: false }
        });
    }

    // 非 HOME 类型强制设置为 false
    validatedData.isDefault = shouldBeDefault;

    // 检查 URL 路径是否已存在
    const existingPage = await db.page.findFirst({
        where: {
            slug: validatedData.slug,
            lang: validatedData.lang,
        }
    });

    if (existingPage) {
        throw new Error(`URL路径 "${validatedData.slug}" 在语言 "${validatedData.lang}" 下已存在，请更换。`);
    }

    // Separate SEO data from Page data
    const { seoTitle, seoKeywords, seoDescription, ...pageData } = validatedData;

    try {
        const newPage = await (db.page as any).create({
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
        console.log('Page created successfully:', newPage.id);
    } catch (error: any) {
        console.error(' [CRITICAL] 创建页面失败:', error);
        throw new Error(`创建页面失败: ${error.message || '未知错误'}`);
    }

    revalidatePath('/admin/pages');
    revalidatePath('/');
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

    const type = formData.get('type')?.toString() || 'CUSTOM';
    const lang = formData.get('lang')?.toString() || 'zh';
    const isDefault = formData.get('isDefault') === 'true';

    const rawData = {
        title: formData.get('title')?.toString() || '',
        slug: formData.get('slug')?.toString() || '',
        content: formData.get('content')?.toString() || '',
        type: type as any,
        status: formData.get('status')?.toString() || 'DRAFT',
        templateId: formData.get('templateId')?.toString() || null,
        headerTemplateId: formData.get('headerTemplateId')?.toString() || null,
        footerTemplateId: formData.get('footerTemplateId')?.toString() || null,
        seoTitle: formData.get('seoTitle')?.toString() || null,
        seoKeywords: formData.get('seoKeywords')?.toString() || null,
        seoDescription: formData.get('seoDescription')?.toString() || null,
        lang: lang,
        translationGroupId: formData.get('translationGroupId')?.toString() || null,
        isDefault: isDefault,
    };

    const validatedData = PageSchema.parse(rawData);
    console.log(`Updating Page ${id} with data:`, JSON.stringify(validatedData, null, 2));

    // 只有首页类型(HOME)才处理 isDefault
    const shouldBeDefault = isDefault && validatedData.type === 'HOME';

    // If setting as default for HOME type, unset others of same type and lang
    if (shouldBeDefault) {
        console.log(`Setting default homepage for ${validatedData.lang}. Unsetting others (except ${id})...`);
        await (db.page as any).updateMany({
            where: {
                type: 'HOME',
                lang: validatedData.lang,
                isDefault: true,
                id: { not: id }
            },
            data: { isDefault: false }
        });
    }

    // 非 HOME 类型强制设置为 false
    validatedData.isDefault = shouldBeDefault;

    // 检查 URL 路径是否冲突 (排除自己)
    const existingPage = await db.page.findFirst({
        where: {
            slug: validatedData.slug,
            lang: validatedData.lang,
            id: { not: id }
        }
    });

    if (existingPage) {
        throw new Error(`URL路径 "${validatedData.slug}" 在语言 "${validatedData.lang}" 下已存在，请更换。`);
    }

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
        console.log(`Page ${id} updated successfully.`);
    } catch (error: any) {
        console.error(' [CRITICAL] 更新页面失败:', error);
        throw new Error(`更新页面失败: ${error.message || '未知错误'}`);
    }

    revalidatePath('/admin/pages');
    revalidatePath('/');
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
