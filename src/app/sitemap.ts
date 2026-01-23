import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { getSiteUrl } from '@/lib/system-settings';

// 强制动态渲染，确保站点地图始终反映最新的数据库状态
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    try {
        const baseUrl = await getSiteUrl();

        // 1. 静态基础页面 (仅保留首页)
        const staticPages: MetadataRoute.Sitemap = [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1.0,
            }
        ];

        // 2. 获取所有已发布的页面 (CMS 动态页面)
        const pages = await db.page.findMany({
            where: { status: 'PUBLISHED' },
            select: { slug: true, updatedAt: true },
        });

        const dynamicPages: MetadataRoute.Sitemap = pages.map((page) => ({
            url: `${baseUrl}/${page.slug}`,
            lastModified: page.updatedAt,
            changeFrequency: 'weekly',
            priority: 0.7,
        }));

        // 3. 获取所有已发布的文章
        const articles = await db.article.findMany({
            where: { status: 'PUBLISHED' },
            select: { slug: true, updatedAt: true },
        });

        const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
            url: `${baseUrl}/articles/${article.slug}`,
            lastModified: article.updatedAt,
            changeFrequency: 'weekly',
            priority: 0.8,
        }));

        // 4. 获取所有已发布的产品
        const products = await db.product.findMany({
            where: { status: 'PUBLISHED' },
            select: { slug: true, updatedAt: true },
        });

        const productPages: MetadataRoute.Sitemap = products.map((product) => ({
            url: `${baseUrl}/product/${product.slug}`,
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

