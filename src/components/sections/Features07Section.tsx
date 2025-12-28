'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';

export const Features07Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, features = [] } = data;
    const { backgroundColor = '#ffffff', textColor = '#111827', accentColor = '#ef4444' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: textColor }}>{title}</h2>
                    {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" itemScope itemType="http://schema.org/ItemList">
                    {features.map((feature: any, index: number) => (
                        <div
                            key={index}
                            className="group relative"
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/ListItem"
                        >
                            <meta itemProp="position" content={String(index + 1)} />
                            <div className="text-8xl font-black opacity-10 absolute -top-4 -left-2" style={{ color: accentColor }}>
                                {String(index + 1).padStart(2, '0')}
                            </div>
                            <div className="relative pt-12">
                                <h3 className="text-2xl font-bold mb-4" style={{ color: textColor }} itemProp="name">{feature.title}</h3>
                                <p className="text-base opacity-70" style={{ color: textColor }} itemProp="description">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
