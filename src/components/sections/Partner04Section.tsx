'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';

export const Partner04Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, partners = [] } = data;
    const { backgroundColor = '#ede9fe', textColor = '#111827', accentColor = '#8b5cf6' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && (
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>
                        {subtitle && <p className="text-lg opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                    </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-5xl mx-auto" itemScope itemType="http://schema.org/ItemList">
                    {partners.map((p: any, i: number) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-center hover:-translate-y-1"
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/Organization"
                        >
                            {p.logo ? (
                                <img src={p.logo} alt={p.name} itemProp="logo" className="h-12 mx-auto mb-4 object-contain" />
                            ) : (
                                <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ background: accentColor }}>
                                    {p.name?.charAt(0)}
                                </div>
                            )}
                            <span className="font-medium" style={{ color: textColor }} itemProp="name">{p.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
