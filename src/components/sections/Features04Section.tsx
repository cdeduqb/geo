'use client';

import { SectionProps } from '@/lib/sections/registry';

// Features04Section: 图标居中简约卡片式
export const Features04Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const {
        title,
        subtitle,
        features = []
    } = data;

    const {
        backgroundColor = '#fafafa',
        textColor = '#1f2937',
        accentColor = '#8b5cf6',
        cardBorderColor = '#e5e7eb'
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
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" itemScope itemType="http://schema.org/ItemList">
                    {features.map((feature: any, index: number) => (
                        <div
                            key={index}
                            className="group text-center p-8 rounded-lg transition-all duration-300 hover:scale-105"
                            style={{
                                background: '#ffffff',
                                border: `1px solid ${cardBorderColor}`
                            }}
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/ListItem"
                        >
                            <meta itemProp="position" content={String(index + 1)} />
                            {/* Icon */}
                            <div className="flex justify-center mb-6">
                                {feature.icon ? (
                                    <img
                                        src={feature.icon}
                                        alt={feature.title}
                                        itemProp="image"
                                        className="w-16 h-16 transition-transform group-hover:scale-110"
                                    />
                                ) : (
                                    <div
                                        className="w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:rotate-12"
                                        style={{ background: `${accentColor}20` }}
                                    >
                                        <svg className="w-8 h-8" style={{ color: accentColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <h3 className="text-lg font-bold mb-3" style={{ color: textColor }} itemProp="name">
                                {feature.title}
                            </h3>
                            <p className="text-sm leading-relaxed opacity-70" style={{ color: textColor }} itemProp="description">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
