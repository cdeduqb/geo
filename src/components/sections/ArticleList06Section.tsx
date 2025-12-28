'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/use-translation';

export const ArticleList06Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t, isEn } = useTranslation();
    const {
        title = '杂志风格',
        subtitle,
        categorySortOrder,
        pageSize = 7,
        showPagination = true,
        showImage = true,
        showDate = true,
        showCategory = true,
        showDescription = true,
    } = data;
    const {
        backgroundColor = '#1f2937',
        textColor = '#ffffff',
        accentColor = '#f59e0b',
        cardBackgroundColor = '#374151',
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

    const mainArticle = articles[0];
    const secondaryArticles = articles.slice(1, 3);
    const listArticles = articles.slice(3);

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
                        <div className="inline-block w-8 h-8 border-4 border-gray-600 border-t-amber-500 rounded-full animate-spin"></div>
                    </div>
                ) : articles.length === 0 ? (
                    <div className="text-center py-12 opacity-60" style={{ color: textColor }}>{t('article.noArticles')}</div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-6" itemScope itemType="http://schema.org/ItemList">
                        {/* Main Article */}
                        {mainArticle && (
                            <article
                                className="lg:col-span-2 lg:row-span-2 rounded-2xl overflow-hidden relative group"
                                style={{ background: cardBackgroundColor }}
                                itemProp="itemListElement"
                                itemScope
                                itemType="http://schema.org/Article"
                            >
                                <meta itemProp="position" content="1" />
                                {showImage && mainArticle.coverImage && (
                                    <img
                                        src={mainArticle.coverImage}
                                        alt={mainArticle.title}
                                        itemProp="image"
                                        className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                    {showCategory && mainArticle.category?.name && (
                                        <span className="text-sm font-bold px-3 py-1 rounded-full mb-4 inline-block" style={{ background: accentColor, color: '#000' }}>{mainArticle.category.name}</span>
                                    )}
                                    <Link href={`/articles/${mainArticle.id}`} itemProp="url">
                                        <h3
                                            itemProp="headline"
                                            className="text-2xl lg:text-3xl font-bold mb-3 hover:opacity-80 transition-opacity text-white line-clamp-2"
                                        >
                                            {mainArticle.title}
                                        </h3>
                                    </Link>
                                    {showDescription && mainArticle.summary && (
                                        <p itemProp="description" className="text-white/70 line-clamp-2 mb-3">{mainArticle.summary}</p>
                                    )}
                                    {showDate && mainArticle.publishedAt && (
                                        <span className="text-sm text-white/50">
                                            <time itemProp="datePublished" dateTime={mainArticle.publishedAt}>{formatDate(mainArticle.publishedAt)}</time>
                                        </span>
                                    )}
                                </div>
                            </article>
                        )}

                        {/* Secondary Articles */}
                        {secondaryArticles.map((article, index) => (
                            <article
                                key={article.id}
                                className="rounded-xl overflow-hidden relative group aspect-[4/3]"
                                style={{ background: cardBackgroundColor }}
                                itemProp="itemListElement"
                                itemScope
                                itemType="http://schema.org/Article"
                            >
                                <meta itemProp="position" content={String(index + 2)} />
                                {showImage && article.coverImage && (
                                    <img
                                        src={article.coverImage}
                                        alt={article.title}
                                        itemProp="image"
                                        className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-300"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-5">
                                    {showCategory && article.category?.name && (
                                        <span className="text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block" style={{ background: accentColor, color: '#000' }}>{article.category.name}</span>
                                    )}
                                    <Link href={`/articles/${article.slug}`} itemProp="url">
                                        <h4 itemProp="headline" className="font-bold text-white hover:opacity-80 transition-opacity line-clamp-2">{article.title}</h4>
                                    </Link>
                                </div>
                            </article>
                        ))}

                        {/* List Articles */}
                        {listArticles.length > 0 && (
                            <div className="lg:col-span-3 grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                                {listArticles.map((article, index) => (
                                    <article
                                        key={article.id}
                                        className="p-4 rounded-xl"
                                        style={{ background: cardBackgroundColor }}
                                        itemProp="itemListElement"
                                        itemScope
                                        itemType="http://schema.org/Article"
                                    >
                                        <meta itemProp="position" content={String(index + 4)} />
                                        <Link href={`/articles/${article.slug}`} itemProp="url">
                                            <h5
                                                itemProp="headline"
                                                className="font-medium hover:opacity-80 transition-opacity line-clamp-1"
                                                style={{ color: textColor }}
                                            >
                                                {article.title}
                                            </h5>
                                        </Link>
                                        {showDate && article.publishedAt && (
                                            <span className="text-xs opacity-50 mt-2 block" style={{ color: textColor }}>
                                                <time itemProp="datePublished" dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                                            </span>
                                        )}
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {showPagination && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-12">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-5 py-2 rounded-lg font-medium disabled:opacity-50" style={{ background: accentColor, color: '#000' }}>{t('common.prev')}</button>
                        <span style={{ color: textColor }}>{currentPage} / {totalPages}</span>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-5 py-2 rounded-lg font-medium disabled:opacity-50" style={{ background: accentColor, color: '#000' }}>{t('common.next')}</button>
                    </div>
                )}
            </div>
        </section>
    );
};
