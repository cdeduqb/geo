'use client';
import { registerSection, SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import Link from 'next/link';
import Copyright from '@/components/license/Copyright';

export const Footer12Section: React.FC<SectionProps> = ({ data = {}, style = {}, systemSettings }) => {
    const { t, getLocalePath } = useTranslation();
    const { logoText = systemSettings?.siteName || '全域魔力', navItems = []
    } = data as any;
    const { backgroundColor = '#ffffff', textColor = '#111827' } = style as any;



    return (
        <footer className="w-full py-6 border-t" style={{ backgroundColor, color: textColor, borderColor: `${textColor}20` }}>
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <span className="text-sm font-bold">{logoText}</span>
                    {navItems && navItems.length > 0 && (
                        <nav className="flex flex-wrap justify-center gap-6">
                            {navItems.map((item: any, i: number) => <Link key={i} href={getLocalePath(item.link || '#')} className="text-xs opacity-70 hover:opacity-100">{item.label}</Link>)}
                        </nav>
                    )}
                    <span className="text-xs">
                        <Copyright className="" systemCopyright={systemSettings?.copyright} />
                        {systemSettings?.icp_number && (
                            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="ml-4 hover:underline">
                                {systemSettings?.icp_number}
                            </a>
                        )}
                    </span>
                </div>
            </div>
        </footer>
    );
};

registerSection({
    type: 'footer-12', name: '紧凑型页脚', description: '单行紧凑布局页脚', category: 'layout',
    component: Footer12Section,
    defaultData: {
        logoText: '全域魔力',
        navItems: [
            { label: '关于我们', link: '/about' },
            { label: '隐私政策', link: '/privacy' },
            { label: '服务条款', link: '/terms' },
            { label: '联系我们', link: '/contact' }
        ]
    },
    defaultStyle: {},
    schema: {
        data: {
            logoText: { type: 'text', label: 'Logo文字' }, navItems: { type: 'menu', label: '导航链接' }
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字色' }
        }
    }, variants: []
});
