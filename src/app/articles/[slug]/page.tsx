import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { getGEOSettings } from '@/lib/system-settings';

import { Article, WithContext } from 'schema-dts';
import PageLayout from '@/components/PageLayout';
import { Metadata } from 'next';
import { Calendar, User, Tag, MapPin, Building2, Package, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import AuthorCard from '@/components/articles/AuthorCard';
import { ArticleStructuredData, BreadcrumbStructuredData } from '@/components/geo/StructuredData';
import { getSiteSettings } from '@/lib/site-settings';
import { RichTextContent } from '@/components/security/SafeHTML';

export const revalidate = 3600; // 每小时重新生成静态页面

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

    const alternates: any = {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/articles/${article.slug}`,
        languages: {
            'zh-CN': `${process.env.NEXT_PUBLIC_SITE_URL || ''}/articles/${article.slug}`,
            'en-US': `${process.env.NEXT_PUBLIC_SITE_URL || ''}/en/articles/${article.slug}`,
        },
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

    // 处理文章内容
    const processedContent = article.content;

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
                    mentions={Array.isArray(article.entities) ? (article.entities as any[]).map(e => ({
                        name: e.text,
                        description: e.description,
                        url: e.url
                    })) : undefined}
                    citations={Array.isArray(article.citations) ? (article.citations as any[]).map(c => ({
                        name: c.title,
                        url: c.url
                    })) : undefined}
                />
            )}
            {(article as any).category && (
                <BreadcrumbStructuredData
                    items={[
                        { name: t(locale, 'common.home'), url: getLocalePath('/', locale as any) },
                        { name: (article as any).category.name, url: getLocalePath(`/category/${(article as any).category.slug}`, locale as any) },
                        { name: article.title, url: getLocalePath(`/articles/${article.slug}`, locale as any) }
                    ]}
                />
            )}

            <article className="min-h-screen bg-white  pb-20">
                {/* 顶部 Hero 区域 */}
                <header className="relative w-full bg-gray-50  py-16 md:py-24 border-b border-gray-100  overflow-hidden">
                    {/* 背景装饰 */}
                    <div className="absolute inset-0 opacity-[0.03]  pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
                    </div>

                    <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                        {article.category && (
                            <Link
                                href={getLocalePath(`/category/${article.category.slug}`, locale as any)}
                                className="inline-flex items-center px-4 py-1.5 bg-blue-600 text-white text-sm font-bold rounded-full mb-8 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                            >
                                {article.category.name}
                            </Link>
                        )}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900  leading-tight mb-8 tracking-tight">
                            {article.title}
                        </h1>

                        <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500  text-sm md:text-base font-medium">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-100  flex items-center justify-center text-blue-600  font-bold overflow-hidden ring-2 ring-white ">
                                    {article.author.avatar ? (
                                        <img src={article.author.avatar} alt={article.author.name || ''} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-4 h-4" />
                                    )}
                                </div>
                                <span className="text-gray-900 ">{(article.author.name === '管理员' || article.author.name === 'Admin') ? t(locale, 'common.admin') : article.author.name}</span>
                            </div>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <time dateTime={article.createdAt.toISOString()} suppressHydrationWarning>
                                    {new Date(article.createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'zh-CN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </time>
                            </div>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <div>
                                {article.views} {t(locale, 'article.views')}
                            </div>
                            {article.aiGenerated && (
                                <>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600 rounded border border-purple-200 text-xs font-semibold">
                                        ✨ {locale === 'en' ? 'AI Assisted' : 'AI 辅助创作'}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <div className={`max-w-4xl mx-auto px-4 relative z-10 ${article.coverImage ? '-mt-8 sm:-mt-12' : 'mt-12'}`}>
                    {/* 封面图 - 悬浮效果 */}
                    {article.coverImage && (
                        <div className="rounded-2xl overflow-hidden shadow-2xl mb-12 ring-1 ring-black/5 aspect-video bg-gray-100 group">
                            <img
                                src={article.coverImage}
                                alt={article.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                    )}

                    {/* 摘要 */}
                    {article.summary && (
                        <div className="mb-10 p-8 bg-blue-50/50 border-l-4 border-blue-500 rounded-r-xl">
                            <p className="text-xl leading-relaxed text-gray-700 font-serif italic">
                                {article.summary}
                            </p>
                        </div>
                    )}

                    {/* 文章内容 */}
                    <RichTextContent
                        content={processedContent}
                        className="prose prose-lg md:prose-xl max-w-none
                            prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900
                            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                            prose-p:text-gray-600 prose-p:leading-8 prose-p:mb-6
                            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-700 prose-a:transition-colors prose-a:border-b prose-a:border-blue-200 hover:prose-a:border-blue-600
                            prose-strong:text-gray-900 prose-strong:font-bold
                            prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-[0.9em] before:prose-code:content-[''] after:prose-code:content-['']
                            prose-pre:bg-gray-900 prose-pre:rounded-xl prose-pre:shadow-lg prose-pre:p-6
                            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:bg-gray-50/50 prose-blockquote:rounded-r-lg
                            prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                            prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6 prose-li:my-2 prose-li:pl-2
                            prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-6"
                    />

                    {/* 底部信息区 */}
                    <div className="mt-16 space-y-12">
                        {/* 标签 */}
                        {(article as any).tags?.length > 0 && (
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                    <Tag className="w-4 h-4" /> {t(locale, 'article.tags')}
                                </span>
                                {(article as any).tags.map((tag: any) => (
                                    <Link
                                        key={tag.id}
                                        href={`/tag/${tag.name}`}
                                        className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                                    >
                                        #{tag.name}
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* 参考资料 (GEO Phase 2) */}
                        {showCitations && article.citations && Array.isArray(article.citations) && article.citations.length > 0 && (
                            <div className="rounded-xl bg-gray-50 p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                    {t(locale, 'article.citations')}
                                </h3>
                                <ol className="list-decimal list-outside ml-5 space-y-3 text-sm text-gray-600">
                                    {article.citations.map((citation: any, index: number) => (
                                        <li key={index} id={`citation-${index + 1}`} className="pl-2">
                                            <span className="font-medium text-gray-900">
                                                {citation.title}
                                            </span>
                                            {citation.author && <span className="text-gray-500"> - {citation.author}</span>}
                                            {citation.publishDate && <span className="text-gray-400"> ({citation.publishDate})</span>}
                                            {citation.url && (
                                                <a
                                                    href={citation.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ml-2 text-blue-600 hover:underline inline-flex items-center"
                                                >
                                                    [{locale === 'en' ? 'View Source' : '查看来源'}]
                                                </a>
                                            )}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}

                        {/* 实体识别 (GEO Phase 3) */}
                        {showEntities && article.entities && Array.isArray(article.entities) && article.entities.length > 0 && (
                            <div className="rounded-xl bg-purple-50 p-6 border border-purple-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                                    {t(locale, 'article.entities')}
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {article.entities.map((entity: any, index: number) => {
                                        let Icon = Tag;
                                        if (entity.type === 'Person') Icon = User;
                                        if (entity.type === 'Place') Icon = MapPin;
                                        if (entity.type === 'Organization') Icon = Building2;
                                        if (entity.type === 'Product') Icon = Package;
                                        if (entity.type === 'Concept') Icon = Lightbulb;

                                        return (
                                            <div key={index} className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-purple-100 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-default" title={entity.description || entity.type}>
                                                <Icon className="w-4 h-4 text-purple-500" />
                                                <span>{entity.text}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* 作者卡片 */}
                        {showAuthorCard && <AuthorCard author={(article as any).author} />}
                    </div>
                </div>
            </article>
        </PageLayout>
    );
}
