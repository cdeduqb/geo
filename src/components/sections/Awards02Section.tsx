'use client';

import { SectionProps } from '@/lib/sections/registry';

interface Award {
    title: string;
    year?: string;
    image?: string;
    description?: string;
}

export const Awards02Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, awards = [] } = data;
    const { backgroundColor = '#111827', textColor = '#f9fafb', accentColor = '#fbbf24' } = style;

    const defaultAwards: Award[] = awards.length > 0 ? awards : [
        { title: '国家级高新技术企业', year: '2023', description: '获得国家科技部认证' },
        { title: '中国驰名商标', year: '2022', description: '品牌价值获官方认可' },
        { title: 'AAA级信用企业', year: '2023', description: '企业信用评级最高等级' },
    ];

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && <h2 className="text-4xl font-bold mb-16 text-center" style={{ color: textColor }}>{title}</h2>}
                <div className="flex flex-wrap justify-center gap-8" itemScope itemType="http://schema.org/ItemList">
                    {defaultAwards.map((award, index) => (
                        <div
                            key={index}
                            className="relative group"
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/ListItem"
                        >
                            <meta itemProp="position" content={String(index + 1)} />
                            <div className="w-40 h-40 rounded-full border-4 flex items-center justify-center text-center p-4 transition-transform group-hover:scale-105" style={{ borderColor: accentColor }}>
                                <div>
                                    <span className="text-4xl block mb-2">🏅</span>
                                    <span className="text-sm font-bold" style={{ color: textColor }} itemProp="name">{award.title}</span>
                                </div>
                            </div>
                            {award.year && (
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold" style={{ background: accentColor, color: '#000' }}>
                                    {award.year}
                                </div>
                            )}
                            {award.description && <meta itemProp="description" content={award.description} />}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
