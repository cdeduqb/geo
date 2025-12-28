'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';

export const Pricing04Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, plans = [] } = data;
    const { backgroundColor = '#ede9fe', textColor = '#111827', accentColor = '#8b5cf6' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && (
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>
                        {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                    </div>
                )}
                <div className="max-w-4xl mx-auto space-y-4" itemScope itemType="http://schema.org/OfferCatalog">
                    {plans.map((plan: any, idx: number) => (
                        <div
                            key={idx}
                            className="bg-white rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg"
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/Offer"
                        >
                            <meta itemProp="url" content="#" />
                            <meta itemProp="priceCurrency" content="CNY" />
                            <meta itemProp="price" content={String(plan.price)} />
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-1" style={{ color: textColor }} itemProp="name">{plan.name}</h3>
                                <p className="text-sm opacity-70" style={{ color: textColor }} itemProp="description">{plan.description}</p>
                            </div>
                            <div className="text-center md:text-right">
                                <span className="text-3xl font-black" style={{ color: accentColor }}>{plan.price}</span>
                                {plan.period && <span className="opacity-70" style={{ color: textColor }}>/{plan.period}</span>}
                            </div>
                            <button className="px-8 py-3 rounded-lg font-semibold whitespace-nowrap" style={{ background: accentColor, color: 'white' }}>
                                {plan.buttonText || '选择'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
