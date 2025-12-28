'use client';

import { useState, useRef, MouseEvent } from 'react';
import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';

// Hero25Section: 悬浮透视卡片
export const Hero25Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const {
        title,
        subtitle,
        cardImage,
        btnText,
        btnLink,
        btnTarget,
        badgeText = '3D Ready',
        statLabel = 'Growth',
        statValue = '+124%'
    } = data;

    const {
        backgroundColor = '#ffffff',
        textColor = '#111827',
        accentColor = '#8b5cf6'
    } = style;

    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate rotation based on cursor position relative to center
        // Limit rotation to +/- 10 degrees for subtlety
        const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 10;
        const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 10;

        setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
    };

    return (
        <section
            ref={containerRef}
            className="py-32 perspective-1000 overflow-hidden"
            style={{ background: backgroundColor }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">

                {/* Text Content */}
                <div className="z-10">
                    <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight" style={{ color: textColor }}>
                        {title}
                    </h2>
                    <p className="text-xl mb-10 opacity-70 leading-relaxed" style={{ color: textColor }}>
                        {subtitle}
                    </p>
                    {btnText && (
                        <a
                            href={btnLink || '#'}
                            target={btnTarget || '_self'}
                            className="inline-block px-8 py-4 rounded-xl font-bold text-white shadow-lg transition-transform hover:-translate-y-1"
                            style={{ background: accentColor }}
                        >
                            {btnText}
                        </a>
                    )}
                </div>

                {/* 3D Card Area */}
                <div className="relative h-[500px] flex items-center justify-center">
                    {/* Background blob decoration */}
                    <div
                        className="absolute w-[500px] h-[500px] rounded-full filter blur-[80px] opacity-30 -z-10 animate-pulse"
                        style={{ background: accentColor }}
                    ></div>

                    {/* Floating Card */}
                    <div
                        className="relative w-full max-w-md aspect-[3/4] transition-transform duration-100 ease-out"
                        style={{
                            transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                            transformStyle: 'preserve-3d'
                        }}
                    >
                        <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                            <img
                                src={cardImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
                                alt="Perspective Card"
                                className="w-full h-full object-cover"
                            />
                            {/* Lighting/Sheen Effect */}
                            <div
                                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none"
                                style={{
                                    opacity: 0.5 + (rotation.y / 20) // Dynamic sheen opacity
                                }}
                            ></div>
                        </div>

                        {/* Floating Element 1 - Badge */}
                        <div
                            className="absolute -top-6 -right-6 px-6 py-3 rounded-full shadow-xl bg-white font-bold"
                            style={{
                                color: accentColor,
                                transform: 'translateZ(50px)'
                            }}
                        >
                            {badgeText}
                        </div>

                        {/* Floating Element 2 - Stats */}
                        <div
                            className="absolute -bottom-10 left-10 p-4 rounded-2xl shadow-xl bg-white/90 backdrop-blur"
                            style={{
                                transform: 'translateZ(80px)'
                            }}
                        >
                            <div className="text-xs uppercase text-gray-500 font-bold mb-1">{statLabel}</div>
                            <div className="text-2xl font-black text-gray-900">{statValue}</div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};
