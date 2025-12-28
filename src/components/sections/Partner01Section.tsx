'use client';

import { SectionProps } from '@/lib/sections/registry';

export const Partner01Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, partners = [] } = data;
    const { backgroundColor = '#ffffff', textColor = '#111827' } = style;

    return (
        <section className="py-16" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && (
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>
                        {subtitle && <p className="text-lg opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                    </div>
                )}
                <div className="flex flex-wrap justify-center items-center gap-12" itemScope itemType="http://schema.org/ItemList">
                    {partners.map((p: any, i: number) => (
                        <div
                            key={i}
                            className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all"
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/Organization"
                        >
                            {p.logo ? (
                                <img src={p.logo} alt={p.name} itemProp="logo" className="h-12 object-contain" />
                            ) : (
                                <span className="text-2xl font-bold" style={{ color: textColor }} itemProp="name">{p.name}</span>
                            )}
                            {p.logo && <meta itemProp="name" content={p.name} />}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
