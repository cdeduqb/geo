'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import { useState, useEffect } from 'react';

export const Countdown02Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, targetDate, buttonText, buttonUrl } = data;
    const { backgroundColor = '#0f172a', textColor = '#f1f5f9', accentColor = '#f59e0b' } = style;
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const target = new Date(targetDate || Date.now() + 86400000 * 7).getTime();
            const diff = target - now;
            if (diff > 0) {
                setTimeLeft({ days: Math.floor(diff / (1000 * 60 * 60 * 24)), hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)), seconds: Math.floor((diff % (1000 * 60)) / 1000) });
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        {title && <h2 className="text-3xl font-bold mb-2" style={{ color: textColor }}>{title}</h2>}
                        {subtitle && <p className="opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                    </div>
                    <div className="flex gap-4">
                        {[{ v: timeLeft.days, l: '天' }, { v: timeLeft.hours, l: '时' }, { v: timeLeft.minutes, l: '分' }, { v: timeLeft.seconds, l: '秒' }].map((t, i) => (
                            <div key={i} className="text-center">
                                <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-black" style={{ background: accentColor, color: backgroundColor }}>{String(t.v).padStart(2, '0')}</div>
                                <div className="text-xs mt-1 opacity-70" style={{ color: textColor }}>{t.l}</div>
                            </div>
                        ))}
                    </div>
                    {buttonText && <a href={buttonUrl || '#'} className="px-8 py-3 rounded-lg font-bold whitespace-nowrap" style={{ background: accentColor, color: backgroundColor }}>{buttonText}</a>}
                </div>
            </div>
        </section>
    );
};
