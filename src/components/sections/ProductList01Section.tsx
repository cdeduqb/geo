'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export const ProductList01Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, categoryId, limit = 6 } = data;
    const { backgroundColor = '#ffffff', textColor = '#111827', accentColor = '#3b82f6' } = style;
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const params = new URLSearchParams();
                if (categoryId) params.append('categoryId', categoryId);
                params.append('limit', String(limit));
                params.append('status', 'published');
                const res = await fetch(`/api/products?${params}`);
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data.products || []);
                }
            } catch (error) {
                console.error('获取产品失败:', error);
            }
        };
        fetchProducts();
    }, [categoryId, limit]);

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && (
                    <div className="text-center mb-12 max-w-3xl mx-auto">
                        <h2 className="text-4xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>
                        {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                    </div>
                )}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto" itemScope itemType="http://schema.org/ItemList">
                    {products.map((product: any, index) => (
                        <Link
                            href={`/product/${product.slug}`}
                            key={product.id}
                            className="group"
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/Product"
                        >
                            <meta itemProp="position" content={String(index + 1)} />
                            <meta itemProp="url" content={`/product/${product.slug}`} />
                            <div className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-xl transition-all">
                                {product.images?.[0] && (
                                    <div className="aspect-square overflow-hidden">
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            itemProp="image"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        />
                                    </div>
                                )}
                                <div className="p-5">
                                    <h3 itemProp="name" className="text-lg font-bold mb-2" style={{ color: textColor }}>{product.name}</h3>
                                    {product.price && (
                                        <div itemProp="offers" itemScope itemType="http://schema.org/Offer">
                                            <meta itemProp="priceCurrency" content="CNY" />
                                            <div className="text-xl font-black" style={{ color: accentColor }}>
                                                ¥<span itemProp="price" content={String(product.price)}>{product.price}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};
