'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useState } from 'react';

// 地图03：多点标注（切换不同地点）
export const Map03Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, locations = [] } = data;
    const { backgroundColor = '#ffffff', textColor = '#111827', accentColor = '#3b82f6' } = style;

    const [activeIndex, setActiveIndex] = useState(0);
    const activeLocation = locations[activeIndex] || {};

    return (
        <section className="py-16" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && <h2 className="text-4xl font-bold text-center mb-4" style={{ color: textColor }}>{title}</h2>}
                {subtitle && <p className="text-lg text-center mb-12 opacity-70" style={{ color: textColor }}>{subtitle}</p>}

                <div className="grid md:grid-cols-4 gap-6">
                    {/* 地点列表 */}
                    <div className="space-y-3">
                        {locations.map((loc: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                className={`w-full text-left p-4 rounded-xl transition-all ${activeIndex === index ? 'shadow-lg' : 'hover:bg-gray-100'}`}
                                style={{ background: activeIndex === index ? accentColor : 'transparent', color: activeIndex === index ? '#fff' : textColor }}
                            >
                                <div className="font-bold">{loc.name}</div>
                                <div className="text-sm opacity-70">{loc.address}</div>
                            </button>
                        ))}
                    </div>

                    {/* 地图 */}
                    <div className="md:col-span-3 rounded-2xl overflow-hidden h-96">
                        {activeLocation.mapUrl ? (
                            <iframe src={activeLocation.mapUrl} className="w-full h-full" frameBorder="0" allowFullScreen />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <span className="text-gray-400">请为该地点配置地图链接</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
