'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';

// 社交媒体05：底部横条
export const Social05Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, socials = [] } = data;
    const { backgroundColor = '#0f172a', textColor = '#ffffff', hoverColor = '#3b82f6' } = style;

    return (
        <section className="py-8" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    {title && <span className="text-lg font-medium" style={{ color: textColor }}>{title}</span>}

                    <div className="flex items-center gap-6">
                        {socials.map((social: any, index: number) => (
                            <a
                                key={index}
                                href={social.url || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 group"
                            >
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                                    style={{ background: social.color || '#374151' }}
                                >
                                    <span className="text-white text-sm font-bold">{social.name?.charAt(0)}</span>
                                </div>
                                <span
                                    className="hidden md:inline text-sm transition-colors group-hover:underline"
                                    style={{ color: textColor }}
                                >
                                    {social.name}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
