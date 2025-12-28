'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';


export const Pricing05Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, plans = [] } = data;
    const { backgroundColor = '#ecfdf5', textColor = '#111827', accentColor = '#10b981' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && (
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>
                        {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                    </div>
                )}
                <div className="grid md:grid-cols-2 gap-8 max-wait mx-auto" itemScope itemType="http://schema.org/OfferCatalog">
                    {plans.map((plan: any, idx: number) => (
                        <div
                            key={idx}
                            className="bg-white rounded-2xl overflow-hidden shadow-xl"
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/Offer"
                        >
                            <meta itemProp="url" content="#" />
                            <meta itemProp="priceCurrency" content="CNY" />
                            <meta itemProp="price" content={String(plan.price)} />
                            <div className="p-8" style={{ background: plan.featured ? accentColor : 'transparent' }}>
                                <h3 className="text-2xl font-bold mb-2" style={{ color: plan.featured ? 'white' : textColor }} itemProp="name">{plan.name}</h3>
                                <div>
                                    <span className="text-5xl font-black" style={{ color: plan.featured ? 'white' : accentColor }}>{plan.price}</span>
                                    {plan.period && <span className="opacity-70" style={{ color: plan.featured ? 'white' : textColor }}>/{plan.period}</span>}
                                </div>
                            </div>
                            <div className="p-8 text-left">
                                <ul className="space-y-3 mb-8">
                                    {plan.features?.map((f: string, i: number) => (
                                        <li key={i} className="flex items-center gap-3" style={{ color: textColor }}>
                                            <span className="text-lg" style={{ color: accentColor }}>✓</span>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <button className="w-full py-4 rounded-xl font-bold text-lg transition-all hover:opacity-90" style={{ background: accentColor, color: 'white' }}>
                                    {plan.buttonText || t('common.getStarted')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
