'use client';
import { registerSection, SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import Link from 'next/link';
import Copyright from '@/components/license/Copyright';

export const Footer04Section: React.FC<SectionProps> = ({ data = {}, style = {}, systemSettings }) => {
    const { t, getLocalePath } = useTranslation();
    const {
        logo, logoText = systemSettings?.siteName || '全域魔力',
        brandDescription = '企业级全域内容管理解决方案提供商',
        col1Title = t('common.products'), col1Links = [], col2Title = t('footer.solutions'), col2Links = [],
        col3Title = t('footer.resources'), col3Links = [], col4Title = t('footer.company'), col4Links = [],
        col5Title = '联系方式', contactPhone = systemSettings?.contactPhone, contactEmail = systemSettings?.contactEmail, contactAddress = systemSettings?.contactAddress
    } = data as any;
    const { backgroundColor = '#f9fafb', textColor = '#111827' } = style as any;



    return (
        <footer className="w-full py-16" style={{ background: backgroundColor, color: textColor }}>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-8 mb-12">
                    <div className="md:col-span-2">
                        <Link href={getLocalePath('/')}>{logo ? <img src={logo} alt={logoText} className="h-10 w-auto mb-4" /> : <span className="text-2xl font-bold block mb-4">{logoText}</span>}</Link>
                        <p className="text-sm opacity-70 mb-4">{brandDescription}</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm mb-4">{col1Title}</h4>
                        <ul className="space-y-2">
                            {col1Links && col1Links.map((item: any, i: number) => <li key={i}><Link href={getLocalePath(item.link || '#')} className="text-sm opacity-70 hover:opacity-100">{item.label}</Link></li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm mb-4">{col2Title}</h4>
                        <ul className="space-y-2">
                            {col2Links && col2Links.map((item: any, i: number) => <li key={i}><Link href={getLocalePath(item.link || '#')} className="text-sm opacity-70 hover:opacity-100">{item.label}</Link></li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm mb-4">{col3Title}</h4>
                        <ul className="space-y-2">
                            {col3Links && col3Links.map((item: any, i: number) => <li key={i}><Link href={getLocalePath(item.link || '#')} className="text-sm opacity-70 hover:opacity-100">{item.label}</Link></li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm mb-4">{col5Title}</h4>
                        <div className="space-y-2 text-sm opacity-70">
                            {contactPhone && <div>📞 {contactPhone}</div>}
                            {contactEmail && <div>✉️ {contactEmail}</div>}
                            {contactAddress && <div className="text-xs">📍 {contactAddress}</div>}
                        </div>
                    </div>
                </div>
                <div className="pt-8 border-t border-current/10 opacity-60 text-center text-sm">
                    <Copyright className="" systemCopyright={systemSettings?.copyright} />
                    {systemSettings?.icp_number && <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="ml-4 hover:underline">{systemSettings?.icp_number}</a>}
                </div>
            </div>
        </footer>
    );
};

registerSection({
    type: 'footer-04', name: '五列企业页脚', description: '完整企业信息布局', category: 'layout',
    component: Footer04Section,
    defaultData: {
        logoText: '全域魔力',
        brandDescription: '企业级全域内容管理解决方案提供商',
        col1Title: '产品',
        col1Links: [
            { label: '内容管理', link: '/products/cms' },
            { label: '营销自动化', link: '/products/marketing' },
            { label: '数据分析', link: '/products/analytics' }
        ],
        col2Title: '解决方案',
        col2Links: [
            { label: '企业官网', link: '/solutions/corporate' },
            { label: '电商平台', link: '/solutions/ecommerce' },
            { label: '媒体出版', link: '/solutions/media' }
        ],
        col3Title: '资源',
        col3Links: [
            { label: '帮助文档', link: '/docs' },
            { label: '视频教程', link: '/tutorials' },
            { label: '开发者API', link: '/api' }
        ],
        col5Title: '联系方式',
        contactPhone: '400-888-8888',
        contactEmail: 'contact@quanyuml.com',
        contactAddress: '北京市朝阳区建国路88号'
    },
    defaultStyle: {},
    schema: {
        data: {
            logo: { type: 'image', label: 'Logo' }, logoText: { type: 'text', label: 'Logo文字' }, brandDescription: { type: 'text', label: '品牌描述' },
            col1Title: { type: 'text', label: '第1列标题' }, col1Links: { type: 'menu', label: '第1列链接' },
            col2Title: { type: 'text', label: '第2列标题' }, col2Links: { type: 'menu', label: '第2列链接' },
            col3Title: { type: 'text', label: '第3列标题' }, col3Links: { type: 'menu', label: '第3列链接' },
            col4Title: { type: 'text', label: '第4列标题' }, col4Links: { type: 'menu', label: '第4列链接' },
            col5Title: { type: 'text', label: '联系标题' }, contactPhone: { type: 'text', label: '电话' }, contactEmail: { type: 'text', label: '邮箱' }, contactAddress: { type: 'text', label: '地址' }
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字色' }
        }
    }, variants: []
});
