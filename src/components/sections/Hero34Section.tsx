import { registerSection, SectionProps } from '@/lib/sections/registry';

export const Hero34Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const {
        title,
        subtitle,
        primaryBtnText,
        primaryBtnLink,
        primaryBtnTarget,
        secondaryBtnText,
        secondaryBtnLink,
        secondaryBtnTarget,
        dashboardImage,
        isMainTitle = true
    } = data;

    const {
        backgroundColor = '#ffffff',
        textColor = '#111827',
        accentColor = '#2563eb'
    } = style;

    const TitleTag = isMainTitle ? 'h1' : 'h2';

    return (
        <section className="pt-32 pb-16 overflow-hidden" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4 text-center">
                <div className="max-w-4xl mx-auto mb-16">
                    <TitleTag
                        className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]"
                        style={{ color: textColor }}
                    >
                        {title}
                    </TitleTag>
                    <p
                        className="text-xl md:text-2xl opacity-70 mb-12 max-w-2xl mx-auto leading-relaxed"
                        style={{ color: textColor }}
                    >
                        {subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        {primaryBtnText && (
                            <a
                                href={primaryBtnLink || '#'}
                                target={primaryBtnTarget || '_self'}
                                className="px-8 py-4 rounded-lg font-bold text-white shadow-lg shadow-blue-500/30 hover:-translate-y-1 transition-transform w-full sm:w-auto inline-block text-center"
                                style={{ background: accentColor }}
                            >
                                {primaryBtnText}
                            </a>
                        )}
                        {secondaryBtnText && (
                            <a
                                href={secondaryBtnLink || '#'}
                                target={secondaryBtnTarget || '_self'}
                                className="px-8 py-4 rounded-lg font-bold border-2 hover:bg-gray-50 w-full sm:w-auto transition-colors inline-block text-center"
                                style={{ borderColor: `${textColor}20`, color: textColor }}
                            >
                                {secondaryBtnText}
                            </a>
                        )}
                    </div>
                </div>

                {/* Dashboard Image with Tilt/Parallax Mockup effect */}
                <div className="relative max-w-6xl mx-auto mt-12">
                    <div className="rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4 perspective-1000">
                        <img
                            src={dashboardImage}
                            alt="App Screenshot"
                            className="rounded-md shadow-2xl ring-1 ring-gray-900/10 w-full"
                        />
                    </div>
                    {/* Background Gradients */}
                    <div className="absolute -top-24 -left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute -bottom-24 -right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                </div>
            </div>
        </section>
    );
};

registerSection({
    type: 'hero-34',
    name: '极简SaaS主页',
    description: '经典的各种SaaS软件着陆页布局，大标题 + CTA + 演示图',
    category: 'layout',
    component: Hero34Section,
    defaultData: {
        title: '管理您的业务，从未如此简单',
        subtitle: '一款集成了CRM、项目管理和财务的一站式平台，帮助团队提升300%的工作效率。',
        primaryBtnText: '免费试用 14 天',
        secondaryBtnText: '预约演示',
        dashboardImage: 'https://tailwindui.com/img/component-images/project-app-screenshot.png',
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
            primaryBtnText: { type: 'text', label: '主按钮文案' },
            primaryBtnLink: { type: 'link', label: '主按钮链接' },
            primaryBtnTarget: { type: 'select', label: '主按钮跳转', options: [{ label: '当前窗口', value: '_self' }, { label: '新窗口', value: '_blank' }] },
            secondaryBtnText: { type: 'text', label: '次按钮文案' },
            secondaryBtnLink: { type: 'link', label: '次按钮链接' },
            secondaryBtnTarget: { type: 'select', label: '次按钮跳转', options: [{ label: '当前窗口', value: '_self' }, { label: '新窗口', value: '_blank' }] },
            dashboardImage: { type: 'image', label: '产品演示截图' }
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '主按钮颜色' }
        }
    }
});
