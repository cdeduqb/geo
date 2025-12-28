'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export const ProductList04Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, categoryId, limit = 4 } = data;
    const { backgroundColor = '#ede9fe', textColor = '#111827', accentColor = '#8b5cf6' } = style;
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
                <div className="max-w-5xl mx-auto space-y-6" itemScope itemType="http://schema.org/ItemList">
                    {products.map((product: any, index) => (
                        <Link
                            href={`/product/${product.slug}`}
                            key={product.id}
                            className="block group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all flex flex-col md:flex-row overflow-hidden"
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/Product"
                        >
                            <meta itemProp="position" content={String(index + 1)} />
                            <meta itemProp="url" content={`/product/${product.slug}`} />
                            {product.images?.[0] && (
                                <div className="md:w-1/2 h-64 md:h-auto overflow-hidden">
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        itemProp="image"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                            )}
                            <div className="md:w-1/2 p-8 flex flex-col justify-center items-start">
                                <h3 itemProp="name" className="text-2xl font-bold mb-4" style={{ color: textColor }}>{product.name}</h3>
                                {product.description && <p itemProp="description" className="mb-6 opacity-70" style={{ color: textColor }}>{product.description}</p>}
                                <div itemProp="offers" itemScope itemType="http://schema.org/Offer">
                                    <meta itemProp="priceCurrency" content="CNY" />
                                    <div className="text-2xl font-bold mb-6" style={{ color: accentColor }}>
                                        ¥<span itemProp="price" content={String(product.price)}>{product.price}</span>
                                    </div>
                                </div>
                                <span className="inline-block px-8 py-3 rounded-full text-white font-medium transition-transform hover:-translate-y-1" style={{ background: accentColor }}>{t('product.viewDetails')}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};
