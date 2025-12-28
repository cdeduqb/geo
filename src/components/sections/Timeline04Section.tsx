'use client';

import { SectionProps } from '@/lib/sections/registry';

export const Timeline04Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, events = [] } = data;
    const { backgroundColor = '#ede9fe', textColor = '#111827', accentColor = '#8b5cf6', dotColor = '#a78bfa' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: textColor }}>{title}</h2>
                    {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                </div>

                <div className="max-w-5xl mx-auto" itemScope itemType="http://schema.org/ItemList">
                    {events.map((event: any, index: number) => (
                        <div
                            key={index}
                            className="relative flex items-start gap-8 mb-12 last:mb-0"
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/ListItem"
                        >
                            <meta itemProp="position" content={String(index + 1)} />
                            {/* 左侧时间+圆点 */}
                            <div className="flex-shrink-0 text-right" style={{ width: '120px' }}>
                                <div className="text-lg font-bold mb-2" style={{ color: accentColor }}>
                                    {event.year || '2024'}
                                </div>
                                <div className="flex items-center justify-end gap-2">
                                    <div className="text-sm opacity-70" style={{ color: textColor }}>
                                        {event.month || '01'}
                                    </div>
                                    <div className="relative">
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ background: dotColor }}
                                        />
                                        {index < events.length - 1 && (
                                            <div
                                                className="absolute top-4 left-1/2 transform -translate-x-1/2 w-0.5"
                                                style={{ background: dotColor, height: '80px' }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 右侧内容 */}
                            <div className="flex-1 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
                                <h3 className="text-2xl font-bold mb-3" style={{ color: textColor }} itemProp="name">
                                    {event.title}
                                </h3>
                                <p className="text-base opacity-70 mb-4" style={{ color: textColor }} itemProp="description">
                                    {event.description}
                                </p>
                                {event.achievement && (
                                    <div className="text-sm font-semibold px-3 py-1 rounded inline-block" style={{ background: `${accentColor}20`, color: accentColor }}>
                                        {event.achievement}
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
