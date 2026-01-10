'use client';
import { registerSection, SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import Link from 'next/link';
import Copyright from '@/components/license/Copyright';

export const Footer08Section: React.FC<SectionProps> = ({ data = {}, style = {}, systemSettings }) => {
    const { t } = useTranslation();
    const { logo, logoText = systemSettings?.siteName || '全域魔力', companyInfo = '专业的全域内容管理与分发平台',
        contactTitle = t('common.contactUs'), contactPhone = '400-888-8888', contactEmail = 'contact@quanyuml.com', contactAddress = '北京市朝阳区建国路88号',
        navTitle = t('common.quickLinks'), navLinks = [],
        qrCode, qrTitle = '扫码关注'
    } = data as any;
    const { backgroundColor = '#ffffff', textColor = '#111827' } = style as any;



    return (
        <footer className="w-full py-16" style={{ background: backgroundColor, color: textColor }}>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="md:col-span-2">
                        <Link href="/">{logo ? <img src={logo} alt={logoText} className="h-10 w-auto mb-4" /> : <span className="text-2xl font-bold block mb-4">{logoText}</span>}</Link>
                        <p className="text-sm opacity-70 mb-6">{companyInfo}</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">{contactTitle}</h4>
                        <div className="space-y-2 text-sm opacity-70">
                            <div>📞 {contactPhone}</div>
                            <div>✉️ {contactEmail}</div>
                            <div className="text-xs">📍 {contactAddress}</div>
                        </div>
                        {navLinks && navLinks.length > 0 && (
                            <div className="mt-6">
                                <h4 className="font-bold mb-2">{navTitle}</h4>
                                <ul className="space-y-1">
                                    {navLinks.map((item: any, i: number) => <li key={i}><Link href={item.link || '#'} className="text-sm opacity-70 hover:opacity-100">{item.label}</Link></li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="text-center">
                        <h4 className="font-bold mb-4">{qrTitle}</h4>
                        {qrCode ? <img src={qrCode} alt="QR Code" className="w-32 h-32 mx-auto border-2 border-current" /> :
                            <div className="w-32 h-32 mx-auto border-2 border-current flex items-center justify-center opacity-30">
                                <span className="text-xs">二维码</span>
                            </div>
                        }
                    </div>
                </div>
                <div className="pt-8 border-t border-current/10 opacity-60 text-center text-sm">
                    <Copyright className=""  systemCopyright={systemSettings?.copyright} />
                    {systemSettings?.icp_number && <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="ml-4 hover:underline">{systemSettings?.icp_number}</a>}
                </div>
            </div>
        </footer>
    );
};

registerSection({
    type: 'footer-08', name: '联系信息页脚', description: '完整联系信息和二维码', category: 'layout',
    component: Footer08Section,
    defaultData: {
        logoText: '全域魔力',
        companyInfo: '专业的全域内容管理与分发平台',
        contactTitle: '联系我们',
        contactPhone: '400-888-8888',
        contactEmail: 'contact@quanyuml.com',
        contactAddress: '北京市朝阳区建国路88号现代城大厦A座15层',
        navTitle: '快速链接',
        navLinks: [
            { label: '产品介绍', link: '/products' },
            { label: '在线客服', link: '/support' }
        ],
        qrTitle: '扫码关注公众号'
    },
    defaultStyle: {},
    schema: {
        data: {
            logo: { type: 'image', label: 'Logo' }, logoText: { type: 'text', label: 'Logo文字' }, companyInfo: { type: 'text', label: '公司简介' },
            contactTitle: { type: 'text', label: '联系标题' }, contactPhone: { type: 'text', label: '电话' }, contactEmail: { type: 'text', label: '邮箱' }, contactAddress: { type: 'text', label: '地址' },
            navTitle: { type: 'text', label: '导航标题' }, navLinks: { type: 'menu', label: '快速链接' },
            qrCode: { type: 'image', label: '二维码' }, qrTitle: { type: 'text', label: '二维码标题' }
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字色' }
        }
    }, variants: []
});
