'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import { useEffect, useState } from 'react';

export const CountdownSection: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { headline, subheadline, targetDate } = data;
    const { backgroundColor = 'bg-blue-600', textColor = 'text-white', padding = 'py-20' } = style;

    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const TimeUnit = ({ value, label }: { value: number, label: string }) => (
        <div className="flex flex-col items-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 w-20 h-20 md:w-24 md:h-24 flex items-center justify-center mb-2 border border-white/20">
                <span className={`text-3xl md:text-4xl font-bold ${textColor}`}>{value.toString().padStart(2, '0')}</span>
            </div>
            <span className={`text-sm uppercase tracking-wider opacity-80 ${textColor}`}>{label}</span>
        </div>
    );

    return (
        <section className={`${backgroundColor} ${padding}`}>
            <div className="container mx-auto px-4 text-center">
                <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${textColor}`}>{headline}</h2>
                <p className={`text-xl mb-12 opacity-90 max-w-2xl mx-auto ${textColor}`}>{subheadline}</p>

                <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                    <TimeUnit value={timeLeft.days} label="天" />
                    <TimeUnit value={timeLeft.hours} label="时" />
                    <TimeUnit value={timeLeft.minutes} label="分" />
                    <TimeUnit value={timeLeft.seconds} label="秒" />
                </div>
            </div>
        </section>
    );
};

