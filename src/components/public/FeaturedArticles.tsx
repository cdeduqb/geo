import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { Article, Category, User } from '@prisma/client';
import { formatDate } from '@/lib/utils';
import { getLocalePath, t, Locale } from '@/lib/i18n';

interface FeaturedArticlesProps {
    articles: (Article & {
        category: Category | null;
        author: User;
    })[];
    locale?: Locale;
}

export default function FeaturedArticles({ articles, locale = 'zh' }: FeaturedArticlesProps) {
    if (articles.length === 0) {
        return null;
    }

    return (
        <section className="bg-white py-16  sm:py-24">
            <div className="container mx-auto px-4">
                <div className="mb-12 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900  sm:text-4xl">
                            {t(locale, 'home.latestArticles')}
                        </h2>
                        <p className="mt-2 text-gray-600 ">
                            {t(locale, 'article.stayUpdated')}
                        </p>
                    </div>
                    <Link
                        href={getLocalePath('/articles', locale)}
                        className="hidden items-center gap-2 text-blue-600 hover:text-blue-700  :text-blue-300 sm:flex"
                    >
                        {t(locale, 'common.viewAll')}
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article) => (
                        <article
                            key={article.id}
                            className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md  "
                        >
                            {article.coverImage && (
                                <div className="aspect-video overflow-hidden bg-gray-100 ">
                                    <img
                                        src={article.coverImage}
                                        alt={article.title}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                            )}
                            <div className="p-6">
                                <div className="mb-3 flex items-center gap-3 text-xs text-gray-500 ">
                                    {article.category && (
                                        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-medium text-blue-600  ">
                                            {article.category.name}
                                        </span>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <time dateTime={article.createdAt.toISOString()}>
                                            {formatDate(article.createdAt)}
                                        </time>
                                    </div>
                                </div>
                                <h3 className="mb-2 text-xl font-bold leading-tight text-gray-900 group-hover:text-blue-600  :text-blue-400">
                                    <Link href={getLocalePath(`/articles/${article.slug}`, locale)}>
                                        {article.title}
                                    </Link>
                                </h3>
                                <p className="mb-4 line-clamp-2 text-sm text-gray-600 ">
                                    {article.summary || article.content.replace(/<[^>]*>?/gm, '').slice(0, 100) + '...'}
                                </p>
                                <Link
                                    href={getLocalePath(`/articles/${article.slug}`, locale)}
                                    className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700  :text-blue-300"
                                >
                                    {t(locale, 'common.readMore')}
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-12 text-center sm:hidden">
                    <Link
                        href={getLocalePath('/articles', locale)}
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700  :text-blue-300"
                    >
                        {t(locale, 'common.viewAllArticles')}
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
