'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export const ProductList05Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, categoryId, limit = 6 } = data;
    const { backgroundColor = '#ecfdf5', textColor = '#111827', accentColor = '#10b981' } = style;
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
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto" itemScope itemType="http://schema.org/ItemList">
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
                            <div className="bg-white rounded-lg overflow-hidden border-2 border-transparent hover:border-green-500 transition-all">
                                {product.images?.[0] && (
                                    <div className="aspect-square overflow-hidden">
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            itemProp="image"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="p-3 text-center">
                                    <h3 itemProp="name" className="font-bold text-sm line-clamp-1" style={{ color: textColor }}>{product.name}</h3>
                                    {product.price && (
                                        <div itemProp="offers" itemScope itemType="http://schema.org/Offer">
                                            <meta itemProp="priceCurrency" content="CNY" />
                                            <div className="font-black mt-1" style={{ color: accentColor }}>
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
