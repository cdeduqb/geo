'use client';

import { SectionProps } from '@/lib/sections/registry';

export const Stats01Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, stats = [] } = data;
    const { backgroundColor = '#ffffff', textColor = '#111827', accentColor = '#3b82f6' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && (
                    <div className="text-center mb-12 max-w-3xl mx-auto">
                        <h2 className="text-4xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>
                        {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                    </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto" itemScope itemType="http://schema.org/ItemList">
                    {stats.map((stat: any, index: number) => (
                        <div
                            key={index}
                            className="text-center"
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/ListItem"
                        >
                            <meta itemProp="position" content={String(index + 1)} />
                            <div itemProp="item" itemScope itemType="http://schema.org/PropertyValue">
                                <div className="text-5xl font-black mb-2" style={{ color: accentColor }} itemProp="value">{stat.value}</div>
                                <div className="text-lg font-semibold" style={{ color: textColor }} itemProp="name">{stat.label}</div>
                                {stat.description && <div className="text-sm opacity-60 mt-1" style={{ color: textColor }} itemProp="description">{stat.description}</div>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
