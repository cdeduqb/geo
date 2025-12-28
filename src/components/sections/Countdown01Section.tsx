'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import { useState, useEffect } from 'react';

export const Countdown01Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, targetDate, buttonText, buttonUrl } = data;
    const { backgroundColor = '#3b82f6', textColor = '#ffffff' } = style;
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const target = new Date(targetDate || Date.now() + 86400000 * 7).getTime();
            const diff = target - now;
            if (diff > 0) {
                setTimeLeft({
                    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((diff % (1000 * 60)) / 1000)
                });
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4 text-center">
                {title && <h2 className="text-4xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>}
                {subtitle && <p className="text-xl opacity-80 mb-10" style={{ color: textColor }}>{subtitle}</p>}
                <div className="flex justify-center gap-6 mb-10">
                    {[{ v: timeLeft.days, l: '天' }, { v: timeLeft.hours, l: '时' }, { v: timeLeft.minutes, l: '分' }, { v: timeLeft.seconds, l: '秒' }].map((t, i) => (
                        <div key={i} className="bg-white/20 rounded-2xl p-6 min-w-[100px]">
                            <div className="text-5xl font-black" style={{ color: textColor }}>{String(t.v).padStart(2, '0')}</div>
                            <div className="text-sm opacity-80" style={{ color: textColor }}>{t.l}</div>
                        </div>
                    ))}
                </div>
                {buttonText && <a href={buttonUrl || '#'} className="inline-block px-10 py-4 rounded-full font-bold text-lg" style={{ background: 'white', color: backgroundColor }}>{buttonText}</a>}
            </div>
        </section>
    );
};
