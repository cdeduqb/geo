'use client';

import { SectionProps } from '@/lib/sections/registry';

interface ServiceRegion {
    name: string;
    description?: string;
    icon?: string;
}

export const ServiceArea02Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, regions = [], showMap = false } = data;
    const { backgroundColor = '#f9fafb', textColor = '#111827', accentColor = '#22c55e' } = style;

    const defaultRegions: ServiceRegion[] = regions.length > 0 ? regions : [
        { name: '全国配送', description: '覆盖31个省市自治区，送货上门', icon: '🚚' },
        { name: '极速达', description: '北上广深同城当日达', icon: '⚡' },
        { name: '海外直邮', description: '支持港澳台及部分海外地区', icon: '🌏' },
    ];

    return (
        <section className="py-16" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {(title || subtitle) && (
                        <div className="text-center mb-12">
                            {title && <h2 className="text-3xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>}
                            {subtitle && <p className="text-lg opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                        </div>
                    )}
                    <div className="grid md:grid-cols-3 gap-8">
                        {defaultRegions.map((region, index) => (
                            <div key={index} className="text-center" itemScope itemType="http://schema.org/AdministrativeArea">
                                {region.icon && (
                                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl" style={{ background: `${accentColor}15` }}>
                                        {region.icon}
                                    </div>
                                )}
                                <h3 className="font-bold text-xl mb-2" style={{ color: textColor }} itemProp="name">{region.name}</h3>
                                {region.description && (
                                    <p className="opacity-70" style={{ color: textColor }}>{region.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
