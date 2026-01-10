'use client';
import { registerSection, SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import Link from 'next/link';
import Copyright from '@/components/license/Copyright';

export const Footer06Section: React.FC<SectionProps> = ({ data = {}, style = {}, systemSettings }) => {
    const { t } = useTranslation();
    const {
        logo, logoText = systemSettings?.siteName || '全域魔力',
        tagline = '连接无处不在',
        socialLinks = [], navLinks = []
    } = data as any;
    const { backgroundColor = '#ffffff', textColor = '#111827' } = style as any;



    return (
        <footer className="w-full py-16" style={{ background: backgroundColor, color: textColor }}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <Link href="/">{logo ? <img src={logo} alt={logoText} className="h-12 w-auto mx-auto mb-4" /> : <span className="text-3xl font-bold block mb-4">{logoText}</span>}</Link>
                    <p className="text-xl opacity-80 mb-8">{tagline}</p>
                    {socialLinks && socialLinks.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                            {socialLinks.map((social: any, i: number) => (
                                <a key={i} href={social.url || '#'} target="_blank" rel="noopener noreferrer"
                                    className="px-6 py-3 rounded-full font-bold text-white transition-transform hover:scale-110"
                                    style={{ background: social.color || '#3b82f6' }}>
                                    {social.icon && <span className="mr-2">{social.icon}</span>}
                                    {social.platform}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
                {navLinks && navLinks.length > 0 && (
                    <nav className="flex flex-wrap justify-center gap-6 mb-8">
                        {navLinks.map((item: any, i: number) => <Link key={i} href={item.link || '#'} className="text-sm opacity-70 hover:opacity-100">{item.label}</Link>)}
                    </nav>
                )}
                <div className="pt-8 border-t border-current/10 opacity-60 text-center text-sm">
                    <Copyright className=""  systemCopyright={systemSettings?.copyright} />
                    {systemSettings?.icp_number && <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="ml-4 hover:underline">{systemSettings?.icp_number}</a>}
                </div>
            </div>
        </footer>
    );
};

registerSection({
    type: 'footer-06', name: '社交媒体优先页脚', description: '突出社交媒体按钮', category: 'layout',
    component: Footer06Section,
    defaultData: {
        logoText: '全域魔力',
        tagline: '连接无处不在',
        socialLinks: [
            { platform: '微信公众号', url: '#', icon: '💬', color: '#07C160' },
            { platform: '新浪微博', url: '#', icon: '🐦', color: '#E6162D' },
            { platform: '抖音', url: '#', icon: '🎵', color: '#000000' },
            { platform: '小红书', url: '#', icon: '📕', color: '#FF2442' }
        ],
        navLinks: [
            { label: '隐私政策', link: '/privacy' },
            { label: '服务条款', link: '/terms' },
            { label: '帮助中心', link: '/help' }
        ]
    },
    defaultStyle: {},
    schema: {
        data: {
            logo: { type: 'image', label: 'Logo' }, logoText: { type: 'text', label: 'Logo文字' }, tagline: { type: 'text', label: '标语' },
            socialLinks: { type: 'list', label: '社交链接' }, navLinks: { type: 'menu', label: '导航' }
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字色' }
        }
    }, variants: []
});
