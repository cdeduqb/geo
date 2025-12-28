'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';

export const Process04Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, steps = [] } = data;
    const { backgroundColor = '#faf5ff', textColor = '#111827', accentColor = '#8b5cf6' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: textColor }}>{title}</h2>
                    {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                </div>

                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-wrap items-start justify-center gap-4">
                        {steps.map((step: any, index: number) => (
                            <div key={index} className="flex items-center">
                                <div
                                    className="relative px-8 py-6 transition-all hover:scale-105"
                                    style={{
                                        background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
                                        clipPath: index < steps.length - 1
                                            ? 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)'
                                            : 'none',
                                        borderRadius: index === steps.length - 1 ? '0.5rem' : '0'
                                    }}
                                >
                                    <div className="text-center text-white min-w-[120px]">
                                        <div className="text-2xl font-black mb-2">{index + 1}</div>
                                        <div className="text-sm font-bold">{step.title}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 grid md:grid-cols-3 gap-6" itemScope itemType="http://schema.org/ItemList">
                        {steps.map((step: any, index: number) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-lg shadow"
                                itemProp="itemListElement"
                                itemScope
                                itemType="http://schema.org/ListItem"
                            >
                                <meta itemProp="position" content={String(index + 1)} />
                                <div className="flex items-center gap-3 mb-3">
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                                        style={{ background: accentColor }}
                                    >
                                        {index + 1}
                                    </div>
                                    <h3 className="font-bold" style={{ color: textColor }} itemProp="name">{step.title}</h3>
                                </div>
                                <p className="text-sm opacity-70" style={{ color: textColor }} itemProp="description">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
