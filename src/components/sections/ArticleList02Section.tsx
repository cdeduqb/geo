'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/use-translation';

export const ArticleList02Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t, isEn } = useTranslation();

    const {
        title = t('article.list'),
        subtitle,
        categoryId,
        pageSize = 5,
        showPagination = true,
        showImage = true,
        showDate = true,
        showCategory = true,
        showDescription = true,
        imagePosition = 'left',
        imageSize = 'medium',
    } = data;
    const {
        backgroundColor = '#ffffff',
        textColor = '#111827',
        accentColor = '#8b5cf6',
        dividerColor = '#e5e7eb',
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
    const imageSizeClass = imageSize === 'small' ? 'w-24 h-24' : imageSize === 'large' ? 'w-48 h-36' : 'w-40 h-32';

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString(isEn ? 'en-US' : 'zh-CN');
    };

    return (
        <section className="py-16" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {(title || subtitle) && (
                        <div className="mb-10">
                            {title && <h2 className="text-3xl font-bold mb-3" style={{ color: textColor }}>{title}</h2>}
                            {subtitle && <p className="text-lg opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-purple-500 rounded-full animate-spin"></div>
                        </div>
                    ) : articles.length === 0 ? (
                        <div className="text-center py-12 opacity-60" style={{ color: textColor }}>{t('article.noArticles')}</div>
                    ) : (
                        <div className="space-y-0" itemScope itemType="http://schema.org/ItemList">
                            {articles.map((article, index) => (
                                <article
                                    key={article.id}
                                    className={`flex items-center gap-6 py-6 ${imagePosition === 'right' ? 'flex-row-reverse' : ''}`}
                                    style={{ borderBottom: index < articles.length - 1 ? `1px solid ${dividerColor}` : 'none' }}
                                    itemProp="itemListElement"
                                    itemScope
                                    itemType="http://schema.org/Article"
                                >
                                    <meta itemProp="position" content={String(index + 1)} />
                                    {showImage && article.coverImage && (
                                        <Link href={`/articles/${article.slug}`} itemProp="url" className={`${imageSizeClass} flex-shrink-0 rounded-xl overflow-hidden`}>
                                            <img
                                                src={article.coverImage}
                                                alt={article.title}
                                                itemProp="image"
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        </Link>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            {showCategory && article.category?.name && (
                                                <span className="text-xs font-bold px-2.5 py-1 rounded" style={{ background: `${accentColor}15`, color: accentColor }}>
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
                                                style={{ color: textColor }}
                                            >
                                                {article.title}
                                            </h3>
                                        </Link>
                                        {showDescription && article.summary && (
                                            <p
                                                itemProp="description"
                                                className="opacity-60 line-clamp-2"
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
                        <div className="flex items-center justify-between mt-10 pt-6" style={{ borderTop: `1px solid ${dividerColor}` }}>
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-30"
                                style={{ color: accentColor }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                {t('common.prev')}
                            </button>
                            <span className="font-medium" style={{ color: textColor }}>{currentPage} / {totalPages}</span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-30"
                                style={{ color: accentColor }}
                            >
                                {t('common.next')}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
