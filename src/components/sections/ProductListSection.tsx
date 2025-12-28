'use client';

import { registerSection, SectionProps } from '@/lib/sections/registry';
import { ArrowRight, Tag, TrendingUp, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/use-translation';

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    comparePrice: number | null;
    coverImage: string | null;
    images: any;
    isFeatured: boolean;
    viewCount: number;
    salesCount: number;
    category: {
        id: string;
        name: string;
        slug: string;
    } | null;
}

export const ProductListSection: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { locale, t, getLocalePath, isEn } = useTranslation();

    const {
        title = t('product.popular'),
        subtitle = '',
        limit = 8,
        categoryId = null,
        featured = false,
        showPrice = true,
        showCategory = true,
    } = data;

    const {
        backgroundColor = 'bg-gray-50',
        padding = 'py-20',
        columns = 'grid-cols-4'
    } = style;

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams({
                    limit: limit.toString(),
                    page: '1',
                    lang: locale,
                });

                if (categoryId) {
                    params.append('categoryId', categoryId);
                }

                if ((data as any).categorySlug) {
                    params.append('category', (data as any).categorySlug);
                }

                if (featured) {
                    params.append('featured', 'true');
                }

                const response = await fetch(`/api/products?${params}`);

                if (!response.ok) {
                    throw new Error(t('product.fetchError'));
                }

                const result = await response.json();
                setProducts(result.products || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : t('product.loadError'));
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [limit, categoryId, featured, locale]);

    const localePrefix = isEn ? '/en' : '';

    if (loading) {
        return (
            <section className={`${backgroundColor} ${padding}`}>
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
                        {subtitle && <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
                    </div>
                    <div className="text-center text-gray-500">{t('product.loading')}</div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className={`${backgroundColor} ${padding}`}>
                <div className="container mx-auto px-4">
                    <div className="text-center text-red-500">{t('common.error')}: {error}</div>
                </div>
            </section>
        );
    }

    if (products.length === 0) {
        return (
            <section className={`${backgroundColor} ${padding}`}>
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
                        {subtitle && <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
                    </div>
                    <div className="text-center text-gray-500">{t('product.noProducts')}</div>
                </div>
            </section>
        );
    }

    return (
        <section className={`${backgroundColor} ${padding}`}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
                    {subtitle && <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
                </div>

                <div className={`grid md:${columns} gap-6`} itemScope itemType="http://schema.org/ItemList">
                    {products.map((product, index) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group"
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/Product"
                        >
                            <meta itemProp="position" content={String(index + 1)} />
                            <div className="aspect-square bg-gray-200 relative overflow-hidden">
                                {product.coverImage ? (
                                    <Link href={`${localePrefix}/product/${product.slug}`} itemProp="url">
                                        <img
                                            src={product.coverImage}
                                            alt={product.name}
                                            itemProp="image"
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </Link>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        {t('product.noImage')}
                                    </div>
                                )}
                                {product.isFeatured && (
                                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3" />
                                        {t('product.featured')}
                                    </div>
                                )}
                                {showCategory && product.category && (
                                    <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                        <Tag className="w-3 h-3" />
                                        {product.category.name}
                                    </div>
                                )}
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <Link href={`${localePrefix}/product/${product.slug}`}>
                                    <h3 itemProp="name" className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                        {product.name}
                                    </h3>
                                </Link>
                                {product.description && (
                                    <p itemProp="description" className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                                        {product.description}
                                    </p>
                                )}

                                <div className="mt-auto">
                                    {showPrice && (
                                        <div className="mb-4" itemProp="offers" itemScope itemType="http://schema.org/Offer">
                                            <meta itemProp="priceCurrency" content={isEn ? "USD" : "CNY"} />
                                            <div className="flex items-baseline gap-2">
                                                <span itemProp="price" content={String(product.price)} className="text-2xl font-bold text-blue-600">
                                                    {isEn ? '$' : '¥'}{Number(product.price).toFixed(2)}
                                                </span>
                                                {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                                                    <span className="text-sm text-gray-400 line-through">
                                                        {isEn ? '$' : '¥'}{Number(product.comparePrice).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Eye className="w-3 h-3" />
                                                {product.viewCount}
                                            </div>
                                            <div>
                                                {t('product.sold')} {product.salesCount}
                                            </div>
                                        </div>
                                        {!showPrice && <Link href={`${localePrefix}/product/${product.slug}`} itemProp="url" className="hidden" />}
                                        <Link
                                            href={`${localePrefix}/product/${product.slug}`}
                                            className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 group/link"
                                        >
                                            {t('product.viewDetails')}
                                            <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

registerSection({
    type: 'product-list',
    name: '产品列表',
    description: '展示数据库中的产品列表（动态加载）',
    category: 'data',
    component: ProductListSection,
    defaultData: {
        title: '热门产品',
        subtitle: '精选优质商品推荐',
        limit: 8,
        categoryId: null,
        featured: false,
        showPrice: true,
        showCategory: true,
    },
    defaultStyle: {
        backgroundColor: 'bg-gray-50',
        padding: 'py-20',
        columns: 'grid-cols-4'
    },
    schema: {
        data: {
            title: { type: 'text', label: '标题' },
            subtitle: { type: 'text', label: '副标题' },
            limit: { type: 'number', label: '显示数量' },
            categoryId: { type: 'text', label: '分类ID（可选）' },
            featured: { type: 'boolean', label: '仅显示精选产品' },
            showPrice: { type: 'boolean', label: '显示价格' },
            showCategory: { type: 'boolean', label: '显示分类' },
        },
        style: {
            backgroundColor: {
                type: 'select',
                label: '背景颜色',
                options: [
                    { label: '白色', value: 'bg-white' },
                    { label: '浅灰', value: 'bg-gray-50' },
                    { label: '深灰', value: 'bg-gray-100' }
                ]
            },
            columns: {
                type: 'select',
                label: '列数',
                options: [
                    { label: '2列', value: 'grid-cols-2' },
                    { label: '3列', value: 'grid-cols-3' },
                    { label: '4列', value: 'grid-cols-4' },
                    { label: '6列', value: 'grid-cols-6' }
                ]
            }
        }
    }
});
