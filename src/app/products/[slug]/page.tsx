import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import { Metadata } from 'next';
import { Tag, Phone, Heart, Share2 } from 'lucide-react';
import Link from 'next/link';
import ProductImageGallery from './_components/ProductImageGallery';
import { getSEOSettings, getGEOSettings } from '@/lib/system-settings';
import { ProductStructuredData, BreadcrumbStructuredData } from '@/components/geo/StructuredData';
import { getSiteSettings } from '@/lib/site-settings';
import { RichTextContent } from '@/components/security/SafeHTML';

// export const dynamic = 'force-dynamic';

import { getLocale } from '@/lib/locale-server';
import { getLocalePath, t } from '@/lib/i18n';

interface ProductPageProps {
    params: Promise<{ slug: string, locale?: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { slug, locale: paramLocale } = await params;
    const locale = paramLocale || await getLocale();

    let product = await db.product.findFirst({
        where: { slug, lang: locale }
    });

    if (!product) {
        product = await db.product.findFirst({
            where: { slug }
        });
    }

    if (!product) {
        return { title: 'Product Not Found' };
    }

    const alternates: any = {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/product/${product.slug}`,
        languages: {
            'zh-CN': `${process.env.NEXT_PUBLIC_SITE_URL || ''}/product/${product.slug}`,
            'en-US': `${process.env.NEXT_PUBLIC_SITE_URL || ''}/en/product/${product.slug}`,
        },
    };

    return {
        title: product.metaTitle || product.name,
        description: product.metaDescription || product.description,
        keywords: product.metaKeywords,
        openGraph: {
            title: product.metaTitle || product.name,
            description: product.metaDescription || product.description || undefined,
            images: product.coverImage ? [product.coverImage] : [],
        },
        alternates
    };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
    const { slug, locale: paramLocale } = await params;
    const locale = paramLocale || await getLocale();
    const geo = await getGEOSettings();
    const seo = await getSEOSettings();

    let product = await db.product.findFirst({
        where: {
            slug: decodeURIComponent(slug),
            lang: locale,
            status: 'PUBLISHED'
        },
        include: {
            category: true,
        },
    });

    if (!product) {
        // Fallback: search in any language
        const baseProduct = await db.product.findFirst({
            where: { slug: decodeURIComponent(slug), status: 'PUBLISHED' }
        });

        if (baseProduct) {
            product = await db.product.findFirst({
                where: { id: baseProduct.id },
                include: { category: true }
            });
        }
    }

    if (!product) {
        notFound();
    }

    // 获取站点设置 (全局页眉页脚)
    const siteSettings = await getSiteSettings();

    // 增加浏览量
    await db.product.update({
        where: { id: product.id },
        data: { viewCount: { increment: 1 } }
    });

    // 获取联系电话
    const contactPhone = await db.systemSetting.findUnique({
        where: { key: 'contact_phone' }
    });

    // 解析图片数组
    const images: string[] = product.images
        ? (Array.isArray(product.images)
            ? product.images.filter((img): img is string => typeof img === 'string')
            : [])
        : [];
    const allImages = product.coverImage ? [product.coverImage, ...images] : images;

    return (
        <PageLayout
            headerTemplate={null}
            footerTemplate={null}
            headerSections={(siteSettings as any)?.headerSections as any[]}
            footerSections={(siteSettings as any)?.footerSections as any[]}
        >
            {/* GEO: 结构化数据 */}
            {geo.enableStructuredData && (
                <ProductStructuredData
                    name={product.name}
                    description={product.description || undefined}
                    image={product.coverImage || undefined}
                    brand={seo.siteName}
                    price={Number(product.price)}
                    currency={locale === 'en' ? "USD" : "CNY"}
                    availability={product.stock > 0 ? 'InStock' : 'OutOfStock'}
                />
            )}

            {(product as any).category && geo.enableStructuredData && (
                <BreadcrumbStructuredData
                    items={[
                        { name: t(locale, 'common.home'), url: locale === 'en' ? '/en' : '/' },
                        { name: (product as any).category.name, url: `/products/category/${(product as any).category.slug}` },
                        { name: product.name, url: `/product/${product.slug}` }
                    ]}
                />
            )}

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* 面包屑 */}
                <nav className="mb-8 text-sm">
                    <ol className="flex items-center gap-2 text-gray-600">
                        <li><Link href={locale === 'en' ? '/en' : '/'} className="hover:text-blue-600">{t(locale, 'common.home')}</Link></li>
                        <li>/</li>
                        {(product as any).category && (
                            <>
                                <li><Link href={`/product?category=${(product as any).category.slug}`} className="hover:text-blue-600">{(product as any).category.name}</Link></li>
                                <li>/</li>
                            </>
                        )}
                        <li className="text-gray-900">{product.name}</li>
                    </ol>
                </nav>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* 左侧 - 图片展示 */}
                    <ProductImageGallery images={allImages} productName={product.name} />

                    {/* 右侧 - 产品信息 */}
                    <div className="space-y-6">
                        {/* 分类标签 */}
                        {(product as any).category && (
                            <Link
                                href={`/product?category=${(product as any).category.slug}`}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full hover:bg-blue-100 transition-colors"
                            >
                                <Tag className="w-3 h-3" />
                                {(product as any).category.name}
                            </Link>
                        )}

                        {/* 产品名称 */}
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                            {product.name}
                        </h1>

                        {/* 精选标识 */}
                        {product.isFeatured && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold rounded-full">
                                ⭐ {t(locale, 'product.featured')}
                            </div>
                        )}

                        {/* 价格 */}
                        <div className="flex items-baseline gap-4">
                            <span className="text-4xl font-bold text-blue-600">
                                {locale === 'en' ? '$' : '¥'}{Number(product.price).toFixed(2)}
                            </span>
                            {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                                <span className="text-xl text-gray-400 line-through">
                                    {locale === 'en' ? '$' : '¥'}{Number(product.comparePrice).toFixed(2)}
                                </span>
                            )}
                        </div>

                        {/* 描述 */}
                        {product.description && (
                            <p className="text-gray-600 text-lg leading-relaxed">
                                {product.description}
                            </p>
                        )}

                        {/* 统计信息 */}
                        <div className="flex items-center gap-6 text-sm text-gray-500 pt-4 border-t border-gray-200">
                            <div>
                                <span className="font-medium text-gray-900">{product.viewCount}</span> {t(locale, 'product.views')}
                            </div>
                            <div>
                                <span className="font-medium text-gray-900">{product.salesCount}</span> {t(locale, 'product.sold')}
                            </div>
                        </div>

                        {/* 操作按钮 */}
                        <div className="flex gap-4 pt-6">
                            {contactPhone?.value ? (
                                <a
                                    href={`tel:${contactPhone.value}`}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
                                >
                                    <Phone className="w-5 h-5" />
                                    {t(locale, 'product.callUs')}
                                </a>
                            ) : (
                                <div className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-300 text-gray-500 font-semibold rounded-xl cursor-not-allowed">
                                    <Phone className="w-5 h-5" />
                                    {t(locale, 'product.noPhone')}
                                </div>
                            )}
                            <button className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:border-blue-500 transition-colors">
                                <Heart className="w-5 h-5 text-gray-600" />
                            </button>
                            <button className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:border-blue-500 transition-colors">
                                <Share2 className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 产品详细内容（如果有） */}
                {product.content && (
                    <div className="mt-16 pt-16 border-t border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">{t(locale, 'product.details')}</h2>
                        <RichTextContent
                            content={product.content}
                            className="prose prose-lg max-w-none"
                        />
                    </div>
                )}
            </div>
        </PageLayout>
    );
}
