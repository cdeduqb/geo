'use client';

import { SectionProps } from '@/lib/sections/registry';

// 社交媒体02：卡片带二维码
export const Social02Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, socials = [] } = data;
    const { backgroundColor = '#f3f4f6', textColor = '#111827', cardBackground = '#ffffff' } = style;

    return (
        <section className="py-16" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && <h2 className="text-3xl font-bold text-center mb-4" style={{ color: textColor }}>{title}</h2>}
                {subtitle && <p className="text-lg text-center mb-10 opacity-70" style={{ color: textColor }}>{subtitle}</p>}

                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {socials.map((social: any, index: number) => (
                        <div key={index} className="rounded-2xl p-6 text-center shadow-lg" style={{ background: cardBackground }}>
                            <div className="text-xl font-bold mb-4" style={{ color: social.color || '#333' }}>{social.name}</div>
                            {social.qrcode ? (
                                <img src={social.qrcode} alt={social.name} className="w-32 h-32 mx-auto mb-4 rounded-lg" />
                            ) : (
                                <div className="w-32 h-32 mx-auto mb-4 rounded-lg bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-400">二维码</span>
                                </div>
                            )}
                            <p className="text-sm opacity-70" style={{ color: textColor }}>{social.description || '扫码关注'}</p>
                            {social.id && <p className="text-sm font-medium mt-2" style={{ color: textColor }}>ID: {social.id}</p>}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
