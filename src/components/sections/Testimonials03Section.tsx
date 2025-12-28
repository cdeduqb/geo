'use client';

import { SectionProps } from '@/lib/sections/registry';

// 样式3：单个大评价轮播（无动画，静态展示第一个）
export const Testimonials03Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, testimonials = [] } = data;
    const { backgroundColor = '#ffffff', textColor = '#111827', accentColor = '#8b5cf6' } = style;

    const featured = testimonials[0] || {};

    return (
        <section className="py-24" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4 max-w-4xl text-center">
                {title && <h2 className="text-4xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>}
                {subtitle && <p className="text-xl mb-16 opacity-70" style={{ color: textColor }}>{subtitle}</p>}

                <div className="relative" itemScope itemType="http://schema.org/Review">
                    <svg className="w-20 h-20 mx-auto mb-8 opacity-20" fill={accentColor} viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>

                    <p className="text-2xl md:text-3xl leading-relaxed mb-10" style={{ color: textColor }} itemProp="reviewBody">
                        "{featured.content}"
                    </p>

                    <div className="flex items-center justify-center gap-4" itemProp="author" itemScope itemType="http://schema.org/Person">
                        {featured.avatar && <img src={featured.avatar} alt={featured.name} itemProp="image" className="w-16 h-16 rounded-full object-cover" />}
                        <div className="text-left">
                            <div className="font-bold text-lg" style={{ color: textColor }} itemProp="name">{featured.name}</div>
                            <div className="opacity-60" style={{ color: textColor }} itemProp="jobTitle">{featured.title}</div>
                            {featured.company && <div style={{ color: accentColor }}>{featured.company}</div>}
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-1 mt-6" itemProp="reviewRating" itemScope itemType="http://schema.org/Rating">
                        <meta itemProp="ratingValue" content={String(featured.rating || 5)} />
                        {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} className="w-6 h-6" fill={star <= (featured.rating || 5) ? accentColor : '#e5e7eb'} viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
