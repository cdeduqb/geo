'use client';
import { registerSection, SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import Link from 'next/link';
import Copyright from '@/components/license/Copyright';

export const Footer14Section: React.FC<SectionProps> = ({ data = {}, style = {}, systemSettings }) => {
    const { t, getLocalePath } = useTranslation();
    const { logo, logoText = systemSettings?.siteName || '全域魔力',
        col1Title = t('common.products'), col1Links = [], col2Title = t('footer.solutions'), col2Links = [],
        col3Title = t('footer.resources'), col3Links = [], col4Title = t('footer.support'), col4Links = [],
        col5Title = t('footer.company'), col5Links = []
    } = data as any;
    const { backgroundColor = '#ffffff', textColor = '#111827' } = style as any;



    return (
        <footer className="w-full py-16" style={{ background: backgroundColor, color: textColor }}>
            <div className="container mx-auto px-4">
                <div className="mb-12">
                    <Link href={getLocalePath('/')}>{logo ? <img src={logo} alt={logoText} className="h-12 w-auto mb-8" /> : <span className="text-3xl font-bold block mb-8">{logoText}</span>}</Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
                    {[
                        { title: col1Title, links: col1Links },
                        { title: col2Title, links: col2Links },
                        { title: col3Title, links: col3Links },
                        { title: col4Title, links: col4Links },
                        { title: col5Title, links: col5Links }
                    ].map((col, idx) => (
                        <div key={idx}>
                            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider opacity-50">{col.title}</h4>
                            <ul className="space-y-2">
                                {col.links && col.links.map((item: any, i: number) => <li key={i}><Link href={getLocalePath(item.link || '#')} className="text-sm opacity-70 hover:opacity-100 transition-opacity">{item.label}</Link></li>)}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="pt-8 border-t border-current/10 opacity-60 text-sm text-center">
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
    type: 'footer-14', name: '站点地图页脚', description: '完整的站点地图布局', category: 'layout',
    component: Footer14Section,
    defaultData: {
        logoText: '全域魔力',
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
            { label: 'API参考', link: '/api' },
            { label: '开发者社区', link: '/community' }
        ],
        col4Title: '支持',
        col4Links: [
            { label: '在线客服', link: '/support' },
            { label: '提交工单', link: '/tickets' },
            { label: '培训课程', link: '/training' }
        ],
        col5Title: '公司',
        col5Links: [
            { label: '关于我们', link: '/about' },
            { label: '加入我们', link: '/careers' },
            { label: '新闻动态', link: '/news' }
        ]
    },
    defaultStyle: {},
    schema: {
        data: {
            logo: { type: 'image', label: 'Logo' }, logoText: { type: 'text', label: 'Logo文字' },
            col1Title: { type: 'text', label: '第1列标题' }, col1Links: { type: 'menu', label: '第1列链接' },
            col2Title: { type: 'text', label: '第2列标题' }, col2Links: { type: 'menu', label: '第2列链接' },
            col3Title: { type: 'text', label: '第3列标题' }, col3Links: { type: 'menu', label: '第3列链接' },
            col4Title: { type: 'text', label: '第4列标题' }, col4Links: { type: 'menu', label: '第4列链接' },
            col5Title: { type: 'text', label: '第5列标题' }, col5Links: { type: 'menu', label: '第5列链接' }
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字色' }
        }
    }, variants: []
});
