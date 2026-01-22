import { registerSection, SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import Link from 'next/link';

export const HeroSection: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { getLocalePath } = useTranslation();
    const { title, subtitle, primaryButtonText, primaryButtonLink, primaryButtonTarget, secondaryButtonText, secondaryButtonLink, secondaryButtonTarget, backgroundImage, isMainTitle = true } = data;
    const { backgroundColor = 'bg-white', textColor = 'text-gray-900', padding = 'py-20', textAlign = 'text-center' } = style;

    const TitleTag = isMainTitle ? 'h1' : 'h2';

    return (
        <section
            className={`relative ${backgroundColor} ${padding} overflow-hidden`}
            style={backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        >
            {backgroundImage && <div className="absolute inset-0 bg-black/50" />} {/* Overlay for readability */}

            <div className={`container mx-auto px-4 relative z-10 ${textAlign}`} itemScope itemType="http://schema.org/CreativeWork">
                <TitleTag className={`text-4xl md:text-6xl font-bold mb-6 ${backgroundImage ? 'text-white' : textColor}`} itemProp="headline">
                    {title || 'Welcome to 企业官网'}
                </TitleTag>
                <p className={`text-xl md:text-2xl mb-8 max-w-2xl mx-auto ${backgroundImage ? 'text-gray-200' : 'text-gray-600'}`} itemProp="description">
                    {subtitle || 'Build stunning websites with AI-powered tools.'}
                </p>
                <div className={`flex gap-4 ${textAlign === 'text-center' ? 'justify-center' : ''}`}>
                    {primaryButtonText && (
                        <Link
                            href={getLocalePath(primaryButtonLink || '#')}
                            target={primaryButtonTarget || '_self'}
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            {primaryButtonText}
                        </Link>
                    )}
                    {secondaryButtonText && (
                        <Link
                            href={getLocalePath(secondaryButtonLink || '#')}
                            target={secondaryButtonTarget || '_self'}
                            className={`px-8 py-3 rounded-lg font-medium transition-colors ${backgroundImage
                                ? 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                }`}
                        >
                            {secondaryButtonText}
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
};

registerSection({
    type: 'hero-simple',
    name: '简约横幅',
    description: '包含标题、副标题和按钮的居中横幅',
    category: 'layout',
    component: HeroSection,
    defaultData: {
        title: '欢迎使用 企业官网',
        subtitle: '下一代 AI 驱动的内容管理系统',
        primaryButtonText: '开始使用',
        primaryButtonLink: '/admin',
        secondaryButtonText: '了解更多',
        secondaryButtonLink: '/about',
        isMainTitle: true,
    },
    defaultStyle: {
        backgroundColor: 'bg-white',
        padding: 'py-24',
        textAlign: 'text-center',
    },
    schema: {
        data: {
            title: { type: 'text', label: '标题' },
            subtitle: { type: 'text', label: '副标题' },
            isMainTitle: { type: 'boolean', label: '设为主标题 (H1)' },
            backgroundImage: { type: 'image', label: '背景图片' },
            primaryButtonText: { type: 'text', label: '主按钮文本' },
            primaryButtonLink: { type: 'link', label: '主按钮链接' },
            primaryButtonTarget: { type: 'select', label: '主按钮跳转', options: [{ label: '当前窗口', value: '_self' }, { label: '新窗口', value: '_blank' }] },
            secondaryButtonText: { type: 'text', label: '次按钮文本' },
            secondaryButtonLink: { type: 'link', label: '次按钮链接' },
            secondaryButtonTarget: { type: 'select', label: '次按钮跳转', options: [{ label: '当前窗口', value: '_self' }, { label: '新窗口', value: '_blank' }] },
        },
        style: {
            backgroundColor: {
                type: 'select',
                label: '背景颜色',
                options: [
                    { label: '白色', value: 'bg-white' },
                    { label: '浅灰', value: 'bg-gray-50' },
                    { label: '深蓝', value: 'bg-slate-900' },
                ]
            },
            textAlign: {
                type: 'select',
                label: '对齐方式',
                options: [
                    { label: '居中', value: 'text-center' },
                    { label: '左对齐', value: 'text-left' },
                ]
            },
            padding: {
                type: 'select',
                label: '垂直间距',
                options: [
                    { label: '小', value: 'py-12' },
                    { label: '中', value: 'py-24' },
                    { label: '大', value: 'py-32' },
                ]
            }
        }
    }
});
