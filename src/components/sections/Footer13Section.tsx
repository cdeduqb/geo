'use client';

import { registerSection, SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import Link from 'next/link';
import Copyright from '@/components/license/Copyright';

export const Footer13Section: React.FC<SectionProps> = ({ data = {}, style = {}, systemSettings }) => {
    const { t } = useTranslation();
    const { logo, logoText = systemSettings?.siteName || '全域魔力', description = '让内容管理更简单高效',
        navTitle = t('common.quickLinks'), navLinks = [], socialLinks = []
    } = data as any;
    const { backgroundColor = '#f9fafb', textColor = '#111827' } = style as any;



    return (
        <footer className="w-full py-12" style={{ background: backgroundColor, color: textColor }}>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
                    <div className="space-y-4">
                        <Link href="/">{logo ? <img src={logo} alt={logoText} className="h-10 w-auto mb-4" /> : <span className="text-2xl font-bold block mb-4">{logoText}</span>}</Link>
                        <p className="text-sm opacity-70 max-w-sm">{description}</p>
                        {socialLinks && socialLinks.length > 0 && (
                            <div className="flex gap-3 pt-4">
                                {socialLinks.map((social: any, i: number) => (
                                    <a key={i} href={social.url || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg border border-current opacity-60 hover:opacity-100 flex items-center justify-center transition-all">
                                        <span className="text-xs font-bold">{social.icon || social.platform.charAt(0)}</span>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                    <div>
                        <h4 className="font-bold text-sm mb-4 uppercase tracking-wider opacity-50">{navTitle}</h4>
                        <ul className="grid grid-cols-2 gap-3">
                            {navLinks && navLinks.map((item: any, i: number) => <li key={i}><Link href={item.link || '#'} className="text-sm opacity-70 hover:opacity-100 transition-opacity">{item.label}</Link></li>)}
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-current  text-center text-sm">
                    <Copyright className=""  systemCopyright={systemSettings?.copyright} />
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
    type: 'footer-13', name: '两列简约页脚', description: '简约的两列布局', category: 'layout',
    component: Footer13Section,
    defaultData: {
        logoText: '全域魔力',
        description: '让内容管理更简单高效',
        navTitle: '快速链接',
        navLinks: [
            { label: '产品功能', link: '/features' },
            { label: '解决方案', link: '/solutions' },
            { label: '客户案例', link: '/cases' },
            { label: '帮助中心', link: '/help' },
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
        data: {
            logo: { type: 'image', label: 'Logo' }, logoText: { type: 'text', label: 'Logo文字' }, description: { type: 'text', label: '描述' },
            navTitle: { type: 'text', label: '导航标题' }, navLinks: { type: 'menu', label: '导航链接' },
            socialLinks: { type: 'list', label: '社交链接' }
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字色' }
        }
    }, variants: []
});
