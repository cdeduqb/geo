'use client';

import { registerSection, SectionProps } from '@/lib/sections/registry';

// Hero36Section: SaaS 仪表盘
export const Hero36Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const {
        title,
        subtitle,
        dashboardImage,
        btnText,
        btnLink,
        btnTarget,
        isMainTitle = true
    } = data;

    const {
        backgroundColor = '#ffffff',
        textColor = '#111827',
        accentColor = '#2563eb'
    } = style;

    const TitleTag = isMainTitle ? 'h1' : 'h2';

    return (
        <section className="pt-24 pb-0 overflow-hidden" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4 text-center">
                <div className="max-w-4xl mx-auto mb-16">
                    <TitleTag className="text-5xl md:text-6xl font-black mb-8 leading-tight tracking-tight" style={{ color: textColor }}>
                        {title}
                    </TitleTag>
                    <p className="text-xl opacity-70 mb-10 max-w-2xl mx-auto" style={{ color: textColor }}>
                        {subtitle}
                    </p>
                    {btnText && (
                        <div className="flex justify-center gap-4">
                            <a
                                href={btnLink || '#'}
                                target={btnTarget || '_self'}
                                className="px-8 py-4 rounded-lg font-bold text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                                style={{ background: accentColor }}
                            >
                                {btnText}
                            </a>
                        </div>
                    )}
                </div>

                {/* Dashboard Mockup */}
                <div className="relative mx-auto max-w-6xl transform perspective-2000 rotateX-3">
                    <div className="relative bg-gray-900 rounded-t-2xl shadow-2xl p-2 border border-black/10 ring-1 ring-black/5">
                        {/* Browser Bar */}
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800/50 mb-1">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="ml-4 flex-1 bg-gray-800 h-6 rounded-md w-full max-w-xl mx-auto opacity-50"></div>
                        </div>
                        {/* Screen Content */}
                        <img
                            src={dashboardImage}
                            alt="Dashboard"
                            className="w-full rounded-lg shadow-inner block"
                        />

                        {/* Reflection Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none rounded-t-2xl"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

registerSection({
    type: 'hero-36',
    name: 'SaaS控制台展示',
    description: '具有 3D 透视效果的 SaaS 仪表盘展示横幅',
    category: 'layout',
    component: Hero36Section,
    defaultData: {
        title: '一站式数据分析平台',
        subtitle: '通过深入的见解和实时数据采集，让您的业务决策更加科学、高效。',
        dashboardImage: 'https://images.unsplash.com/photo-1551288049-bbda4833effb?auto=format&fit=crop&w=1200',
        btnText: 'u7acbu5373u7533u8bf7',
        isMainTitle: true
    },
    defaultStyle: {
        backgroundColor: '#ffffff',
        textColor: '#111827',
        accentColor: '#2563eb'
    },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            isMainTitle: { type: 'boolean', label: '设为主标题 (H1)' },
            dashboardImage: { type: 'image', label: '展示图' },
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
