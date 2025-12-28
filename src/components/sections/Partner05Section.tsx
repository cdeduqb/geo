'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';

export const Partner05Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, partners = [] } = data;
    const { backgroundColor = '#ecfdf5', textColor = '#111827', accentColor = '#10b981' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && (
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>
                        {subtitle && <p className="text-lg opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                    </div>
                )}
                <div className="max-w-4xl mx-auto" itemScope itemType="http://schema.org/ItemList">
                    {partners.map((p: any, i: number) => (
                        <div
                            key={i}
                            className="flex items-center gap-6 p-6 border-b border-gray-200 last:border-0"
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/Organization"
                        >
                            <div className="w-16 h-16 rounded-full bg-white shadow flex items-center justify-center flex-shrink-0">
                                {p.logo ? (
                                    <img src={p.logo} alt={p.name} itemProp="logo" className="w-10 h-10 object-contain" />
                                ) : (
                                    <span className="text-xl font-bold" style={{ color: accentColor }}>{p.name?.charAt(0)}</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold" style={{ color: textColor }} itemProp="name">{p.name}</h3>
                                {p.description && <p className="text-sm opacity-70" style={{ color: textColor }} itemProp="description">{p.description}</p>}
                            </div>
                            {p.url && <a href={p.url} className="text-sm font-medium" style={{ color: accentColor }} itemProp="url">访问 →</a>}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
