'use client';

import { SectionProps } from '@/lib/sections/registry';

export const Partner03Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, partners = [] } = data;
    const { backgroundColor = '#f9fafb', textColor = '#111827', accentColor = '#10b981' } = style;

    return (
        <section className="py-16" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && <h2 className="text-center text-lg font-medium mb-8 opacity-70" style={{ color: textColor }}>{title}</h2>}
                <div className="overflow-hidden" itemScope itemType="http://schema.org/ItemList">
                    <div className="flex animate-scroll gap-16">
                        {[...partners, ...partners].map((p: any, i: number) => (
                            <div
                                key={i}
                                className="flex-shrink-0"
                                itemProp="itemListElement"
                                itemScope
                                itemType="http://schema.org/Organization"
                            >
                                {p.logo ? (
                                    <img src={p.logo} alt={p.name} itemProp="logo" className="h-10 object-contain" />
                                ) : (
                                    <span className="text-2xl font-bold whitespace-nowrap" style={{ color: textColor }} itemProp="name">
                                        {p.name}
                                    </span>
                                )}
                                {p.logo && <meta itemProp="name" content={p.name} />}
                            </div>
                        ))}
                    </div>
                </div>
                <style jsx>{`
                    @keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
                    .animate-scroll { animation: scroll 30s linear infinite; }
                `}</style>
            </div>
        </section>
    );
};
