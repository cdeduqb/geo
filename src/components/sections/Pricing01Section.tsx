'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';

export const Pricing01Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, plans = [] } = data;
    const { backgroundColor = '#ffffff', textColor = '#111827', accentColor = '#3b82f6' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && (
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>
                        {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                    </div>
                )}
                <div className="grid md:grid-cols-3 gap-8 max-wait mx-auto" itemScope itemType="http://schema.org/OfferCatalog">
                    {plans.map((plan: any, idx: number) => (
                        <div
                            key={idx}
                            className={`rounded-2xl p-8 ${plan.featured ? 'ring-2 shadow-xl scale-105' : 'bg-gray-50'}`}
                            style={{ '--tw-ring-color': plan.featured ? accentColor : 'transparent' } as React.CSSProperties}
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/Offer"
                        >
                            <meta itemProp="url" content="#" />
                            <meta itemProp="priceCurrency" content="CNY" />
                            <meta itemProp="price" content={String(plan.price)} />
                            {plan.featured && <div className="text-xs font-bold text-center py-1 px-3 rounded-full mb-4 inline-block" style={{ background: accentColor, color: 'white' }}>{t('pricing.popular')}</div>}
                            <h3 className="text-2xl font-bold mb-2" style={{ color: textColor }} itemProp="name">{plan.name}</h3>
                            <div className="mb-6">
                                <span className="text-4xl font-black" style={{ color: accentColor }}>{plan.price}</span>
                                <span className="opacity-70" style={{ color: textColor }}>/{plan.period || t('pricing.month')}</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {plan.features?.map((f: string, i: number) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <span style={{ color: accentColor }}>✓</span>
                                        <span style={{ color: textColor }}>{f}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-3 rounded-lg font-semibold transition-all" style={{ background: plan.featured ? accentColor : 'transparent', color: plan.featured ? 'white' : accentColor, border: `2px solid ${accentColor}` }}>
                                {plan.buttonText || t('pricing.selectPlan')}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
