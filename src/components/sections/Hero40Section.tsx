'use client';

import { useState, useEffect } from 'react';
import { registerSection, SectionProps } from '@/lib/sections/registry';

// Hero40Section: 倒计时注册
export const Hero40Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const {
        title,
        subtitle,
        targetDate,
        btnText,
        btnLink,
        btnTarget,
        topBadge = 'UPCOMING EVENT',
        daysLabel = 'DAYS',
        hoursLabel = 'HOURS',
        minutesLabel = 'MINS',
        secondsLabel = 'SECS',
        isMainTitle = true
    } = data;

    const {
        backgroundColor = '#1e1b4b',
        textColor = '#ffffff',
        accentColor = '#f59e0b'
    } = style;

    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const TitleTag = isMainTitle ? 'h1' : 'h2';

    useEffect(() => {
        const target = new Date(targetDate || '2025-12-31').getTime();

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = target - now;

            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <section className="py-20 flex items-center justify-center min-h-[500px]" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">

                {/* Text Content */}
                <div className="text-center lg:text-left">
                    <span className="inline-block px-4 py-1 rounded-full text-sm font-bold tracking-wider mb-4 bg-white/10" style={{ color: accentColor }}>
                        {topBadge}
                    </span>
                    <TitleTag className="text-5xl md:text-6xl font-black mb-6 leading-tight" style={{ color: textColor }}>
                        {title}
                    </TitleTag>
                    <p className="text-xl opacity-80 mb-8" style={{ color: textColor }}>
                        {subtitle}
                    </p>
                    {btnText && (
                        <a
                            href={btnLink || '#'}
                            target={btnTarget || '_self'}
                            className="inline-block px-10 py-4 rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition-transform"
                            style={{ background: accentColor, color: '#000' }}
                        >
                            {btnText}
                        </a>
                    )}
                </div>

                {/* Countdown Timer */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: daysLabel, value: timeLeft.days },
                        { label: hoursLabel, value: timeLeft.hours },
                        { label: minutesLabel, value: timeLeft.minutes },
                        { label: secondsLabel, value: timeLeft.seconds }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                            <div className="text-4xl md:text-5xl font-mono font-bold mb-2" style={{ color: textColor }}>
                                {String(item.value).padStart(2, '0')}
                            </div>
                            <div className="text-xs font-bold tracking-widest opacity-60" style={{ color: textColor }}>
                                {item.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

registerSection({
    type: 'hero-40',
    name: '倒计时发布横幅',
    description: '用于产品发布、活动预热的倒计时展示组件',
    category: 'layout',
    component: Hero40Section,
    defaultData: {
        title: '新一代产品即将开启',
        subtitle: '加入我们的发布盛会，第一时间体验前所未有的科技创新。',
        targetDate: '2025-12-31',
        btnText: 'u7acbu5373u9884u7ea6',
        topBadge: '全球首发',
        isMainTitle: true
    },
    defaultStyle: {
        backgroundColor: '#1e1b4b',
        textColor: '#ffffff',
        accentColor: '#f59e0b'
    },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            isMainTitle: { type: 'boolean', label: '设为主标题 (H1)' },
            targetDate: { type: 'text', label: '目标日期 (YYYY-MM-DD)' },
            btnText: { type: 'text', label: '按钮文案' },
            btnLink: { type: 'link', label: '按钮链接' },
            btnTarget: { type: 'select', label: '跳转方式', options: [{ label: '当前窗口', value: '_self' }, { label: '新窗口', value: '_blank' }] },
            topBadge: { type: 'text', label: '顶部标签' }
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '强调色 (倒计时/按钮)' }
        }
    }
});
