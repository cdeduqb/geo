'use client';

import { SectionProps } from '@/lib/sections/registry';

export const Compare04Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, leftProduct = {}, rightProduct = {} } = data;
    const { backgroundColor = '#ede9fe', textColor = '#111827', accentColor = '#8b5cf6' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && (
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>
                        {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                    </div>
                )}
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8" itemScope itemType="http://schema.org/ItemList">
                    <div className="bg-white rounded-2xl p-8 shadow-xl" itemProp="itemListElement" itemScope itemType="http://schema.org/Product">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold" style={{ color: textColor }} itemProp="name">{leftProduct.name}</h3>
                            {leftProduct.price && <div className="text-3xl font-black mt-2" style={{ color: accentColor }}>{leftProduct.price}</div>}
                        </div>
                        <ul className="space-y-4">
                            {leftProduct.features?.map((f: string, idx: number) => (
                                <li key={idx} className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm" style={{ background: accentColor }}>✓</span>
                                    <span style={{ color: textColor }}>{f}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white rounded-2xl p-8 shadow-xl ring-4 ring-purple-500" itemProp="itemListElement" itemScope itemType="http://schema.org/Product">
                        <div className="text-center mb-6">
                            <div className="text-xs font-bold px-3 py-1 rounded-full inline-block mb-2" style={{ background: accentColor, color: 'white' }}>推荐</div>
                            <h3 className="text-2xl font-bold" style={{ color: textColor }} itemProp="name">{rightProduct.name}</h3>
                            {rightProduct.price && <div className="text-3xl font-black mt-2" style={{ color: accentColor }}>{rightProduct.price}</div>}
                        </div>
                        <ul className="space-y-4">
                            {rightProduct.features?.map((f: string, idx: number) => (
                                <li key={idx} className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm" style={{ background: accentColor }}>✓</span>
                                    <span style={{ color: textColor }}>{f}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};
