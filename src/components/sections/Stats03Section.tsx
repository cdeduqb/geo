'use client';

import { SectionProps } from '@/lib/sections/registry';

export const Stats03Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, stats = [] } = data;
    const { backgroundColor = '#0f172a', textColor = '#f1f5f9', accentColor = '#22c55e' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && (
                    <div className="text-center mb-12 max-w-3xl mx-auto">
                        <h2 className="text-4xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>
                        {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                    </div>
                )}
                <div className="flex flex-wrap justify-center gap-0 max-w-5xl mx-auto" itemScope itemType="http://schema.org/ItemList">
                    {stats.map((stat: any, index: number) => (
                        <div
                            key={index}
                            className="flex-1 min-w-[200px] text-center py-8 px-6 border-r last:border-r-0"
                            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/ListItem"
                        >
                            <meta itemProp="position" content={String(index + 1)} />
                            <div itemProp="item" itemScope itemType="http://schema.org/PropertyValue">
                                <div className="text-5xl font-black mb-2" style={{ color: accentColor }} itemProp="value">{stat.value}</div>
                                <div className="text-lg uppercase tracking-wider opacity-80" style={{ color: textColor }} itemProp="name">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
