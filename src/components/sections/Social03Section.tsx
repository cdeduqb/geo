'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';

// 社交媒体03：横向滚动卡片
export const Social03Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, socials = [] } = data;
    const { backgroundColor = '#1f2937', textColor = '#ffffff', cardBackground = '#374151' } = style;

    return (
        <section className="py-16" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && <h2 className="text-3xl font-bold text-center mb-4" style={{ color: textColor }}>{title}</h2>}
                {subtitle && <p className="text-lg text-center mb-10 opacity-70" style={{ color: textColor }}>{subtitle}</p>}
            </div>

            <div className="overflow-x-auto pb-4">
                <div className="flex gap-4 px-4" style={{ width: 'max-content' }}>
                    {socials.map((social: any, index: number) => (
                        <a
                            key={index}
                            href={social.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-64 flex-shrink-0 rounded-xl p-5 hover:scale-105 transition-transform"
                            style={{ background: cardBackground }}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: social.color || '#3b82f6' }}>
                                    <span className="text-white text-lg font-bold">{social.name?.charAt(0)}</span>
                                </div>
                                <div>
                                    <div className="font-bold" style={{ color: textColor }}>{social.name}</div>
                                    <div className="text-sm opacity-60" style={{ color: textColor }}>{social.followers || '粉丝数'}</div>
                                </div>
                            </div>
                            <p className="text-sm opacity-80" style={{ color: textColor }}>{social.description}</p>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};
