import { db } from '@/lib/db';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProductCategoryForm from '../_components/ProductCategoryForm';
import { notFound } from 'next/navigation';
import { getI18nSettings } from '@/lib/system-settings';

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

    const i18nSettings = await getI18nSettings();
    const enableMultiLanguage = i18nSettings.enableMultiLanguage;

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
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/admin/products/categories"
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">编辑产品分类</h1>
                </div>
            </div>

            <ProductCategoryForm
                category={category}
                categories={categories}
                enableMultiLanguage={enableMultiLanguage}
                translationGroups={translationGroups}
            />
        </div>
    );
}
