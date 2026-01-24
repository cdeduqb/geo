'use client';

import { registerSection, SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import Link from 'next/link';
import Copyright from '@/components/license/Copyright';

export const Footer07Section: React.FC<SectionProps> = ({ data = {}, style = {}, systemSettings }) => {
    const { t, getLocalePath } = useTranslation();
    const { logo, logoText = systemSettings?.siteName || '全域魔力', description = '让内容管理更智能·更高效·更有价值',
        features = [], navLinks = [], socialLinks = []
    } = data as any;
    const { backgroundColor = '#1e293b', textColor = '#ffffff' } = style as any;



    return (
        <footer className="w-full py-16 relative overflow-hidden" style={{ background: backgroundColor, color: textColor }}>
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
            </div>
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="md:col-span-2">
                        <Link href={getLocalePath('/')}>{logo ? <img src={logo} alt={logoText} className="h-12 w-auto mb-4" /> : <span className="text-3xl font-bold block mb-4">{logoText}</span>}</Link>
                        <p className="text-lg opacity-80 mb-6">{description}</p>
                        {features && features.length > 0 && (
                            <div className="grid grid-cols-2 gap-4">
                                {features.map((feature: any, i: number) => (
                                    <div key={i} className="flex items-start gap-2">
                                        <span className="text-2xl">{feature.icon || '✓'}</span>
                                        <span className="text-sm opacity-70">{feature.text}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">快速链接</h4>
                        <ul className="space-y-2">
                            {navLinks && navLinks.map((item: any, i: number) => <li key={i}><Link href={getLocalePath(item.link || '#')} className="text-sm opacity-70 hover:opacity-100">{item.label}</Link></li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">关注我们</h4>
                        <div className="flex gap-3">
                            {socialLinks && socialLinks.map((social: any, i: number) => (
                                <a key={i} href={social.url || '#'} className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                                    <span className="text-xs font-bold">{social.icon || social.platform.charAt(0)}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="pt-8 text-center text-sm">
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
    type: 'footer-07', name: '深色渐变页脚', description: '深色背景带渐变色特效', category: 'layout',
    component: Footer07Section,
    defaultData: {
        logoText: '全域魔力',
        description: '让内容管理更智能·更高效·更有价值',
        features: [
            { icon: '⚡', text: '极速响应' },
            { icon: '🔒', text: '安全可靠' },
            { icon: '🎯', text: '精准触达' },
            { icon: '💡', text: 'AI驱动' }
        ],
        navLinks: [
            { label: '产品功能', link: '/features' },
            { label: '价格方案', link: '/pricing' },
            { label: '帮助文档', link: '/docs' },
            { label: '联系支持', link: '/support' }
        ],
        socialLinks: [
            { platform: '微信', url: '#', icon: 'W' },
            { platform: '微博', url: '#', icon: 'W' },
            { platform: '抖音', url: '#', icon: 'D' },
            { platform: '小红书', url: '#', icon: 'X' }
        ]
    },
    defaultStyle: {},
    schema: {
        data: {
            logo: { type: 'image', label: 'Logo' }, logoText: { type: 'text', label: 'Logo文字' }, description: { type: 'text', label: '描述' },
            features: { type: 'list', label: '特色列表' }, navLinks: { type: 'menu', label: '导航链接' }, socialLinks: { type: 'list', label: '社交链接' }
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字色' },
        }
    }, variants: []
});
