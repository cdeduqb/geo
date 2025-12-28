'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';

export const Pricing02Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, plans = [] } = data;
    const { backgroundColor = '#0f172a', textColor = '#f1f5f9', accentColor = '#f59e0b' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && (
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>
                        {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                    </div>
                )}
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto" itemScope itemType="http://schema.org/OfferCatalog">
                    {plans.map((plan: any, idx: number) => (
                        <div
                            key={idx}
                            className="rounded-2xl p-8"
                            style={{ background: plan.featured ? accentColor : 'rgba(255,255,255,0.05)' }}
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/Offer"
                        >
                            <meta itemProp="url" content="#" />
                            <meta itemProp="priceCurrency" content="CNY" />
                            <meta itemProp="price" content={String(plan.price)} />
                            <h3 className="text-xl font-bold mb-2" style={{ color: plan.featured ? '#0f172a' : textColor }} itemProp="name">{plan.name}</h3>
                            <p className="text-sm opacity-70 mb-4" style={{ color: plan.featured ? '#0f172a' : textColor }} itemProp="description">{plan.description}</p>
                            <div className="mb-6">
                                <span className="text-5xl font-black" style={{ color: plan.featured ? '#0f172a' : accentColor }}>{plan.price}</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {plan.features?.map((f: string, i: number) => (
                                    <li key={i} className="flex items-center gap-2 text-sm" style={{ color: plan.featured ? '#0f172a' : textColor }}>
                                        <span>✓</span><span>{f}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-3 rounded-lg font-semibold" style={{ background: plan.featured ? '#0f172a' : accentColor, color: plan.featured ? accentColor : '#0f172a' }}>
                                {plan.buttonText || '选择'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
