import { db } from '@/lib/db';
import { getSEOSettings, getSiteUrl, getI18nSettings } from '@/lib/system-settings';
import { locales, Locale, defaultLocale, getLocalePath } from '@/lib/i18n';

function stripHtml(html: string | null | undefined): string {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '').trim();
}

/**
 * llms.txt: 为 AI 爬虫和 LLM 提供结构化的 Markdown 网站概览
 * 遵循 https://llmstxt.org/ 规范
 */
export async function GET() {
    try {
        const seo = await getSEOSettings();
        const baseUrl = await getSiteUrl();
        const i18nSettings = await getI18nSettings();
        const enableMultiLanguage = i18nSettings?.enableMultiLanguage;

        // 基础信息
        let content = `# ${seo.siteName}\n\n`;
        content += `> ${seo.siteDescription}\n\n`;

        // 如果开启多语言，增加语言版本说明
        if (enableMultiLanguage) {
            content += `## Languages\n\n`;
            locales.forEach(locale => {
                const name = locale === 'zh' ? '简体中文' : 'English';
                const url = `${baseUrl}${getLocalePath('/', locale)}`;
                content += `- [${name}](${url})\n`;
            });
            content += `\n`;
        }

        // 核心页面
        content += `## Core Pages\n\n`;

        // 获取主要页面
        const pages = await db.page.findMany({
            where: {
                status: 'PUBLISHED',
                // 如果禁用多语言，只获取默认语言的内容
                ...(enableMultiLanguage ? {} : { lang: defaultLocale })
            },
            select: { title: true, slug: true, lang: true },
            orderBy: [{ isDefault: 'desc' }, { updatedAt: 'desc' }],
            take: 20
        });

        pages.forEach(page => {
            const url = `${baseUrl}${getLocalePath(`/${page.slug}`, page.lang as any)}`;
            content += `- [${page.title}](${url}) (${page.lang})\n`;
        });

        // 最新文章
        const articles = await db.article.findMany({
            where: {
                status: 'PUBLISHED',
                // 如果禁用多语言，只获取默认语言的内容
                ...(enableMultiLanguage ? {} : { lang: defaultLocale })
            },
            select: { 
                title: true, 
                slug: true, 
                lang: true, 
                summary: true,
                entities: true,
                citations: true
            },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        if (articles.length > 0) {
            content += `\n## Recent Articles\n\n`;
            articles.forEach(article => {
                const url = `${baseUrl}${getLocalePath(`/articles/${article.slug}`, article.lang as any)}`;
                content += `- [${article.title}](${url}): ${stripHtml(article.summary)} (${article.lang})\n`;

                // 实体 sameAs (最核心 3 个)
                if (article.entities) {
                    try {
                        const entityList = typeof article.entities === 'string'
                            ? JSON.parse(article.entities)
                            : (article.entities as any);
                        if (Array.isArray(entityList) && entityList.length > 0) {
                            const entityLinks = entityList
                                .filter(e => e && e.name && e.url)
                                .slice(0, 3)
                                .map(e => `[${e.name}](${e.url})`)
                                .join(', ');
                            if (entityLinks) {
                                content += `  - **Entities sameAs**: ${entityLinks}\n`;
                            }
                        }
                    } catch {}
                }

                // 权威引用 (最核心 2 个)
                if (article.citations) {
                    try {
                        const citationList = typeof article.citations === 'string'
                            ? JSON.parse(article.citations)
                            : (article.citations as any);
                        if (Array.isArray(citationList) && citationList.length > 0) {
                            const citationLinks = citationList
                                .filter(c => c && c.title && c.url)
                                .slice(0, 2)
                                .map(c => `[${c.title}](${c.url})`)
                                .join(', ');
                            if (citationLinks) {
                                content += `  - **Citations**: ${citationLinks}\n`;
                            }
                        }
                    } catch {}
                }
            });
        }

        // 最新产品
        const products = await db.product.findMany({
            where: {
                status: 'PUBLISHED',
                // 如果禁用多语言，只获取默认语言的内容
                ...(enableMultiLanguage ? {} : { lang: defaultLocale })
            },
            select: { name: true, slug: true, lang: true, description: true },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        if (products.length > 0) {
            content += `\n## Products\n\n`;
            products.forEach(product => {
                const url = `${baseUrl}${getLocalePath(`/product/${product.slug}`, product.lang as any)}`;
                content += `- [${product.name}](${url}): ${stripHtml(product.description)} (${product.lang})\n`;
            });
        }

        // 引导至全量 Sitemap
        content += `\n## Resources\n\n`;
        content += `- [Full Index](${baseUrl}/llms-full.txt): Comprehensive list of all pages and articles for deep context.\n`;
        content += `- [Full Sitemap](${baseUrl}/sitemap.xml): Complete index of all URLs for deep crawling.\n`;

        content += `\n---\n*Generated by Molicms for AI Interoperability. Last updated: ${new Date().toISOString().split('T')[0]}.*`;

        return new Response(content, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
            },
        });
    } catch (error) {
        console.error('Error generating llms.txt:', error);
        return new Response('Error generating llms.txt', { status: 500 });
    }
}
