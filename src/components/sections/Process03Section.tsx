'use client';

import { SectionProps } from '@/lib/sections/registry';

export const Process03Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, steps = [] } = data;
    const { backgroundColor = '#fffbeb', textColor = '#111827', accentColor = '#f59e0b' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: textColor }}>{title}</h2>
                    {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                </div>

                <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12" itemScope itemType="http://schema.org/ItemList">
                    {steps.map((step: any, index: number) => (
                        <div
                            key={index}
                            className="text-center"
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/ListItem"
                        >
                            <meta itemProp="position" content={String(index + 1)} />
                            <div
                                className="w-32 h-32 rounded-full mx-auto mb-6 flex flex-col items-center justify-center transition-transform hover:scale-110"
                                style={{ background: `${accentColor}20`, border: `4px solid ${accentColor}` }}
                            >
                                <div className="text-4xl font-black" style={{ color: accentColor }}>
                                    {step.icon || (index + 1)}
                                </div>
                                <div className="text-xs font-bold mt-1" style={{ color: accentColor }}>
                                    STEP
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold mb-3" style={{ color: textColor }} itemProp="name">
                                {step.title}
                            </h3>
                            <p className="text-base opacity-70" style={{ color: textColor }} itemProp="description">
                                {step.description}
                            </p>
                            {step.note && (
                                <div className="mt-3 text-sm font-semibold" style={{ color: accentColor }}>
                                    {step.note}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
