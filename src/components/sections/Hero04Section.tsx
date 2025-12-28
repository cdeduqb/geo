import { registerSection, SectionProps } from '@/lib/sections/registry';
import Link from 'next/link';

export const Hero04Section: React.FC<SectionProps> = ({ data, style }) => {
    const {
        title = '沉浸式视觉体验',
        subtitle = '用震撼的视频背景讲述您的品牌故事，抓住用户的每一秒注意力。',
        videoUrl = 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4',
        btnText = '开始探索', btnLink = '#', btnTarget = '_self',
        isMainTitle = true
    } = data;
    const { overlayColor = '#000000', overlayOpacity = 0.6, textColor = '#ffffff', accentColor = '#3b82f6' } = style as any;

    const TitleTag = isMainTitle ? 'h1' : 'h2';

    return (
        <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src={videoUrl} type="video/mp4" />
                </video>
                <div
                    className="absolute inset-0"
                    style={{ background: overlayColor, opacity: overlayOpacity }}
                ></div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 relative z-10 text-center" itemScope itemType="http://schema.org/CreativeWork">
                <TitleTag className="text-5xl md:text-7xl font-bold mb-6 tracking-tight animate-fade-in-up" style={{ color: textColor }} itemProp="headline">
                    {title}
                </TitleTag>
                <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto font-light leading-relaxed animate-fade-in-up delay-100" style={{ color: textColor, opacity: 0.9 }} itemProp="description">
                    {subtitle}
                </p>
                <a
                    href={btnLink}
                    target={btnTarget}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 animate-fade-in-up delay-200"
                    style={{ background: accentColor, color: '#fff' }}
                >
                    <span>{btnText}</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </a>
            </div>
        </section>
    );
};

registerSection({
    type: 'hero-04',
    name: '视频背景横幅',
    description: '全屏视频背景横幅，适合品牌形象展示',
    category: 'layout',
    component: Hero04Section,
    defaultData: {
        title: '探索浩瀚宇宙',
        subtitle: '全域魔力带您领略前所未有的数字体验，开启即时渲染新纪元。',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4',
        btnText: '观看影片',
        btnLink: '#'
    },
    defaultStyle: {
        overlayColor: '#000000',
        overlayOpacity: 0.5,
        textColor: '#ffffff',
        accentColor: '#6366f1'
    },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'text', label: '副标题' },
            isMainTitle: { type: 'boolean', label: '设为主标题 (H1)' },
            videoUrl: { type: 'text', label: '视频地址(MP4)' },
            btnText: { type: 'text', label: '按钮文案' },
            btnLink: { type: 'link', label: '按钮链接' },
            btnTarget: { type: 'select', label: '跳转方式', options: [{ label: '当前窗口', value: '_self' }, { label: '新窗口', value: '_blank' }] }
        },
        style: {
            overlayColor: { type: 'color', label: '遮罩颜色' },
            overlayOpacity: { type: 'number', label: '遮罩透明度' } as any,
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '按钮颜色' }
        }
    }
});
