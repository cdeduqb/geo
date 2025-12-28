'use client';

import { SectionProps } from '@/lib/sections/registry';

// 样式5：瀑布流式评价（三列不等高）
export const Testimonials05Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, testimonials = [] } = data;
    const { backgroundColor = '#0f172a', textColor = '#f8fafc', cardBackground = '#1e293b', accentColor = '#38bdf8' } = style;

    // 将testimonials分成三列
    const columns: any[][] = [[], [], []];
    testimonials.forEach((item: any, index: number) => {
        columns[index % 3].push(item);
    });

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && <h2 className="text-4xl font-bold text-center mb-4" style={{ color: textColor }}>{title}</h2>}
                {subtitle && <p className="text-xl text-center mb-12 opacity-70" style={{ color: textColor }}>{subtitle}</p>}

                <div className="grid md:grid-cols-3 gap-6" itemScope itemType="http://schema.org/ItemList">
                    {columns.map((column, colIndex) => (
                        <div key={colIndex} className="space-y-6">
                            {column.map((item: any, index: number) => (
                                <div
                                    key={index}
                                    className="rounded-2xl p-6"
                                    style={{ background: cardBackground }}
                                    itemProp="itemListElement"
                                    itemScope
                                    itemType="http://schema.org/Review"
                                >
                                    <p className="leading-relaxed mb-6" style={{ color: textColor }} itemProp="reviewBody">
                                        "{item.content}"
                                    </p>
                                    <div className="flex items-center gap-4" itemProp="author" itemScope itemType="http://schema.org/Person">
                                        {item.avatar && (
                                            <img src={item.avatar} alt={item.name} itemProp="image" className="w-10 h-10 rounded-full object-cover" />
                                        )}
                                        <div>
                                            <div className="font-medium" style={{ color: textColor }} itemProp="name">{item.name}</div>
                                            <div className="text-sm opacity-60" style={{ color: textColor }} itemProp="jobTitle">{item.title}</div>
                                        </div>
                                    </div>
                                    {item.company && (
                                        <div className="mt-4 pt-4 border-t border-white/10 text-sm" style={{ color: accentColor }}>{item.company}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
