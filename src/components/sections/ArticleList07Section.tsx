'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/use-translation';

export const ArticleList07Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t, isEn } = useTranslation();
    const {
        title = '瀑布流',
        subtitle,
        categorySortOrder,
        pageSize = 9,
        showPagination = true,
        showImage = true,
        showDate = true,
        showCategory = true,
        showDescription = true,
    } = data;
    const {
        backgroundColor = '#f3f4f6',
        textColor = '#111827',
        accentColor = '#ec4899',
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

    // Distribute articles into 3 columns for masonry effect
    const columns: any[][] = [[], [], []];
    articles.forEach((article, i) => columns[i % 3].push(article));

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
                        <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-pink-500 rounded-full animate-spin"></div>
                    </div>
                ) : articles.length === 0 ? (
                    <div className="text-center py-12 opacity-60" style={{ color: textColor }}>{t('article.noArticles')}</div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" itemScope itemType="http://schema.org/ItemList">
                        {columns.map((column, colIndex) => (
                            <div key={colIndex} className="space-y-6">
                                {column.map((article, i) => {
                                    const overallIndex = i * 3 + colIndex + 1;
                                    return (
                                        <article
                                            key={article.id}
                                            className="rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
                                            style={{ background: cardBackgroundColor }}
                                            itemProp="itemListElement"
                                            itemScope
                                            itemType="http://schema.org/Article"
                                        >
                                            <meta itemProp="position" content={String(overallIndex)} />
                                            {showImage && article.coverImage && (
                                                <Link href={`/articles/${article.slug}`} itemProp="url">
                                                    <div className={`overflow-hidden ${i % 2 === 0 ? 'aspect-[4/3]' : 'aspect-video'}`}>
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
                                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                    {showCategory && article.category?.name && (
                                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${accentColor}15`, color: accentColor }}>
                                                            {article.category.name}
                                                        </span>
                                                    )}
                                                    {showDate && article.publishedAt && (
                                                        <span className="text-xs opacity-50" style={{ color: textColor }}>
                                                            <time itemProp="datePublished" dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                                                        </span>
                                                    )}
                                                </div>
                                                <Link href={`/articles/${article.slug}`}>
                                                    <h3
                                                        itemProp="headline"
                                                        className="font-bold mb-2 hover:opacity-80 transition-opacity line-clamp-2"
                                                        style={{ color: textColor }}
                                                    >
                                                        {article.title}
                                                    </h3>
                                                </Link>
                                                {showDescription && article.summary && (
                                                    <p
                                                        itemProp="description"
                                                        className="text-sm opacity-60 line-clamp-3"
                                                        style={{ color: textColor }}
                                                    >
                                                        {article.summary}
                                                    </p>
                                                )}
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                )}

                {showPagination && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-12">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-5 py-2 rounded-full font-medium text-white disabled:opacity-50" style={{ background: accentColor }}>{t('common.prev')}</button>
                        <span style={{ color: textColor }}>{currentPage} / {totalPages}</span>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-5 py-2 rounded-full font-medium text-white disabled:opacity-50" style={{ background: accentColor }}>{t('common.next')}</button>
                    </div>
                )}
            </div>
        </section>
    );
};
