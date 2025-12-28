import { db } from '@/lib/db';
import CreateProductClient from './_components/CreateProductClient';
import { getI18nSettings } from '@/lib/system-settings';

export default async function CreateProductPage() {
    const categories = await db.productCategory.findMany({
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    const i18nSettings = await getI18nSettings();

    // Fetch translation groups if multi-language is enabled
    // Filter by status: 'PUBLISHED' as requested
    let translationGroups: { id: string; label: string; lang: string }[] = [];
    if (i18nSettings.enableMultiLanguage) {
        const productsWithGroups = await db.product.findMany({
            where: {
                translationGroupId: { not: null },
                status: 'PUBLISHED'
            },
            select: { translationGroupId: true, name: true, lang: true },
            distinct: ['translationGroupId'],
        });
        translationGroups = productsWithGroups
            .filter(p => p.translationGroupId)
            .map(p => ({
                id: p.translationGroupId!,
                label: `${p.name} (${p.lang})`,
                lang: p.lang
            }));
    }

    return (
        <div className="max-w-7xl mx-auto py-6">
            <CreateProductClient
                categories={categories}
                enableMultiLanguage={i18nSettings.enableMultiLanguage}
                translationGroups={translationGroups}
            />
        </div>
    );
}
