'use server';

import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createPushService } from '@/lib/seo/push-service';
import { getSiteUrl } from '@/lib/system-settings';

const ArticleSchema = z.object({
    title: z.string().min(1, '标题不能为空'),
    slug: z.string().min(1, 'URL 路径不能为空'),
    content: z.string().optional().default(''),
    summary: z.string().optional(),
    coverImage: z.string().optional().nullable(),
    categoryId: z.string().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'SCHEDULED']),
    seoTitle: z.string().optional().nullable(),
    seoKeywords: z.string().optional().nullable(),
    seoDescription: z.string().optional().nullable(),
    citations: z.string().optional().nullable(),
    entities: z.string().optional().nullable(),
    sortOrder: z.coerce.number().default(0),
    lang: z.string().default('zh'),
    translationGroupId: z.string().optional().nullable(),
});

export async function autoPushToSEO(articleSlug: string, lang: string = 'zh') {
    try {
        const baseUrl = await getSiteUrl();

        // 验证 URL 是否合法（非 localhost，除非确实想推 localhost）
        if (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')) {
            console.warn('[SEO Push] 检测到 Base URL 为 localhost，搜索引擎可能会拒绝推送:', baseUrl);
        }

        const { getLocalePath } = await import('@/lib/i18n');

        // 构建唯一且规范（Canonical）的链接
        // 避免向 IndexNow/百度 等推送产生 URL 重定向或具有 canonical 指向的别名地址
        const slugPath = getLocalePath(`/articles/${articleSlug}`, lang as any);
        const urls: string[] = [`${baseUrl}${slugPath}`];

        const configs = await db.sEOPushConfig.findMany({
            where: { isActive: true },
        });

        // 导入平台配置以过滤仅脚本平台
        const { SEO_PLATFORMS } = await import('@/lib/seo/platform-config');
        const apiConfigs = configs.filter(config => {
            const platformCfg = SEO_PLATFORMS[config.platform];
            return platformCfg && (platformCfg.pushType === 'api' || platformCfg.pushType === 'both');
        });

        if (apiConfigs.length === 0) {
            console.log('[SEO Push] 没有支持 API 推送的激活配置，跳过推送');
            return;
        }

        // 使用 Promise.allSettled 确保所有推送完成
        const pushPromises = apiConfigs.map(async (config) => {
            try {
                const service = createPushService(
                    config.platform,
                    config.apiUrl || '',
                    config.token || '',
                    config.siteId || undefined
                );

                const result = await service.push(urls);

                // 记录推送日志
                await db.sEOPushLog.create({
                    data: {
                        configId: config.id,
                        url: urls.join(', '),
                        status: result.success ? 'success' : 'failed',
                        response: JSON.stringify(result.response || result.message || {}),
                    },
                });

                // 更新最后推送时间
                await db.sEOPushConfig.update({
                    where: { id: config.id },
                    data: { lastPushAt: new Date() },
                });

                console.log(`[SEO Push] ${config.platform}: ${result.message}`);
                return { platform: config.platform, success: result.success };
            } catch (error: any) {
                console.error(`[SEO Push] ${config.platform} 失败:`, error.message);
                return { platform: config.platform, success: false, error: error.message };
            }
        });

        await Promise.allSettled(pushPromises);
    } catch (error) {
        console.error('[SEO Push] 自动推送出错:', error);
    }
}

