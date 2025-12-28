'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/use-translation';

export const ArticleList04Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t, isEn } = useTranslation();
    const {
        title = '时间线',
        categorySortOrder,
        pageSize = 6,
        showPagination = true,
        showImage = true,
        showDate = true,
        showCategory = true,
        showDescription = true,
    } = data;
    const {
        backgroundColor = '#ffffff',
        textColor = '#111827',
        accentColor = '#10b981',
        lineColor = '#e5e7eb',
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

    return (
        <section className="py-16" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: textColor }}>{title}</h2>}

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
                    </div>
                ) : articles.length === 0 ? (
                    <div className="text-center py-12 opacity-60" style={{ color: textColor }}>{t('article.noArticles')}</div>
                ) : (
                    <div className="max-w-3xl mx-auto relative" itemScope itemType="http://schema.org/ItemList">
                        <div className="absolute left-8 top-0 bottom-0 w-0.5" style={{ background: lineColor }}></div>
                        {articles.map((article, index) => (
                            <div key={article.id} className="relative pl-20 pb-10">
                                <div className="absolute left-6 w-5 h-5 rounded-full border-4 border-white" style={{ background: accentColor }}></div>
                                {showDate && article.publishedAt && (
                                    <div className="absolute left-0 top-0 text-xs font-bold px-2 py-1 rounded" style={{ background: `${accentColor}15`, color: accentColor }}>
                                        <time itemProp="datePublished" dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                                    </div>
                                )}
                                <article
                                    className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
                                    itemProp="itemListElement"
                                    itemScope
                                    itemType="http://schema.org/Article"
                                >
                                    <meta itemProp="position" content={String(index + 1)} />
                                    <div className="flex gap-4">
                                        {showImage && article.coverImage && (
                                            <Link href={`/articles/${article.slug}`} itemProp="url" className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                                                <img
                                                    src={article.coverImage}
                                                    alt={article.title}
                                                    itemProp="image"
                                                    className="w-full h-full object-cover"
                                                />
                                            </Link>
                                        )}
                                        <div className="flex-1">
                                            {showCategory && article.category?.name && (
                                                <span className="text-xs font-semibold mb-2 inline-block" style={{ color: accentColor }}>{article.category.name}</span>
                                            )}
                                            <Link href={`/articles/${article.slug}`}>
                                                <h3
                                                    itemProp="headline"
                                                    className="text-lg font-bold mb-2 hover:opacity-80 transition-opacity line-clamp-2"
                                                    style={{ color: textColor }}
                                                >
                                                    {article.title}
                                                </h3>
                                            </Link>
                                            {showDescription && article.summary && (
                                                <p
                                                    itemProp="description"
                                                    className="text-sm opacity-60 line-clamp-2"
                                                    style={{ color: textColor }}
                                                >
                                                    {article.summary}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            </div>
                        ))}
                    </div>
                )}

                {showPagination && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-5 py-2 rounded-lg font-medium text-white disabled:opacity-50" style={{ background: accentColor }}>{t('common.prev')}</button>
                        <span style={{ color: textColor }}>{currentPage} / {totalPages}</span>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-5 py-2 rounded-lg font-medium text-white disabled:opacity-50" style={{ background: accentColor }}>{t('common.next')}</button>
                    </div>
                )}
            </div>
        </section>
    );
};
