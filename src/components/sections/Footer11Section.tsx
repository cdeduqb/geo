'use client';

import { registerSection, SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import Link from 'next/link';
import Copyright from '@/components/license/Copyright';

export const Footer11Section: React.FC<SectionProps> = ({ data = {}, style = {}, systemSettings }) => {
    const { t, getLocalePath } = useTranslation();
    const { logo, logoText = systemSettings?.siteName || '全域魔力',
        contactTitle = t('common.contactUs'), contactSubtitle = '我们随时为您服务',
        phone = '400-888-8888', email = 'contact@quanyuml.com', address = '北京市朝阳区建国路88号',
        workingHours = '周一至周五 9:00-18:00',
        navLinks = [], socialLinks = []
    } = data as any;
    const { backgroundColor = '#111827', textColor = '#f9fafb', accentColor = '#3b82f6' } = style as any;



    return (
        <footer className="w-full py-20" style={{ background: backgroundColor, color: textColor }}>
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">{contactTitle}</h2>
                    <p className="text-xl opacity-70 mb-12">{contactSubtitle}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {phone && (
                            <div className="p-6 rounded-xl bg-white/5 backdrop-blur">
                                <div className="text-3xl mb-3">📞</div>
                                <h3 className="font-bold mb-2">电话</h3>
                                <a href={`tel:${phone}`} className="opacity-70 hover:opacity-100" style={{ color: accentColor }}>{phone}</a>
                            </div>
                        )}
                        {email && (
                            <div className="p-6 rounded-xl bg-white/5 backdrop-blur">
                                <div className="text-3xl mb-3">✉️</div>
                                <h3 className="font-bold mb-2">邮箱</h3>
                                <a href={`mailto:${email}`} className="opacity-70 hover:opacity-100" style={{ color: accentColor }}>{email}</a>
                            </div>
                        )}
                        {address && (
                            <div className="p-6 rounded-xl bg-white/5 backdrop-blur">
                                <div className="text-3xl mb-3">📍</div>
                                <h3 className="font-bold mb-2">地址</h3>
                                <p className="opacity-70 text-sm">{address}</p>
                            </div>
                        )}
                    </div>
                    {workingHours && <p className="mt-8 text-sm opacity-50">⏰ {workingHours}</p>}
                </div>
                <div className="pt-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <Link href={getLocalePath('/')}>{logo ? <img src={logo} alt={logoText} className="h-10 w-auto" /> : <span className="text-xl font-bold">{logoText}</span>}</Link>
                        {navLinks && navLinks.length > 0 && (
                            <div className="flex flex-wrap gap-6">
                                {navLinks.map((item: any, i: number) => <Link key={i} href={getLocalePath(item.link || '#')} className="text-sm opacity-70 hover:opacity-100">{item.label}</Link>)}
                            </div>
                        )}
                        {socialLinks && socialLinks.length > 0 && (
                            <div className="flex gap-3">
                                {socialLinks.map((social: any, i: number) => (
                                    <a key={i} href={social.url || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                                        <span className="text-xs font-bold">{social.icon || social.platform.charAt(0)}</span>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="mt-8 text-center text-sm">
                        <Copyright className="" systemCopyright={systemSettings?.copyright} />
                        {systemSettings?.icp_number && <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="ml-4 hover:underline">{systemSettings?.icp_number}</a>}
                    </div>
                </div>
            </div>
        </footer>
    );
};

registerSection({
    type: 'footer-11', name: '大型联系页脚', description: '突出联系信息的页脚', category: 'layout',
    component: Footer11Section,
    defaultData: {
        logoText: '全域魔力',
        contactTitle: '联系我们',
        contactSubtitle: '我们随时为您服务',
        phone: '400-888-8888',
        email: 'contact@quanyuml.com',
        address: '北京市朝阳区建国路88号现代城大厦A座15层',
        workingHours: '周一至周五 9:00-18:00',
        navLinks: [
            { label: '产品介绍', link: '/products' },
            { label: '解决方案', link: '/solutions' },
            { label: '关于我们', link: '/about' }
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
            contactTitle: { type: 'text', label: '联系标题' }, contactSubtitle: { type: 'text', label: '联系副标题' },
            phone: { type: 'text', label: '电话' }, email: { type: 'text', label: '邮箱' }, address: { type: 'text', label: '地址' },
            workingHours: { type: 'text', label: '工作时间' },
            navLinks: { type: 'menu', label: '导航' }, socialLinks: { type: 'list', label: '社交链接' }
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字色' },
            accentColor: { type: 'color', label: '强调色' }
        }
    }, variants: []
});
