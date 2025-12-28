import { db } from '@/lib/db';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { t, Locale } from '@/lib/i18n';

interface ArticleListProps {
    limit?: number;
    categoryId?: string;
    layout?: 'grid' | 'list' | 'magazine';
    page?: number;
    locale?: Locale;
}

export default async function ArticleList({
    limit = 9,
    categoryId,
    layout = 'grid',
    page = 1,
    locale = 'zh'
}: ArticleListProps) {
    const skip = (page - 1) * limit;

    const where = {
        status: 'PUBLISHED' as const,
        lang: locale,
        ...(categoryId && { categoryId })
    };

    const [articles, total] = await Promise.all([
        db.article.findMany({
            where,
            include: {
                author: true,
                category: true,
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip,
        }),
        db.article.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    if (articles.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-500 text-lg">{t(locale, 'article.noArticles')}</p>
            </div>
        );
    }

    const localePrefix = locale === 'en' ? '/en' : '';

    // 网格布局
    if (layout === 'grid') {
        return (
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article) => (
                        <article
                            key={article.id}
                            className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                        >
                            {article.coverImage && (
                                <div className="aspect-video overflow-hidden bg-gray-100">
                                    <img
                                        src={article.coverImage}
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            )}
                            <div className="p-6">
                                {(article as any).category && (
                                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full mb-3">
                                        {(article as any).category.name}
                                    </span>
                                )}
                                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    <Link href={`${localePrefix}/articles/${article.slug}`}>
                                        {article.title}
                                    </Link>
                                </h2>
                                {article.summary && (
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {article.summary}
                                    </p>
                                )}
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <span>{(article as any).author?.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <time>{new Date(article.createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'zh-CN')}</time>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
                {totalPages > 1 && (
                    <Pagination currentPage={page} totalPages={totalPages} locale={locale} />
                )}
            </div>
        );
    }

    // 列表布局
    if (layout === 'list') {
        return (
            <div className="space-y-6">
                <div className="space-y-6">
                    {articles.map((article) => (
                        <article
                            key={article.id}
                            className="flex gap-6 bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 group"
                        >
                            {article.coverImage && (
                                <div className="w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                    <img
                                        src={article.coverImage}
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    {(article as any).category && (
                                        <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                                            {(article as any).category.name}
                                        </span>
                                    )}
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            <span>{(article as any).author?.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            <time>{new Date(article.createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'zh-CN')}</time>
                                        </div>
                                    </div>
                                </div>
                                <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    <Link href={`${localePrefix}/articles/${article.slug}`} className="line-clamp-1">
                                        {article.title}
                                    </Link>
                                </h2>
                                {article.summary && (
                                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                        {article.summary}
                                    </p>
                                )}
                                <Link
                                    href={`${localePrefix}/articles/${article.slug}`}
                                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:gap-2 transition-all font-medium"
                                >
                                    {t(locale, 'common.readMore')} <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
                {totalPages > 1 && (
                    <Pagination currentPage={page} totalPages={totalPages} locale={locale} />
                )}
            </div>
        );
    }

    // 杂志风格布局
    if (layout === 'magazine') {
        const [featured, ...rest] = articles;
        return (
            <div className="space-y-8">
                {/* 特色文章 */}
                {featured && (
                    <article className="group relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                        <div className="grid md:grid-cols-2 gap-0">
                            {featured.coverImage && (
                                <div className="aspect-[4/3] md:aspect-auto overflow-hidden bg-gray-100">
                                    <img
                                        src={featured.coverImage}
                                        alt={featured.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            )}
                            <div className="p-8 flex flex-col justify-center">
                                {(featured as any).category && (
                                    <span className="inline-block w-fit px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full mb-4">
                                        {(featured as any).category.name}
                                    </span>
                                )}
                                <h2 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                                    <Link href={`${localePrefix}/articles/${featured.slug}`}>
                                        {featured.title}
                                    </Link>
                                </h2>
                                {featured.summary && (
                                    <p className="text-gray-600 mb-6 line-clamp-4">
                                        {featured.summary}
                                    </p>
                                )}
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <span>{(featured as any).author?.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <time>{new Date(featured.createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'zh-CN')}</time>
                                    </div>
                                </div>
                                <Link
                                    href={`${localePrefix}/articles/${featured.slug}`}
                                    className="inline-flex items-center gap-2 text-blue-600 hover:gap-3 transition-all font-semibold"
                                >
                                    {t(locale, 'common.readMore')} <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </article>
                )}

                {/* 其他文章网格 */}
                {rest.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {rest.map((article) => (
                            <article
                                key={article.id}
                                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100"
                            >
                                {article.coverImage && (
                                    <div className="aspect-video overflow-hidden bg-gray-100">
                                        <img
                                            src={article.coverImage}
                                            alt={article.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                )}
                                <div className="p-4">
                                    {(article as any).category && (
                                        <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded mb-2">
                                            {(article as any).category.name}
                                        </span>
                                    )}
                                    <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                        <Link href={`${localePrefix}/articles/${article.slug}`}>
                                            {article.title}
                                        </Link>
                                    </h3>
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                        <time>{new Date(article.createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'zh-CN', { month: 'short', day: 'numeric' })}</time>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
                {totalPages > 1 && (
                    <Pagination currentPage={page} totalPages={totalPages} locale={locale} />
                )}
            </div>
        );
    }

    return null;
}

function Pagination({ currentPage, totalPages, locale }: { currentPage: number; totalPages: number; locale: Locale }) {
    return (
        <div className="flex justify-center items-center gap-2 mt-12">
            {currentPage > 1 && (
                <Link
                    href={`?page=${currentPage - 1}`}
                    className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    {t(locale, 'common.prev')}
                </Link>
            )}
            <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Link
                        key={pageNum}
                        href={`?page=${pageNum}`}
                        className={`px-4 py-2 rounded-lg transition-colors ${pageNum === currentPage
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        {pageNum}
                    </Link>
                ))}
            </div>
            {currentPage < totalPages && (
                <Link
                    href={`?page=${currentPage + 1}`}
                    className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    {t(locale, 'common.next')}
                </Link>
            )}
        </div>
    );
}
