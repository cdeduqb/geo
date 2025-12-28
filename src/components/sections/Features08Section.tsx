'use client';
import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';

export const Features08Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, features = [] } = data;
    const { backgroundColor = '#f9fafb', textColor = '#111827', accentColor = '#3b82f6' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: textColor }}>{title}</h2>
                    {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                </div>
                <div className="space-y-16" itemScope itemType="http://schema.org/ItemList">
                    {features.map((feature: any, index: number) => (
                        <div
                            key={index}
                            className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/ListItem"
                        >
                            <meta itemProp="position" content={String(index + 1)} />
                            <div className="md:w-1/2">
                                {feature.image && (
                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        itemProp="image"
                                        className="rounded-2xl shadow-xl w-full"
                                    />
                                )}
                            </div>
                            <div className="md:w-1/2">
                                <h3 className="text-3xl font-bold mb-4" style={{ color: textColor }} itemProp="name">{feature.title}</h3>
                                <p className="text-lg opacity-70 mb-6" style={{ color: textColor }} itemProp="description">{feature.description}</p>
                                {feature.link && (
                                    <a href={feature.link} className="inline-flex items-center gap-2 font-semibold" style={{ color: accentColor }} itemProp="url">
                                        {feature.linkText || t('common.learnMore')} →
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
