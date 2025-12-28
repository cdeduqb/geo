'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/use-translation';

export const ArticleList09Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t, isEn } = useTranslation();
    const {
        title = '极简卡片',
        categorySortOrder,
        pageSize = 4,
        showPagination = true,
        showImage = true,
        showDate = true,
        showCategory = true,
        cardStyle = 'minimal',
    } = data;
    const {
        backgroundColor = '#ffffff',
        textColor = '#111827',
        accentColor = '#14b8a6',
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
    const formatDate = (dateStr: string) => dateStr ? new Date(dateStr).toLocaleDateString(isEn ? 'en-US' : 'zh-CN') : '';

    return (
        <section className="py-16" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && <h2 className="text-3xl font-bold mb-10 text-center" style={{ color: textColor }}>{title}</h2>}

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin"></div>
                    </div>
                ) : articles.length === 0 ? (
                    <div className="text-center py-12 opacity-60" style={{ color: textColor }}>{t('article.noArticles')}</div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto" itemScope itemType="http://schema.org/ItemList">
                        {articles.map((article, index) => (
                            <Link href={`/articles/${article.slug}`} key={article.id} itemProp="url">
                                <article
                                    className={`p-6 rounded-xl transition-all hover:-translate-y-1 ${cardStyle === 'bordered' ? 'border-2' : ''}`}
                                    style={{
                                        background: cardBackgroundColor,
                                        borderColor: cardStyle === 'bordered' ? borderColor : 'transparent',
                                        boxShadow: cardStyle === 'shadow' ? '0 4px 20px rgba(0,0,0,0.08)' : 'none'
                                    }}
                                    itemProp="itemListElement"
                                    itemScope
                                    itemType="http://schema.org/Article"
                                >
                                    <meta itemProp="position" content={String(index + 1)} />
                                    <div className="flex gap-4">
                                        {showImage && article.coverImage && (
                                            <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                                                <img
                                                    src={article.coverImage}
                                                    alt={article.title}
                                                    itemProp="image"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h3
                                                itemProp="headline"
                                                className="font-bold mb-2 hover:opacity-80 transition-opacity line-clamp-2"
                                                style={{ color: textColor }}
                                            >
                                                {article.title}
                                            </h3>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {showCategory && article.category?.name && (
                                                    <span className="text-xs font-medium" style={{ color: accentColor }}>{article.category.name}</span>
                                                )}
                                                {showDate && article.publishedAt && (
                                                    <span className="text-sm opacity-50" style={{ color: textColor }}>
                                                        <time itemProp="datePublished" dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}

                {showPagination && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-10">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-30" style={{ background: `${accentColor}15`, color: accentColor }}>{t('common.prev')}</button>
                        <span className="font-medium" style={{ color: textColor }}>{currentPage} / {totalPages}</span>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-30" style={{ background: `${accentColor}15`, color: accentColor }}>{t('common.next')}</button>
                    </div>
                )}
            </div>
        </section>
    );
};
