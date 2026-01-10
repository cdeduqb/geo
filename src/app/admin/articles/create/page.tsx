import { db } from '@/lib/db';
import { createArticle } from '../actions';
import { ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import CreateArticleClient from './_components/CreateArticleClient';
import { getI18nSettings } from '@/lib/system-settings';

export const dynamic = 'force-dynamic';

export default async function CreateArticlePage() {
    const categories = await db.category.findMany();
    const enableMultiLanguageSetting = await db.systemSetting.findUnique({
        where: { key: 'enable_multi_language' }
    });
    const enableMultiLanguage = enableMultiLanguageSetting?.value === 'true';

    const i18nSettingsStr = await db.systemSetting.findUnique({ where: { key: 'i18n_settings' } });
    let supportedLocales = ['zh', 'en'];
    if (i18nSettingsStr?.value) {
        try {
            const config = JSON.parse(i18nSettingsStr.value);
            if (Array.isArray(config.supportedLocales)) {
                supportedLocales = config.supportedLocales;
            }
        } catch { }
    }

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
            {/* 页面头部 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/articles"
                        className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Link>
                    <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-100">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">新建文章</h1>
                        <p className="text-[13px] text-gray-500 font-medium">
                            创建一篇新的文章并发布
                        </p>
                    </div>
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
                    supportedLocales={supportedLocales}
                />
            </Suspense>
        </div>
    );
}

