'use client';

import { SectionProps } from '@/lib/sections/registry';

export const Compare05Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, items = [] } = data;
    const { backgroundColor = '#ecfdf5', textColor = '#111827', accentColor = '#10b981' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && (
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>
                        {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                    </div>
                )}
                <div className="max-w-4xl mx-auto space-y-6" itemScope itemType="http://schema.org/ItemList">
                    {items.map((item: any, idx: number) => (
                        <div key={idx} className="bg-white rounded-xl p-6 shadow-lg" itemProp="itemListElement" itemScope itemType="http://schema.org/ListItem">
                            <h3 className="text-lg font-bold mb-4" style={{ color: textColor }}>{item.category}</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg bg-red-50">
                                    <div className="text-sm font-bold text-red-600 mb-2">❌ {item.badLabel || '之前'}</div>
                                    <p className="text-sm" style={{ color: textColor }}>{item.bad}</p>
                                </div>
                                <div className="p-4 rounded-lg" style={{ background: `${accentColor}10` }}>
                                    <div className="text-sm font-bold mb-2" style={{ color: accentColor }}>✓ {item.goodLabel || '现在'}</div>
                                    <p className="text-sm" style={{ color: textColor }}>{item.good}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
