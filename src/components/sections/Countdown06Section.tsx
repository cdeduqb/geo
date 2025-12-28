'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import { useState, useEffect } from 'react';

export const Countdown06Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, targetDate, features = [] } = data;
    const { backgroundColor = '#ec4899', textColor = '#ffffff' } = style;
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
        <section className="py-20" style={{ background: `linear-gradient(135deg, ${backgroundColor}, ${backgroundColor}cc)` }}>
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        {title && <h2 className="text-4xl font-black mb-4" style={{ color: textColor }}>{title}</h2>}
                        {subtitle && <p className="text-lg opacity-90 mb-6" style={{ color: textColor }}>{subtitle}</p>}
                        {features.length > 0 && (
                            <ul className="space-y-3">
                                {features.map((f: string, i: number) => (
                                    <li key={i} className="flex items-center gap-3" style={{ color: textColor }}>
                                        <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">✓</span>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="bg-white/10 backdrop-blur rounded-3xl p-8">
                        <div className="text-center mb-6" style={{ color: textColor }}>倒计时</div>
                        <div className="grid grid-cols-4 gap-4">
                            {[{ v: timeLeft.days, l: '天' }, { v: timeLeft.hours, l: '时' }, { v: timeLeft.minutes, l: '分' }, { v: timeLeft.seconds, l: '秒' }].map((t, i) => (
                                <div key={i} className="text-center">
                                    <div className="bg-white rounded-xl p-4">
                                        <div className="text-3xl font-black" style={{ color: backgroundColor }}>{String(t.v).padStart(2, '0')}</div>
                                    </div>
                                    <div className="text-xs mt-2 opacity-80" style={{ color: textColor }}>{t.l}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
