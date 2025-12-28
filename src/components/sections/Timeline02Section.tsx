'use client';

import { SectionProps } from '@/lib/sections/registry';

export const Timeline02Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, events = [] } = data;
    const { backgroundColor = '#f9fafb', textColor = '#111827', accentColor = '#10b981' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: textColor }}>{title}</h2>
                    {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                </div>

                <div className="max-w-6xl mx-auto relative" itemScope itemType="http://schema.org/ItemList">
                    {/* 中心线 */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full" style={{ background: `${accentColor}30` }} />

                    {events.map((event: any, index: number) => {
                        const isLeft = index % 2 === 0;
                        return (
                            <div
                                key={index}
                                className={`relative flex items-center mb-12 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
                                itemProp="itemListElement"
                                itemScope
                                itemType="http://schema.org/ListItem"
                            >
                                <meta itemProp="position" content={String(index + 1)} />
                                <div className={`w-1/2 ${isLeft ? 'pr-12 text-right' : 'pl-12'}`}>
                                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
                                        {event.date && (
                                            <div className="text-sm font-bold mb-2" style={{ color: accentColor }}>
                                                {event.date}
                                            </div>
                                        )}
                                        <h3 className="text-xl font-bold mb-2" style={{ color: textColor }} itemProp="name">
                                            {event.title}
                                        </h3>
                                        <p className="text-sm opacity-70" style={{ color: textColor }} itemProp="description">
                                            {event.description}
                                        </p>
                                    </div>
                                </div>

                                {/* 中心点 */}
                                <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center"
                                        style={{ background: accentColor, boxShadow: `0 0 0 4px ${backgroundColor}` }}
                                    >
                                        <span className="text-white font-bold">{index + 1}</span>
                                    </div>
                                </div>

                                <div className="w-1/2" />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
