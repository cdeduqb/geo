'use client';

import { useState } from 'react';
import { registerSection, SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export const HeaderSection: React.FC<SectionProps> = ({ data, style = {}, isEditing }) => {
    const { t, getLocalePath } = useTranslation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const {
        logo,
        logoText = '企业官网',
        navItems = [],
        ctaButtonText,
        ctaButtonLink,
        ctaButtonColor = '#2563eb', // 默认蓝色背景
        ctaButtonTextColor = '#ffffff', // 默认白色文字
        slogan
    } = data;
    const {
        backgroundColor = 'bg-white',
        textColor = 'text-gray-900',
        sticky = 'relative',
        layout = 'default', // 新增：布局类型
        height = 'h-16' // 新增：高度
    } = style;

    // 默认导航项
    const defaultNavItems = navItems.length > 0 ? navItems : [
        { label: '首页', link: '/' },
        { label: '关于', link: '/about' },
        { label: '服务', link: '/services' },
        { label: '联系', link: '/contact' },
    ];

    // 编辑模式/预览模式下禁用 fixed 定位，改为 relative 或 sticky，以确保组件留在预览框内
    let editModeClass = `${sticky} z-10`;
    if (isEditing) {
        // 如果包含 fixed，强制改为 relative 以防止跳出预览框
        if (sticky.includes('fixed')) {
            editModeClass = 'relative z-0';
        } else {
            // sticky top-0 在 relative 容器中仍能工作，但为安全起见确保 z-index 不会遮挡编辑器
            editModeClass = `${sticky} z-0`;
        }
    }

    // 处理背景颜色（支持Tailwind类名、十六进制、rgba、渐变等）
    const bgStyle = backgroundColor?.startsWith('bg-')
        ? backgroundColor
        : backgroundColor?.includes('gradient') || backgroundColor?.includes('rgba') || backgroundColor?.startsWith('#')
            ? { background: backgroundColor }
            : backgroundColor;

    // 处理文字颜色
    const textStyle = textColor?.startsWith('text-')
        ? textColor
        : textColor?.startsWith('#')
            ? { color: textColor }
            : textColor;

    // 处理CTA按钮颜色
    // 处理CTA按钮颜色
    const ctaButtonStyle = ctaButtonColor?.startsWith('bg-')
        ? ctaButtonColor
        : { background: ctaButtonColor };

    // 处理CTA按钮文字颜色
    const ctaTextStyle = ctaButtonTextColor?.startsWith('text-')
        ? ctaButtonTextColor
        : { color: ctaButtonTextColor };

    // 渲染Logo组件
    const renderLogo = () => (
        <Link href={getLocalePath('/')} className="flex items-center gap-2">
            {logo ? (
                <img src={logo} alt={logoText} className="h-8 w-auto" />
            ) : (
                <span className={`text-xl font-bold ${typeof textStyle === 'string' ? textStyle : ''}`} style={typeof textStyle === 'object' ? textStyle : undefined}>{logoText}</span>
            )}
        </Link>
    );

    // 渲染导航
    const renderNav = (className = '') => (
        <nav className={`hidden md:flex items-center gap-6 ${className}`}>
            {defaultNavItems.map((item: any, index: number) => (
                <Link
                    key={index}
                    href={getLocalePath(item.link || '#')}
                    className={typeof textStyle === 'string' ? `${textStyle} hover:text-blue-600 transition-colors font-medium text-sm` : 'hover:text-blue-600 transition-colors font-medium text-sm'}
                    style={typeof textStyle === 'object' ? textStyle : undefined}
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    );

    // 渲染CTA按钮
    const renderCTA = () => ctaButtonText && (
        <Link
            href={getLocalePath(ctaButtonLink || '#')}
            className={`${typeof ctaButtonStyle === 'string' ? ctaButtonStyle : 'bg-blue-600'} ${typeof ctaTextStyle === 'string' ? ctaTextStyle : 'text-white'} px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm whitespace-nowrap`}
            style={{
                ...(typeof ctaButtonStyle === 'object' ? ctaButtonStyle : {}),
                ...(typeof ctaTextStyle === 'object' ? ctaTextStyle : {})
            }}
        >
            {ctaButtonText}
        </Link>
    );

    // 渲染工具栏（语言切换器 + CTA）
    const renderTools = (className = '') => (
        <div className={`flex items-center gap-4 ${className}`}>
            <LanguageSwitcher />
            {renderCTA()}
        </div>
    );

    // 根据layout类型渲染不同布局
    const renderLayout = () => {
        switch (layout) {
            case 'centered-logo':
                // 居中Logo，导航两侧
                return (
                    <div className={`flex items-center justify-between ${height}`}>
                        {renderNav('flex-1')}
                        <div className="flex-shrink-0 mx-8">{renderLogo()}</div>
                        <div className="flex-1 flex justify-end gap-4">
                            {renderTools()}
                        </div>
                    </div>
                );

            case 'stacked':
                // 垂直堆叠
                return (
                    <div className="py-4 space-y-3">
                        <div className="flex items-center justify-between">
                            {renderLogo()}
                            {renderTools()}
                        </div>
                        {renderNav('justify-center')}
                    </div>
                );

            case 'minimal-left':
                // 极简左对齐
                return (
                    <div className={`flex items-center gap-12 ${height}`}>
                        {renderLogo()}
                        {renderNav()}
                        <div className="ml-auto">{renderTools()}</div>
                    </div>
                );

            case 'split':
                // 左中右三栏
                return (
                    <div className={`grid grid-cols-3 items-center ${height}`}>
                        <div>{renderLogo()}</div>
                        {renderNav('justify-center')}
                        <div className="flex justify-end">{renderTools()}</div>
                    </div>
                );

            case 'compact':
                // 紧凑型
                return (
                    <div className="flex items-center justify-between h-12">
                        <div className="flex items-center gap-8">
                            {renderLogo()}
                            {renderNav()}
                        </div>
                        {renderTools()}
                    </div>
                );

            case 'large-centered':
                // 大型居中
                return (
                    <div className="py-6 space-y-4">
                        <div className="flex justify-center">
                            <div className="text-center">
                                {logo ? (
                                    <Link href={getLocalePath('/')}>
                                        <img src={logo} alt={logoText} className="h-12 w-auto mx-auto mb-2" />
                                    </Link>
                                ) : (
                                    <Link href={getLocalePath('/')}>
                                        <span
                                            className={typeof textStyle === 'string' ? `text-xl font-bold ${textStyle}` : 'text-xl font-bold'}
                                            style={typeof textStyle === 'object' ? textStyle : undefined}
                                        >
                                            {logoText}
                                        </span>
                                    </Link>
                                )}
                                {slogan && <p className={`text-sm ${textColor} opacity-70 mt-1`}>{slogan}</p>}
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-8">
                            {renderNav()}
                            {renderTools()}
                        </div>
                    </div>
                );

            case 'sidebar-style':
                // 侧边栏风格（全部靠左）
                return (
                    <div className={`flex flex-col gap-4 py-4`}>
                        {renderLogo()}
                        {renderNav('flex-col items-start gap-3')}
                        {renderTools()}
                    </div>
                );

            case 'wide-spaced':
                // 宽间距
                return (
                    <div className={`flex items-center justify-between ${height}`}>
                        {renderLogo()}
                        <div className="flex items-center gap-12">
                            {renderNav('gap-12')}
                            {renderTools()}
                        </div>
                    </div>
                );

            case 'with-divider':
                // 带分隔线
                return (
                    <div className={`flex items-center ${height}`}>
                        {renderLogo()}
                        <div className={`h-6 w-px ${textColor} opacity-20 mx-6`}></div>
                        {renderNav('flex-1')}
                        {renderTools()}
                    </div>
                );

            case 'boxed':
                // 盒装布局
                return (
                    <div className={`flex items-center justify-between ${height} px-6 border border-gray-200 rounded-lg mx-4 my-2`}>
                        {renderLogo()}
                        {renderNav()}
                        {renderTools()}
                    </div>
                );

            default:
                // 默认布局
                return (
                    <div className={`flex items-center justify-between ${height}`}>
                        {renderLogo()}
                        {renderNav()}
                        {renderTools()}
                    </div>
                );
        }
    };

    return (
        <header
            className={`${editModeClass} ${typeof bgStyle === 'string' ? bgStyle : ''} border-b border-gray-200`}
            style={typeof bgStyle === 'object' ? bgStyle : undefined}
        >
            <div className="container mx-auto px-4">
                {renderLayout()}
                {/* Mobile Menu Button */}
                <button
                    className="md:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 z-50"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Menu Panel */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-white">
                    <div className="pt-20 pb-6 px-6 h-full overflow-y-auto">
                        <nav className="space-y-4">
                            {defaultNavItems.map((item: any, index: number) => (
                                <Link
                                    key={index}
                                    href={getLocalePath(item.link || '#')}
                                    className="block py-3 text-lg font-medium text-gray-900 border-b border-gray-100"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                        <div className="mt-8 space-y-4">
                            <LanguageSwitcher />
                            {ctaButtonText && (
                                <Link
                                    href={getLocalePath(ctaButtonLink || '#')}
                                    className="block w-full text-center py-3 px-4 rounded-lg font-medium text-white"
                                    style={{ background: ctaButtonColor }}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {ctaButtonText}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

// 注册组件
registerSection({
    type: 'header',
    name: '页眉导航',
    description: '网站顶部导航栏，支持多种布局风格',
    category: 'layout',
    component: HeaderSection, // 添加组件引用
    schema: {
        data: {
            logo: {
                type: 'image',
                label: 'Logo 图片',
            },
            logoText: {
                type: 'text',
                label: 'Logo 文字',
            },
            slogan: {
                type: 'text',
                label: '标语（仅部分布局支持）',
            },
            navItems: {
                type: 'menu',
                label: '导航菜单项（点击编辑添加/修改）',
            },
            ctaButtonText: {
                type: 'text',
                label: 'CTA 按钮文字',
            },
            ctaButtonLink: {
                type: 'link',
                label: 'CTA 按钮链接',
            },
            ctaButtonColor: {
                type: 'color',
                label: 'CTA 按钮背景色',
            },
            ctaButtonTextColor: {
                type: 'color',
                label: 'CTA 按钮文字颜色',
            }
        },
        style: {
            layout: {
                type: 'select',
                label: '布局方式',
                options: [
                    { value: 'default', label: '默认 - 左Logo右导航' },
                    { value: 'centered-logo', label: '居中Logo' },
                    { value: 'stacked', label: '垂直堆叠' },
                    { value: 'minimal-left', label: '极简左对齐' },
                    { value: 'split', label: '三栏均分' },
                    { value: 'compact', label: '紧凑型' },
                    { value: 'large-centered', label: '大型居中' },
                    { value: 'wide-spaced', label: '宽间距' },
                    { value: 'with-divider', label: '带分隔线' },
                    { value: 'boxed', label: '盒装布局' },
                ]
            },
            backgroundColor: {
                type: 'color',
                label: '背景颜色',
            },
            textColor: {
                type: 'color',
                label: '文字颜色',
            },
            sticky: {
                type: 'select',
                label: '定位方式',
                options: [
                    { value: 'relative', label: '普通' },
                    { value: 'sticky top-0', label: '吸顶' },
                    { value: 'fixed top-0 w-full', label: '固定' },
                ]
            },
            height: {
                type: 'text',
                label: '高度（Tailwind类名，如 h-16）',
            }
        }
    },
    defaultData: {
        logoText: '企业官网',
        navItems: [
            { label: '首页', link: '/' },
            { label: '产品', link: '/products' },
            { label: '关于', link: '/about' },
        ],
        ctaButtonText: '开始使用',
        ctaButtonLink: '/get-started',
        ctaButtonColor: '#2563eb',
        ctaButtonTextColor: '#ffffff'
    },
    defaultStyle: {
        backgroundColor: '#ffffff',
        textColor: '#111827',
        sticky: 'sticky top-0',
        layout: 'default',
        height: 'h-16'
    },
    variants: [
        {
            label: '默认布局',
            description: '经典左Logo右导航布局',
            data: {
                logoText: 'Brand',
                navItems: [
                    { label: '首页', link: '/' },
                    { label: '产品', link: '/products' },
                    { label: '关于', link: '/about' },
                ],
                ctaButtonText: '开始使用'
            },
            style: {
                layout: 'default',
                backgroundColor: '#ffffff',
                textColor: '#111827',
                height: 'h-16'
            }
        },
        {
            label: '居中Logo布局',
            description: 'Logo居中，导航分列两侧，适合品牌展示',
            data: {
                logoText: 'BRAND',
                navItems: [
                    { label: '产品', link: '/products' },
                    { label: '服务', link: '/services' },
                    { label: '案例', link: '/cases' },
                    { label: '博客', link: '/blog' },
                ],
                ctaButtonText: '联系我们'
            },
            style: {
                layout: 'centered-logo',
                backgroundColor: '#f9fafb',
                textColor: '#111827',
                height: 'h-16'
            }
        },
        {
            label: '垂直堆叠布局',
            description: 'Logo和导航分两行，节省横向空间',
            data: {
                logoText: 'Company',
                navItems: [
                    { label: '首页', link: '/' },
                    { label: '解决方案', link: '/solutions' },
                    { label: '客户案例', link: '/cases' },
                    { label: '资源', link: '/resources' },
                ],
                ctaButtonText: '免费试用'
            },
            style: {
                layout: 'stacked',
                backgroundColor: '#ffffff',
                textColor: '#1f2937'
            }
        },
        {
            label: '极简左对齐',
            description: '所有元素左对齐，现代极简风格',
            data: {
                logoText: 'Minimal',
                navItems: [
                    { label: '作品', link: '/works' },
                    { label: '关于', link: '/about' },
                    { label: '联系', link: '/contact' },
                ],
                ctaButtonText: '探索'
            },
            style: {
                layout: 'minimal-left',
                backgroundColor: '#000000',
                textColor: '#ffffff',
                height: 'h-16'
            }
        },
        {
            label: '三栏均分布局',
            description: '左中右三栏均匀分布，平衡美观',
            data: {
                logoText: 'Enterprise',
                navItems: [
                    { label: '产品', link: '/products' },
                    { label: '解决方案', link: '/solutions' },
                    { label: '定价', link: '/pricing' },
                ],
                ctaButtonText: '预约演示'
            },
            style: {
                layout: 'split',
                backgroundColor: '#2563eb',
                textColor: '#ffffff',
                height: 'h-16'
            }
        },
        {
            label: '紧凑型布局',
            description: '高度较小，适合内容密集型网站',
            data: {
                logoText: 'Compact',
                navItems: [
                    { label: '新闻', link: '/news' },
                    { label: '视频', link: '/videos' },
                    { label: '专栏', link: '/columns' },
                ],
                ctaButtonText: '登录'
            },
            style: {
                layout: 'compact',
                backgroundColor: '#111827',
                textColor: '#ffffff'
            }
        },
        {
            label: '大型居中布局',
            description: '超大Logo居中，强调品牌形象',
            data: {
                logoText: 'BIG BRAND',
                slogan: '打造卓越体验',
                navItems: [
                    { label: '系列', link: '/collections' },
                    { label: '品牌故事', link: '/story' },
                    { label: '门店', link: '/stores' },
                ],
                ctaButtonText: '预约体验'
            },
            style: {
                layout: 'large-centered',
                backgroundColor: 'bg-gradient-to-r from-purple-600 to-pink-500',
                textColor: 'text-white'
            }
        },
        {
            label: '双行布局',
            description: 'Logo和按钮在上排，导航在下排',
            data: {
                logoText: 'TwoRow',
                navItems: [
                    { label: '首页', link: '/' },
                    { label: '产品', link: '/products' },
                    { label: '服务', link: '/services' },
                    { label: '案例', link: '/cases' },
                    { label: '关于', link: '/about' },
                ],
                ctaButtonText: '联系我们'
            },
            style: {
                layout: 'stacked',
                backgroundColor: '#ffffff',
                textColor: '#1f2937',
                height: 'h-auto'
            }
        },
        {
            label: '浮动透明布局',
            description: '透明背景悬浮效果，适合覆盖在图片上',
            data: {
                logoText: 'Float',
                navItems: [
                    { label: '首页', link: '/' },
                    { label: '作品集', link: '/portfolio' },
                    { label: '服务', link: '/services' },
                    { label: '联系', link: '/contact' },
                ],
                ctaButtonText: '获取报价'
            },
            style: {
                layout: 'default',
                backgroundColor: 'rgba(255,255,255,0.1)',
                textColor: '#ffffff',
                height: 'h-16'
            }
        },
        {
            label: '渐变背景布局',
            description: '时尚渐变色背景',
            data: {
                logoText: 'Gradient',
                navItems: [
                    { label: '平台', link: '/platform' },
                    { label: '功能', link: '/features' },
                    { label: '定价', link: '/pricing' },
                ],
                ctaButtonText: '免费试用'
            },
            style: {
                layout: 'split',
                backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                textColor: '#ffffff',
                height: 'h-16'
            }
        },
        {
            label: '圆角卡片布局',
            description: '带圆角和阴影，现代卡片风格',
            data: {
                logoText: 'Card',
                navItems: [
                    { label: '首页', link: '/' },
                    { label: '服务', link: '/services' },
                    { label: '博客', link: '/blog' },
                ],
                ctaButtonText: '开始'
            },
            style: {
                layout: 'boxed',
                backgroundColor: '#ffffff',
                textColor: '#374151',
                height: 'h-14'
            }
        },
        {
            label: '紧凑商务布局',
            description: '紧凑专业，适合企业官网',
            data: {
                logoText: 'Business Pro',
                navItems: [
                    { label: '解决方案', link: '/solutions' },
                    { label: '产品', link: '/products' },
                    { label: '客户', link: '/clients' },
                    { label: '新闻', link: '/news' },
                ],
                ctaButtonText: '预约演示'
            },
            style: {
                layout: 'compact',
                backgroundColor: '#1e3a8a',
                textColor: '#ffffff'
            }
        },
        {
            label: '宽间距布局',
            description: '导航间距加大，更加舒展',
            data: {
                logoText: 'Spacious',
                navItems: [
                    { label: '首页', link: '/' },
                    { label: '服务', link: '/services' },
                    { label: '团队', link: '/team' },
                ],
                ctaButtonText: '咨询'
            },
            style: {
                layout: 'wide-spaced',
                backgroundColor: '#ffffff',
                textColor: '#1f2937',
                height: 'h-20'
            }
        },
        {
            label: '带分隔线布局',
            description: 'Logo与导航用分隔线隔开，层次分明',
            data: {
                logoText: 'Divided',
                navItems: [
                    { label: '产品', link: '/products' },
                    { label: '文档', link: '/docs' },
                    { label: '社区', link: '/community' },
                ],
                ctaButtonText: '开始'
            },
            style: {
                layout: 'with-divider',
                backgroundColor: '#059669',
                textColor: '#ffffff',
                height: 'h-16'
            }
        },
        {
            label: '盒装布局',
            description: '带边框和圆角，卡片式设计',
            data: {
                logoText: 'Boxed',
                navItems: [
                    { label: '特性', link: '/features' },
                    { label: '定价', link: '/pricing' },
                    { label: '支持', link: '/support' },
                ],
                ctaButtonText: '试用'
            },
            style: {
                layout: 'boxed',
                backgroundColor: '#ffffff',
                textColor: '#111827'
            }
        }
    ]
});
