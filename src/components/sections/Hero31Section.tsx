'use client';

import { useState, useEffect } from 'react';
import { registerSection, SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';

// Hero31Section: 沉浸式全屏轮播
export const Hero31Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const {
        slides = [], // { image, title, subtitle, btnText, btnLink }
        isMainTitle = true
    } = data;

    const {
        textColor = '#ffffff',
        accentColor = '#3b82f6',
        overlayOpacity = 0.4
    } = style;

    const TitleTag = isMainTitle ? 'h1' : 'h2';

    const defaultSlides = slides.length > 0 ? slides : [
        {
            image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            title: '探索无限可能',
            subtitle: '在广阔的自然中寻找灵感，开启属于你的冒险之旅。'
        },
        {
            image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            title: '宁静致远',
            subtitle: '远离城市的喧嚣，感受内心的平静与祥和。'
        },
        {
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            title: '巅峰视野',
            subtitle: '站在巨人的肩膀上，眺望未来的方向。'
        },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Auto-play logic
    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 6000);
        return () => clearInterval(timer);
    }, [currentSlide]);

    const nextSlide = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentSlide((prev) => (prev + 1) % defaultSlides.length);
        setTimeout(() => setIsAnimating(false), 800);
    };

    const prevSlide = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentSlide((prev) => (prev - 1 + defaultSlides.length) % defaultSlides.length);
        setTimeout(() => setIsAnimating(false), 800);
    };

    return (
        <section className="relative h-screen min-h-[600px] overflow-hidden bg-black">
            {defaultSlides.map((slide: any, index: number) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    {/* Background Image with slight zoom effect on active */}
                    <div
                        className={`absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms] ease-out ${currentSlide === index ? 'scale-110' : 'scale-100'
                            }`}
                        style={{ backgroundImage: `url(${slide.image})` }}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />

                    {/* Content */}
                    <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                        <div className="max-w-4xl">
                            <TitleTag
                                className={`text-5xl md:text-7xl font-bold mb-6 transform transition-all duration-1000 delay-300 ${currentSlide === index ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                    }`}
                                style={{ color: textColor }}
                            >
                                {slide.title}
                            </TitleTag>
                            <p
                                className={`text-xl md:text-2xl mb-10 transform transition-all duration-1000 delay-500 ${currentSlide === index ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                    }`}
                                style={{ color: textColor, opacity: 0.9 }}
                            >
                                {slide.subtitle}
                            </p>
                            {slide.btnText && (
                                <a
                                    href={slide.btnLink || '#'}
                                    target={slide.btnTarget || '_self'}
                                    className={`inline-block px-8 py-4 rounded-full font-bold transform transition-all duration-1000 delay-700 hover:scale-105 ${currentSlide === index ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                        }`}
                                    style={{ background: accentColor, color: '#fff' }}
                                >
                                    {slide.btnText}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>

            {/* Indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
                {defaultSlides.map((_: any, index: number) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'w-10 bg-white' : 'bg-white/50 hover:bg-white/80'
                            }`}
                        style={{ background: currentSlide === index ? accentColor : undefined }}
                    />
                ))}
            </div>
        </section>
    );
};

registerSection({
    type: 'hero-31',
    name: '全屏轮播横幅',
    description: '具有沉浸式体验、支持多图切换的全屏展示横幅',
    category: 'layout',
    component: Hero31Section,
    defaultData: {
        isMainTitle: true,
        slides: [
            {
                image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=2070&q=80',
                title: '探索无限可能',
                subtitle: '在广阔的自然中寻找灵感，开启属于你的冒险之旅。',
                btnText: '了解更多'
            }
        ]
    },
    defaultStyle: {
        textColor: '#ffffff',
        accentColor: '#3b82f6',
        overlayOpacity: 0.4
    },
    schema: {
        data: {
            isMainTitle: { type: 'boolean', label: '设为主标题 (H1)' },
            slides: {
                type: 'list',
                label: '幻灯片列表',
                itemSchema: {
                    image: { type: 'image', label: '背景图片' },
                    title: { type: 'text', label: '标题' },
                    subtitle: { type: 'text', label: '副标题' },
                    btnText: { type: 'text', label: '按钮文案' },
                    btnLink: { type: 'link', label: '按钮链接' },
                    btnTarget: { type: 'select', label: '跳转方式', options: [{ label: '当前窗口', value: '_self' }, { label: '新窗口', value: '_blank' }] }
                }
            } as any
        },
        style: {
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '强调色 (指示器/按钮)' },
            overlayOpacity: { type: 'number', label: '蒙层透明度 (0-1)' }
        }
    }
});
