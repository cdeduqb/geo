import { db } from '@/lib/db';
import { getSiteUrl } from '@/lib/system-settings';
import { Feed } from 'feed';

export async function generateFeed() {
    const siteUrl = await getSiteUrl();

    // 获取基础设置
    const [titleSetting, descriptionSetting] = await Promise.all([
        db.systemSetting.findUnique({ where: { key: 'site_name' } }),
        db.systemSetting.findUnique({ where: { key: 'site_description' } })
    ]);

    const title = titleSetting?.value || '企业官网';
    const description = descriptionSetting?.value || '专注于为现代企业提供数字化驱动内容。';

    const feed = new Feed({
        title,
        description,
        id: siteUrl,
        link: siteUrl,
        language: "zh",
        image: `${siteUrl}/logo.png`,
        favicon: `${siteUrl}/favicon.ico`,
        copyright: `All rights reserved ${new Date().getFullYear()}, ${title}`,
        feedLinks: {
            rss2: `${siteUrl}/feed.xml`,
            atom: `${siteUrl}/atom.xml`
        },
        author: {
            name: title,
            link: siteUrl
        }
    });

    const articles = await db.article.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: { author: true, category: true }
    });

    articles.forEach(article => {
        const url = `${siteUrl}/articles/${article.slug}`;
        feed.addItem({
            title: article.title,
            id: url,
            link: url,
            description: article.summary || '',
            content: article.content,
            author: [
                {
                    name: article.author?.name || '管理员',
                }
            ],
            contributor: [
                {
                    name: article.author?.name || '管理员',
                }
            ],
            date: article.createdAt,
            image: article.coverImage && article.coverImage.startsWith('http') 
                    ? article.coverImage 
                    : article.coverImage ? `${siteUrl}${article.coverImage}` : undefined,
            category: article.category ? [{ name: article.category.name }] : undefined
        });
    });

    return feed;
}
