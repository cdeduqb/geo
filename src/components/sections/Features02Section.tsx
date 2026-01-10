'use client';

import { registerSection, SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';

// Features02Section: 现代卡片式功能网格
export const Features02Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const {
        title,
        subtitle,
        features = []
    } = data;

    const {
        backgroundColor = '#ffffff',
        textColor = '#111827',
        accentColor = '#3b82f6',
        cardBackground = '#f9fafb'
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
                            className="group relative p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                            style={{ background: cardBackground }}
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/ListItem"
                        >
                            <meta itemProp="position" content={String(index + 1)} />
                            {/* Icon */}
                            <div
                                className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                                style={{ background: `${accentColor}15` }}
                            >
                                {feature.icon ? (
                                    <img src={feature.icon} alt={feature.title} itemProp="image" className="w-8 h-8" />
                                ) : (
                                    <svg className="w-8 h-8" style={{ color: accentColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>

                            {/* Content */}
                            <h3 className="text-2xl font-bold mb-4" style={{ color: textColor }} itemProp="name">
                                {feature.title}
                            </h3>
                            <p className="text-base leading-relaxed opacity-70 mb-6" style={{ color: textColor }} itemProp="description">
                                {feature.description}
                            </p>

                            {/* Optional Link */}
                            {feature.link && (
                                <a
                                    href={feature.link}
                                    className="inline-flex items-center gap-2 font-semibold transition-colors"
                                    style={{ color: accentColor }}
                                    itemProp="url"
                                >
                                    {feature.linkText || t('common.learnMore')}
                                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </a>
                            )}

                            {/* Hover Border Effect */}
                            <div
                                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                                style={{ border: `2px solid ${accentColor}20` }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
