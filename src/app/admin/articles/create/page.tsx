import { db } from '@/lib/db';
import { createArticle } from '../actions';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import CreateArticleClient from './_components/CreateArticleClient';
import { getI18nSettings } from '@/lib/system-settings';

export default async function CreateArticlePage() {
    const categories = await db.category.findMany();
    const i18nSettings = await getI18nSettings();
    const enableMultiLanguage = i18nSettings.enableMultiLanguage;

    // 获取所有翻译组（用于下拉选择）
    let translationGroups: { id: string; label: string; lang: string }[] = [];
    if (enableMultiLanguage) {
        const articlesWithGroups = await db.article.findMany({
            where: {
                translationGroupId: { not: null },
                status: 'PUBLISHED'
            },
            select: { translationGroupId: true, title: true, lang: true },
            distinct: ['translationGroupId'],
        });
        translationGroups = articlesWithGroups
            .filter(a => a.translationGroupId)
            .map(a => ({
                id: a.translationGroupId!,
                label: `${a.title.substring(0, 30)}${a.title.length > 30 ? '...' : ''} (${a.lang})`,
                lang: a.lang
            }));
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/admin/articles"
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">新建文章</h1>
                </div>
            </div>

            <Suspense fallback={
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            }>
                <CreateArticleClient
                    categories={categories}
                    action={createArticle}
                    enableMultiLanguage={enableMultiLanguage}
                    translationGroups={translationGroups}
                />
            </Suspense>
        </div>
    );
}
