'use client';

import { useState, useRef, useEffect } from 'react';
import { registerSection, SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';

// Hero21Section: 图片对比滑块
export const Hero21Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const {
        title,
        description,
        beforeImage,
        afterImage,
        beforeLabel,
        afterLabel,
        btnText,
        btnLink,
        btnTarget,
        isMainTitle = false
    } = data;

    const {
        backgroundColor = '#111827',
        textColor = '#ffffff',
        accentColor = '#3b82f6'
    } = style;

    const TitleTag = isMainTitle ? 'h1' : 'h2';

    const [sliderPosition, setSliderPosition] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = (x / rect.width) * 100;
        setSliderPosition(percent);
    };

    const handleMouseDown = () => { isDragging.current = true; };
    const handleMouseUp = () => { isDragging.current = false; };
    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging.current) handleMove(e.clientX);
    };
    const handleTouchMove = (e: React.TouchEvent) => {
        handleMove(e.touches[0].clientX);
    };

    // Global cleanup for drag
    useEffect(() => {
        const up = () => { isDragging.current = false; };
        window.addEventListener('mouseup', up);
        window.addEventListener('touchend', up);
        return () => {
            window.removeEventListener('mouseup', up);
            window.removeEventListener('touchend', up);
        };
    }, []);

    return (
        <section className="py-24 overflow-hidden" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <TitleTag className="text-4xl md:text-5xl font-bold mb-6" style={{ color: textColor }}>{title}</TitleTag>
                    <p className="text-xl max-w-2xl mx-auto opacity-80" style={{ color: textColor }}>{description}</p>
                </div>

                <div
                    ref={containerRef}
                    className="relative w-full max-w-5xl mx-auto aspect-video rounded-2xl overflow-hidden cursor-ew-resize shadow-2xl border-4 border-opacity-20"
                    style={{ borderColor: accentColor }}
                    onMouseMove={handleMouseMove}
                    onMouseDown={handleMouseDown}
                    onTouchMove={handleTouchMove}
                >
                    {/* After Image (Background) */}
                    <img
                        src={afterImage}
                        alt="After"
                        className="absolute inset-0 w-full h-full object-cover"
                        draggable="false"
                    />
                    <span className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm font-semibold backdrop-blur-sm z-10 selection-none pointer-events-none">
                        {afterLabel}
                    </span>

                    {/* Before Image (Foreground, clipped) */}
                    <div
                        className="absolute inset-0 overflow-hidden"
                        style={{ width: `${sliderPosition}%` }}
                    >
                        <img
                            src={beforeImage}
                            alt="Before"
                            className="absolute inset-0 w-full h-full max-w-none object-cover" // max-w-none is critical for clipping
                            style={{ width: containerRef.current?.offsetWidth || '100%' }} // Need to match container width
                            draggable="false"
                        />
                        <span className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm font-semibold backdrop-blur-sm z-10 selection-none pointer-events-none">
                            {beforeLabel}
                        </span>
                    </div>

                    {/* Slider Handler Line */}
                    <div
                        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                        style={{ left: `${sliderPosition}%` }}
                    >
                        <div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg transform active:scale-110 transition-transform"
                            style={{ color: accentColor }}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            {/* Button Area */}
            {btnText && (
                <div className="mt-12 text-center">
                    <a
                        href={btnLink || '#'}
                        target={btnTarget || '_self'}
                        className="inline-block px-10 py-4 rounded-full font-bold text-lg text-white shadow-lg transition-transform hover:scale-105"
                        style={{ background: accentColor }}
                    >
                        {btnText}
                    </a>
                </div>
            )}
        </section>
    );
};

registerSection({
    type: 'hero-21',
    name: '图片对比组件',
    description: '展示前后对比的滑块组件',
    category: 'layout',
    component: Hero21Section,
    defaultData: {
        title: '卓越的项目交付',
        description: '通过我们的专业服务，见证项目从原始概念到最终成品的蜕变。',
        beforeImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200',
        afterImage: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200',
        beforeLabel: '之前',
        afterLabel: '之后',
        btnText: '预约咨询',
        isMainTitle: false
    },
    defaultStyle: {
        backgroundColor: '#111827',
        textColor: '#ffffff',
        accentColor: '#3b82f6'
    },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            description: { type: 'textarea', label: '描述内容' },
            isMainTitle: { type: 'boolean', label: '设为主标题 (H1)' },
            beforeImage: { type: 'image', label: '对比前图片' },
            afterImage: { type: 'image', label: '对比后图片' },
            beforeLabel: { type: 'text', label: '对比前文案' },
            afterLabel: { type: 'text', label: '对比后文案' },
            btnText: { type: 'text', label: '按钮文案' },
            btnLink: { type: 'link', label: '按钮链接' },
            btnTarget: { type: 'select', label: '跳转方式', options: [{ label: '当前窗口', value: '_self' }, { label: '新窗口', value: '_blank' }] }
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '强调色/滑块色' }
        }
    }
});
