'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';

export const Timeline05Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, events = [] } = data;
    const { backgroundColor = '#ffffff', textColor = '#111827', accentColor = '#ec4899', cardBgColor = '#ffffff' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: textColor }}>{title}</h2>
                    {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                </div>

                <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6" itemScope itemType="http://schema.org/ItemList">
                    {events.map((event: any, index: number) => (
                        <div
                            key={index}
                            className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1"
                            style={{ background: cardBgColor }}
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/ListItem"
                        >
                            <meta itemProp="position" content={String(index + 1)} />
                            {/* 顶部彩条 */}
                            <div className="h-2" style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}dd)` }} />

                            <div className="p-6">
                                {/* 日期标签 */}
                                <div className="flex items-center gap-2 mb-4">
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                                        style={{ background: accentColor }}
                                    >
                                        {index + 1}
                                    </div>
                                    <div>
                                        <div className="text-xs opacity-70" style={{ color: textColor }}>
                                            {event.period || '时间'}
                                        </div>
                                        <div className="text-sm font-bold" style={{ color: accentColor }}>
                                            {event.date}
                                        </div>
                                    </div>
                                </div>

                                {/* 标题 */}
                                <h3 className="text-xl font-bold mb-3" style={{ color: textColor }} itemProp="name">
                                    {event.title}
                                </h3>

                                {/* 描述 */}
                                <p className="text-sm opacity-70 mb-4" style={{ color: textColor }} itemProp="description">
                                    {event.description}
                                </p>

                                {/* 关键词 */}
                                {event.keywords && (
                                    <div className="flex flex-wrap gap-2">
                                        {event.keywords.map((keyword: string, idx: number) => (
                                            <span
                                                key={idx}
                                                className="text-xs px-2 py-1 rounded-full border"
                                                style={{ borderColor: accentColor, color: accentColor }}
                                            >
                                                {keyword}
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
