'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export const ProductList06Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, categoryId, limit = 3 } = data;
    const { backgroundColor = '#fdf2f8', textColor = '#111827', accentColor = '#ec4899' } = style;
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const params = new URLSearchParams();
                if (categoryId) params.append('categoryId', categoryId);
                params.append('limit', String(limit));
                const res = await fetch(`/api/products?${params}`);
                if (res.ok) { const data = await res.json(); setProducts(data.products || []); }
            } catch (error) { console.error('获取产品失败:', error); }
        };
        fetchProducts();
    }, [categoryId, limit]);

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && (
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>
                        {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                    </div>
                )}
                <div className="max-w-4xl mx-auto space-y-8" itemScope itemType="http://schema.org/ItemList">
                    {products.map((product: any, index) => (
                        <div key={product.id} itemProp="itemListElement" itemScope itemType="http://schema.org/Product">
                            <meta itemProp="position" content={String(index + 1)} />
                            <Link href={`/product/${product.slug}`} itemProp="url" className="block group">
                                <div className="flex flex-col md:flex-row gap-8 bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all">
                                    {product.images?.[0] && (
                                        <div className="w-full md:w-64 h-64 rounded-xl overflow-hidden flex-shrink-0">
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                itemProp="image"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 flex flex-col justify-center">
                                        <div className="text-sm mb-2" style={{ color: accentColor }}>{product.category?.name || ''}</div>
                                        <h3 itemProp="name" className="text-2xl font-bold mb-3" style={{ color: textColor }}>{product.name}</h3>
                                        {product.description && <p itemProp="description" className="opacity-70 mb-4 line-clamp-3" style={{ color: textColor }}>{product.description}</p>}
                                        <div className="flex items-center gap-4">
                                            {product.price && (
                                                <div itemProp="offers" itemScope itemType="http://schema.org/Offer">
                                                    <meta itemProp="priceCurrency" content="CNY" />
                                                    <div className="text-3xl font-black" style={{ color: accentColor }}>
                                                        ¥<span itemProp="price" content={String(product.price)}>{product.price}</span>
                                                    </div>
                                                </div>
                                            )}
                                            <span className="text-sm font-bold hover:underline" style={{ color: accentColor }}>{t('product.buyNow')}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
