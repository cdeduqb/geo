'use client';
import { registerSection, SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import Link from 'next/link';
import Copyright from '@/components/license/Copyright';

export const Footer05Section: React.FC<SectionProps> = ({ data = {}, style = {}, systemSettings }) => {
    const { t } = useTranslation();
    const {
        logo, logoText = systemSettings?.siteName || '全域魔力',
        description = '值得信赖的合作伙伴',
        partners = [], navLinks = []
    } = data as any;
    const { backgroundColor = '#ffffff', textColor = '#111827' } = style as any;



    return (
        <footer className="w-full py-16" style={{ background: backgroundColor, color: textColor }}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <Link href="/">{logo ? <img src={logo} alt={logoText} className="h-12 w-auto mx-auto mb-4" /> : <span className="text-3xl font-bold block mb-4">{logoText}</span>}</Link>
                    <p className="text-lg opacity-70">{description}</p>
                </div>
                {partners && partners.length > 0 && (
                    <div className="mb-12">
                        <h4 className="text-center font-bold mb-8">合作伙伴</h4>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
                            {partners.map((partner: any, i: number) => (
                                <div key={i} className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                                    {partner.logo ? <img src={partner.logo} alt={partner.name} className="h-12 w-auto" /> : <span className="font-bold text-lg">{partner.name}</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
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
    type: 'footer-05', name: '合作伙伴展示页脚', description: 'Logo展示+合作伙伴', category: 'layout',
    component: Footer05Section,
    defaultData: {
        logoText: '全域魔力',
        description: '值得信赖的合作伙伴',
        partners: [
            { name: '阿里云', logo: '' },
            { name: '腾讯云', logo: '' },
            { name: '华为云', logo: '' },
            { name: '百度智能云', logo: '' },
            { name: '京东云', logo: '' },
            { name: '字节跳动', logo: '' }
        ],
        navLinks: [
            { label: '合作伙伴计划', link: '/partners' },
            { label: '渠道合作', link: '/channels' },
            { label: '技术合作', link: '/tech-partners' }
        ]
    },
    defaultStyle: {},
    schema: {
        data: {
            logo: { type: 'image', label: 'Logo' }, logoText: { type: 'text', label: 'Logo文字' }, description: { type: 'text', label: '描述' },
            partners: { type: 'list', label: '合作伙伴' }, navLinks: { type: 'menu', label: '导航' }
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字色' }
        }
    }, variants: []
});
