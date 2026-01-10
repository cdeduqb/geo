'use client';

import { registerSection, SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import Link from 'next/link';
import Copyright from '@/components/license/Copyright';

interface Footer01Data {
    logo?: string;
    logoText?: string;
    description?: string;
    navItems?: Array<{ label: string; link: string }>;
    socialLinks?: Array<{ platform: string; url: string; icon?: string }>;
}

interface Footer01Style {
    backgroundColor?: string;
    textColor?: string;
}

export const Footer01Section: React.FC<SectionProps> = ({ data = {}, style = {}, systemSettings }) => {
    const { t } = useTranslation();
    const {
        logo, logoText = systemSettings?.siteName || '全域魔力',
        description = '专业的全域内容管理与分发平台', navItems = [], socialLinks = [],
    } = data as Footer01Data;
    const { backgroundColor = '#ffffff', textColor = '#111827' } = style as Footer01Style;



    return (
        <footer className="w-full py-12 md:py-16" style={{ background: backgroundColor, color: textColor }}>
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center text-center space-y-8">
                    <Link href="/" className="inline-flex items-center gap-2">
                        {logo ? <img src={logo} alt={logoText} className="h-10 w-auto" /> : <span className="text-2xl font-bold">{logoText}</span>}
                    </Link>
                    {description && <p className="text-base opacity-70 max-w-md">{description}</p>}
                    {navItems && navItems.length > 0 && (
                        <nav className="flex flex-wrap justify-center gap-6">
                            {navItems.map((item, i) => <Link key={i} href={item.link || '#'} className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">{item.label}</Link>)}
                        </nav>
                    )}
                    {socialLinks && socialLinks.length > 0 && (
                        <div className="flex gap-4">
                            {socialLinks.map((social, i) => (
                                <a key={i} href={social.url || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center opacity-60 hover:opacity-100 hover:scale-110 transition-all" title={social.platform}>
                                    <span className="text-xs font-bold">{social.icon || social.platform.charAt(0).toUpperCase()}</span>
                                </a>
                            ))}
                        </div>
                    )}
                    <div className="pt-8 border-t border-current/10 opacity-60 w-full max-w-2xl">
                        <p className="text-xs">
                            <Copyright systemCopyright={systemSettings?.copyright} />
                            {systemSettings?.icp_number && (
                                <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="ml-4 hover:underline">
                                    {systemSettings.icp_number}
                                </a>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

registerSection({
    type: 'footer-01', name: '极简居中页脚', description: '简洁的居中对齐页脚布局', category: 'layout',
    component: Footer01Section,
    defaultData: {
        logoText: '全域魔力',
        description: '专业的全域内容管理与分发平台',
        navItems: [
            { label: '产品', link: '/products' },
            { label: '解决方案', link: '/solutions' },
            { label: '关于我们', link: '/about' },
            { label: '联系我们', link: '/contact' }
        ],
        socialLinks: [
            { platform: '微信', url: '#', icon: 'W' },
            { platform: '微博', url: '#', icon: 'W' },
            { platform: '抖音', url: '#', icon: 'D' }
        ]
    },
    defaultStyle: {},
    schema: {
        data: { logo: { type: 'image', label: 'Logo 图片' }, logoText: { type: 'text', label: 'Logo 文字' }, description: { type: 'text', label: '简短描述' }, navItems: { type: 'menu', label: '导航链接' }, socialLinks: { type: 'list', label: '社交媒体链接' } },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' }
        }
    }, variants: []
});
