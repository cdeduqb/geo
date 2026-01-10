'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FileText,
    Palette,
    Sparkles,
    Search,
    Settings,
    LogOut,
    Bell,
    ChevronDown,
    ChevronRight,
    Menu,
    Bot,
    Home,
    ShoppingBag
} from 'lucide-react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/toast';

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
    isLicensed?: boolean;
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
            { label: '内容分类', href: '/admin/categories' }
        ]
    },
    {
        label: 'AI 创作',
        icon: Sparkles,
        children: [
            { label: '创作策略', href: '/admin/ai/strategies' },
            { label: '创作工厂', href: '/admin/articles/automation' },
            { label: '批量任务', href: '/admin/ai/tasks' }
        ]
    },
    {
        label: 'SEO/GEO',
        icon: Search,
        children: [
            { label: '搜索引擎推送', href: '/admin/seo/configs' },
            { label: '生成式引擎优化', href: '/admin/geo' }
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
        label: '产品管理',
        icon: ShoppingBag,
        children: [
            { label: '产品列表', href: '/admin/products' },
            { label: '产品分类', href: '/admin/products/categories' }
        ]
    },
    {
        label: '系统设置',
        icon: Settings,
        children: [
            { label: '站点设置', href: '/admin/settings/site' },
            { label: '语言中心', href: '/admin/i18n' },
            { label: 'AI 配置', href: '/admin/settings/ai' },
            { label: '存储配置', href: '/admin/settings/storage' },
            { label: '文件管理', href: '/admin/files' },
            { label: '系统日志', href: '/admin/settings/logs' },
            { label: '清理缓存', href: '/admin/settings/cache' },
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
    enableMultiLanguage = false,
    isLicensed = false
}: AdminLayoutClientProps) {
    const [expandedMenus, setExpandedMenus] = useState<string[]>([
        '内容管理', '产品管理', '装修管理', 'AI 创作', '推广营销', '系统设置', 'SEO/GEO'
    ]);
    // 许可证 ping 已统一由 LicensePing 组件处理（每24小时最多1次）
    const pathname = usePathname();
    const { showToast } = useToast();

    // 更新相关状态
    const [updateInfo, setUpdateInfo] = useState<{ hasUpdate: boolean, localVersion: string, remoteVersion: string } | null>(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        // 检查更新
        const checkUpdate = async () => {
            try {
                const res = await fetch('/api/admin/system/update/check');
                if (res.ok) {
                    const data = await res.json();
                    setUpdateInfo(data);
                }
            } catch (error) {
                console.error('Check update failed:', error);
                // 静默失败，不打扰用户
            }
        };

        checkUpdate();
    }, []);

    const handleUpdate = async () => {
        if (!updateInfo?.hasUpdate) return;

        setIsUpdating(true);
        try {
            const res = await fetch('/api/admin/system/update', {
                method: 'POST'
            });
            const data = await res.json();

            if (res.ok && data.success) {
                showToast("更新已开始。系统正在后台更新并重启，请稍后刷新页面。", 'success');
                setShowUpdateModal(false);
            } else {
                throw new Error(data.error || '更新启动失败');
            }
        } catch (error) {
            showToast("更新失败。无法启动更新进程，请查看服务器日志。", 'error');
            setIsUpdating(false);
        }
    };

    const toggleMenu = (label: string) => {
        setExpandedMenus(prev =>
            prev.includes(label)
                ? prev.filter(item => item !== label)
                : [...prev, label]
        );
    };

    const isActive = (path?: string) => {
        if (!path) return false;
        if (pathname === path) return true;

        // 特殊处理：如果存在更具体的菜单项匹配当前路径，则较短的前缀路径不应显示为激活
        // 例如：当在 /admin/products/categories 时，/admin/products 不应激活
        const hasMoreSpecificMatch = MENU_ITEMS.some(m =>
            m.children?.some(c => c.href !== path && c.href.length > path.length && pathname.startsWith(c.href))
        );

        if (hasMoreSpecificMatch) return false;

        return pathname.startsWith(`${path}/`);
    };

    const renderMenuItem = (item: MenuItem) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedMenus.includes(item.label);
        const active = hasChildren
            ? item.children?.some(child => isActive(child.href))
            : isActive(item.href);

        if (hasChildren) {
            return (
                <div key={item.label} className="mb-0.5">
                    <button
                        onClick={() => toggleMenu(item.label)}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-sm font-bold transition-all duration-300 rounded-2xl group
                            ${active
                                ? 'text-indigo-600 bg-transparent'
                                : 'text-gray-900 hover:bg-indigo-50/30'
                            }
                        `}
                    >
                        <div className="flex items-center">
                            <item.icon className={`w-4 h-4 mr-3 transition-colors ${active ? 'text-indigo-600' : 'text-gray-600 group-hover:text-gray-600'}`} />
                            <span className="tracking-tight">{item.label}</span>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 text-gray-300 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>

                    {isExpanded && (
                        <div className="mt-1 space-y-0.5 pb-1">
                            {item.children!.map(child => {
                                const isChildActive = isActive(child.href);
                                return (
                                    <Link
                                        key={child.href}
                                        href={child.href}
                                        className={`relative flex items-center pl-[48px] pr-4 py-1.5 text-sm font-medium rounded-xl transition-all duration-300
                                            ${isChildActive
                                                ? 'text-indigo-600 bg-indigo-50/60 font-bold'
                                                : 'text-gray-500 hover:text-gray-900 hover:bg-indigo-50/30'
                                            }
                                        `}
                                    >
                                        {isChildActive && (
                                            <div className="absolute left-6 w-1 h-1 rounded-full bg-indigo-600 animate-in fade-in zoom-in duration-300" />
                                        )}
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
                className={`relative flex items-center px-3.5 py-2.5 text-sm font-bold rounded-2xl transition-all duration-300 mb-0.5 group
                    ${active
                        ? 'text-indigo-600 bg-transparent'
                        : 'text-gray-900 hover:bg-indigo-50/30'
                    }
                `}
            >
                {active && (
                    <div className="absolute left-0 w-1 h-4 rounded-full bg-indigo-600 animate-in fade-in slide-in-from-left-1 duration-300" />
                )}
                <item.icon className={`w-4 h-4 mr-3 transition-colors ${active ? 'text-indigo-600' : 'text-gray-600 group-hover:text-gray-600'}`} />
                <span className="tracking-tight">{item.label}</span>
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex font-sans text-gray-900">
            {/* Sidebar - Integrated with Layout Background */}
            <aside className="w-52 flex-shrink-0 bg-[#f8fafc] flex flex-col h-screen sticky top-0 z-40">
                {/* Logo Area */}
                <div className="h-20 flex items-center px-6">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 group">
                        {siteLogo ? (
                            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm ring-1 ring-gray-100">
                                <img
                                    src={siteLogo}
                                    alt={siteName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-indigo-100 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Bot className="w-5 h-5" />
                            </div>
                        )}
                        <div className="flex flex-col">
                            <h1 className="font-bold text-[15px] leading-tight text-gray-900 tracking-tight">
                                {siteName || 'moli企业官网'}
                            </h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">管理后台</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1 scrollbar-hide">
                    {MENU_ITEMS.map(item => {
                        // 如果未启用多语言，隐藏“语言中心”
                        if (!enableMultiLanguage && item.label === '系统设置' && item.children) {
                            const filteredChildren = item.children.filter(child => child.label !== '语言中心');
                            return renderMenuItem({ ...item, children: filteredChildren });
                        }

                        // 如果未授权（isLicensed 为 false），隐藏“语言中心”
                        if (!isLicensed && item.label === '系统设置' && item.children) {
                            const filteredChildren = item.children.filter(child => child.label !== '语言中心');
                            return renderMenuItem({ ...item, children: filteredChildren });
                        }

                        return renderMenuItem(item);
                    })}
                </nav>

                {/* User Profile (Bottom) */}
                <div className="p-6 border-t border-gray-100/50 mt-auto">
                    <div className="flex items-center justify-between">
                        <Link href="/admin/profile" className="flex items-center gap-3.5 flex-1 hover:bg-white/60 p-2.5 -ml-2.5 rounded-2xl transition-all duration-300 group">
                            <div className="w-10 h-10 rounded-full bg-white border-2 border-primary-50 flex items-center justify-center text-sm font-bold text-primary-600 shadow-sm group-hover:scale-105 transition-transform">
                                {user.name?.[0] || 'A'}
                            </div>
                            <div className="flex flex-col">
                                <div className="font-bold text-gray-800 text-sm group-hover:text-primary-700">{user.name || 'Admin'}</div>
                                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">管理员</div>
                            </div>
                        </Link>
                        <button
                            onClick={() => logoutAction()}
                            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-white hover:shadow-sm rounded-xl transition-all duration-300 active:scale-95"
                            title="退出登录"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area - Minimized Padding to fill viewport */}
            <div className="flex-1 py-2.5 pr-2.5 pl-1 overflow-hidden flex flex-col h-screen">
                <div className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col relative">
                    {/* Header */}
                    <header className="h-16 flex items-center justify-between px-8 bg-white/10 backdrop-blur-sm sticky top-0 z-30">
                        {/* Left: Breadcrumbs */}
                        <div className="flex items-center text-sm">
                            <button className="p-2 -ml-2 mr-2 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden">
                                <Menu className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-2.5">
                                <span className="text-gray-400 font-medium hover:text-gray-600 cursor-pointer transition-colors">工作台</span>
                                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                                <span className="text-indigo-600 font-bold bg-indigo-50/60 px-2.5 py-0.5 rounded-lg text-xs tracking-wide">
                                    {MENU_ITEMS.find(m =>
                                        m.href === pathname || m.children?.some(c => isActive(c.href))
                                    )?.label ||
                                        MENU_ITEMS.flatMap(m => m.children || []).find(c => isActive(c.href))?.label ||
                                        '控制台'}
                                </span>
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-6">
                            <Link href="/" target="_blank" className="flex items-center gap-2 text-[13px] text-gray-500 hover:text-indigo-600 transition-all font-bold group">
                                <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span>查看首页</span>
                            </Link>

                            <div className="h-4 w-px bg-gray-100"></div>

                            <button
                                onClick={() => {
                                    if (updateInfo?.hasUpdate) {
                                        setShowUpdateModal(true);
                                    } else {
                                        showToast(`当前已是最新版本 (${updateInfo?.localVersion || 'unknown'})`, 'success');
                                    }
                                }}
                                className={`relative p-2 rounded-xl transition-all duration-300 group ${updateInfo?.hasUpdate ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 cursor-pointer' : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50/50'}`}
                            >
                                <Bell className={`w-5 h-5 ${updateInfo?.hasUpdate ? 'animate-pulse' : 'group-hover:rotate-12'} transition-transform`} />
                                {updateInfo?.hasUpdate && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                                )}
                            </button>
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 overflow-y-auto px-8 py-10 custom-scrollbar">
                        <div className="max-w-7xl mx-auto min-h-full">
                            {children}
                        </div>
                    </main>
                </div>
            </div>

            {/* Update Confirmation Modal */}
            <ConfirmDialog
                isOpen={showUpdateModal}
                title="系统更新可用"
                message={`发现新版本！系统将自动获取最新代码并重启服务。\n\n当前版本: ${updateInfo?.localVersion}\n最新版本: ${updateInfo?.remoteVersion}\n\n更新过程可能需要几分钟，期间服务将暂时中断，是否立即更新？`}
                confirmText={isUpdating ? "更新中..." : "立即更新"}
                cancelText="暂不更新"
                confirmButtonClass="bg-indigo-600 hover:bg-indigo-700"
                onConfirm={handleUpdate}
                onCancel={() => setShowUpdateModal(false)}
                isLoading={isUpdating}
            />
        </div>
    );
}
