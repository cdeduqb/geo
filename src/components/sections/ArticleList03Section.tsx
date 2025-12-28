'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/use-translation';

export const ArticleList03Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t, isEn } = useTranslation();

    const {
        title = t('article.latestArticles'),
        subtitle,
        categorySortOrder,
        pageSize = 5,
        showPagination = true,
        showImage = true,
        showDate = true,
        showCategory = true,
        showDescription = true,
        featuredLayout = true,
    } = data;
    const {
        backgroundColor = '#f9fafb',
        textColor = '#111827',
        accentColor = '#ef4444',
        cardBackgroundColor = '#ffffff',
    } = style;

    const [articles, setArticles] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (categorySortOrder) params.append('categorySortOrder', categorySortOrder);
                params.append('page', String(currentPage));
                params.append('limit', String(pageSize));
                params.append('status', 'published');

                const res = await fetch(`/api/articles?${params}`);
                if (res.ok) {
                    const result = await res.json();
                    setArticles(result.articles || []);
                    setTotal(result.pagination?.total || 0);
                }
            } catch (error) {
                console.error('获取文章失败:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, [categorySortOrder, currentPage, pageSize]);

    const totalPages = Math.ceil(total / pageSize);
    const formatDate = (dateStr: string) => dateStr ? new Date(dateStr).toLocaleDateString(isEn ? 'en-US' : 'zh-CN') : '';

    const featuredArticle = featuredLayout && articles.length > 0 ? articles[0] : null;
    const otherArticles = featuredLayout ? articles.slice(1) : articles;

    return (
        <section className="py-16" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {(title || subtitle) && (
                    <div className="text-center mb-12">
                        {title && <h2 className="text-3xl font-bold mb-3" style={{ color: textColor }}>{title}</h2>}
                        {subtitle && <p className="text-lg opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin"></div>
                    </div>
                ) : articles.length === 0 ? (
                    <div className="text-center py-12 opacity-60" style={{ color: textColor }}>{t('article.noArticles')}</div>
                ) : (
                    <div className="grid lg:grid-cols-2 gap-8" itemScope itemType="http://schema.org/ItemList">
                        {featuredArticle && (
                            <article
                                className="lg:row-span-2 rounded-2xl overflow-hidden shadow-lg"
                                style={{ background: cardBackgroundColor }}
                                itemProp="itemListElement"
                                itemScope
                                itemType="http://schema.org/Article"
                            >
                                <meta itemProp="position" content="1" />
                                {showImage && featuredArticle.coverImage && (
                                    <Link href={`/articles/${featuredArticle.id}`} itemProp="url">
                                        <div className="aspect-[4/3] overflow-hidden">
                                            <img
                                                src={featuredArticle.coverImage}
                                                alt={featuredArticle.title}
                                                itemProp="image"
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    </Link>
                                )}
                                <div className="p-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        {showCategory && featuredArticle.category?.name && (
                                            <span className="text-sm font-semibold px-3 py-1 rounded-full text-white" style={{ background: accentColor }}>
                                                {featuredArticle.category.name}
                                            </span>
                                        )}
                                        {showDate && featuredArticle.publishedAt && (
                                            <span className="text-sm opacity-50" style={{ color: textColor }}>
                                                <time itemProp="datePublished" dateTime={featuredArticle.publishedAt}>{formatDate(featuredArticle.publishedAt)}</time>
                                            </span>
                                        )}
                                    </div>
                                    <Link href={`/articles/${featuredArticle.id}`}>
                                        <h3
                                            itemProp="headline"
                                            className="text-2xl font-bold mb-3 hover:opacity-80 transition-opacity line-clamp-2"
                                            style={{ color: textColor }}
                                        >
                                            {featuredArticle.title}
                                        </h3>
                                    </Link>
                                    {showDescription && featuredArticle.summary && (
                                        <p
                                            itemProp="description"
                                            className="opacity-60 line-clamp-3"
                                            style={{ color: textColor }}
                                        >
                                            {featuredArticle.summary}
                                        </p>
                                    )}
                                </div>
                            </article>
                        )}
                        <div className="space-y-4">
                            {otherArticles.map((article, index) => (
                                <article
                                    key={article.id}
                                    className="flex gap-4 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                                    style={{ background: cardBackgroundColor }}
                                    itemProp="itemListElement"
                                    itemScope
                                    itemType="http://schema.org/Article"
                                >
                                    <meta itemProp="position" content={String(index + 2)} />
                                    {showImage && article.coverImage && (
                                        <Link href={`/articles/${article.slug}`} itemProp="url" className="w-28 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                                            <img
                                                src={article.coverImage}
                                                alt={article.title}
                                                itemProp="image"
                                                className="w-full h-full object-cover"
                                            />
                                        </Link>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            {showCategory && article.category?.name && (
                                                <span className="text-xs font-semibold" style={{ color: accentColor }}>{article.category.name}</span>
                                            )}
                                            {showDate && article.publishedAt && (
                                                <span className="text-sm opacity-50" style={{ color: textColor }}>
                                                    <time itemProp="datePublished" dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                                                </span>
                                            )}
                                        </div>
                                        <Link href={`/articles/${article.slug}`}>
                                            <h4
                                                itemProp="headline"
                                                className="font-bold hover:opacity-80 transition-opacity line-clamp-2"
                                                style={{ color: textColor }}
                                            >
                                                {article.title}
                                            </h4>
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                )}

                {showPagination && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-12">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-5 py-2 rounded-lg font-medium text-white disabled:opacity-50" style={{ background: accentColor }}>{t('common.prev')}</button>
                        <span style={{ color: textColor }}>{currentPage} / {totalPages}</span>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-5 py-2 rounded-lg font-medium text-white disabled:opacity-50" style={{ background: accentColor }}>{t('common.next')}</button>
                    </div>
                )}
            </div>
        </section>
    );
};
