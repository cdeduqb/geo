'use client';

import { SectionProps } from '@/lib/sections/registry';

// 样式1：经典卡片式评价
export const Testimonials01Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, testimonials = [] } = data;
    const { backgroundColor = '#f9fafb', textColor = '#111827', cardBackground = '#ffffff', accentColor = '#3b82f6' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && <h2 className="text-4xl font-bold text-center mb-4" style={{ color: textColor }}>{title}</h2>}
                {subtitle && <p className="text-xl text-center mb-12 opacity-70" style={{ color: textColor }}>{subtitle}</p>}

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((item: any, index: number) => (
                        <div
                            key={index}
                            className="rounded-2xl p-8 shadow-lg"
                            style={{ background: cardBackground }}
                            itemScope
                            itemType="http://schema.org/Review"
                        >
                            <div className="flex items-center gap-1 mb-4" itemProp="reviewRating" itemScope itemType="http://schema.org/Rating">
                                <meta itemProp="ratingValue" content={String(item.rating || 5)} />
                                <meta itemProp="bestRating" content="5" />
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg key={star} className="w-5 h-5" fill={star <= (item.rating || 5) ? accentColor : '#e5e7eb'} viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-lg mb-6 leading-relaxed" style={{ color: textColor }}>
                                "<span itemProp="reviewBody">{item.content}</span>"
                            </p>
                            <div className="flex items-center gap-4" itemProp="author" itemScope itemType="http://schema.org/Person">
                                {item.avatar && (
                                    <img
                                        src={item.avatar}
                                        alt={item.name}
                                        itemProp="image"
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                )}
                                <div>
                                    <div className="font-bold" style={{ color: textColor }} itemProp="name">{item.name}</div>
                                    <div className="text-sm opacity-60" style={{ color: textColor }} itemProp="jobTitle">{item.title}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
