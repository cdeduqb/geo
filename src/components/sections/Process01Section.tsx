'use client';

import { SectionProps } from '@/lib/sections/registry';

export const Process01Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, steps = [] } = data;
    const { backgroundColor = '#f0f9ff', textColor = '#111827', accentColor = '#3b82f6', completedColor = '#10b981' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: textColor }}>{title}</h2>
                    {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                </div>

                <div className="max-w-5xl mx-auto">
                    {/* Progress Bar */}
                    <div className="flex items-center justify-between mb-12">
                        {steps.map((step: any, index: number) => (
                            <div key={index} className="flex-1 flex items-center">
                                <div className="flex flex-col items-center flex-1">
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white mb-3 transition-all"
                                        style={{ background: index === 0 ? accentColor : completedColor }}
                                    >
                                        {index + 1}
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold mb-1" style={{ color: textColor }}>{step.title}</div>
                                        <div className="text-sm opacity-70" style={{ color: textColor }}>{step.subtitle}</div>
                                    </div>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="h-1 flex-1 mx-4" style={{ background: completedColor, opacity: 0.3 }} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Details */}
                    <div className="grid md:grid-cols-3 gap-6" itemScope itemType="http://schema.org/ItemList">
                        {steps.map((step: any, index: number) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-xl border"
                                style={{ borderColor: '#e5e7eb' }}
                                itemProp="itemListElement"
                                itemScope
                                itemType="http://schema.org/ListItem"
                            >
                                <meta itemProp="position" content={String(index + 1)} />
                                <div className="text-sm font-bold mb-2" style={{ color: accentColor }}>步骤 {index + 1}</div>
                                <h3 className="text-lg font-bold mb-2" style={{ color: textColor }} itemProp="name">{step.title}</h3>
                                <p className="text-sm opacity-70" style={{ color: textColor }} itemProp="description">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
