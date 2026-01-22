'use client';
import { registerSection, SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import Link from 'next/link';
import Copyright from '@/components/license/Copyright';

export const Footer09Section: React.FC<SectionProps> = ({ data = {}, style = {}, systemSettings }) => {
    const { t, getLocalePath } = useTranslation();
    const { logo, logoText = systemSettings?.siteName || '全域魔力',
        appTitle = '立即下载全域魔力APP', appDescription = '随时随地管理你的内容',
        iosLink = '#', androidLink = '#',
        qrCode, qrTitle = '扫码下载',
        navLinks = []
    } = data as any;
    const { backgroundColor = '#f9fafb', textColor = '#111827' } = style as any;



    return (
        <footer className="w-full py-16" style={{ background: backgroundColor, color: textColor }}>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    <div>
                        <Link href={getLocalePath('/')}>{logo ? <img src={logo} alt={logoText} className="h-10 w-auto mb-6" /> : <span className="text-2xl font-bold block mb-6">{logoText}</span>}</Link>
                        <h3 className="text-2xl font-bold mb-4">{appTitle}</h3>
                        <p className="text-lg opacity-70 mb-6">{appDescription}</p>
                        <div className="flex gap-4">
                            <a href={iosLink} className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
                                <span className="text-2xl">🍎</span>
                                <div className="text-left">
                                    <div className="text-xs opacity-70">Download on the</div>
                                    <div className="font-bold">App Store</div>
                                </div>
                            </a>
                            <a href={androidLink} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                                <span className="text-2xl">🤖</span>
                                <div className="text-left">
                                    <div className="text-xs opacity-70">GET IT ON</div>
                                    <div className="font-bold">Google Play</div>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <h4 className="font-bold mb-4">{qrTitle}</h4>
                        {qrCode ? <img src={qrCode} alt="QR Code" className="w-48 h-48 border-4 border-current rounded-2xl" /> :
                            <div className="w-48 h-48 border-4 border-current rounded-2xl flex items-center justify-center opacity-30">
                                <span className="text-sm">扫码下载</span>
                            </div>
                        }
                    </div>
                </div>
                {navLinks && navLinks.length > 0 && (
                    <nav className="flex flex-wrap justify-center gap-6 mb-8">
                        {navLinks.map((item: any, i: number) => <Link key={i} href={getLocalePath(item.link || '#')} className="text-sm opacity-70 hover:opacity-100">{item.label}</Link>)}
                    </nav>
                )}
                <div className="pt-8 border-t border-current/10 opacity-60 text-center text-sm">
                    <Copyright className="" systemCopyright={systemSettings?.copyright} />
                    {systemSettings?.icp_number && <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="ml-4 hover:underline">{systemSettings?.icp_number}</a>}
                </div>
            </div>
        </footer>
    );
};

registerSection({
    type: 'footer-09', name: '应用下载页脚', description: 'APP下载为重点', category: 'layout',
    component: Footer09Section,
    defaultData: {
        logoText: '全域魔力',
        appTitle: '立即下载全域魔力APP',
        appDescription: '随时随地管理你的内容，让工作更高效',
        iosLink: '#',
        androidLink: '#',
        qrTitle: '扫码下载移动端',
        navLinks: [
            { label: '用户协议', link: '/terms' },
            { label: '隐私政策', link: '/privacy' },
            { label: '帮助中心', link: '/help' }
        ]
    },
    defaultStyle: {},
    schema: {
        data: {
            logo: { type: 'image', label: 'Logo' }, logoText: { type: 'text', label: 'Logo文字' },
            appTitle: { type: 'text', label: 'APP标题' }, appDescription: { type: 'text', label: 'APP描述' },
            iosLink: { type: 'link', label: 'iOS下载链接' }, androidLink: { type: 'link', label: 'Android下载链接' },
            qrCode: { type: 'image', label: '二维码' }, qrTitle: { type: 'text', label: '二维码标题' },
            navLinks: { type: 'menu', label: '导航' }
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字色' }
        }
    }, variants: []
});
