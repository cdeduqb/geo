'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/use-translation';

export const ArticleList01Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { locale, t, getLocalePath, isEn } = useTranslation();

    const {
        title = t('article.latestArticles'),
        subtitle,
        categoryId,
        pageSize = 6,
        showPagination = true,
        showImage = true,
        showDate = true,
        showCategory = true,
        showDescription = true,
        columnCount = 3,
        imageRatio = '16/9',
        buttonText = t('common.readMore'),
        cardRadius = '12',
        cardShadow = true,
    } = data;
    const {
        backgroundColor = '#ffffff',
        textColor = '#111827',
        accentColor = '#3b82f6',
        cardBackgroundColor = '#f9fafb',
        titleColor,
        descriptionColor,
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
                if (categoryId) params.append('categoryId', categoryId);
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
    }, [categoryId, currentPage, pageSize]);

    const totalPages = Math.ceil(total / pageSize);
    const gridCols = columnCount == 2 ? 'md:grid-cols-2' : columnCount == 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3';

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString(isEn ? 'en-US' : 'zh-CN');
    };

    return (
        <section className="py-16" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {(title || subtitle) && (
                    <div className="text-center mb-12">
                        {title && <h2 className="text-3xl font-bold mb-4" style={{ color: titleColor || textColor }}>{title}</h2>}
                        {subtitle && <p className="text-lg opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                        <p className="mt-4 opacity-60" style={{ color: textColor }}>{t('common.loading')}</p>
                    </div>
                ) : articles.length === 0 ? (
                    <div className="text-center py-12 opacity-60" style={{ color: textColor }}>{t('article.noArticles')}</div>
                ) : (
                    <div className={`grid gap-8 ${gridCols}`} itemScope itemType="http://schema.org/ItemList">
                        {articles.map((article, index) => (
                            <article
                                key={article.id}
                                className={`overflow-hidden ${cardShadow ? 'shadow-sm hover:shadow-xl' : ''} transition-shadow`}
                                style={{ background: cardBackgroundColor, borderRadius: `${cardRadius}px` }}
                                itemProp="itemListElement"
                                itemScope
                                itemType="http://schema.org/Article"
                            >
                                <meta itemProp="position" content={String(index + 1)} />
                                {showImage && article.coverImage && (
                                    <Link href={`/articles/${article.slug}`} itemProp="url">
                                        <div className="overflow-hidden" style={{ aspectRatio: imageRatio }}>
                                            <img
                                                src={article.coverImage}
                                                alt={article.title}
                                                itemProp="image"
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    </Link>
                                )}
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                                        {showCategory && article.category?.name && (
                                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: `${accentColor}15`, color: accentColor }}>
                                                {article.category.name}
                                            </span>
                                        )}
                                        {showDate && article.publishedAt && (
                                            <span className="text-sm opacity-50" style={{ color: textColor }}>
                                                <time itemProp="datePublished" dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                                            </span>
                                        )}
                                    </div>
                                    <Link href={`/articles/${article.slug}`}>
                                        <h3
                                            itemProp="headline"
                                            className="text-xl font-bold mb-2 hover:opacity-80 transition-opacity cursor-pointer line-clamp-2"
                                            style={{ color: titleColor || textColor }}
                                        >
                                            {article.title}
                                        </h3>
                                    </Link>
                                    {showDescription && article.summary && (
                                        <p
                                            itemProp="description"
                                            className="opacity-60 mb-4 line-clamp-2"
                                            style={{ color: descriptionColor || textColor }}
                                        >
                                            {article.summary}
                                        </p>
                                    )}
                                    <Link href={`/articles/${article.slug}`} className="inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all" style={{ color: accentColor }}>
                                        {buttonText}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {showPagination && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ color: textColor }}
                        >
                            {t('common.prev')}
                        </button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            let page = i + 1;
                            if (totalPages > 5) {
                                if (currentPage <= 3) page = i + 1;
                                else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                                else page = currentPage - 2 + i;
                            }
                            return (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${page === currentPage ? 'text-white' : 'border border-gray-200 hover:bg-gray-50'}`}
                                    style={page === currentPage ? { backgroundColor: accentColor } : { color: textColor }}
                                >
                                    {page}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ color: textColor }}
                        >
                            {t('common.next')}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};
