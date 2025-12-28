'use client';

import { registerSection, SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';

// Features03Section: 横向列表式功能展示
export const Features03Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const {
        title,
        subtitle,
        features = []
    } = data;

    const {
        backgroundColor = '#f9fafb',
        textColor = '#111827',
        accentColor = '#10b981',
        layout = 'two-column'
    } = style;

    const isTwoColumn = layout === 'two-column';

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-16 max-w-3xl">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: textColor }}>
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-xl opacity-70" style={{ color: textColor }}>
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Features List */}
                <div className={`grid ${isTwoColumn ? 'md:grid-cols-2' : 'grid-cols-1'} gap-8`} itemScope itemType="http://schema.org/ItemList">
                    {features.map((feature: any, index: number) => (
                        <div
                            key={index}
                            className="group flex gap-6 p-6 rounded-xl transition-all duration-300 hover:bg-white hover:shadow-lg"
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/ListItem"
                        >
                            <meta itemProp="position" content={String(index + 1)} />
                            {/* Icon/Number */}
                            <div className="flex-shrink-0">
                                {feature.icon ? (
                                    <div
                                        className="w-14 h-14 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                                        style={{ background: `${accentColor}20` }}
                                    >
                                        <img src={feature.icon} alt={feature.title} itemProp="image" className="w-7 h-7" />
                                    </div>
                                ) : (
                                    <div
                                        className="w-14 h-14 rounded-lg flex items-center justify-center font-bold text-2xl transition-transform group-hover:scale-110"
                                        style={{
                                            background: `${accentColor}20`,
                                            color: accentColor
                                        }}
                                    >
                                        {String(index + 1).padStart(2, '0')}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-3 transition-colors" style={{ color: textColor }} itemProp="name">
                                    {feature.title}
                                </h3>
                                <p className="text-base leading-relaxed opacity-70 mb-4" style={{ color: textColor }} itemProp="description">
                                    {feature.description}
                                </p>

                                {/* Tags/Labels */}
                                {feature.tags && feature.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {feature.tags.map((tag: string, tagIndex: number) => (
                                            <span
                                                key={tagIndex}
                                                className="px-3 py-1 rounded-full text-xs font-semibold"
                                                style={{
                                                    background: `${accentColor}15`,
                                                    color: accentColor
                                                }}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Optional Link */}
                                {feature.link && (
                                    <a
                                        href={feature.link}
                                        className="inline-flex items-center gap-2 font-semibold text-sm transition-all"
                                        style={{ color: accentColor }}
                                        itemProp="url"
                                    >
                                        {feature.linkText || '查看详情'}
                                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
