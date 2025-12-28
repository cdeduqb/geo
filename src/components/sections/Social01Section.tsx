'use client';

import { SectionProps } from '@/lib/sections/registry';

// 社交媒体01：经典图标网格
export const Social01Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, socials = [] } = data;
    const { backgroundColor = '#ffffff', textColor = '#111827', iconColor = '#3b82f6' } = style;

    const socialIcons: Record<string, string> = {
        wechat: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 14.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-7 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',
        weibo: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm5 8.5c0 2.5-2 4.5-4.5 4.5S8 13 8 10.5 10 6 12.5 6s4.5 2 4.5 4.5z',
        douyin: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3 15h-2v-5c0-1.1-.9-2-2-2s-2 .9-2 2v5H7v-5c0-2.76 2.24-5 5-5s5 2.24 5 5v5z',
        xiaohongshu: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15H9v-6h2v6zm4 0h-2v-6h2v6z',
        bilibili: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 13l-3-3 1.41-1.41L10 12.17l4.59-4.59L16 9l-6 6z',
        zhihu: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z',
    };

    return (
        <section className="py-16" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4 text-center">
                {title && <h2 className="text-3xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>}
                {subtitle && <p className="text-lg mb-10 opacity-70" style={{ color: textColor }}>{subtitle}</p>}

                <div className="flex flex-wrap justify-center gap-6">
                    {socials.map((social: any, index: number) => (
                        <a
                            key={index}
                            href={social.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: iconColor + '20' }}>
                                <svg className="w-8 h-8" fill={iconColor} viewBox="0 0 24 24">
                                    <path d={socialIcons[social.platform] || socialIcons.wechat} />
                                </svg>
                            </div>
                            <span className="text-sm font-medium" style={{ color: textColor }}>{social.name}</span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};
