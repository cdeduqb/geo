'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/use-translation';

export const ArticleList10Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t, isEn } = useTranslation();
    const {
        title = '新闻中心',
        subtitle,
        categorySortOrder,
        pageSize = 8,
        showPagination = true,
        showImage = true,
        showDate = true,
        showCategory = true,
        showDescription = true,
        layout = 'portal',
    } = data;
    const {
        backgroundColor = '#ffffff',
        textColor = '#111827',
        accentColor = '#dc2626',
        cardBackgroundColor = '#f9fafb',
        borderColor = '#e5e7eb',
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
    const formatDate = (dateStr: string) => {
        if (!dateStr) return { day: '', monthYear: '' };
        const date = new Date(dateStr);
        return {
            day: date.getDate().toString().padStart(2, '0'),
            monthYear: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
        };
    };

    const topArticles = articles.slice(0, 2);
    const listArticles = articles.slice(2);

    return (
        <section className="py-16" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {(title || subtitle) && (
                    <div className="flex items-center justify-between mb-10 pb-4" style={{ borderBottom: `2px solid ${accentColor}` }}>
                        <div>
                            {title && <h2 className="text-2xl font-bold" style={{ color: textColor }}>{title}</h2>}
                            {subtitle && <p className="text-sm opacity-60 mt-1" style={{ color: textColor }}>{subtitle}</p>}
                        </div>
                        <Link href="/articles" className="text-sm font-medium hover:underline" style={{ color: accentColor }}>更多文章 →</Link>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin"></div>
                    </div>
                ) : articles.length === 0 ? (
                    <div className="text-center py-12 opacity-60" style={{ color: textColor }}>{t('article.noArticles')}</div>
                ) : (
                    <div itemScope itemType="http://schema.org/ItemList">
                        {/* Top Articles */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            {topArticles.map((article, index) => (
                                <article
                                    key={article.id}
                                    className="rounded-lg overflow-hidden border"
                                    style={{ background: cardBackgroundColor, borderColor }}
                                    itemProp="itemListElement"
                                    itemScope
                                    itemType="http://schema.org/Article"
                                >
                                    <meta itemProp="position" content={String(index + 1)} />
                                    {showImage && article.coverImage && (
                                        <Link href={`/articles/${article.slug}`} itemProp="url">
                                            <div className="aspect-video overflow-hidden">
                                                <img
                                                    src={article.coverImage}
                                                    alt={article.title}
                                                    itemProp="image"
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        </Link>
                                    )}
                                    <div className="p-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            {showCategory && article.category?.name && (
                                                <span className="text-xs font-bold px-2 py-0.5" style={{ background: accentColor, color: '#fff' }}>{article.category.name}</span>
                                            )}
                                            {showDate && article.publishedAt && (
                                                <span className="text-xs opacity-50" style={{ color: textColor }}>
                                                    <time itemProp="datePublished" dateTime={article.publishedAt}>{formatDate(article.publishedAt).monthYear}</time>
                                                </span>
                                            )}
                                        </div>
                                        <Link href={`/articles/${article.slug}`}>
                                            <h3
                                                itemProp="headline"
                                                className="text-lg font-bold hover:opacity-80 transition-opacity line-clamp-2"
                                                style={{ color: textColor }}
                                            >
                                                {article.title}
                                            </h3>
                                        </Link>
                                        {showDescription && article.summary && (
                                            <p
                                                itemProp="description"
                                                className="text-sm opacity-60 mt-2 line-clamp-2"
                                                style={{ color: textColor }}
                                            >
                                                {article.summary}
                                            </p>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* List Articles */}
                        {listArticles.length > 0 && (
                            <div className="border rounded-lg overflow-hidden" style={{ borderColor }}>
                                {listArticles.map((article, index) => (
                                    <Link href={`/articles/${article.slug}`} key={article.id} itemProp="url">
                                        <article
                                            className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                                            style={{ borderBottom: index < listArticles.length - 1 ? `1px solid ${borderColor}` : 'none' }}
                                            itemProp="itemListElement"
                                            itemScope
                                            itemType="http://schema.org/Article"
                                        >
                                            <meta itemProp="position" content={String(index + 3)} />
                                            {showDate && article.publishedAt && (
                                                <div className="w-14 text-center flex-shrink-0">
                                                    <div className="text-2xl font-bold" style={{ color: accentColor }}>{formatDate(article.publishedAt).day}</div>
                                                    <div className="text-xs opacity-50" style={{ color: textColor }}>
                                                        <time itemProp="datePublished" dateTime={article.publishedAt}>{formatDate(article.publishedAt).monthYear}</time>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    {showCategory && article.category?.name && (
                                                        <span className="text-xs font-medium" style={{ color: accentColor }}>[{article.category.name}]</span>
                                                    )}
                                                    <span
                                                        itemProp="headline"
                                                        className="font-medium hover:opacity-80 transition-opacity line-clamp-1"
                                                        style={{ color: textColor }}
                                                    >
                                                        {article.title}
                                                    </span>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {showPagination && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors disabled:opacity-30" style={{ borderColor, color: textColor }}>{t('common.prev')}</button>
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
                                    className="w-10 h-10 rounded font-medium transition-colors"
                                    style={page === currentPage ? { backgroundColor: accentColor, color: '#fff' } : { borderColor, color: textColor, border: '1px solid' }}
                                >
                                    {page}
                                </button>
                            );
                        })}
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors disabled:opacity-30" style={{ borderColor, color: textColor }}>{t('common.next')}</button>
                    </div>
                )}
            </div>
        </section>
    );
};
