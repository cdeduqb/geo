'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import { useState, useEffect } from 'react';

export const Countdown03Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, targetDate, eventName } = data;
    const { backgroundColor = '#10b981', textColor = '#ffffff' } = style;
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
        <section className="py-24" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4 text-center">
                {eventName && <div className="text-lg font-medium opacity-80 mb-4" style={{ color: textColor }}>{eventName}</div>}
                {title && <h2 className="text-5xl md:text-6xl font-black mb-6" style={{ color: textColor }}>{title}</h2>}
                {subtitle && <p className="text-xl opacity-80 mb-12" style={{ color: textColor }}>{subtitle}</p>}
                <div className="flex justify-center gap-2 md:gap-4">
                    {[{ v: timeLeft.days, l: '天' }, { v: timeLeft.hours, l: '时' }, { v: timeLeft.minutes, l: '分' }, { v: timeLeft.seconds, l: '秒' }].map((t, i) => (
                        <div key={i} className="flex items-center">
                            <div className="bg-white rounded-xl p-4 md:p-6 min-w-[80px] md:min-w-[120px]">
                                <div className="text-4xl md:text-6xl font-black" style={{ color: backgroundColor }}>{String(t.v).padStart(2, '0')}</div>
                                <div className="text-sm opacity-70" style={{ color: backgroundColor }}>{t.l}</div>
                            </div>
                            {i < 3 && <span className="text-4xl font-bold mx-2" style={{ color: textColor }}>:</span>}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
