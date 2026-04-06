import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { getGEOSettings } from '@/lib/system-settings';

import { Article, WithContext } from 'schema-dts';
import PageLayout from '@/components/PageLayout';
import { Metadata } from 'next';
import { Calendar, User, Tag, MapPin, Building2, Package, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import AuthorCard from '@/components/articles/AuthorCard';
import { ArticleStructuredData, BreadcrumbStructuredData, FAQStructuredData, DatasetStructuredData } from '@/components/geo/StructuredData';
import { getSiteSettings } from '@/lib/site-settings';
import { RichTextContent } from '@/components/security/SafeHTML';
import { extractFAQFromHTML, extractDatasetsFromHTML } from '@/lib/geo/parser';
import ArticleLayoutTraditional from '../_components/ArticleLayoutTraditional';
import ArticleLayoutBlog from '../_components/ArticleLayoutBlog';

export const revalidate = 300; // 每5分钟重新生成静态页面，迎合爬虫抓取频率

export async function generateStaticParams() {
    try {
        const articles = await db.article.findMany({
            where: { status: 'PUBLISHED' },
            select: { slug: true }
        });

        return articles.map(article => ({
            slug: article.slug,
        }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}

import { Badge } from "@/components/ui/badge";

import { getLocale } from '@/lib/locale-server';
import { getLocalePath, t } from '@/lib/i18n';
import ViewCounter from '../_components/ViewCounter';

interface ArticlePageProps {
    params: Promise<{ slug: string, locale?: string }>;
}

// 获取语言设置的静态友好版本
async function getSafeLocale(paramLocale?: string) {
    if (paramLocale) return paramLocale;
    // 在构建时或无语言路径时，尝试获取默认语言
    // 如果数据库连接可用则获取，否则默认 zh
    try {
        const setting = await db.systemSetting.findUnique({
            where: { key: 'default_locale' }
        });
        return setting?.value || 'zh';
    } catch {
        return 'zh';
    }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
    const { slug, locale: paramLocale } = await params;
    const locale = await getSafeLocale(paramLocale);

    // 1. 优先匹配 slug + lang
    let article = await (db.article as any).findFirst({
        where: { slug, lang: locale },
        include: {
            seo: true,
            author: true,
            category: true,
            tags: true,
        }
    });

    // 2. 如果没找到，尝试在任何语言中查找该 slug
    if (!article) {
        article = await (db.article as any).findFirst({
            where: { slug },
            include: {
                seo: true,
                author: true,
                category: true,
                tags: true,
            }
        });
    }

    if (!article) {
        return { title: 'Article Not Found' };
    }

    const { getSiteUrl } = await import('@/lib/system-settings');
    const { getLocalePath } = await import('@/lib/i18n');
    const baseUrl = await getSiteUrl();

    let siblings = [];
    if (article.translationGroupId) {
        siblings = await (db.article as any).findMany({
            where: { translationGroupId: article.translationGroupId, status: 'PUBLISHED' },
            select: { lang: true, slug: true }
        });
    } else {
        siblings = await (db.article as any).findMany({
            where: { slug: article.slug, status: 'PUBLISHED' },
            select: { lang: true, slug: true }
        });
    }

    const languages: Record<string, string> = {};
    siblings.forEach((s: any) => {
        const langCode = s.lang === 'zh' ? 'zh-CN' : s.lang === 'en' ? 'en-US' : s.lang;
        languages[langCode] = `${baseUrl}${getLocalePath(`/articles/${s.slug}`, s.lang as any)}`;
    });

    const alternates: any = {
        canonical: `${baseUrl}${getLocalePath(`/articles/${article.slug}`, locale as any)}`,
        languages: Object.keys(languages).length > 1 ? languages : undefined,
    };

    return {
        title: (article as any).seo?.title || article.title,
        description: (article as any).seo?.description || article.summary,
        keywords: (article as any).seo?.keywords,
        openGraph: {
            title: (article as any).seo?.title || article.title,
            description: (article as any).seo?.description || article.summary || undefined,
            images: (article as any).seo?.ogImage ? [(article as any).seo.ogImage] : article.coverImage ? [article.coverImage] : [],
            type: 'article',
            publishedTime: article.createdAt.toISOString(),
            modifiedTime: article.updatedAt.toISOString(),
            section: (article as any).category?.name,
            authors: (article as any).author?.name ? [(article as any).author.name] : [],
            tags: (article as any).tags?.map((t: any) => t.name) || [],
        },
        twitter: {
            card: 'summary_large_image',
            title: (article as any).seo?.title || article.title,
            description: (article as any).seo?.description || article.summary || undefined,
            images: (article as any).seo?.ogImage ? [(article as any).seo.ogImage] : article.coverImage ? [article.coverImage] : [],
        },
        alternates
    };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const { slug, locale: paramLocale } = await params;
    const locale = await getSafeLocale(paramLocale);
    const geo = await getGEOSettings();

    let article = await (db.article as any).findFirst({
        where: {
            slug,
            lang: locale,
            status: 'PUBLISHED'
        },
        include: {
            author: {
                select: {
                    id: true, name: true, avatar: true, bio: true,
                    expertise: true, website: true, twitter: true,
                    linkedin: true, github: true, isPublicAuthor: true,
                }
            },
            category: true,
            tags: true,
            seo: true,
        },
    });

    if (!article) {
        // 尝试在任何语言中查找该 slug
        const baseArticle = await (db.article as any).findFirst({
            where: { slug, status: 'PUBLISHED' }
        });

        if (baseArticle) {
            // 如果该文章属于一个翻译组，尝试在当前请求的语言中查找对应的翻译
            if (baseArticle.translationGroupId) {
                const translation = await (db.article as any).findFirst({
                    where: {
                        translationGroupId: baseArticle.translationGroupId,
                        lang: locale,
                        status: 'PUBLISHED'
                    }
                });

                if (translation) {
                    const { redirect } = await import('next/navigation');
                    // 🔧 对 slug 进行 URL 编码，避免特殊字符导致的错误
                    const encodedSlug = encodeURIComponent(translation.slug);
                    const redirectPath = getLocalePath(`/articles/${encodedSlug}`, locale as any);
                    redirect(redirectPath);
                }
            }

            // 如果没找到翻译，或者根本没切换语言，我们就在当前环境下渲染这个“基准”文章
            // 这样即使没有翻译，切换语言后也能留在当前 URL 模式下。
            article = await (db.article as any).findFirst({
                where: { id: baseArticle.id },
                include: {
                    author: {
                        select: {
                            id: true, name: true, avatar: true, bio: true,
                            expertise: true, website: true, twitter: true,
                            linkedin: true, github: true, isPublicAuthor: true,
                        }
                    },
                    category: true,
                    tags: true,
                    seo: true,
                }
            });
        }
    }

    if (!article) {
        notFound();
    }

    // 获取站点设置 (全局页眉页脚)
    const siteSettings = await getSiteSettings(locale);

    // 获取显示设置
    const showAuthorCardSetting = await db.systemSetting.findUnique({
        where: { key: 'show_author_card' }
    });
    const showAuthorCard = showAuthorCardSetting?.value === 'true';

    // 获取参考资料和关键实体显示设置
    const showCitationsSetting = await db.systemSetting.findUnique({
        where: { key: 'show_citations' }
    });
    const showCitations = showCitationsSetting?.value !== 'false'; // 默认显示

    const showEntitiesSetting = await db.systemSetting.findUnique({
        where: { key: 'show_entities' }
    });
    const showEntities = showEntitiesSetting?.value !== 'false'; // 默认显示

    // 浏览量现在由客户端组件 ViewCounter 处理，以支持静态页面
    // 增加浏览量的逻辑已移出服务端渲染过程

    const seoSettings = await import('@/lib/system-settings').then(m => m.getSEOSettings());
    let processedContent = article.content;
    const wordCount = processedContent ? processedContent.replace(/<[^>]*>?/gm, '').length : 0;

    // ✨ 为 SEO 和 TOC 目录动态注入锚点 ID (给 h2, h3 自动挂载 id)
    if (processedContent) {
        processedContent = processedContent.replace(/<h([23])(.*?)>([^<]+)<\/h\1>/g, (match: string, p1: string, p2: string, p3: string) => {
            // 如果已经有了 id 则跳过
            if (p2.includes('id=')) return match;
            // 通过文章原生标题生成安全锚点短链
            const id = p3.trim().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fa5-]/g, '').toLowerCase();
            return `<h${p1}${p2} id="${id || 'heading-' + Math.random().toString(36).substr(2, 5)}">${p3}</h${p1}>`;
        });
    }

    // 🏗️ 架构路由分配 (Architecture: Dual-Renderer Router)
    // 默认我们获取一个全局博客切换样式参数，若无则默认 'blog'，展示新的优质排版
    let layoutStyle = 'blog'; 
    const layoutSetting = await db.systemSetting.findUnique({ where: { key: 'article_layout_style' }});
    if (layoutSetting) { layoutStyle = layoutSetting.value; }
    
    // 如果想要给特定分类 (Category) 最高权限覆盖，可在此处预留: 
    // if (article.category?.layoutStyle) { layoutStyle = article.category.layoutStyle }

    // GEO/SEO: 获取上下篇文章，建立内部链接结构网
    const prevArticle = await db.article.findFirst({
        where: { lang: locale, status: 'PUBLISHED', createdAt: { lt: article.createdAt } },
        orderBy: { createdAt: 'desc' },
        select: { slug: true, title: true }
    });

    const nextArticle = await db.article.findFirst({
        where: { lang: locale, status: 'PUBLISHED', createdAt: { gt: article.createdAt } },
        orderBy: { createdAt: 'asc' },
        select: { slug: true, title: true }
    });

    return (
        <PageLayout
            headerTemplate={null}
            footerTemplate={null}
            headerSections={siteSettings?.headerSections as any[]}
            footerSections={siteSettings?.footerSections as any[]}
        >
            <ViewCounter slug={article.slug} />
            {/* GEO: 结构化数据 */}
            {geo.enableStructuredData && (
                <ArticleStructuredData
                    title={article.title}
                    description={article.summary || undefined}
                    author={(article as any).author?.name ? {
                        name: (article as any).author.name,
                        url: (article as any).author.isPublicAuthor ? `/author/${(article as any).author.id}` : undefined
                    } : undefined}
                    datePublished={article.createdAt.toISOString()}
                    dateModified={article.updatedAt.toISOString()}
                    image={article.coverImage || undefined}
                    url={getLocalePath(`/articles/${article.slug}`, locale as any)}
                    publisher={seoSettings ? {
                        name: seoSettings.siteName || 'Website',
                        logo: (siteSettings as any)?.logo || undefined
                    } : undefined}
                    wordCount={wordCount}
                    articleSection={(article as any).category?.name}
                    mentions={Array.isArray(article.entities) ? (article.entities as any[]).map((e: any) => ({
                        name: e.text,
                        description: e.description,
                        url: e.url
                    })) : undefined}
                    citations={Array.isArray(article.citations) ? (article.citations as any[]).map((c: any) => ({
                        name: c.title,
                        url: c.url
                    })) : undefined}
                    speakable={{
                        cssSelector: ['#article-title', '#article-summary']
                    }}
                />
            )}
            {geo.enableStructuredData && (() => {
                const faqs = extractFAQFromHTML(article.content);
                if (faqs.length > 0) {
                    return <FAQStructuredData questions={faqs} />;
                }
                return null;
            })()}
            {geo.enableStructuredData && (() => {
                const datasets = extractDatasetsFromHTML(article.content);
                return datasets.map((ds, i) => (
                    <DatasetStructuredData
                        key={i}
                        name={ds.name}
                        description={ds.description}
                        url={getLocalePath(`/articles/${article.slug}`, locale as any)}
                        creator={{ name: (article as any).author?.name || 'Admin' }}
                    />
                ));
            })()}
            {(article as any).category && (
                <BreadcrumbStructuredData
                    items={[
                        { name: t(locale, 'common.home'), url: getLocalePath('/', locale as any) },
                        { name: (article as any).category.name, url: getLocalePath(`/category/${(article as any).category.slug}`, locale as any) },
                        { name: article.title, url: getLocalePath(`/articles/${article.slug}`, locale as any) }
                    ]}
                />
            )}

            {layoutStyle === 'traditional' ? (
                <ArticleLayoutTraditional 
                    article={article} 
                    locale={locale} 
                    showAuthorCard={showAuthorCard} 
                    showCitations={showCitations} 
                    showEntities={showEntities} 
                    processedContent={processedContent} 
                    prevArticle={prevArticle}
                    nextArticle={nextArticle}
                />
            ) : (
                <ArticleLayoutBlog 
                    article={article} 
                    locale={locale} 
                    showAuthorCard={showAuthorCard} 
                    showCitations={showCitations} 
                    showEntities={showEntities} 
                    processedContent={processedContent} 
                    prevArticle={prevArticle}
                    nextArticle={nextArticle}
                />
            )}
        </PageLayout>
    );
}
