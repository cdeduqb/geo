'use client';

import { SectionProps } from '@/lib/sections/registry';

export const Stats02Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, stats = [] } = data;
    const { backgroundColor = '#f0f9ff', textColor = '#111827', accentColor = '#0ea5e9' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && (
                    <div className="text-center mb-12 max-w-3xl mx-auto">
                        <h2 className="text-4xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>
                        {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                    </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto" itemScope itemType="http://schema.org/ItemList">
                    {stats.map((stat: any, index: number) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-all"
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/ListItem"
                        >
                            <meta itemProp="position" content={String(index + 1)} />
                            <div itemProp="item" itemScope itemType="http://schema.org/PropertyValue">
                                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl" style={{ background: `${accentColor}20` }}>
                                    {stat.icon || '📊'}
                                </div>
                                <div className="text-4xl font-black mb-2" style={{ color: accentColor }} itemProp="value">{stat.value}</div>
                                <div className="text-base font-semibold" style={{ color: textColor }} itemProp="name">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
