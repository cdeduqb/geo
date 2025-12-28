'use client';

import { SectionProps } from '@/lib/sections/registry';

export const Process05Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, steps = [] } = data;
    const { backgroundColor = '#fdf2f8', textColor = '#111827', accentColor = '#ec4899', lineColor = '#e5e7eb' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: textColor }}>{title}</h2>
                    {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                </div>

                <div className="max-w-4xl mx-auto" itemScope itemType="http://schema.org/ItemList">
                    {steps.map((step: any, index: number) => (
                        <div
                            key={index}
                            className="relative flex gap-6 pb-12 last:pb-0"
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/ListItem"
                        >
                            <meta itemProp="position" content={String(index + 1)} />
                            {index < steps.length - 1 && (
                                <div
                                    className="absolute left-8 top-20 w-0.5 h-full"
                                    style={{ background: lineColor }}
                                />
                            )}

                            <div className="flex-shrink-0 relative z-10">
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-xl"
                                    style={{ background: accentColor, boxShadow: `0 4px 12px ${accentColor}40` }}
                                >
                                    {step.icon || (index + 1)}
                                </div>
                            </div>

                            <div className="flex-1 pt-2">
                                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="text-sm font-bold px-3 py-1 rounded-full" style={{ background: `${accentColor}20`, color: accentColor }}>
                                            步骤 {index + 1}
                                        </div>
                                        {step.duration && (
                                            <div className="text-xs opacity-70" style={{ color: textColor }}>
                                                {step.duration}
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3" style={{ color: textColor }} itemProp="name">
                                        {step.title}
                                    </h3>
                                    <p className="text-base opacity-70 mb-4" style={{ color: textColor }} itemProp="description">
                                        {step.description}
                                    </p>
                                    {step.highlights && (
                                        <div className="flex flex-wrap gap-2">
                                            {step.highlights.map((highlight: string, idx: number) => (
                                                <span
                                                    key={idx}
                                                    className="text-xs px-2 py-1 rounded"
                                                    style={{ background: `${accentColor}10`, color: accentColor }}
                                                >
                                                    {highlight}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
