'use client';

import React from 'react';
import { AdminLayoutProvider, useAdminLayout } from './layout/AdminLayoutContext';
import ClassicLayout from './layout/ClassicLayout';
import AntDesignDarkLayout from './layout/AntDesignDarkLayout';
import VercelTopNavLayout from './layout/VercelTopNavLayout';
import MacosGlassLayout from './layout/MacosGlassLayout';
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

    return (
        <>
            {layoutType === 'classic' && <ClassicLayout>{children}</ClassicLayout>}
            {layoutType === 'ant-dark' && <AntDesignDarkLayout>{children}</AntDesignDarkLayout>}
            {layoutType === 'vercel-top' && <VercelTopNavLayout>{children}</VercelTopNavLayout>}
            {layoutType === 'macos-glass' && <MacosGlassLayout>{children}</MacosGlassLayout>}
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
