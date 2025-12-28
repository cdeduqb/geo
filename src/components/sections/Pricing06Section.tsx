'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';

export const Pricing06Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, plans = [] } = data;
    const { backgroundColor = '#fdf2f8', textColor = '#111827', accentColor = '#ec4899' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && (
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>
                        {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                    </div>
                )}
                <div className="grid md:grid-cols-3 gap-0 max-w-5xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl" itemScope itemType="http://schema.org/OfferCatalog">
                    {plans.map((plan: any, idx: number) => (
                        <div
                            key={idx}
                            className={`p-8 ${idx === 1 ? 'bg-gradient-to-b' : ''} ${idx !== plans.length - 1 ? 'border-r border-gray-100' : ''}`}
                            style={idx === 1 ? { backgroundImage: `linear-gradient(to bottom, ${accentColor}, ${accentColor}dd)` } : {}}
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/Offer"
                        >
                            <meta itemProp="url" content="#" />
                            <meta itemProp="priceCurrency" content="CNY" />
                            <meta itemProp="price" content={String(plan.price)} />
                            <div className="text-center">
                                <h3 className="text-xl font-bold mb-4" style={{ color: idx === 1 ? 'white' : textColor }} itemProp="name">{plan.name}</h3>
                                <div className="mb-6">
                                    <span className="text-5xl font-black" style={{ color: idx === 1 ? 'white' : accentColor }}>{plan.price}</span>
                                    {plan.period && <div className="text-sm opacity-70" style={{ color: idx === 1 ? 'white' : textColor }}>{plan.period}</div>}
                                </div>
                                <ul className="space-y-3 mb-8 text-sm text-left">
                                    {plan.features?.map((f: string, i: number) => (
                                        <li key={i} className="flex items-center gap-2" style={{ color: idx === 1 ? 'white' : textColor }}>
                                            <span>✓</span>{f}
                                        </li>
                                    ))}
                                </ul>
                                <button className="w-full py-3 rounded-full font-semibold transition-all" style={{ background: idx === 1 ? 'white' : accentColor, color: idx === 1 ? accentColor : 'white' }}>
                                    {plan.buttonText || '选择'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
