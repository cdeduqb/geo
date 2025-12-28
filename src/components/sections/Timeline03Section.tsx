'use client';

import { SectionProps } from '@/lib/sections/registry';

export const Timeline03Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, events = [] } = data;
    const { backgroundColor = '#fef3c7', textColor = '#111827', accentColor = '#f59e0b' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: textColor }}>{title}</h2>
                    {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                </div>

                <div className="max-w-6xl mx-auto">
                    {/* 横向进度条 */}
                    <div className="relative mb-12">
                        <div className="flex items-center justify-between">
                            {events.map((event: any, index: number) => (
                                <div key={index} className="flex-1 flex flex-col items-center relative">
                                    <div
                                        className="w-16 h-16 rounded-full flex items-center justify-center mb-4 z-10 transition-transform hover:scale-110"
                                        style={{ background: accentColor, boxShadow: `0 4px 12px ${accentColor}40` }}
                                    >
                                        <span className="text-white font-bold text-lg">{index + 1}</span>
                                    </div>
                                    {index < events.length - 1 && (
                                        <div
                                            className="absolute top-8 left-1/2 w-full h-1"
                                            style={{ background: `${accentColor}40` }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 事件卡片 */}
                    <div className="grid md:grid-cols-3 gap-6" itemScope itemType="http://schema.org/ItemList">
                        {events.map((event: any, index: number) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-xl shadow-lg"
                                itemProp="itemListElement"
                                itemScope
                                itemType="http://schema.org/ListItem"
                            >
                                <meta itemProp="position" content={String(index + 1)} />
                                <div className="text-xs font-bold mb-2 px-3 py-1 rounded-full inline-block" style={{ background: `${accentColor}20`, color: accentColor }}>
                                    {event.date || `第${index + 1}步`}
                                </div>
                                <h3 className="text-xl font-bold mb-3 mt-2" style={{ color: textColor }} itemProp="name">
                                    {event.title}
                                </h3>
                                <p className="text-sm opacity-70" style={{ color: textColor }} itemProp="description">
                                    {event.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
