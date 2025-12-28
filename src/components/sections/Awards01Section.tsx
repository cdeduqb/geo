'use client';

import { SectionProps } from '@/lib/sections/registry';

interface Award {
    title: string;
    year?: string;
    image?: string;
    issuer?: string;
}

export const Awards01Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, awards = [] } = data;
    const { backgroundColor = '#ffffff', textColor = '#111827', accentColor = '#f59e0b' } = style;

    const defaultAwards: Award[] = awards.length > 0 ? awards : [
        { title: '高新技术企业', year: '2023', issuer: '科技部', image: '' },
        { title: 'ISO9001认证', year: '2022', issuer: '国际标准化组织', image: '' },
        { title: '行业十佳品牌', year: '2023', issuer: '中国行业协会', image: '' },
        { title: '最佳服务奖', year: '2023', issuer: '消费者协会', image: '' },
    ];

    return (
        <section className="py-16" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {(title || subtitle) && (
                    <div className="text-center mb-12">
                        {title && <h2 className="text-3xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>}
                        {subtitle && <p className="text-lg opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                    </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6" itemScope itemType="http://schema.org/ItemList">
                    {defaultAwards.map((award, index) => (
                        <div
                            key={index}
                            className="text-center p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow"
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/ListItem"
                        >
                            <meta itemProp="position" content={String(index + 1)} />
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl" style={{ background: `${accentColor}15`, color: accentColor }}>
                                🏆
                            </div>
                            <h3 className="font-bold mb-1" style={{ color: textColor }} itemProp="name">{award.title}</h3>
                            {award.issuer && <p className="text-sm opacity-60 mb-1" style={{ color: textColor }}>{award.issuer}</p>}
                            {award.year && (
                                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${accentColor}15`, color: accentColor }}>
                                    {award.year}
                                </span>
                            )}
                            {award.image && <meta itemProp="image" content={award.image} />}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
