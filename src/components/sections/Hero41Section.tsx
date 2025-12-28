'use client';

import { useState, useEffect, useRef } from 'react';
import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';

// Hero41Section: 交互式多屏滑动
export const Hero41Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const {
        title,
        items = [] // { image, title, text, link }
    } = data;

    const {
        backgroundColor = '#000000',
        textColor = '#ffffff',
        accentColor = '#ffffff'
    } = style;

    const defaultItems = items;

    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // This component simulates a pinned scroll effect
    // As the user scrolls down, the images stack or slide
    // For simplicity in this demo without heavy libraries like GSAP ScrollTrigger,
    // we'll use a click/hover interaction or auto-play vertical slider that feels like scroll

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % defaultItems.length);
        }, 5000); // Auto change every 5s
        return () => clearInterval(interval);
    }, [defaultItems.length]);

    return (
        <section className="relative h-[800px] flex overflow-hidden" style={{ background: backgroundColor }}>
            {/* Left Content */}
            <div className="w-1/2 flex flex-col justify-center px-12 md:px-24 z-10 relative">
                <h2 className="text-xl font-bold mb-12 tracking-widest opacity-50 uppercase" style={{ color: textColor }}>
                    {title}
                </h2>
                <div className="space-y-12">
                    {defaultItems.map((item: any, index: number) => (
                        <div
                            key={index}
                            className={`transition-all duration-500 cursor-pointer ${activeIndex === index ? 'opacity-100 translate-x-0' : 'opacity-30 -translate-x-4'
                                }`}
                            onClick={() => setActiveIndex(index)}
                        >
                            <h3 className="text-4xl md:text-6xl font-bold mb-4" style={{ color: textColor }}>{item.title}</h3>
                            <p className="text-lg max-w-md opacity-80" style={{ color: textColor }}>{item.text}</p>
                            {activeIndex === index && (
                                <a href={item.link || '#'} className="inline-block mt-6 border-b-2 pb-1 transition-colors hover:opacity-70" style={{ borderColor: accentColor, color: accentColor }}>
                                    {item.linkText || 'Learn more'}
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Images */}
            <div className="absolute inset-y-0 right-0 w-3/5 h-full">
                {defaultItems.map((item: any, index: number) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-out ${activeIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                    >
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
                    </div>
                ))}
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-white/10 w-full z-20">
                <div
                    className="h-full transition-all duration-500 ease-linear"
                    style={{
                        width: `${((activeIndex + 1) / defaultItems.length) * 100}%`,
                        background: accentColor
                    }}
                ></div>
            </div>
        </section>
    );
};
