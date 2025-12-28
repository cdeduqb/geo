'use client';

import { SectionProps } from '@/lib/sections/registry';

// 地图01：全宽嵌入地图
export const Map01Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, mapUrl, height = '400' } = data;
    const { backgroundColor = '#ffffff', textColor = '#111827' } = style;

    return (
        <section style={{ background: backgroundColor }}>
            {title && (
                <div className="container mx-auto px-4 py-8">
                    <h2 className="text-3xl font-bold text-center" style={{ color: textColor }}>{title}</h2>
                </div>
            )}
            <div style={{ height: `${height}px` }}>
                {mapUrl ? (
                    <iframe src={mapUrl} className="w-full h-full" frameBorder="0" allowFullScreen />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">请配置地图嵌入链接（高德/百度/腾讯地图）</span>
                    </div>
                )}
            </div>
        </section>
    );
};
