import { db } from '@/lib/db';
import CreateProductClient from './_components/CreateProductClient';
import { getI18nSettings } from '@/lib/system-settings';

export const dynamic = 'force-dynamic';

export default async function CreateProductPage() {
    const categories = await db.productCategory.findMany({
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
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
    // Filter by status: 'PUBLISHED' as requested
    let translationGroups: { id: string; label: string; lang: string }[] = [];
    if (enableMultiLanguage) {
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
        <div className="max-w-7xl mx-auto">
            <CreateProductClient
                categories={categories}
                enableMultiLanguage={enableMultiLanguage}
                translationGroups={translationGroups}
                supportedLocales={supportedLocales}
            />
        </div>
    );
}

