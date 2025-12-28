'use client';

import { registerSection, SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import Link from 'next/link';
import Copyright from '@/components/license/Copyright';

export const Footer10Section: React.FC<SectionProps> = ({ data = {}, style = {}, systemSettings }) => {
    const { t } = useTranslation();
    const { logo, logoText = systemSettings?.siteName || '全域魔力', description = '专业的全域内容管理与分发平台',
        navItems = [], socialLinks = [],
        waveColor1 = '#3b82f6', waveColor2 = '#60a5fa', enableAnimation = true
    } = data as any;
    const { backgroundColor = '#ffffff', textColor = '#111827' } = style as any;



    return (
        <footer className="w-full relative" style={{ background: backgroundColor }}>
            <div className="w-full overflow-hidden leading-none">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className={`w-full h-24 md:h-32 ${enableAnimation ? 'animate-pulse' : ''}`} style={{ transform: 'rotate(180deg)' }}>
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill={waveColor1} opacity="0.5" />
                    <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" fill={waveColor2} opacity="0.7" />
                </svg>
            </div>
            <div className="pb-16 px-4" style={{ background: backgroundColor, color: textColor }}>
                <div className="container mx-auto">
                    <div className="flex flex-col items-center text-center space-y-8 mb-12">
                        <Link href="/">{logo ? <img src={logo} alt={logoText} className="h-12 w-auto" /> : <span className="text-3xl font-bold">{logoText}</span>}</Link>
                        <p className="text-lg opacity-70 max-w-md">{description}</p>
                        {navItems && navItems.length > 0 && (
                            <nav className="flex flex-wrap justify-center gap-6">
                                {navItems.map((item: any, i: number) => <Link key={i} href={item.link || '#'} className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">{item.label}</Link>)}
                            </nav>
                        )}
                        {socialLinks && socialLinks.length > 0 && (
                            <div className="flex gap-4">
                                {socialLinks.map((social: any, i: number) => (
                                    <a key={i} href={social.url || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center opacity-60 hover:opacity-100 hover:scale-110 transition-all">
                                        <span className="text-xs font-bold">{social.icon || social.platform.charAt(0)}</span>
                                    </a>
                                ))}
                            </div>
                        )}
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
            </div>
        </footer>
    );
};

registerSection({
    type: 'footer-10', name: '创意波浪页脚', description: 'SVG波浪装饰页脚', category: 'layout',
    component: Footer10Section,
    defaultData: {
        logoText: '全域魔力',
        description: '专业的全域内容管理与分发平台',
        navItems: [
            { label: '产品', link: '/products' },
            { label: '解决方案', link: '/solutions' },
            { label: '定价', link: '/pricing' },
            { label: '关于我们', link: '/about' }
        ],
        socialLinks: [
            { platform: '微信', url: '#', icon: 'W' },
            { platform: '微博', url: '#', icon: 'W' },
            { platform: '抖音', url: '#', icon: 'D' }
        ],
        enableAnimation: true
    },
    defaultStyle: {},
    schema: {
        data: {
            logo: { type: 'image', label: 'Logo' }, logoText: { type: 'text', label: 'Logo文字' }, description: { type: 'text', label: '描述' },
            navItems: { type: 'menu', label: '导航' }, socialLinks: { type: 'list', label: '社交链接' },
            waveColor1: { type: 'color', label: '波浪颜色1' }, waveColor2: { type: 'color', label: '波浪颜色2' }, enableAnimation: { type: 'boolean', label: '启用动画' }
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字色' }
        }
    }, variants: []
});
