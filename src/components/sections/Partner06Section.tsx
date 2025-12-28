'use client';

import { SectionProps } from '@/lib/sections/registry';

export const Partner06Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, stats = [], partners = [] } = data;
    const { backgroundColor = '#fdf2f8', textColor = '#111827', accentColor = '#ec4899' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            {title && <h2 className="text-3xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>}
                            {subtitle && <p className="text-lg opacity-70 mb-8" style={{ color: textColor }}>{subtitle}</p>}
                            <div className="flex gap-8">
                                {stats.map((s: any, i: number) => (
                                    <div key={i}>
                                        <div className="text-3xl font-black" style={{ color: accentColor }}>{s.value}</div>
                                        <div className="text-sm opacity-70" style={{ color: textColor }}>{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4" itemScope itemType="http://schema.org/ItemList">
                            {partners.map((p: any, i: number) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-xl p-4 shadow hover:shadow-lg transition-all flex items-center justify-center"
                                    itemProp="itemListElement"
                                    itemScope
                                    itemType="http://schema.org/Organization"
                                >
                                    {p.logo ? (
                                        <img src={p.logo} alt={p.name} itemProp="logo" className="h-8 object-contain" />
                                    ) : (
                                        <span className="font-bold text-sm" style={{ color: textColor }} itemProp="name">{p.name}</span>
                                    )}
                                    {p.logo && <meta itemProp="name" content={p.name} />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
