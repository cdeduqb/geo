'use client';

import { SectionProps } from '@/lib/sections/registry';

interface ServiceRegion {
    name: string;
    cities?: string[];
}

export const ServiceArea01Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, regions = [] } = data;
    const { backgroundColor = '#ffffff', textColor = '#111827', accentColor = '#3b82f6' } = style;

    const defaultRegions: ServiceRegion[] = regions.length > 0 ? regions : [
        { name: '华东地区', cities: ['上海', '南京', '杭州', '苏州', '宁波'] },
        { name: '华北地区', cities: ['北京', '天津', '石家庄', '济南', '青岛'] },
        { name: '华南地区', cities: ['广州', '深圳', '东莞', '佛山', '珠海'] },
        { name: '西南地区', cities: ['成都', '重庆', '昆明', '贵阳'] },
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
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {defaultRegions.map((region, index) => (
                        <div key={index} className="bg-gray-50 rounded-2xl p-6" itemScope itemType="http://schema.org/AdministrativeArea">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${accentColor}15`, color: accentColor }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <h3 className="font-bold text-lg" style={{ color: textColor }} itemProp="name">{region.name}</h3>
                            </div>
                            {region.cities && (
                                <div className="flex flex-wrap gap-2">
                                    {region.cities.map((city, idx) => (
                                        <span key={idx} className="px-3 py-1 rounded-full text-sm bg-white" style={{ color: textColor }}>{city}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
