'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
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

// TODO: ==========================================================
// 通过修改下方的数组，您可以自由控制后台目前开启哪几种界面风格！
// 如果您只想强制系统使用并锁定任何一种风格，请在数组里仅保留那个名称（如：['ant-dark']）。
// 所有可选 ID 有：'classic', 'ant-dark', 'vercel-top', 'macos-glass'
// ================================================================
export const ENABLED_LAYOUTS: LayoutType[] = ['ant-dark'];

export type LayoutType = 'classic' | 'ant-dark' | 'vercel-top' | 'macos-glass';

export interface User {
    name?: string | null;
    email?: string | null;
}

export interface MenuItem {
    label: string;
    icon: any;
    href?: string;
    children?: { label: string; href: string }[];
}

export const MENU_ITEMS: MenuItem[] = [
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
            { label: '企业知识库', href: '/admin/knowledge-base' },
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
            { label: '生成式引擎优化', href: '/admin/geo' },
            { label: '重定向管理', href: '/admin/seo/redirects' }
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
            { label: '清理缓存', href: '/admin/settings/cache' },
            { label: '留言管理', href: '/admin/messages' }
        ]
    }
];

interface AdminLayoutContextType {
    user: User;
    logoutAction: () => Promise<void>;
    siteName?: string;
    siteLogo?: string | null;
    enableMultiLanguage: boolean;
    isLicensed: boolean;

    // Layout and UI Settings State
    layoutType: LayoutType;
    setLayoutType: (type: LayoutType) => void;
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (c: boolean) => void;
    isSettingDrawerOpen: boolean;
    setIsSettingDrawerOpen: (o: boolean) => void;

    // Menu state
    expandedMenus: string[];
    toggleMenu: (label: string) => void;
    isActive: (path?: string) => boolean;
    filteredMenuItems: MenuItem[];

    // Updates
    updateInfo: any;
    isUpdating: boolean;
    showUpdateModal: boolean;
    setShowUpdateModal: (s: boolean) => void;
    handleUpdate: () => void;
}

export const AdminLayoutContext = createContext<AdminLayoutContextType | undefined>(undefined);

export function AdminLayoutProvider({
    children,
    user,
    logoutAction,
    siteName,
    siteLogo,
    enableMultiLanguage = false,
    isLicensed = false
}: {
    children: ReactNode;
    user: User;
    logoutAction: () => Promise<void>;
    siteName?: string;
    siteLogo?: string | null;
    enableMultiLanguage?: boolean;
    isLicensed?: boolean;
}) {
    const pathname = usePathname();
    const { showToast } = useToast();

    // -- App State --
    const [layoutType, setLayoutStyle] = useState<LayoutType>(ENABLED_LAYOUTS[0]);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isSettingDrawerOpen, setIsSettingDrawerOpen] = useState(false);

    // Initialize layout from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('molicms-admin-layout') as LayoutType;
        if (saved && ENABLED_LAYOUTS.includes(saved)) {
            setLayoutStyle(saved);
        } else {
            // 如果缓存找不到，或缓存的并不在可用数组里（代表代码改了锁定设置），强制使用数组内第一个可用的配置修正。
            setLayoutStyle(ENABLED_LAYOUTS[0]);
            localStorage.setItem('molicms-admin-layout', ENABLED_LAYOUTS[0]);
        }
    }, []);

    const setLayoutType = (type: LayoutType) => {
        setLayoutStyle(type);
        localStorage.setItem('molicms-admin-layout', type);
    };

    // -- Menu Logic --
    const [expandedMenus, setExpandedMenus] = useState<string[]>([
        '内容管理', '产品管理', '装修管理', 'AI 创作', '系统设置', 'SEO/GEO'
    ]);

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
        const hasMoreSpecificMatch = MENU_ITEMS.some(m =>
            m.children?.some(c => c.href !== path && c.href.length > path.length && pathname.startsWith(c.href))
        );
        if (hasMoreSpecificMatch) return false;
        return pathname.startsWith(`${path}/`);
    };

    // 动态过滤未开启的多语言或授权菜单
    const filteredMenuItems = React.useMemo(() => {
        return MENU_ITEMS.map(item => {
            if (!enableMultiLanguage && item.label === '系统设置' && item.children) {
                return { ...item, children: item.children.filter(child => child.label !== '语言中心') };
            }
            if (!isLicensed && item.label === '系统设置' && item.children) {
                return { ...item, children: item.children.filter(child => child.label !== '语言中心') };
            }
            return item;
        });
    }, [enableMultiLanguage, isLicensed]);


    // -- Update Notification --
    const [updateInfo, setUpdateInfo] = useState<any>(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const checkUpdate = async () => {
            try {
                const res = await fetch('/api/admin/system/update/check');
                if (res.ok) {
                    const data = await res.json();
                    setUpdateInfo(data);
                }
            } catch (error) {
                console.error('Check update failed:', error);
            }
        };
        checkUpdate();
    }, []);

    const handleUpdate = async () => {
        if (!updateInfo?.hasUpdate) return;
        setIsUpdating(true);
        try {
            const res = await fetch('/api/admin/system/update', { method: 'POST' });
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

    const contextValue = {
        user,
        logoutAction,
        siteName,
        siteLogo,
        enableMultiLanguage,
        isLicensed,
        layoutType,
        setLayoutType,
        sidebarCollapsed,
        setSidebarCollapsed,
        isSettingDrawerOpen,
        setIsSettingDrawerOpen,
        expandedMenus,
        toggleMenu,
        isActive,
        filteredMenuItems,
        updateInfo,
        isUpdating,
        showUpdateModal,
        setShowUpdateModal,
        handleUpdate
    };

    return (
        <AdminLayoutContext.Provider value={contextValue}>
            {children}
        </AdminLayoutContext.Provider>
    );
}

export function useAdminLayout() {
    const context = useContext(AdminLayoutContext);
    if (context === undefined) {
        throw new Error('useAdminLayout must be used within an AdminLayoutProvider');
    }
    return context;
}
