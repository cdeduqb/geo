import { db } from '@/lib/db';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProductCategoryForm from '../_components/ProductCategoryForm';
import { notFound } from 'next/navigation';
import { getI18nSettings } from '@/lib/system-settings';

export const dynamic = 'force-dynamic';

export default async function EditProductCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const category = await db.productCategory.findUnique({
        where: { id },
    });

    if (!category) {
        notFound();
    }

    // Fetch all categories for parent selection
    const categories = await db.productCategory.findMany({
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }]
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
        const categoriesWithGroups = await db.productCategory.findMany({
            where: {
                translationGroupId: { not: null },
                isActive: true
            },
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
            <ProductCategoryForm
                category={category}
                categories={categories}
                enableMultiLanguage={enableMultiLanguage}
                translationGroups={translationGroups}
                supportedLocales={supportedLocales}
            />
        </div>
    );
}
