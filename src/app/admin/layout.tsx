import { getCurrentUser, logout } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminLayoutClient from './_components/AdminLayoutClient';
import { ToastProvider } from '@/components/ui/toast';
import { getSEOSettings } from '@/lib/system-settings';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    const settings = await getSEOSettings();

    // 简单的登出处理
    async function handleLogout() {
        'use server';
        await logout();
        redirect('/login');
    }

    return (
        <ToastProvider>
            <AdminLayoutClient
                user={user}
                logoutAction={handleLogout}
                siteName={settings.siteName}
                siteLogo={settings.siteLogo}
                enableMultiLanguage={settings.enableMultiLanguage}
            >
                {children}
            </AdminLayoutClient>
        </ToastProvider>
    );
}
