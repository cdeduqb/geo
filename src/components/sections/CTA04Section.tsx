'use client';

import { useTranslation } from '@/lib/i18n/use-translation';


export const CTA04Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, buttonText, buttonUrl, features = [] } = data;
    const { backgroundColor = '#f9fafb', textColor = '#111827', accentColor = '#8b5cf6' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-12">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>
                            {subtitle && <p className="text-lg opacity-70 mb-6" style={{ color: textColor }}>{subtitle}</p>}
                            <ul className="space-y-3 mb-8">
                                {features.map((f: string, i: number) => (
                                    <li key={i} className="flex items-center gap-3" style={{ color: textColor }}>
                                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm" style={{ background: accentColor }}>✓</span>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="text-center">
                            <a href={buttonUrl || '#'} className="inline-block w-full py-5 rounded-2xl font-bold text-xl transition-all hover:opacity-90" style={{ background: accentColor, color: 'white' }}>
                                {buttonText || t('common.tryNow')}
                            </a>
                            <p className="mt-4 text-sm opacity-50" style={{ color: textColor }}>无需信用卡 · 免费试用14天</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
