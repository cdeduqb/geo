'use client';

import { useTranslation } from '@/lib/i18n/use-translation';


export const CTA02Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, primaryButtonText, primaryButtonUrl, secondaryButtonText, secondaryButtonUrl } = data;
    const { backgroundColor = '#0f172a', textColor = '#f1f5f9', accentColor = '#f59e0b' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>
                        {subtitle && <p className="text-lg opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                    </div>
                    <div className="flex gap-4 flex-shrink-0">
                        <a href={primaryButtonUrl || '#'} className="px-8 py-4 rounded-lg font-bold transition-all hover:opacity-90" style={{ background: accentColor, color: backgroundColor }}>
                            {primaryButtonText || '开始使用'}
                        </a>
                        {secondaryButtonText && (
                            <a href={secondaryButtonUrl || '#'} className="px-8 py-4 rounded-lg font-bold border-2 transition-all hover:bg-white/10" style={{ borderColor: textColor, color: textColor }}>
                                {secondaryButtonText}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
