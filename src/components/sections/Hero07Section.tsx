'use client';

import { registerSection, SectionProps } from '@/lib/sections/registry';
import Link from 'next/link';

export const Hero07Section: React.FC<SectionProps> = ({ data, style }) => {
    const {
        title = '创意无界，设计无限',
        subtitle = '全域魔力设计平台，为创意人士打造的最佳工具。',
        btnText = '查看作品集', btnLink = '#',
        illustration = 'https://cdni.iconscout.com/illustration/premium/thumb/3d-web-development-2974958-2477434.png',
        isMainTitle = true
    } = data;
    const { backgroundColor = '#fff1f2', textColor = '#881337', accentColor = '#e11d48' } = style as any;

    const TitleTag = isMainTitle ? 'h1' : 'h2';

    return (
        <section className="py-20 lg:py-32 overflow-hidden relative" style={{ background: backgroundColor }}>
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-pink-300 to-purple-300 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-yellow-300 to-orange-300 rounded-full blur-3xl opacity-30 translate-y-1/3 -translate-x-1/3"></div>

            <div className="container mx-auto px-4 relative z-10 flex flex-col-reverse lg:flex-row items-center justify-between" itemScope itemType="http://schema.org/CreativeWork">
                <div className="lg:w-1/2 text-center lg:text-left mt-10 lg:mt-0">
                    <TitleTag className="text-5xl lg:text-7xl font-black mb-8 leading-tight tracking-tight" style={{ color: textColor }} itemProp="headline">
                        {title}
                    </TitleTag>
                    <p className="text-xl lg:text-2xl mb-10 font-medium opacity-80" style={{ color: textColor }} itemProp="description">
                        {subtitle}
                    </p>
                    <a
                        href={btnLink || '#'}
                        className="inline-block px-10 py-5 rounded-full font-bold text-lg text-white shadow-xl transition-transform hover:-translate-y-1 hover:shadow-2xl"
                        style={{ background: accentColor }}
                    >
                        {btnText}
                    </a>
                </div>
                <div className="lg:w-1/2 flex justify-center lg:justify-end">
                    <img
                        src={illustration}
                        alt="3D Illustration"
                        className="w-full max-w-lg lg:max-w-xl animate-float drop-shadow-2xl"
                    />
                </div>
            </div>

            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
};

registerSection({
    type: 'hero-07',
    name: '创意图文横幅',
    description: '左侧文字，右侧 3D 插画，具有漂浮动画效果',
    category: 'layout',
    component: Hero07Section,
    defaultData: {
        title: '创意无界，设计无限',
        subtitle: '全域魔力设计平台，为创意人士打造的最佳工具。',
        btnText: '查看作品集',
        btnLink: '#',
        illustration: 'https://cdni.iconscout.com/illustration/premium/thumb/3d-web-development-2974958-2477434.png',
        isMainTitle: true
    },
    defaultStyle: {
        backgroundColor: '#fff1f2',
        textColor: '#881337',
        accentColor: '#e11d48'
    },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'text', label: '副标题' },
            isMainTitle: { type: 'boolean', label: '设为主标题 (H1)' },
            btnText: { type: 'text', label: '按钮文案' },
            btnLink: { type: 'link', label: '按钮链接' },
            illustration: { type: 'image', label: '插画图片' }
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '强调色 (按钮背景)' }
        }
    }
});
