'use client';

import { SectionProps } from '@/lib/sections/registry';

// 地图05：交通指南地图
export const Map05Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, mapUrl, transportMethods = [] } = data;
    const { backgroundColor = '#ffffff', textColor = '#111827', accentColor = '#3b82f6' } = style;

    return (
        <section className="py-16" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && <h2 className="text-4xl font-bold text-center mb-4" style={{ color: textColor }}>{title}</h2>}
                {subtitle && <p className="text-lg text-center mb-12 opacity-70" style={{ color: textColor }}>{subtitle}</p>}

                <div className="grid md:grid-cols-2 gap-10">
                    {/* 地图 */}
                    <div className="rounded-2xl overflow-hidden h-96">
                        {mapUrl ? (
                            <iframe src={mapUrl} className="w-full h-full" frameBorder="0" allowFullScreen />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <span className="text-gray-400">请配置地图链接</span>
                            </div>
                        )}
                    </div>

                    {/* 交通方式 */}
                    <div className="space-y-6">
                        {transportMethods.map((method: any, index: number) => (
                            <div key={index} className="flex gap-4">
                                <div className="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center" style={{ background: accentColor }}>
                                    <span className="text-white text-xl">{method.icon || '🚗'}</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1" style={{ color: textColor }}>{method.name}</h4>
                                    <p className="opacity-70" style={{ color: textColor }}>{method.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
