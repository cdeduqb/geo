import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Globe, Twitter, Linkedin, Github } from 'lucide-react';
import Link from 'next/link';
import { getLocale } from '@/lib/locale-server';
import { Metadata } from 'next';

export async function generateMetadata({
    params
}: {
    params: Promise<{ id: string; locale?: string }>
}): Promise<Metadata> {
    const { id, locale: paramLocale } = await params;
    const locale = paramLocale || await getLocale();
    const author = await db.user.findUnique({
        where: { id },
        select: { name: true, bio: true }
    });

    const isEn = locale === 'en';
    const alternates = {
        canonical: `/author/${id}`,
        languages: {
            'zh-CN': `/author/${id}`,
            'en-US': `/en/author/${id}`,
        },
    };

    return {
        title: author?.name || (isEn ? 'Author' : '作者'),
        description: author?.bio,
        alternates
    };
}

export default async function AuthorPage({
    params
}: {
    params: Promise<{ id: string; locale?: string }>
}) {
    const { id, locale: paramLocale } = await params;
    const locale = paramLocale || await getLocale();
    const isEn = locale === 'en';

    const author = await db.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
            expertise: true,
            website: true,
            twitter: true,
            linkedin: true,
            github: true,
            articles: {
                where: { status: 'PUBLISHED', lang: locale },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    summary: true,
                    createdAt: true,
                },
                orderBy: { createdAt: 'desc' },
            }
        }
    });

    if (!author) {
        notFound();
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const authorUrl = `${baseUrl}${isEn ? '/en' : ''}/author/${id}`;

    // Person Schema for SEO
    const personSchema = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: author.name || (isEn ? 'Unknown Author' : '未知作者'),
        url: authorUrl,
        image: author.avatar,
        description: author.bio,
        sameAs: [
            author.website,
            author.twitter ? `https://twitter.com/${author.twitter.replace('@', '')}` : null,
            author.linkedin,
            author.github ? `https://github.com/${author.github}` : null,
        ].filter(Boolean),
    };

    const localePrefix = isEn ? '/en' : '';

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(personSchema),
                }}
            />

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 py-12">
                    {/* 作者信息卡片 */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* 头像 */}
                            <div className="flex-shrink-0">
                                {author.avatar ? (
                                    <img
                                        src={author.avatar}
                                        alt={author.name || ''}
                                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow-lg"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                                        {author.name?.[0] || '?'}
                                    </div>
                                )}
                            </div>

                            {/* 信息 */}
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {author.name || (isEn ? 'Unknown Author' : '未知作者')}
                                </h1>

                                {/* 专业领域 */}
                                {author.expertise && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {author.expertise.split(',').map((exp, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-full"
                                            >
                                                {exp.trim()}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* 简介 */}
                                {author.bio && (
                                    <p className="text-gray-600 mb-4 leading-relaxed">
                                        {author.bio}
                                    </p>
                                )}

                                {/* 社交链接 */}
                                <div className="flex flex-wrap gap-3">
                                    {author.website && (
                                        <a
                                            href={author.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                                        >
                                            <Globe className="w-4 h-4" />
                                            {isEn ? 'Website' : '网站'}
                                        </a>
                                    )}
                                    {author.twitter && (
                                        <a
                                            href={`https://twitter.com/${author.twitter.replace('@', '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                                        >
                                            <Twitter className="w-4 h-4" />
                                            Twitter
                                        </a>
                                    )}
                                    {author.linkedin && (
                                        <a
                                            href={author.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                                        >
                                            <Linkedin className="w-4 h-4" />
                                            LinkedIn
                                        </a>
                                    )}
                                    {author.github && (
                                        <a
                                            href={`https://github.com/${author.github}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                                        >
                                            <Github className="w-4 h-4" />
                                            GitHub
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 文章列表 */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            {isEn ? `Published Articles (${(author as any).articles.length})` : `发表的文章 (${(author as any).articles.length})`}
                        </h2>

                        <div className="space-y-4">
                            {(author as any).articles.length === 0 ? (
                                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                                    <p className="text-gray-500 ">{isEn ? 'No articles found' : '暂无文章'}</p>
                                </div>
                            ) : (
                                (author as any).articles.map((article: any) => (
                                    <Link
                                        key={article.id}
                                        href={`${localePrefix}/articles/${article.slug}`}
                                        className="block bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-500 hover:shadow-md transition-all"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600">
                                            {article.title}
                                        </h3>
                                        {article.summary && (
                                            <p className="text-gray-600 mb-3 line-clamp-2">
                                                {article.summary}
                                            </p>
                                        )}
                                        <div className="text-sm text-gray-500 ">
                                            {new Date(article.createdAt).toLocaleDateString(isEn ? 'en-US' : 'zh-CN')}
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
