'use client';

import { SectionProps } from '@/lib/sections/registry';

export const Process02Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, steps = [] } = data;
    const { backgroundColor = '#ecfdf5', textColor = '#111827', accentColor = '#10b981' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: textColor }}>{title}</h2>
                    {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                </div>

                <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6" itemScope itemType="http://schema.org/ItemList">
                    {steps.map((step: any, index: number) => (
                        <div
                            key={index}
                            className="relative"
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/ListItem"
                        >
                            <meta itemProp="position" content={String(index + 1)} />
                            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                                <div
                                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white"
                                    style={{ background: accentColor }}
                                >
                                    {step.icon || (index + 1)}
                                </div>
                                <h3 className="text-lg font-bold mb-2 text-center" style={{ color: textColor }} itemProp="name">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-center opacity-70" style={{ color: textColor }} itemProp="description">
                                    {step.description}
                                </p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                                    <svg className="w-6 h-6" style={{ color: accentColor }} fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
