'use client';

import { SectionProps } from '@/lib/sections/registry';

// 团队介绍15：极简名录
export const Team15Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, groups = [] } = data;
    const { backgroundColor = '#ffffff', textColor = '#111827', accentColor = '#3b82f6', borderColor = '#e5e7eb' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b pb-8" style={{ borderColor }}>
                    <div>
                        {title && <h2 className="text-3xl font-bold mb-2" style={{ color: textColor }}>{title}</h2>}
                        {subtitle && <p className="text-lg opacity-60" style={{ color: textColor }}>{subtitle}</p>}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16" itemScope itemType="http://schema.org/ItemList">
                    {groups.map((group: any, index: number) => (
                        <div key={index} itemProp="itemListElement" itemScope itemType="http://schema.org/ItemList">
                            <h3 className="text-xl font-bold mb-6 pb-2 border-b-2 inline-block" style={{ color: textColor, borderColor: accentColor }} itemProp="name">
                                {group.groupName}
                            </h3>
                            <ul className="space-y-4">
                                {group.list && group.list.map((item: any, idx: number) => (
                                    <li
                                        key={idx}
                                        className="flex justify-between items-baseline group hover:bg-gray-50 p-2 rounded transition-colors -mx-2"
                                        itemProp="itemListElement"
                                        itemScope
                                        itemType="http://schema.org/Person"
                                    >
                                        <span className="font-medium" style={{ color: textColor }} itemProp="name">{item.name}</span>
                                        <span className="text-sm opacity-50" style={{ color: textColor }} itemProp="jobTitle">{item.title}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
