import { db } from '@/lib/db';
import { updateArticle } from '../actions';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ArticleForm from '../_components/ArticleForm';
import TranslationButton from '../_components/TranslationButton';
import { notFound } from 'next/navigation';
import { getI18nSettings } from '@/lib/system-settings';

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
    const serializedArticle = JSON.parse(JSON.stringify(article));

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
                    <h1 className="text-2xl font-bold text-gray-900">编辑文章</h1>
                    {enableMultiLanguage && (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                            {article.lang === 'zh' ? '中文' : 'English'}
                        </span>
                    )}
                </div>
                {enableMultiLanguage && (
                    <div className="flex items-center gap-3">
                        {translations.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>翻译版本:</span>
                                {translations.map(t => (
                                    <Link
                                        key={t.id}
                                        href={`/admin/articles/${t.id}`}
                                        className="px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                                    >
                                        {t.lang === 'zh' ? '中文' : 'English'}
                                    </Link>
                                ))}
                            </div>
                        )}
                        <TranslationButton
                            articleId={article.id}
                            currentLang={article.lang}
                        />
                    </div>
                )}
            </div>

            <ArticleForm
                categories={categories}
                article={serializedArticle}
                action={updateArticle}
                enableMultiLanguage={enableMultiLanguage}
                translationGroups={translationGroups}
            />
        </div>
    );
}
