'use client';

import { SectionProps } from '@/lib/sections/registry';

// 地图04：静态地图图片（带标注）
export const Map04Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, mapImage, markers = [] } = data;
    const { backgroundColor = '#1f2937', textColor = '#ffffff', accentColor = '#f59e0b' } = style;

    return (
        <section className="py-16" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && <h2 className="text-4xl font-bold text-center mb-4" style={{ color: textColor }}>{title}</h2>}
                {subtitle && <p className="text-lg text-center mb-12 opacity-70" style={{ color: textColor }}>{subtitle}</p>}

                <div className="relative max-w-4xl mx-auto">
                    {mapImage ? (
                        <img src={mapImage} alt="地图" className="w-full rounded-2xl" />
                    ) : (
                        <div className="w-full h-80 bg-gray-700 rounded-2xl flex items-center justify-center">
                            <span className="text-gray-400">请上传地图图片</span>
                        </div>
                    )}

                    {/* 标注点 */}
                    {markers.map((marker: any, index: number) => (
                        <div
                            key={index}
                            className="absolute group"
                            style={{ left: `${marker.x || 50}%`, top: `${marker.y || 50}%`, transform: 'translate(-50%, -100%)' }}
                        >
                            <div className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer animate-bounce" style={{ background: accentColor }}>
                                <span className="text-white text-sm font-bold">{index + 1}</span>
                            </div>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
                                <div className="bg-white rounded-lg p-3 shadow-lg whitespace-nowrap">
                                    <div className="font-bold text-gray-800">{marker.name}</div>
                                    <div className="text-sm text-gray-500">{marker.description}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
