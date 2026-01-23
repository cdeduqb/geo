import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { locales, Locale, defaultLocale, getLocalePath } from '@/lib/i18n';
import { getSiteUrl, getI18nSettings } from '@/lib/system-settings';

// 强制动态渲染，确保站点地图始终反映最新的数据库状态
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    try {
        const baseUrl = await getSiteUrl();
        const i18nSettings = await getI18nSettings();
        const enableMultiLanguage = i18nSettings?.enableMultiLanguage;

        // 1. 静态基础页面 (仅保留首页)
        const staticPages: MetadataRoute.Sitemap = [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1.0,
            }
        ];

        // 如果开启多语言，增加各语言版本的首页
        if (enableMultiLanguage) {
            locales.forEach(locale => {
                if (locale !== defaultLocale) {
                    staticPages.push({
                        url: `${baseUrl}${getLocalePath('/', locale)}`,
                        lastModified: new Date(),
                        changeFrequency: 'daily',
                        priority: 1.0,
                    });
                }
            });
        }

        // 2. 获取所有已发布的页面 (CMS 动态页面)
        const pages = await db.page.findMany({
            where: { status: 'PUBLISHED' },
            select: { slug: true, updatedAt: true, lang: true },
        });

        const dynamicPages: MetadataRoute.Sitemap = pages.map((page) => ({
            url: `${baseUrl}${getLocalePath(`/${page.slug}`, page.lang as Locale)}`,
            lastModified: page.updatedAt,
            changeFrequency: 'weekly',
            priority: 0.7,
        }));

        // 3. 获取所有已发布的文章
        const articles = await db.article.findMany({
            where: { status: 'PUBLISHED' },
            select: { slug: true, updatedAt: true, lang: true },
        });

        const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
            url: `${baseUrl}${getLocalePath(`/articles/${article.slug}`, article.lang as Locale)}`,
            lastModified: article.updatedAt,
            changeFrequency: 'weekly',
            priority: 0.8,
        }));

        // 4. 获取所有已发布的产品
        const products = await db.product.findMany({
            where: { status: 'PUBLISHED' },
            select: { slug: true, updatedAt: true, lang: true },
        });

        const productPages: MetadataRoute.Sitemap = products.map((product) => ({
            url: `${baseUrl}${getLocalePath(`/product/${product.slug}`, product.lang as Locale)}`,
            lastModified: product.updatedAt,
            changeFrequency: 'weekly',
            priority: 0.8,
        }));

        // 5. 获取作者页面 (仅展示公开作者)
        const authors = await db.user.findMany({
            where: { isPublicAuthor: true },
            select: { id: true, updatedAt: true },
        });

        const authorPages: MetadataRoute.Sitemap = authors.map((author) => ({
            url: `${baseUrl}/author/${author.id}`,
            lastModified: author.updatedAt,
            changeFrequency: 'monthly',
            priority: 0.4,
        }));

        return [
            ...staticPages,
            ...dynamicPages,
            ...articlePages,
            ...productPages,
            ...authorPages
        ];
    } catch (error) {
        console.warn('Database unavailable during sitemap generation. Returning empty sitemap.');
        return [];
    }
}

