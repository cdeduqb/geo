'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';

// Features06Section: 大图标背景卡片式
export const Features06Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const {
        title,
        subtitle,
        features = []
    } = data;

    const {
        backgroundColor = '#0f172a',
        textColor = '#f1f5f9',
        accentColor = '#06b6d4'
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

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" itemScope itemType="http://schema.org/ItemList">
                    {features.map((feature: any, index: number) => (
                        <div
                            key={index}
                            className="group relative p-8 rounded-2xl overflow-hidden transition-all duration-300 hover:translate-y-[-8px]"
                            style={{
                                background: `linear-gradient(135deg, ${accentColor}15, transparent)`,
                                border: `1px solid ${accentColor}30`
                            }}
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/ListItem"
                        >
                            <meta itemProp="position" content={String(index + 1)} />
                            {/* Background Icon */}
                            <div className="absolute top-4 right-4 opacity-10">
                                {feature.icon ? (
                                    <img
                                        src={feature.icon}
                                        alt=""
                                        itemProp="image"
                                        className="w-32 h-32 transition-transform group-hover:scale-110 group-hover:rotate-6"
                                    />
                                ) : (
                                    <svg
                                        className="w-32 h-32 transition-transform group-hover:scale-110 group-hover:rotate-6"
                                        style={{ color: textColor }}
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                    </svg>
                                )}
                            </div>

                            {/* Content */}
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-4" style={{ color: textColor }} itemProp="name">
                                    {feature.title}
                                </h3>
                                <p className="text-base leading-relaxed opacity-80" style={{ color: textColor }} itemProp="description">
                                    {feature.description}
                                </p>

                                {/* Optional Metric */}
                                {feature.metric && (
                                    <div className="mt-6 pt-6 border-t" style={{ borderColor: `${accentColor}30` }}>
                                        <div
                                            className="text-3xl font-bold mb-1"
                                            style={{ color: accentColor }}
                                        >
                                            {feature.metric}
                                        </div>
                                        {feature.metricLabel && (
                                            <div className="text-sm opacity-70" style={{ color: textColor }}>
                                                {feature.metricLabel}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Gradient Border on Hover */}
                            <div
                                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                                style={{
                                    background: `linear-gradient(135deg, ${accentColor}40, transparent)`,
                                    border: `2px solid ${accentColor}`
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
