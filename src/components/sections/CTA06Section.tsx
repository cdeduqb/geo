'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';

export const CTA06Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, primaryButtonText, primaryButtonUrl, secondaryButtonText, secondaryButtonUrl, stats = [] } = data;
    const { backgroundColor = '#ec4899', textColor = '#ffffff', accentColor = '#be185d' } = style;

    return (
        <section className="py-20" style={{ background: `linear-gradient(135deg, ${backgroundColor}, ${accentColor})` }}>
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: textColor }}>{title}</h2>
                    {subtitle && <p className="text-xl opacity-90 mb-8" style={{ color: textColor }}>{subtitle}</p>}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        <a href={primaryButtonUrl || '#'} className="px-10 py-4 rounded-full font-bold text-lg transition-all hover:scale-105" style={{ background: 'white', color: backgroundColor }}>
                            {primaryButtonText || t('common.getStarted')}
                        </a>
                        {secondaryButtonText && (
                            <a href={secondaryButtonUrl || '#'} className="px-10 py-4 rounded-full font-bold text-lg border-2 transition-all hover:bg-white/10" style={{ borderColor: 'white', color: 'white' }}>
                                {secondaryButtonText}
                            </a>
                        )}
                    </div>
                    {stats.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-12">
                            {stats.map((stat: any, i: number) => (
                                <div key={i} className="text-center">
                                    <div className="text-4xl font-black mb-1" style={{ color: textColor }}>{stat.value}</div>
                                    <div className="text-sm opacity-80" style={{ color: textColor }}>{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
