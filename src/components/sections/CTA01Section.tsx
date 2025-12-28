'use client';

import { useTranslation } from '@/lib/i18n/use-translation';

export const CTA01Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, buttonText, buttonUrl } = data;
    const { backgroundColor = '#3b82f6', textColor = '#ffffff', accentColor = '#1d4ed8' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: textColor }}>{title}</h2>
                {subtitle && <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto" style={{ color: textColor }}>{subtitle}</p>}
                <a href={buttonUrl || '#'} className="inline-block px-10 py-4 rounded-full font-bold text-lg transition-all hover:scale-105" style={{ background: 'white', color: backgroundColor }}>
                    {buttonText || t('common.getStarted')}
                </a>
            </div>
        </section>
    );
};
