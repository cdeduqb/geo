'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';

export const Pricing03Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, plans = [] } = data;
    const { backgroundColor = '#f9fafb', textColor = '#111827', accentColor = '#10b981' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && (
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>
                        {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                    </div>
                )}
                <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto" itemScope itemType="http://schema.org/OfferCatalog">
                    {plans.map((plan: any, idx: number) => (
                        <div
                            key={idx}
                            className="w-72 bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/Offer"
                        >
                            <meta itemProp="url" content="#" />
                            <meta itemProp="priceCurrency" content="CNY" />
                            <meta itemProp="price" content={String(plan.price)} />
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-2xl" style={{ background: `${accentColor}20`, color: accentColor }}>{plan.icon || '💎'}</div>
                            <h3 className="text-xl font-bold mb-2" style={{ color: textColor }} itemProp="name">{plan.name}</h3>
                            <div className="mb-4">
                                <span className="text-4xl font-black" style={{ color: accentColor }}>{plan.price}</span>
                                {plan.period && <span className="opacity-70" style={{ color: textColor }}>/{plan.period}</span>}
                            </div>
                            <ul className="space-y-2 mb-6 text-sm">
                                {plan.features?.map((f: string, i: number) => (
                                    <li key={i} className="flex items-center gap-2" style={{ color: textColor }}>
                                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white" style={{ background: accentColor }}>✓</span>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-3 rounded-xl font-semibold transition-all hover:opacity-90" style={{ background: accentColor, color: 'white' }}>
                                {plan.buttonText || '开始使用'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
