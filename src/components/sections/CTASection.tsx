import { registerSection, SectionProps } from '@/lib/sections/registry';
import { ArrowRight } from 'lucide-react';

export const CTASection: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, buttonText, buttonLink } = data;
    const { backgroundColor = 'bg-blue-600', textColor = 'text-white', padding = 'py-20' } = style;

    return (
        <section className={`${backgroundColor} ${padding}`}>
            <div className="container mx-auto px-4 text-center">
                <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${textColor}`}>
                    {title}
                </h2>
                {subtitle && (
                    <p className={`text-xl mb-10 max-w-2xl mx-auto opacity-90 ${textColor}`}>
                        {subtitle}
                    </p>
                )}
                <a
                    href={buttonLink || '#'}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg"
                >
                    {buttonText}
                    <ArrowRight className="w-5 h-5" />
                </a>
            </div>
        </section>
    );
};

registerSection({
    type: 'cta-simple',
    name: '号召性用语',
    description: '引导用户行动的横幅',
    category: 'marketing',
    component: CTASection,
    defaultData: {
        title: '准备好开始了吗？',
        subtitle: '立即注册，开启您的 AI 内容创作之旅。',
        buttonText: '免费注册',
        buttonLink: '/register'
    },
    defaultStyle: {
        backgroundColor: 'bg-blue-600',
        textColor: 'text-white',
        padding: 'py-24'
    },
    schema: {
        data: {
            title: { type: 'text', label: '标题' },
            subtitle: { type: 'text', label: '副标题' },
            buttonText: { type: 'text', label: '按钮文本' },
            buttonLink: { type: 'link', label: '按钮链接' }
        },
        style: {
            backgroundColor: {
                type: 'select',
                label: '背景颜色',
                options: [
                    { label: '品牌蓝', value: 'bg-blue-600' },
                    { label: '深色', value: 'bg-gray-900' },
                    { label: '紫色渐变', value: 'bg-gradient-to-r from-purple-600 to-blue-600' }
                ]
            },
            padding: {
                type: 'select',
                label: '垂直间距',
                options: [
                    { label: '中', value: 'py-16' },
                    { label: '大', value: 'py-24' }
                ]
            }
        }
    }
});
