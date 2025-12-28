'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/use-translation';

export const ArticleList05Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t, isEn } = useTranslation();
    const {
        title = '文章',
        categorySortOrder,
        pageSize = 10,
        showPagination = true,
        showDate = true,
        showCategory = true,
        showDivider = true,
    } = data;
    const {
        backgroundColor = '#ffffff',
        textColor = '#111827',
        accentColor = '#6366f1',
        dividerColor = '#f3f4f6',
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
        <section className="py-12" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    {title && <h2 className="text-2xl font-bold mb-8" style={{ color: textColor }}>{title}</h2>}

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block w-6 h-6 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin"></div>
                        </div>
                    ) : articles.length === 0 ? (
                        <div className="text-center py-12 opacity-60" style={{ color: textColor }}>{t('article.noArticles')}</div>
                    ) : (
                        <ul className="space-y-0" itemScope itemType="http://schema.org/ItemList">
                            {articles.map((article, index) => (
                                <li
                                    key={article.id}
                                    className="py-4"
                                    style={{ borderBottom: showDivider && index < articles.length - 1 ? `1px solid ${dividerColor}` : 'none' }}
                                    itemProp="itemListElement"
                                    itemScope
                                    itemType="http://schema.org/Article"
                                >
                                    <meta itemProp="position" content={String(index + 1)} />
                                    <Link href={`/articles/${article.slug}`} itemProp="url" className="group flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {showCategory && article.category?.name && (
                                                <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: `${accentColor}15`, color: accentColor }}>
                                                    {article.category.name}
                                                </span>
                                            )}
                                            <span
                                                itemProp="headline"
                                                className="font-medium group-hover:opacity-70 transition-opacity line-clamp-1"
                                                style={{ color: textColor }}
                                            >
                                                {article.title}
                                            </span>
                                        </div>
                                        {showDate && article.publishedAt && (
                                            <span className="text-sm opacity-50 flex-shrink-0 ml-4" style={{ color: textColor }}>
                                                <time itemProp="datePublished" dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}

                    {showPagination && totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
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
                                        className={`w-8 h-8 rounded text-sm font-medium transition-colors ${page === currentPage ? 'text-white' : 'hover:bg-gray-100'}`}
                                        style={page === currentPage ? { backgroundColor: accentColor } : { color: textColor }}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
