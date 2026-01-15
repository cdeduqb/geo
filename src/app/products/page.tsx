import { db } from '@/lib/db';
import PageLayout from '@/components/PageLayout';
import { ProductListSection } from '@/components/sections/ProductListSection';
import { Metadata } from 'next';
import { getSiteSettings } from '@/lib/site-settings';
import { getLocale } from '@/lib/locale-server';
import { t } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
    params,
    searchParams,
}: {
    params: Promise<{ locale?: string }>;
    searchParams: Promise<{ category?: string }>;
}): Promise<Metadata> {
    const { locale: paramLocale } = await params;
    const { category } = await searchParams;
    const locale = paramLocale || await getLocale();

    if (category) {
        const cat = await db.productCategory.findFirst({
            where: { slug: category, lang: locale },
            select: { name: true }
        });
        if (cat) {
            return {
                title: `${cat.name} - ${t(locale, 'product.list')}`,
                description: locale === 'en' ? `Browse all products in ${cat.name}` : `浏览 ${cat.name} 分类下的所有产品`,
            };
        }
    }

    return {
        title: t(locale, 'product.list'),
        description: locale === 'en' ? 'Browse our high-quality products' : '浏览我们的所有优质产品',
    };
}

export default async function ProductListPage({
    params,
    searchParams,
}: {
    params: Promise<{ locale?: string }>;
    searchParams: Promise<{ category?: string }>;
}) {
    const { locale: paramLocale } = await params;
    const { category } = await searchParams;
    const locale = paramLocale || await getLocale();

    // 获取站点设置 (全局页眉页脚)
    const siteSettings = await getSiteSettings(locale);

    return (
        <PageLayout
            headerTemplate={null}
            footerTemplate={null}
            headerSections={(siteSettings as any)?.headerSections as any[]}
            footerSections={(siteSettings as any)?.footerSections as any[]}
        >
            <div className="pt-8">
                <ProductListSection
                    data={{
                        title: category ? t(locale, 'product.list') : t(locale, 'product.title'),
                        subtitle: locale === 'en' ? 'Explore our curated collections' : '探索我们的精选系列',
                        limit: 24,
                        categorySlug: category,
                        showCategory: true,
                        showPrice: true,
                    } as any}
                    style={{
                        backgroundColor: 'bg-white',
                        padding: 'py-12',
                        columns: 'grid-cols-4'
                    }}
                />
            </div>
        </PageLayout>
    );
}
