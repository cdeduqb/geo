import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import ProductEditForm from './_components/ProductEditForm';
import { getI18nSettings } from '@/lib/system-settings';


export const dynamic = 'force-dynamic';

export default async function EditProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const product = await db.product.findUnique({
        where: { id },
        include: {
            category: true,
        },
    });

    if (!product) {
        notFound();
    }

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

    const serializedProduct = {
        ...product,
        price: product.price.toNumber(),
        comparePrice: product.comparePrice?.toNumber() || null,
        costPrice: product.costPrice?.toNumber() || null,
    };

    return (
        <ProductEditForm
            product={serializedProduct as any}
            categories={categories}
            enableMultiLanguage={enableMultiLanguage}
            translationGroups={translationGroups}
            supportedLocales={supportedLocales}
        />
    );
}
