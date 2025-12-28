'use client';

import { SectionProps, registerSection } from '@/lib/sections/registry';

export const Hero14Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const {
        title,
        subtitle,
        btnText,
        btnLink,
        btnTarget,
        isMainTitle = true
    } = data;

    const TitleTag = isMainTitle ? 'h1' : 'h2';

    const {
        backgroundColor = '#0f172a',
        textColor = '#ffffff',
        accentColor = '#3b82f6',
        secondaryColor = '#ec4899',
        tertiaryColor = '#8b5cf6'
    } = style;

    return (
        <section className="relative h-screen min-h-[600px] overflow-hidden flex items-center justify-center p-4">
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ background: backgroundColor }}>
                {/* Aurora Blobs */}
                <div
                    className="absolute top-0 left-1/4 w-[60vw] h-[60vw] rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob"
                    style={{ background: accentColor }}
                ></div>
                <div
                    className="absolute top-0 right-1/4 w-[60vw] h-[60vw] rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob animation-delay-2000"
                    style={{ background: secondaryColor }}
                ></div>
                <div
                    className="absolute -bottom-32 left-1/3 w-[70vw] h-[70vw] rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob animation-delay-4000"
                    style={{ background: tertiaryColor }}
                ></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto text-center" itemScope itemType="http://schema.org/CreativeWork">
                <TitleTag
                    className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70"
                    style={{ color: textColor }} // Fallback
                    itemProp="headline"
                >
                    {title || 'Aurora Horizons'}
                </TitleTag>
                <p
                    className="text-xl md:text-2xl mb-12 opacity-80 leading-relaxed font-light"
                    style={{ color: textColor }}
                    itemProp="description"
                >
                    {subtitle || 'Experience the fluidity of modern design. Where color meets motion in perfect harmony.'}
                </p>
                {btnText && (
                    <a
                        href={btnLink || '#'}
                        target={btnTarget || '_self'}
                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full backdrop-blur-md border border-white/20 hover:bg-white/10 transition-all hover:scale-105"
                        style={{ color: textColor }}
                    >
                        {btnText}
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </a>
                )}
            </div>

            <style jsx global>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 10s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </section>
    );
};

registerSection({
    type: 'hero-14',
    name: '极光背景横幅',
    description: '带有流动极光效果的高端展示横幅',
    category: 'layout',
    component: Hero14Section,
    defaultData: {
        title: '极光之境',
        subtitle: '体验现代设计的流动性。在这里，色彩与运动完美和谐。',
        btnText: '即刻体验',
        btnLink: '#',
        isMainTitle: true
    },
    defaultStyle: {
        backgroundColor: '#0f172a',
        textColor: '#ffffff',
        accentColor: '#3b82f6',
        secondaryColor: '#ec4899',
        tertiaryColor: '#8b5cf6'
    },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'text', label: '副标题' },
            isMainTitle: { type: 'boolean', label: '设为主标题 (H1)' },
            btnText: { type: 'text', label: '按钮文案' },
            btnLink: { type: 'link', label: '按钮链接' },
            btnTarget: { type: 'select', label: '跳转方式', options: [{ label: '当前窗口', value: '_self' }, { label: '新窗口', value: '_blank' }] }
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '极光色 A' },
            secondaryColor: { type: 'color', label: '极光色 B' },
            tertiaryColor: { type: 'color', label: '极光色 C' }
        }
    }
});
