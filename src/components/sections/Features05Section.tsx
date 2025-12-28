'use client';

import { SectionProps } from '@/lib/sections/registry';

// Features05Section: 竖向时间线式
export const Features05Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const {
        title,
        subtitle,
        features = []
    } = data;

    const {
        backgroundColor = '#ffffff',
        textColor = '#111827',
        accentColor = '#f59e0b',
        lineColor = '#d1d5db'
    } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: textColor }}>
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-xl opacity-70" style={{ color: textColor }}>
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Timeline */}
                <div className="max-w-4xl mx-auto" itemScope itemType="http://schema.org/ItemList">
                    {features.map((feature: any, index: number) => (
                        <div
                            key={index}
                            className="relative flex gap-8 pb-12 last:pb-0"
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/ListItem"
                        >
                            <meta itemProp="position" content={String(index + 1)} />
                            {/* Timeline Line */}
                            {index < features.length - 1 && (
                                <div
                                    className="absolute left-6 top-16 w-0.5 h-full"
                                    style={{ background: lineColor }}
                                />
                            )}

                            {/* Number/Icon */}
                            <div className="flex-shrink-0 relative z-10">
                                {feature.icon ? (
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center"
                                        style={{ background: accentColor }}
                                    >
                                        <img src={feature.icon} alt={feature.title} itemProp="image" className="w-6 h-6" />
                                    </div>
                                ) : (
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg"
                                        style={{ background: accentColor }}
                                    >
                                        {index + 1}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pt-1">
                                <h3 className="text-2xl font-bold mb-3" style={{ color: textColor }} itemProp="name">
                                    {feature.title}
                                </h3>
                                <p className="text-base leading-relaxed opacity-70 mb-4" style={{ color: textColor }} itemProp="description">
                                    {feature.description}
                                </p>

                                {/* Optional Badge */}
                                {feature.badge && (
                                    <span
                                        className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                                        style={{
                                            background: `${accentColor}20`,
                                            color: accentColor
                                        }}
                                    >
                                        {feature.badge}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
