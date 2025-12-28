'use client';

import { SectionProps } from '@/lib/sections/registry';

export const Partner02Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, partners = [] } = data;
    const { backgroundColor = '#0f172a', textColor = '#f1f5f9' } = style;

    return (
        <section className="py-16" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && (
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>
                        {subtitle && <p className="text-lg opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                    </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8" itemScope itemType="http://schema.org/ItemList">
                    {partners.map((p: any, i: number) => (
                        <div
                            key={i}
                            className="flex items-center justify-center p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/Organization"
                        >
                            {p.logo ? (
                                <img src={p.logo} alt={p.name} itemProp="logo" className="h-10 object-contain invert" />
                            ) : (
                                <span className="text-xl font-bold" style={{ color: textColor }} itemProp="name">{p.name}</span>
                            )}
                            {p.logo && <meta itemProp="name" content={p.name} />}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
