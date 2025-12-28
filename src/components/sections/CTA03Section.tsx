'use client';

import { useTranslation } from '@/lib/i18n/use-translation';

export const CTA03Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, buttonText, buttonUrl, backgroundImage } = data;
    const { backgroundColor = '#10b981', textColor = '#ffffff', accentColor = '#059669' } = style;

    return (
        <section className="py-24 relative overflow-hidden" style={{ background: backgroundColor }}>
            {backgroundImage && <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />}
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: textColor }}>{title}</h2>
                    {subtitle && <p className="text-xl mb-10 opacity-90" style={{ color: textColor }}>{subtitle}</p>}
                    <a href={buttonUrl || '#'} className="inline-block px-12 py-5 rounded-full font-bold text-xl transition-all hover:scale-105 shadow-2xl" style={{ background: 'white', color: backgroundColor }}>
                        {buttonText || t('common.getStarted')}
                    </a>
                </div>
            </div>
        </section>
    );
};
