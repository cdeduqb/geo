import { db } from '@/lib/db';
import { updateCategory } from '../actions';
import { ArrowLeft, FolderEdit } from 'lucide-react';
import Link from 'next/link';
import CategoryForm from '../_components/CategoryForm';
import { notFound } from 'next/navigation';
import { getI18nSettings } from '@/lib/system-settings';

export const dynamic = 'force-dynamic';

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const category = await db.category.findUnique({
        where: { id },
    });

    if (!category) {
        notFound();
    }

    // Fetch all categories for parent selection
    const categories = await db.category.findMany({
        orderBy: { name: 'asc' }
    });

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
        <div className="space-y-6">
            <CategoryForm
                category={category}
                categories={categories}
                action={updateCategory}
                enableMultiLanguage={enableMultiLanguage}
                translationGroups={translationGroups}
                supportedLocales={supportedLocales}
            />
        </div>
    );
}

