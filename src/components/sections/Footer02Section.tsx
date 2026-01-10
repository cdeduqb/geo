'use client';
import { registerSection, SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import Link from 'next/link';
import Copyright from '@/components/license/Copyright';

export const Footer02Section: React.FC<SectionProps> = ({ data = {}, style = {}, systemSettings }) => {
    const { t } = useTranslation();
    const {
        logo, logoText = systemSettings?.siteName || '全域魔力',
        brandDescription = '专业的全域内容管理与分发平台，赋能企业数字化转型',
        col1Title = t('common.products'), col1Links = [],
        col2Title = t('footer.solutions'), col2Links = [],
        col3Title = t('footer.aboutUs'), col3Links = []
    } = data as any;
    const { backgroundColor = '#f9fafb', textColor = '#111827' } = style as any;



    return (
        <footer className="w-full py-16" style={{ background: backgroundColor, color: textColor }}>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="md:col-span-1">
                        <Link href="/">{logo ? <img src={logo} alt={logoText} className="h-10 w-auto mb-4" /> : <span className="text-2xl font-bold block mb-4">{logoText}</span>}</Link>
                        <p className="text-sm opacity-70">{brandDescription}</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm mb-4">{col1Title}</h4>
                        <ul className="space-y-2">
                            {col1Links && col1Links.map((item: any, i: number) => <li key={i}><Link href={item.link || '#'} className="text-sm opacity-70 hover:opacity-100 transition-opacity">{item.label}</Link></li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm mb-4">{col2Title}</h4>
                        <ul className="space-y-2">
                            {col2Links && col2Links.map((item: any, i: number) => <li key={i}><Link href={item.link || '#'} className="text-sm opacity-70 hover:opacity-100 transition-opacity">{item.label}</Link></li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm mb-4">{col3Title}</h4>
                        <ul className="space-y-2">
                            {col3Links && col3Links.map((item: any, i: number) => <li key={i}><Link href={item.link || '#'} className="text-sm opacity-70 hover:opacity-100 transition-opacity">{item.label}</Link></li>)}
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-current/10 opacity-60 text-center text-sm">
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
    type: 'footer-02', name: '经典三列页脚', description: '经典的三列导航布局', category: 'layout',
    component: Footer02Section,
    defaultData: {
        logoText: '全域魔力',
        brandDescription: '专业的全域内容管理与分发平台，赋能企业数字化转型',
        col1Title: '产品',
        col1Links: [
            { label: '内容管理系统', link: '/products/cms' },
            { label: '数据分析平台', link: '/products/analytics' },
            { label: 'AI智能助手', link: '/products/ai' }
        ],
        col2Title: '解决方案',
        col2Links: [
            { label: '企业官网', link: '/solutions/corporate' },
            { label: '电商平台', link: '/solutions/ecommerce' },
            { label: '营销推广', link: '/solutions/marketing' }
        ],
        col3Title: '关于我们',
        col3Links: [
            { label: '公司介绍', link: '/about' },
            { label: '联系我们', link: '/contact' },
            { label: '加入我们', link: '/careers' }
        ]
    },
    defaultStyle: {},
    schema: {
        data: {
            logo: { type: 'image', label: 'Logo' }, logoText: { type: 'text', label: 'Logo文字' }, brandDescription: { type: 'text', label: '品牌描述' },
            col1Title: { type: 'text', label: '第1列标题' }, col1Links: { type: 'menu', label: '第1列链接' },
            col2Title: { type: 'text', label: '第2列标题' }, col2Links: { type: 'menu', label: '第2列链接' },
            col3Title: { type: 'text', label: '第3列标题' }, col3Links: { type: 'menu', label: '第3列链接' }
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字色' }
        }
    }, variants: []
});
