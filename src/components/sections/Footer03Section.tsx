'use client';
import { registerSection, SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import Link from 'next/link';
import Copyright from '@/components/license/Copyright';

export const Footer03Section: React.FC<SectionProps> = ({ data = {}, style = {}, systemSettings }) => {
    const { t } = useTranslation();
    const {
        logo, logoText = systemSettings?.siteName || '全域魔力',
        brandDescription = '助力企业实现全渠道内容管理与精准分发',
        col1Title = '核心功能', col1Links = [],
        col2Title = '行业方案', col2Links = [],
        col3Title = '服务支持', col3Links = [],
        col4Title = t('footer.aboutUs'), col4Links = []
    } = data as any;
    const { backgroundColor = '#ffffff', textColor = '#111827' } = style as any;



    return (
        <footer className="w-full py-16" style={{ background: backgroundColor, color: textColor }}>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
                    <div>
                        <Link href="/">{logo ? <img src={logo} alt={logoText} className="h-10 w-auto mb-4" /> : <span className="text-2xl font-bold block mb-4">{logoText}</span>}</Link>
                        <p className="text-sm opacity-70">{brandDescription}</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm mb-4">{col1Title}</h4>
                        <ul className="space-y-2">
                            {col1Links && col1Links.map((item: any, i: number) => <li key={i}><Link href={item.link || '#'} className="text-sm opacity-70 hover:opacity-100">{item.label}</Link></li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm mb-4">{col2Title}</h4>
                        <ul className="space-y-2">
                            {col2Links && col2Links.map((item: any, i: number) => <li key={i}><Link href={item.link || '#'} className="text-sm opacity-70 hover:opacity-100">{item.label}</Link></li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm mb-4">{col3Title}</h4>
                        <ul className="space-y-2">
                            {col3Links && col3Links.map((item: any, i: number) => <li key={i}><Link href={item.link || '#'} className="text-sm opacity-70 hover:opacity-100">{item.label}</Link></li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm mb-4">{col4Title}</h4>
                        <ul className="space-y-2">
                            {col4Links && col4Links.map((item: any, i: number) => <li key={i}><Link href={item.link || '#'} className="text-sm opacity-70 hover:opacity-100">{item.label}</Link></li>)}
                        </ul>
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
    type: 'footer-03', name: '四列导航页脚', description: '四列导航+品牌信息', category: 'layout',
    component: Footer03Section,
    defaultData: {
        logoText: '全域魔力',
        brandDescription: '助力企业实现全渠道内容管理与精准分发',
        col1Title: '核心功能',
        col1Links: [
            { label: '智能编辑器', link: '/features/editor' },
            { label: '多渠道发布', link: '/features/publish' },
            { label: '数据分析', link: '/features/analytics' }
        ],
        col2Title: '行业方案',
        col2Links: [
            { label: '零售电商', link: '/solutions/retail' },
            { label: '教育培训', link: '/solutions/education' },
            { label: '金融服务', link: '/solutions/finance' }
        ],
        col3Title: '服务支持',
        col3Links: [
            { label: '帮助中心', link: '/help' },
            { label: 'API文档', link: '/docs/api' },
            { label: '开发者社区', link: '/community' }
        ],
        col4Title: '关于我们',
        col4Links: [
            { label: '公司简介', link: '/about' },
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
            col3Title: { type: 'text', label: '第3列标题' }, col3Links: { type: 'menu', label: '第3列链接' },
            col4Title: { type: 'text', label: '第4列标题' }, col4Links: { type: 'menu', label: '第4列链接' }
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字色' }
        }
    }, variants: []
});
