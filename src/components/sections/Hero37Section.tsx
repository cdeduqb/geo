'use client';

import { useState } from 'react';
import { registerSection, SectionProps } from '@/lib/sections/registry';

// Hero37Section: 粗犷排版
export const Hero37Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const {
        title,
        revealImage,
        btnText,
        btnLink,
        btnTarget,
        isMainTitle = true
    } = data;

    const {
        backgroundColor = '#ef4444',
        textColor = '#ffffff',
        accentColor = '#000000'
    } = style;

    const [isHovered, setIsHovered] = useState(false);
    const TitleTag = isMainTitle ? 'h1' : 'h2';

    return (
        <section
            className="group relative cursor-crosshair overflow-hidden"
            style={{ background: backgroundColor }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="container mx-auto px-4 py-32 md:py-48 relative z-20">
                <TitleTag
                    className="text-[15vw] leading-[0.85] font-black uppercase mix-blend-difference break-words"
                    style={{ color: textColor }}
                >
                    {title || 'IMPACT'}
                </TitleTag>

                <div className="mt-12 flex justify-end">
                    {btnText && (
                        <a
                            href={btnLink || '#'}
                            target={btnTarget || '_self'}
                            className="inline-block px-12 py-6 bg-black text-white text-2xl font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
                            style={{ background: accentColor }}
                        >
                            {btnText}
                        </a>
                    )}
                </div>
            </div>

            {/* Reveal Image on Hover */}
            <div
                className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-300 ease-in-out ${isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
            >
                <img
                    src={revealImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'}
                    alt="Reveal"
                    className="w-full h-full object-cover grayscale"
                />
            </div>

            {/* Texture Overlay */}
            <div className="absolute inset-0 z-10 opacity-20 pointer-events-none text-[200px] leading-none select-none overflow-hidden" style={{ color: 'black' }}>
                ////////////////////////////////////////////////////////////////////////////////
            </div>
        </section>
    );
};

registerSection({
    type: 'hero-37',
    name: '极简视觉冲击',
    description: '通过巨大文字、强烈对比和悬停悬念展示品牌冲击力',
    category: 'layout',
    component: Hero37Section,
    defaultData: {
        title: 'IMPACT',
        revealImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=2000&q=80',
        btnText: 'GET STARTED',
        isMainTitle: true
    },
    defaultStyle: {
        backgroundColor: '#ef4444',
        textColor: '#ffffff',
        accentColor: '#000000'
    },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            isMainTitle: { type: 'boolean', label: '设为主标题 (H1)' },
            revealImage: { type: 'image', label: '悬停显示图' },
            btnText: { type: 'text', label: '按钮文案' },
            btnLink: { type: 'link', label: '按钮链接' },
            btnTarget: { type: 'select', label: '跳转方式', options: [{ label: '当前窗口', value: '_self' }, { label: '新窗口', value: '_blank' }] }
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '按钮背景' }
        }
    }
});
