'use client';

import { SectionProps } from '@/lib/sections/registry';

export const Stats04Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, stats = [] } = data;
    const { backgroundColor = '#fef3c7', textColor = '#111827', accentColor = '#f59e0b' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && (
                    <div className="text-center mb-12 max-w-3xl mx-auto">
                        <h2 className="text-4xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>
                        {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto" itemScope itemType="http://schema.org/ItemList">
                    {stats.map((stat: any, index: number) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-8 text-center shadow-lg relative overflow-hidden"
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/ListItem"
                        >
                            <meta itemProp="position" content={String(index + 1)} />
                            <div itemProp="item" itemScope itemType="http://schema.org/PropertyValue">
                                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: accentColor }} />
                                <div className="text-6xl font-black mb-3" style={{ color: accentColor }} itemProp="value">{stat.value}</div>
                                <div className="text-xl font-bold mb-2" style={{ color: textColor }} itemProp="name">{stat.label}</div>
                                {stat.change && (
                                    <div className="text-sm" style={{ color: stat.change.startsWith('+') ? '#22c55e' : '#ef4444' }} itemProp="description">
                                        {stat.change} 较上期
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
