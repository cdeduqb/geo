'use client';

import { SectionProps } from '@/lib/sections/registry';

// 样式4：横向滚动式评价
export const Testimonials04Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, testimonials = [] } = data;
    const { backgroundColor = '#f3f4f6', textColor = '#111827', cardBackground = '#ffffff', borderColor = '#e5e7eb' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && <h2 className="text-4xl font-bold text-center mb-4" style={{ color: textColor }}>{title}</h2>}
                {subtitle && <p className="text-xl text-center mb-12 opacity-70" style={{ color: textColor }}>{subtitle}</p>}
            </div>

            <div className="overflow-x-auto pb-4">
                <div className="flex gap-6 px-4" style={{ width: 'max-content' }} itemScope itemType="http://schema.org/ItemList">
                    {testimonials.map((item: any, index: number) => (
                        <div
                            key={index}
                            className="w-80 flex-shrink-0 rounded-xl p-6 border"
                            style={{ background: cardBackground, borderColor }}
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/Review"
                        >
                            <div className="flex items-center gap-3 mb-4" itemProp="author" itemScope itemType="http://schema.org/Person">
                                {item.avatar && (
                                    <img src={item.avatar} alt={item.name} itemProp="image" className="w-12 h-12 rounded-full object-cover" />
                                )}
                                <div>
                                    <div className="font-bold" style={{ color: textColor }} itemProp="name">{item.name}</div>
                                    <div className="text-sm opacity-60" style={{ color: textColor }} itemProp="jobTitle">{item.title}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 mb-3" itemProp="reviewRating" itemScope itemType="http://schema.org/Rating">
                                <meta itemProp="ratingValue" content={String(item.rating || 5)} />
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg key={star} className="w-4 h-4" fill={star <= (item.rating || 5) ? '#fbbf24' : '#e5e7eb'} viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="leading-relaxed" style={{ color: textColor }} itemProp="reviewBody">
                                "{item.content}"
                            </p>
                            {item.company && <div className="mt-4 text-sm font-medium opacity-70" style={{ color: textColor }}>{item.company}</div>}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
