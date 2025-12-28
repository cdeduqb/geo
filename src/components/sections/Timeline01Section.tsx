'use client';

import { SectionProps } from '@/lib/sections/registry';

export const Timeline01Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, events = [] } = data;
    const { backgroundColor = '#ffffff', textColor = '#111827', accentColor = '#3b82f6', lineColor = '#e5e7eb' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: textColor }}>{title}</h2>
                    {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                </div>

                <div className="max-w-4xl mx-auto" itemScope itemType="http://schema.org/ItemList">
                    {events.map((event: any, index: number) => (
                        <div
                            key={index}
                            className="relative flex gap-6 pb-10 last:pb-0"
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/ListItem"
                        >
                            <meta itemProp="position" content={String(index + 1)} />
                            {index < events.length - 1 && (
                                <div className="absolute left-4 top-12 w-0.5 h-full" style={{ background: lineColor }} />
                            )}

                            <div className="flex-shrink-0 relative z-10">
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center"
                                    style={{ background: accentColor, border: `3px solid ${backgroundColor}` }}
                                >
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                </div>
                            </div>

                            <div className="flex-1 pt-0">
                                {event.date && (
                                    <div className="text-sm font-bold mb-2" style={{ color: accentColor }}>
                                        {event.date}
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-2" style={{ color: textColor }} itemProp="name">
                                    {event.title}
                                </h3>
                                <p className="text-base opacity-70" style={{ color: textColor }} itemProp="description">
                                    {event.description}
                                </p>
                                {event.tags && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {event.tags.map((tag: string, idx: number) => (
                                            <span
                                                key={idx}
                                                className="text-xs px-2 py-1 rounded-full"
                                                style={{ background: `${accentColor}20`, color: accentColor }}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
