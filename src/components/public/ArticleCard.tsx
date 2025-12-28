import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Article, Category, User } from '@prisma/client';
import { formatDate } from '@/lib/utils';

interface ArticleCardProps {
    article: Article & {
        category: Category | null;
        author: User;
    };
}

export default function ArticleCard({ article }: ArticleCardProps) {
    return (
        <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md  ">
            {article.coverImage && (
                <div className="aspect-video w-full overflow-hidden bg-gray-100 ">
                    <img
                        src={article.coverImage}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
            )}
            <div className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex items-center gap-4 text-xs text-gray-500 ">
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
                    <Link href={`/articles/${article.slug}`} className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true" />
                        {article.title}
                    </Link>
                </h3>
                <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-600 line-clamp-3 ">
                    {article.summary || article.content.replace(/<[^>]*>?/gm, '').slice(0, 150) + '...'}
                </p>
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 ">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-100 ">
                            {/* Placeholder avatar */}
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">
                                {article.author.name?.[0] || 'A'}
                            </div>
                        </div>
                        <span className="text-sm font-medium text-gray-700 ">
                            {article.author.name || 'Admin'}
                        </span>
                    </div>
                    <span className="flex items-center gap-1 text-sm font-medium text-blue-600 ">
                        阅读全文 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                </div>
            </div>
        </article>
    );
}
