'use client';

import { SectionProps } from '@/lib/sections/registry';

// 样式2：大引号式评价
export const Testimonials02Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, testimonials = [] } = data;
    const { backgroundColor = '#1f2937', textColor = '#ffffff', quoteColor = '#3b82f6' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && <h2 className="text-4xl font-bold text-center mb-4" style={{ color: textColor }}>{title}</h2>}
                {subtitle && <p className="text-xl text-center mb-12 opacity-70" style={{ color: textColor }}>{subtitle}</p>}

                <div className="grid md:grid-cols-2 gap-12" itemScope itemType="http://schema.org/ItemList">
                    {testimonials.map((item: any, index: number) => (
                        <div
                            key={index}
                            className="relative pl-8"
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/Review"
                        >
                            <svg className="absolute left-0 top-0 w-16 h-16 -translate-x-4 -translate-y-4 opacity-30" fill={quoteColor} viewBox="0 0 24 24">
                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                            </svg>
                            <p className="text-xl leading-relaxed mb-6 italic" style={{ color: textColor }} itemProp="reviewBody">
                                "{item.content}"
                            </p>
                            <div className="flex items-center gap-4" itemProp="author" itemScope itemType="http://schema.org/Person">
                                {item.avatar && (
                                    <img
                                        src={item.avatar}
                                        alt={item.name}
                                        itemProp="image"
                                        className="w-14 h-14 rounded-full object-cover border-2"
                                        style={{ borderColor: quoteColor }}
                                    />
                                )}
                                <div>
                                    <div className="font-bold text-lg" style={{ color: textColor }} itemProp="name">{item.name}</div>
                                    <div className="text-sm opacity-60" style={{ color: textColor }} itemProp="jobTitle">{item.title}</div>
                                    {item.company && <div className="text-sm" style={{ color: quoteColor }}>{item.company}</div>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
