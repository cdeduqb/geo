'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/use-translation';

export const ArticleList08Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t, isEn } = useTranslation();
    const {
        title = '暗色主题',
        subtitle,
        categorySortOrder,
        pageSize = 6,
        showPagination = true,
        showImage = true,
        showDate = true,
        showCategory = true,
        showDescription = true,
        showGradient = true,
    } = data;
    const {
        backgroundColor = '#0f172a',
        textColor = '#f8fafc',
        accentColor = '#22d3ee',
        cardBackgroundColor = '#1e293b',
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
        <section className="py-16 relative overflow-hidden" style={{ background: backgroundColor }}>
            {showGradient && (
                <>
                    <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: accentColor }}></div>
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ background: '#a855f7' }}></div>
                </>
            )}
            <div className="container mx-auto px-4 relative z-10">
                {(title || subtitle) && (
                    <div className="text-center mb-12">
                        {title && <h2 className="text-3xl font-bold mb-3" style={{ color: textColor }}>{title}</h2>}
                        {subtitle && <p className="text-lg opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block w-8 h-8 border-4 border-gray-600 border-t-cyan-400 rounded-full animate-spin"></div>
                    </div>
                ) : articles.length === 0 ? (
                    <div className="text-center py-12 opacity-60" style={{ color: textColor }}>{t('article.noArticles')}</div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" itemScope itemType="http://schema.org/ItemList">
                        {articles.map((article, index) => (
                            <article
                                key={article.id}
                                className="rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-colors group"
                                style={{ background: cardBackgroundColor }}
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
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    </Link>
                                )}
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                                        {showCategory && article.category?.name && (
                                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full border" style={{ borderColor: accentColor, color: accentColor }}>
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
                            </article>
                        ))}
                    </div>
                )}

                {showPagination && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors disabled:opacity-30" style={{ color: textColor }}>{t('common.prev')}</button>
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
                                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${page === currentPage ? '' : 'hover:bg-white/10'}`}
                                    style={page === currentPage ? { backgroundColor: accentColor, color: '#000' } : { color: textColor }}
                                >
                                    {page}
                                </button>
                            );
                        })}
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors disabled:opacity-30" style={{ color: textColor }}>{t('common.next')}</button>
                    </div>
                )}
            </div>
        </section>
    );
};
