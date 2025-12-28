import { db } from '@/lib/db';
import { createCategory } from '../actions';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CategoryForm from '../_components/CategoryForm';
import { getI18nSettings } from '@/lib/system-settings';

export default async function CreateCategoryPage() {
    // Fetch all categories for parent selection
    const categories = await db.category.findMany({
        orderBy: { name: 'asc' }
    });

    const i18nSettings = await getI18nSettings();
    const enableMultiLanguage = i18nSettings.enableMultiLanguage;

    // Fetch translation groups if multi-language is enabled
    let translationGroups: { id: string; label: string; lang: string }[] = [];
    if (enableMultiLanguage) {
        const categoriesWithGroups = await db.category.findMany({
            where: { translationGroupId: { not: null } },
            select: { translationGroupId: true, name: true, lang: true },
            distinct: ['translationGroupId'],
        });
        translationGroups = categoriesWithGroups
            .filter(c => c.translationGroupId)
            .map(c => ({
                id: c.translationGroupId!,
                label: `${c.name} (${c.lang})`,
                lang: c.lang
            }));
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/admin/categories"
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">新建分类</h1>
                </div>
            </div>

            <CategoryForm
                categories={categories}
                action={createCategory}
                enableMultiLanguage={enableMultiLanguage}
                translationGroups={translationGroups}
            />
        </div>
    );
}
