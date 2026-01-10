import { db } from '@/lib/db';
import { updateArticle } from '@/app/admin/articles/actions';
import { ArrowLeft, FileEdit } from 'lucide-react';
import Link from 'next/link';
import ArticleForm from '../_components/ArticleForm';
import TranslationButton from '../_components/TranslationButton';
import { notFound } from 'next/navigation';
import { getI18nSettings } from '@/lib/system-settings';

export const dynamic = 'force-dynamic';

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const article = await db.article.findUnique({
        where: { id },
        include: { seo: true },
    });

    if (!article) {
        notFound();
    }

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

    // 查找翻译组中的其他文章
    let translations: { id: string; lang: string; title: string }[] = [];
    if (enableMultiLanguage && article.translationGroupId) {
        const groupArticles = await db.article.findMany({
            where: { translationGroupId: article.translationGroupId },
            select: { id: true, lang: true, title: true },
        });
        translations = groupArticles.filter(a => a.id !== article.id);
    }

    // 序列化数据以避免传递 Date 对象给客户端组件
    const serializedArticle = {
        ...article,
        createdAt: article.createdAt?.toISOString(),
        updatedAt: article.updatedAt?.toISOString(),
        seo: article.seo ? {
            ...article.seo,
        } : null
    };

    // 预绑定 ID 到 Action，这是 Next.js 15/16 推荐的处理方式
    const updateActionWithId = updateArticle.bind(null, article.id);

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
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                        <FileEdit className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">编辑文章</h1>
                            {enableMultiLanguage && (
                                <span className="px-2 py-1 text-xs font-bold bg-gray-100 text-gray-600 rounded-lg">
                                    {article.lang === 'zh' ? '中文' : 'English'}
                                </span>
                            )}
                        </div>
                        <p className="text-[13px] text-gray-500 font-medium truncate max-w-md">
                            {article.title}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {enableMultiLanguage && translations.length > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-400 font-medium">翻译版本:</span>
                            {translations.map(t => (
                                <Link
                                    key={t.id}
                                    href={`/admin/articles/${t.id}`}
                                    className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs hover:bg-blue-100 transition-colors"
                                >
                                    {t.lang === 'zh' ? '中文' : 'English'}
                                </Link>
                            ))}
                        </div>
                    )}
                    {enableMultiLanguage && (
                        <TranslationButton
                            articleId={article.id}
                            currentLang={article.lang}
                        />
                    )}
                </div>
            </div>

            <ArticleForm
                categories={categories}
                article={serializedArticle}
                action={updateActionWithId}
                enableMultiLanguage={enableMultiLanguage}
                translationGroups={translationGroups}
                supportedLocales={supportedLocales}
            />
        </div>
    );
}

