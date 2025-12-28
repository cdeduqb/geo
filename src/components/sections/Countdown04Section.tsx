'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import { useState, useEffect } from 'react';

export const Countdown04Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, targetDate, discount, originalPrice, salePrice } = data;
    const { backgroundColor = '#fef2f2', textColor = '#111827', accentColor = '#ef4444' } = style;
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const target = new Date(targetDate || Date.now() + 86400000).getTime();
            const diff = target - now;
            if (diff > 0) {
                setTimeLeft({ days: Math.floor(diff / (1000 * 60 * 60 * 24)), hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)), seconds: Math.floor((diff % (1000 * 60)) / 1000) });
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <section className="py-16" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            {discount && <div className="inline-block px-4 py-1 rounded-full text-white font-bold mb-4" style={{ background: accentColor }}>{discount}</div>}
                            {title && <h2 className="text-3xl font-bold mb-2" style={{ color: textColor }}>{title}</h2>}
                            {subtitle && <p className="opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                            <div className="mt-4 flex items-baseline gap-4">
                                {originalPrice && <span className="text-xl line-through opacity-50" style={{ color: textColor }}>{originalPrice}</span>}
                                {salePrice && <span className="text-4xl font-black" style={{ color: accentColor }}>{salePrice}</span>}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {[{ v: timeLeft.hours, l: '时' }, { v: timeLeft.minutes, l: '分' }, { v: timeLeft.seconds, l: '秒' }].map((t, i) => (
                                <div key={i} className="w-16 h-20 rounded-xl flex flex-col items-center justify-center" style={{ background: accentColor }}>
                                    <div className="text-2xl font-black text-white">{String(t.v).padStart(2, '0')}</div>
                                    <div className="text-xs text-white/80">{t.l}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
