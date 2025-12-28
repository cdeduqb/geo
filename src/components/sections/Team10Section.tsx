'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';

// 团队介绍10：紧凑目录
export const Team10Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, members = [] } = data;
    const { backgroundColor = '#ffffff', textColor = '#111827', itemBgColor = '#f9fafb' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
                    <div>
                        {title && <h2 className="text-3xl font-bold mb-2" style={{ color: textColor }}>{title}</h2>}
                        {subtitle && <p className="text-lg opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" itemScope itemType="http://schema.org/ItemList">
                    {members.map((member: any, index: number) => (
                        <div
                            key={index}
                            className="flex items-center p-4 rounded-lg transition-colors hover:shadow-md"
                            style={{ background: itemBgColor }}
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/Person"
                        >
                            <div className="flex-shrink-0 mr-4">
                                <img
                                    src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}&background=random`}
                                    alt={member.name}
                                    itemProp="image"
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold truncate" style={{ color: textColor }} itemProp="name">{member.name}</h3>
                                <p className="text-xs font-medium opacity-60 truncate mb-1" style={{ color: textColor }} itemProp="jobTitle">{member.role}</p>
                                {member.bio && <p className="text-xs opacity-50 truncate" style={{ color: textColor }} itemProp="description">{member.bio}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
