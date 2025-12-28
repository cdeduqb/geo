'use client';

import { SectionProps } from '@/lib/sections/registry';

interface Award {
    title: string;
    image: string;
}

export const Awards03Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, awards = [] } = data;
    const { backgroundColor = '#f9fafb', textColor = '#111827' } = style;

    const defaultAwards: Award[] = awards.length > 0 ? awards : [
        { title: 'ISO9001质量管理体系认证', image: '' },
        { title: 'ISO14001环境管理体系认证', image: '' },
        { title: 'OHSAS18001职业健康安全认证', image: '' },
        { title: '高新技术企业证书', image: '' },
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
                            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/ListItem"
                        >
                            <meta itemProp="position" content={String(index + 1)} />
                            <div className="aspect-[4/3] bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                                {award.image ? (
                                    <img src={award.image} alt={award.title} itemProp="image" className="w-full h-full object-contain" />
                                ) : (
                                    <span className="text-4xl opacity-30">📜</span>
                                )}
                            </div>
                            <h3 className="text-sm font-medium text-center" style={{ color: textColor }} itemProp="name">{award.title}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
