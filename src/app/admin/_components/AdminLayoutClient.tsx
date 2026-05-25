'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AdminLayoutProvider, useAdminLayout } from './layout/AdminLayoutContext';
import ClassicLayout from './layout/ClassicLayout';
import VercelTopNavLayout from './layout/VercelTopNavLayout';
import ThemeSettingDrawer from './layout/ThemeSettingDrawer';

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

// 代理组件，负责从 Context 中读取当前 layout 模式并切换
function LayoutSwitcher({ children }: { children: React.ReactNode }) {
    const { layoutType } = useAdminLayout();
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            document.body.setAttribute('data-admin-layout', layoutType);
        }
    }, [layoutType]);

    // 如果处于模板或页面等“可视化编辑器(Builder)”专有路线下，直接拦截渲染
    // 强制跳脱所有的系统外壳(Header / Sidebar)，让内容完全铺满全屏！
    if (pathname && (pathname.includes('/builder') || pathname.includes('/edit-visual'))) {
        return <>{children}</>;
    }

    return (
        <>
            {layoutType === 'classic' && <ClassicLayout>{children}</ClassicLayout>}
            {layoutType === 'vercel-top' && <VercelTopNavLayout>{children}</VercelTopNavLayout>}
            <ThemeSettingDrawer />
        </>
    );
}

export default function AdminLayoutClient({
    children,
    user,
    logoutAction,
    siteName,
    siteLogo,
    enableMultiLanguage = false,
    isLicensed = false
}: AdminLayoutClientProps) {
    return (
        <AdminLayoutProvider
            user={user}
            logoutAction={logoutAction}
            siteName={siteName}
            siteLogo={siteLogo}
            enableMultiLanguage={enableMultiLanguage}
            isLicensed={isLicensed}
        >
            <LayoutSwitcher>{children}</LayoutSwitcher>
        </AdminLayoutProvider>
    );
}
