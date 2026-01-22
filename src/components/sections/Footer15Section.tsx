'use client';

import { registerSection, SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import Link from 'next/link';
import Copyright from '@/components/license/Copyright';

export const Footer15Section: React.FC<SectionProps> = ({ data = {}, style = {}, systemSettings }) => {
    const { t, getLocalePath } = useTranslation();
    const { logo, logoText = systemSettings?.siteName || '全域魔力',
        cards = [], navLinks = [], socialLinks = []
    } = data as any;
    const { backgroundColor = '#f9fafb', textColor = '#111827', cardBgColor = '#ffffff' } = style as any;



    return (
        <footer className="w-full py-16" style={{ background: backgroundColor, color: textColor }}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <Link href={getLocalePath('/')}>{logo ? <img src={logo} alt={logoText} className="h-12 w-auto mx-auto mb-6" /> : <span className="text-3xl font-bold block mb-6">{logoText}</span>}</Link>
                </div>
                {cards && cards.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {cards.map((card: any, i: number) => (
                            <div key={i} className="p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow" style={{ background: cardBgColor }}>
                                <div className="text-3xl mb-4">{card.icon}</div>
                                <h3 className="font-bold text-lg mb-2">{card.title}</h3>
                                <p className="text-sm opacity-70 mb-4">{card.description}</p>
                                {card.link && (
                                    <Link href={getLocalePath(card.link)} className="text-sm font-bold hover:underline">
                                        {card.linkText || t('common.learnMore')} →
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-current opacity-10">
                    {navLinks && navLinks.length > 0 && (
                        <div className="flex flex-wrap gap-6">
                            {navLinks.map((item: any, i: number) => <Link key={i} href={getLocalePath(item.link || '#')} className="text-sm opacity-70 hover:opacity-100">{item.label}</Link>)}
                        </div>
                    )}
                    {socialLinks && socialLinks.length > 0 && (
                        <div className="flex gap-3">
                            {socialLinks.map((social: any, i: number) => (
                                <a key={i} href={social.url || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-current opacity-60 hover:opacity-100 flex items-center justify-center transition-all">
                                    <span className="text-xs font-bold">{social.icon || social.platform.charAt(0)}</span>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
                <div className="mt-6 text-center text-sm">
                    <Copyright className="" systemCopyright={systemSettings?.copyright} />
                    {systemSettings?.icp_number && (
                        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="ml-4 hover:underline">
                            {systemSettings?.icp_number}
                        </a>
                    )}
                </div>
            </div>
        </footer>
    );
};

registerSection({
    type: 'footer-15', name: '现代卡片页脚', description: '卡片式布局页脚', category: 'layout',
    component: Footer15Section,
    defaultData: {
        logoText: '全域魔力',
        cards: [
            { icon: '🚀', title: '快速上手', description: '5分钟即可开始使用', link: '/get-started', linkText: '开始使用' },
            { icon: '📚', title: '丰富文档', description: '详细的产品使用指南', link: '/docs', linkText: '查看文档' },
            { icon: '💬', title: '专业支持', description: '7x24小时技术支持', link: '/support', linkText: '联系我们' }
        ],
        navLinks: [
            { label: '隐私政策', link: '/privacy' },
            { label: '服务条款', link: '/terms' },
            { label: 'Cookie政策', link: '/cookies' }
        ],
        socialLinks: [
            { platform: '微信', url: '#', icon: 'W' },
            { platform: '微博', url: '#', icon: 'W' }
        ]
    },
    defaultStyle: {},
    schema: {
        data: {
            logo: { type: 'image', label: 'Logo' }, logoText: { type: 'text', label: 'Logo文字' },
            cards: { type: 'list', label: '卡片列表' },
            navLinks: { type: 'menu', label: '导航' }, socialLinks: { type: 'list', label: '社交链接' }
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字色' },
            cardBgColor: { type: 'color', label: '卡片背景色' }
        }
    }, variants: []
});
