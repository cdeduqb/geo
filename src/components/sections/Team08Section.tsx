'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';

// 团队介绍08：瀑布流卡片
export const Team08Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, members = [] } = data;
    const { backgroundColor = '#f3f4f6', textColor = '#111827', cardBgColor = '#ffffff' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    {title && <h2 className="text-3xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>}
                    {subtitle && <p className="text-lg opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                </div>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8" itemScope itemType="http://schema.org/ItemList">
                    {members.map((member: any, index: number) => (
                        <div
                            key={index}
                            className="break-inside-avoid rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
                            style={{ background: cardBgColor }}
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/Person"
                        >
                            <img
                                src={member.image || `https://images.unsplash.com/photo-${1550000000000 + index}?auto=format&fit=crop&q=80&w=600`}
                                alt={member.name}
                                itemProp="image"
                                className="w-full h-auto object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-1" style={{ color: textColor }} itemProp="name">{member.name}</h3>
                                <div className="text-sm font-bold uppercase tracking-wide opacity-50 mb-4" style={{ color: textColor }} itemProp="jobTitle">{member.role}</div>
                                <p className="opacity-80 leading-relaxed text-sm" style={{ color: textColor }} itemProp="description">{member.bio}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
