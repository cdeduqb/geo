'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';

// 团队介绍09：悬停覆盖
export const Team09Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, members = [] } = data;
    const { backgroundColor = '#ffffff', textColor = '#111827', overlayColor = 'rgba(0,0,0,0.7)', overlayTextColor = '#ffffff' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    {title && <h2 className="text-3xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>}
                    {subtitle && <p className="text-lg opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" itemScope itemType="http://schema.org/ItemList">
                    {members.map((member: any, index: number) => (
                        <div
                            key={index}
                            className="group relative aspect-[3/4] overflow-hidden rounded-xl cursor-pointer"
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/Person"
                        >
                            <img
                                src={member.image || `https://images.unsplash.com/photo-${1530000000000 + index}?auto=format&fit=crop&q=80&w=600`}
                                alt={member.name}
                                itemProp="image"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div
                                className="absolute inset-0 flex flex-col justify-end p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                                style={{ background: overlayColor }}
                            >
                                <h3 className="text-xl font-bold mb-1" style={{ color: overlayTextColor }} itemProp="name">{member.name}</h3>
                                <p className="text-sm font-medium opacity-80 mb-3" style={{ color: overlayTextColor }} itemProp="jobTitle">{member.role}</p>
                                <p className="text-sm opacity-90 line-clamp-3" style={{ color: overlayTextColor }} itemProp="description">{member.bio}</p>
                            </div>
                            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent group-hover:opacity-0 transition-opacity duration-300">
                                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                                <p className="text-sm text-white/80">{member.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
