'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FileText,
    Palette,
    RefreshCw,
    Search,
    Settings,
    LogOut,
    Bell,
    ChevronDown,
    ChevronRight,
    Menu,
    Box,
    Key,
    AppWindow,
    Wrench,
    Bot,
    Home,
    ShoppingBag
} from 'lucide-react';

interface User {
    name?: string | null;
    email?: string | null;
}

interface AdminLayoutClientProps {
    children: React.ReactNode;
    user: User;
    logoutAction: () => Promise<void>;
    siteName?: string;
    siteLogo?: string | null;
    enableMultiLanguage?: boolean;
}

type MenuItem = {
    label: string;
    icon: any;
    href?: string;
    children?: { label: string; href: string }[];
};

const MENU_ITEMS: MenuItem[] = [
    {
        label: '控制台',
        icon: LayoutDashboard,
        href: '/admin/dashboard'
    },
    {
        label: '内容管理',
        icon: FileText,
        children: [
            { label: '文章管理', href: '/admin/articles' },
            { label: '分类管理', href: '/admin/categories' },
            { label: '文件管理', href: '/admin/files' }
        ]
    },
    {
        label: '产品管理',
        icon: ShoppingBag,
        children: [
            { label: '产品列表', href: '/admin/products' },
            { label: '分类管理', href: '/admin/products/categories' }
        ]
    },
    {
        label: '装修管理',
        icon: Palette,
        children: [
            { label: '模板管理', href: '/admin/templates' },
            { label: '页面管理', href: '/admin/pages' }
        ]
    },
    {
        label: 'AI 创作',
        icon: RefreshCw,
        children: [
            { label: '创作策略', href: '/admin/ai/strategies' },
            { label: '创作工厂', href: '/admin/articles/automation' },
            { label: '批量任务', href: '/admin/ai/tasks' }
        ]
    },
    {
        label: '推广营销',
        icon: Search,
        children: [
            { label: '搜索引擎推送', href: '/admin/seo/configs' },
            { label: '大模型优化', href: '/admin/geo' }
        ]
    },
    {
        label: '系统设置',
        icon: Settings,
        children: [
            { label: '站点设置', href: '/admin/settings/site' },
            { label: '语言中心', href: '/admin/i18n' },
            { label: '授权管理', href: '/admin/license' },
            { label: 'AI 配置', href: '/admin/settings/ai' },
            { label: '存储配置', href: '/admin/settings/storage' },
            { label: '留言管理', href: '/admin/messages' }
        ]
    }
];

export default function AdminLayoutClient({
    children,
    user,
    logoutAction,
    siteName,
    siteLogo,
    enableMultiLanguage = false
}: AdminLayoutClientProps) {
    const [expandedMenus, setExpandedMenus] = useState<string[]>([
        '内容管理', '产品管理', '装修管理', 'AI 创作', '推广营销', '系统设置'
    ]);
    const pathname = usePathname();




    const toggleMenu = (label: string) => {
        setExpandedMenus(prev =>
            prev.includes(label)
                ? prev.filter(item => item !== label)
                : [...prev, label]
        );
    };

    const isActive = (path?: string) => path ? (pathname === path || pathname.startsWith(`${path}/`)) : false;

    const renderMenuItem = (item: MenuItem) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedMenus.includes(item.label);
        const active = hasChildren
            ? item.children?.some(child => isActive(child.href))
            : isActive(item.href);

        if (hasChildren) {
            return (
                <div key={item.label} className="mb-1">
                    <button
                        onClick={() => toggleMenu(item.label)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg group
                            ${active
                                ? 'text-gray-900 bg-gray-100'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }
                        `}
                    >
                        <div className="flex items-center">
                            <item.icon className={`w-4 h-4 mr-3 transition-colors ${active ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                            <span>{item.label}</span>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>

                    {isExpanded && (
                        <div className="mt-1 ml-4 pl-3 border-l border-gray-200 space-y-1">
                            {item.children!.map(child => {
                                const isChildActive = isActive(child.href);
                                return (
                                    <Link
                                        key={child.href}
                                        href={child.href}
                                        className={`flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200
                                            ${isChildActive
                                                ? 'bg-primary-50 text-primary-700 font-medium'
                                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                            }
                                        `}
                                    >
                                        {child.label}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <Link
                key={item.label}
                href={item.href!}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 mb-1 group
                    ${active
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                `}
            >
                <item.icon className={`w-4 h-4 mr-3 transition-colors ${active ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                <span>{item.label}</span>
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 border-r border-gray-200 bg-white flex flex-col h-screen sticky top-0 z-40">
                {/* Logo Area */}
                <div className="h-16 flex items-center px-5 border-b border-gray-100">
                    <Link href="/admin/dashboard" className="flex items-center gap-2.5 group w-full">
                        {siteLogo ? (
                            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                    src={siteLogo}
                                    alt={siteName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105 flex-shrink-0">
                                <Bot className="w-5 h-5" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h1 className="font-bold text-sm leading-tight text-gray-900 truncate">
                                {siteName || 'GeoCMS'}
                            </h1>
                            <p className="text-xs text-gray-500 truncate">管理后台</p>
                        </div>
                    </Link>
                </div>


                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-hide">
                    {MENU_ITEMS.map(item => {
                        // 如果未启用多语言，隐藏“语言中心”
                        if (!enableMultiLanguage && item.label === '系统设置' && item.children) {
                            const filteredChildren = item.children.filter(child => child.label !== '语言中心');
                            return renderMenuItem({ ...item, children: filteredChildren });
                        }
                        return renderMenuItem(item);
                    })}
                </nav>

                {/* User Profile (Bottom) */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                    <div className="flex items-center justify-between">
                        <Link href="/admin/profile" className="flex items-center gap-3 flex-1 hover:bg-white p-2 -ml-2 rounded-lg transition-colors group">
                            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-medium text-primary-600 shadow-sm group-hover:border-primary-200">
                                {user.name?.[0] || 'A'}
                            </div>
                            <div className="text-sm">
                                <div className="font-medium text-gray-700 group-hover:text-primary-700">{user.name || 'Admin'}</div>
                                <div className="text-xs text-gray-500">管理员</div>
                            </div>
                        </Link>
                        <button
                            onClick={() => logoutAction()}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="退出登录"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-8 border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-30">
                    {/* Left: Breadcrumbs */}
                    <div className="flex items-center text-sm">
                        <button className="p-2 -ml-2 mr-2 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden">
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="flex items-center text-gray-500">
                            <span className="hover:text-gray-900 cursor-pointer transition-colors">工作台</span>
                            <ChevronRight className="w-4 h-4 mx-2 text-gray-300" />
                            <span className="text-primary-600 font-medium bg-primary-50 px-2 py-0.5 rounded-md">
                                {MENU_ITEMS.find(m =>
                                    m.href === pathname || m.children?.some(c => isActive(c.href))
                                )?.label ||
                                    MENU_ITEMS.flatMap(m => m.children || []).find(c => isActive(c.href))?.label ||
                                    '控制台'}
                            </span>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-4">
                        <Link href="/" target="_blank" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50">
                            <Home className="w-4 h-4" />
                            <span>返回首页</span>
                        </Link>

                        <div className="h-4 w-px bg-gray-200"></div>

                        <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
