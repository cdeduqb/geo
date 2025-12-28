'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import { useState, useEffect } from 'react';

export const Countdown05Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, targetDate, buttonText, buttonUrl, backgroundImage } = data;
    const { backgroundColor = '#8b5cf6', textColor = '#ffffff' } = style;
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
        <section className="py-24 relative overflow-hidden" style={{ background: backgroundColor }}>
            {backgroundImage && <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />}
            <div className="container mx-auto px-4 relative z-10 text-center">
                {title && <h2 className="text-4xl md:text-5xl font-black mb-12" style={{ color: textColor }}>{title}</h2>}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {[{ v: timeLeft.days, l: '天' }, { v: timeLeft.hours, l: '时' }, { v: timeLeft.minutes, l: '分' }, { v: timeLeft.seconds, l: '秒' }].map((t, i) => (
                        <div key={i} className="w-24 h-24 rounded-full bg-white/20 backdrop-blur flex flex-col items-center justify-center">
                            <div className="text-3xl font-black" style={{ color: textColor }}>{String(t.v).padStart(2, '0')}</div>
                            <div className="text-xs opacity-80" style={{ color: textColor }}>{t.l}</div>
                        </div>
                    ))}
                </div>
                {buttonText && <a href={buttonUrl || '#'} className="inline-block px-12 py-4 rounded-full font-bold text-lg backdrop-blur border-2 transition-all hover:bg-white/20" style={{ borderColor: 'white', color: textColor }}>{buttonText}</a>}
            </div>
        </section>
    );
};
