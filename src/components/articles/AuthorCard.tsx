'use client';

import { Globe, Twitter, Linkedin, Github, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface AuthorCardProps {
    author: {
        id: string;
        name: string | null;
        avatar: string | null;
        bio: string | null;
        expertise: string | null;
        website: string | null;
        twitter: string | null;
        linkedin: string | null;
        github: string | null;
        isPublicAuthor: boolean;
    };
}

import { useTranslation } from '@/lib/i18n/use-translation';

export default function AuthorCard({ author }: AuthorCardProps) {
    const { t } = useTranslation();

    // 如果作者未设置为公开，则不显示卡片
    // if (!author.isPublicAuthor) {
    //     return null;
    // }

    const displayName = author.name === '管理员' || author.name === 'Admin' ? t('common.admin') : (author.name || t('common.unknownAuthor'));

    return (
        <div className="mt-12 p-8 bg-white rounded-[24px] border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex flex-col sm:flex-row gap-8 items-center">
                {/* 头像 */}
                <div className="flex-shrink-0">
                    {author.avatar ? (
                        <img
                            src={author.avatar}
                            alt={displayName}
                            className="w-20 h-20 rounded-full object-cover border border-gray-100  shadow-sm"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-gray-100  flex items-center justify-center text-2xl font-bold text-gray-400 ">
                            {author.name?.[0] || '?'}
                        </div>
                    )}
                </div>

                {/* 信息 */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900  flex items-center gap-2">
                                {displayName}
                            </h3>
                            {author.expertise && (
                                <p className="text-sm text-gray-500  mt-1">
                                    {author.expertise}
                                </p>
                            )}
                        </div>

                        <Link
                            href={`/author/${author.id}`}
                            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600  hover:text-blue-700 :text-blue-300 transition-colors"
                        >
                            {t('common.viewAllArticles')}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* 简介 */}
                    {author.bio && (
                        <p className="text-base text-gray-600  mb-4 leading-relaxed">
                            {author.bio}
                        </p>
                    )}

                    {/* 社交链接 */}
                    <div className="flex items-center gap-4">
                        {author.website && (
                            <a
                                href={author.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-900  :text-white transition-colors"
                                title="个人网站"
                            >
                                <Globe className="w-4 h-4" />
                            </a>
                        )}
                        {author.twitter && (
                            <a
                                href={`https://twitter.com/${author.twitter.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-900  :text-white transition-colors"
                                title="Twitter"
                            >
                                <Twitter className="w-4 h-4" />
                            </a>
                        )}
                        {author.linkedin && (
                            <a
                                href={author.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-900  :text-white transition-colors"
                                title="LinkedIn"
                            >
                                <Linkedin className="w-4 h-4" />
                            </a>
                        )}
                        {author.github && (
                            <a
                                href={`https://github.com/${author.github}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-900  :text-white transition-colors"
                                title="GitHub"
                            >
                                <Github className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