export async function createArticle(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) throw new Error('未授权');

    const rawData = {
        title: formData.get('title'),
        slug: formData.get('slug'),
        content: formData.get('content'),
        summary: formData.get('summary'),
        coverImage: formData.get('coverImage'),
        categoryId: formData.get('categoryId'),
        status: formData.get('status'),
        seoTitle: formData.get('seoTitle') || null,
        seoKeywords: formData.get('seoKeywords') || null,
        seoDescription: formData.get('seoDescription') || null,
        citations: formData.get('citations') || null,
        entities: formData.get('entities') || null,
        sortOrder: formData.get('sortOrder'),
        lang: formData.get('lang') || 'zh',
        translationGroupId: formData.get('translationGroupId') || null,
    };

    const validatedData = ArticleSchema.parse(rawData);
    const { seoTitle, seoKeywords, seoDescription, citations, entities, ...articleData } = validatedData;

    // 处理翻译组 ID：如果是 __new__，生成一个新的唯一 ID
    let finalTranslationGroupId = articleData.translationGroupId;
    if (finalTranslationGroupId === '__new__') {
        finalTranslationGroupId = `tg-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    }

    try {
        const citationsData = rawData.citations ? JSON.parse(rawData.citations as string) : null;
        const entitiesData = rawData.entities ? JSON.parse(rawData.entities as string) : null;

        const article = await (db.article as any).create({
            data: {
                ...articleData,
                translationGroupId: finalTranslationGroupId || undefined,
                authorId: user.id,
                categoryId: articleData.categoryId || undefined,
                citations: citationsData,
                entities: entitiesData,
                seo: {
                    create: {
                        title: seoTitle,
                        keywords: seoKeywords,
                        description: seoDescription,
                    }
                }
            },
        });

        if (validatedData.status === 'PUBLISHED') {
            autoPushToSEO(article.slug, article.lang);
            // 重新验证静态页面
            revalidatePath(`/articles/${article.slug}`);
            revalidatePath(`/${article.lang}/articles/${article.slug}`);
            revalidatePath('/articles');
            revalidatePath(`/${article.lang}/articles`);
        }
    } catch (error) {
        console.error('创建文章失败:', error);
        throw error;
    }

    revalidatePath('/admin/articles');
    redirect('/admin/articles');
}

export async function updateArticle(id: string, formData: FormData) {
    const user = await getCurrentUser();
    if (!user) throw new Error('未授权');

    if (!id) throw new Error('文章 ID 不能为空');

    const rawData = {
        title: formData.get('title'),
        slug: formData.get('slug'),
        content: formData.get('content'),
        summary: formData.get('summary'),
        coverImage: formData.get('coverImage'),
        categoryId: formData.get('categoryId'),
        status: formData.get('status'),
        seoTitle: formData.get('seoTitle') || null,
        seoKeywords: formData.get('seoKeywords') || null,
        seoDescription: formData.get('seoDescription') || null,
        citations: formData.get('citations') || null,
        entities: formData.get('entities') || null,
        sortOrder: formData.get('sortOrder'),
        lang: formData.get('lang') || 'zh',
        translationGroupId: formData.get('translationGroupId') || null,
    };

    try {
        const validatedData = ArticleSchema.parse(rawData);
        const { seoTitle, seoKeywords, seoDescription, citations, entities, ...articleData } = validatedData;

        const oldArticle = await db.article.findUnique({ where: { id } });
        if (!oldArticle) throw new Error(`Article with ID ${id} not found`);

        // 处理翻译组 ID：如果是 __new__，生成一个新的唯一 ID
        let finalTranslationGroupId = articleData.translationGroupId;
        if (finalTranslationGroupId === '__new__') {
            finalTranslationGroupId = `tg-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        }

        const citationsData = rawData.citations ? JSON.parse(rawData.citations as string) : null;
        const entitiesData = rawData.entities ? JSON.parse(rawData.entities as string) : null;

        const article = await (db.article as any).update({
            where: { id },
            data: {
                ...articleData,
                translationGroupId: finalTranslationGroupId || null,
                categoryId: articleData.categoryId || null,
                citations: citationsData,
                entities: entitiesData,
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

        if (validatedData.status === 'PUBLISHED') {
            // 重新验证静态页面
            revalidatePath(`/articles/${article.slug}`);
            revalidatePath(`/${article.lang}/articles/${article.slug}`);
            revalidatePath('/articles');
            revalidatePath(`/${article.lang}/articles`);

            if (oldArticle?.status !== 'PUBLISHED') {
                autoPushToSEO(article.slug, article.lang);
            } else {
                // 如果已经是发布状态，更新时也触发推送（支持 IndexNow/Google 的更新通知）
                autoPushToSEO(article.slug, article.lang);
            }
        }
    } catch (error) {
        console.error('[updateArticle] Error:', error);
        throw error;
    }

    revalidatePath('/admin/articles');
    redirect('/admin/articles');
}

export async function deleteArticle(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) throw new Error('未授权');

    const id = formData.get('id') as string;
    if (!id) throw new Error('缺少文章 ID');

    try {
        const article = await db.article.findUnique({ where: { id } });

        await db.article.delete({
            where: { id },
        });

        if (article) {
            revalidatePath(`/articles/${article.slug}`);
            revalidatePath(`/${article.lang}/articles/${article.slug}`);
            revalidatePath('/articles');
            revalidatePath(`/${article.lang}/articles`);
        }

        revalidatePath('/admin/articles');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete article:', error);
        throw error;
    }
}

// 创建文章的翻译版本
export async function createTranslation(articleId: string, targetLang: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('未授权');

    const original = await db.article.findUnique({
        where: { id: articleId },
        include: { seo: true },
    });

    if (!original) throw new Error('原文章不存在');

    // 如果原文章已有翻译组 ID，使用它；否则创建一个新的
    const translationGroupId = original.translationGroupId || `tg-${original.id}`;

    // 更新原文章的翻译组 ID（如果它还没有）
    if (!original.translationGroupId) {
        await db.article.update({
            where: { id: articleId },
            data: { translationGroupId },
        });
    }

    // 检查目标语言的翻译是否已存在
    const existing = await (db.article as any).findFirst({
        where: { translationGroupId, lang: targetLang },
    });

    if (existing) {
        return { success: false, error: '该语言的翻译版本已存在', articleId: existing.id };
    }

    // 创建翻译版本
    const newSlug = `${original.slug}-${targetLang}`;
    const newArticle = await (db.article as any).create({
        data: {
            title: `[${targetLang.toUpperCase()}] ${original.title}`,
            slug: newSlug,
            content: original.content,
            summary: original.summary,
            coverImage: original.coverImage,
            status: 'DRAFT',
            authorId: user.id,
            categoryId: original.categoryId,
            aiGenerated: original.aiGenerated,
            citations: original.citations as any,
            entities: original.entities as any,
            sortOrder: original.sortOrder,
            lang: targetLang,
            translationGroupId,
            seo: original.seo ? {
                create: {
                    title: original.seo.title ? `[${targetLang.toUpperCase()}] ${original.seo.title}` : null,
                    keywords: original.seo.keywords,
                    description: original.seo.description ? `[${targetLang.toUpperCase()}] ${original.seo.description}` : null,
                }
            } : undefined,
        },
    });

    revalidatePath('/admin/articles');
    return { success: true, articleId: newArticle.id };
}
