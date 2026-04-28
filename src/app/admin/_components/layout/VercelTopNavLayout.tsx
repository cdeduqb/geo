'use client';

import React from 'react';
import Link from 'next/link';
import { Bot, Home, Bell, Settings, LogOut, Sparkles } from 'lucide-react';
import { useAdminLayout } from './AdminLayoutContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export default function VercelTopNavLayout({ children }: { children: React.ReactNode }) {
    const {
        user,
        logoutAction,
        siteName,
        siteLogo,
        isActive,
        filteredMenuItems,
        updateInfo,
        isUpdating,
        showUpdateModal,
        setShowUpdateModal,
        handleUpdate,
        setIsSettingDrawerOpen
    } = useAdminLayout();

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans text-gray-900">
            {/* Top Navigation */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                {/* Upper Header: Logo & Right Actions */}
                <div className="h-16 px-6 max-w-[1400px] mx-auto flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/dashboard" className="flex items-center gap-2">
                            {siteLogo ? (
                                <img src={siteLogo} alt={siteName} className="w-7 h-7 object-cover rounded-full border border-gray-200" />
                            ) : (
                                <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center text-white">
                                    <Bot className="w-4 h-4" />
                                </div>
                            )}
                            <h1 className="font-semibold text-gray-900 text-[15px]">
                                {siteName || 'Molicms Workspace'}
                            </h1>
                        </Link>
                        <span className="text-gray-300 mx-2 text-xl font-light">/</span>
                        <div className="text-sm font-medium bg-gray-100/80 px-2 py-0.5 rounded-md text-gray-600">
                            Admin
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/" target="_blank" className="text-gray-500 hover:text-black hover:bg-gray-100 p-1.5 rounded-md transition-all">
                            <Home className="w-[18px] h-[18px]" />
                        </Link>
                        
                        <button
                            onClick={() => setIsSettingDrawerOpen(true)}
                            className="text-gray-500 hover:text-black hover:bg-gray-100 p-1.5 rounded-md transition-all"
                        >
                            <Settings className="w-[18px] h-[18px]" />
                        </button>

                        <button
                            onClick={() => setShowUpdateModal(true)}
                            className="relative text-gray-500 hover:text-black hover:bg-gray-100 p-1.5 rounded-md transition-all"
                        >
                            <Bell className="w-[18px] h-[18px]" />
                            {updateInfo?.hasUpdate && (
                                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-600 rounded-full ring-2 ring-white" />
                            )}
                        </button>

                        <div className="h-5 w-px bg-gray-200 mx-1" />

                        {/* User Menu */}
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                                <button className="outline-none">
                                    <div className="w-8 h-8 rounded-full border border-gray-200 bg-gradient-to-tr from-gray-100 to-gray-50 flex items-center justify-center text-sm font-semibold text-gray-700 hover:ring-2 hover:ring-gray-200 transition-all">
                                        {user.name?.[0] || 'A'}
                                    </div>
                                </button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Portal>
                                <DropdownMenu.Content className="min-w-[200px] bg-white rounded-xl shadow-lg border border-gray-200 p-1 z-50 animate-in fade-in zoom-in-95" align="end" sideOffset={5}>
                                    <div className="px-2 py-2.5 border-b border-gray-100 mb-1">
                                        <p className="text-sm font-medium text-gray-900">{user.name || 'Admin'}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email || 'Administrator'}</p>
                                    </div>
                                    <DropdownMenu.Item className="outline-none flex items-center px-2 py-2 text-sm text-gray-700 rounded-md cursor-pointer hover:bg-gray-100 hover:text-gray-900 transition-colors" onSelect={() => window.location.href='/admin/profile'}>
                                        <Settings className="mr-2 w-4 h-4" /> 账号设置
                                    </DropdownMenu.Item>
                                    <DropdownMenu.Item className="outline-none flex items-center px-2 py-2 text-sm text-red-600 rounded-md cursor-pointer hover:bg-red-50 transition-colors" onSelect={() => logoutAction()}>
                                        <LogOut className="mr-2 w-4 h-4" /> 退出登录
                                    </DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                    </div>
                </div>

                {/* Lower Header: Tabs based Navigation */}
                <div className="bg-white">
                    <nav className="max-w-[1400px] mx-auto px-6 flex items-center gap-6 overflow-x-auto scrollbar-hide">
                        {filteredMenuItems.map((item: any) => {
                            const hasChildren = item.children && item.children.length > 0;
                            const active = hasChildren
                                ? item.children?.some((child: any) => isActive(child.href))
                                : isActive(item.href);

                            if (hasChildren) {
                                return (
                                    <DropdownMenu.Root key={item.label}>
                                        <DropdownMenu.Trigger asChild>
                                            <button className={`flex items-center gap-2 py-3 text-sm font-medium border-b-2 outline-none transition-all ${active ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'}`}>
                                                <item.icon className="w-4 h-4" />
                                                <span>{item.label}</span>
                                            </button>
                                        </DropdownMenu.Trigger>
                                        <DropdownMenu.Portal>
                                            <DropdownMenu.Content className="min-w-[180px] bg-white rounded-lg shadow-lg border border-gray-200 p-1 z-50 animate-in fade-in slide-in-from-top-2" align="start" sideOffset={1}>
                                                {item.children.map((child: any) => (
                                                    <DropdownMenu.Item key={child.href} asChild>
                                                        <Link href={child.href} className={`flex items-center outline-none px-3 py-2 text-sm rounded-md cursor-pointer transition-colors ${isActive(child.href) ? 'bg-gray-100 font-medium text-black' : 'text-gray-600 hover:bg-gray-50 hover:text-black'}`}>
                                                            {child.label}
                                                        </Link>
                                                    </DropdownMenu.Item>
                                                ))}
                                            </DropdownMenu.Content>
                                        </DropdownMenu.Portal>
                                    </DropdownMenu.Root>
                                );
                            }

                            return (
                                <Link
                                    key={item.label}
                                    href={item.href!}
                                    className={`flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-all ${active ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'}`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </header>

            {/* Main Content Space */}
            <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6 min-h-[calc(100vh-180px)]">
                    {children}
                </div>
            </main>
            
            <UpdateModal 
                show={showUpdateModal} 
                setShow={setShowUpdateModal} 
                isUpdating={isUpdating} 
                updateInfo={updateInfo} 
                handleUpdate={handleUpdate} 
            />
        </div>
    );
}

// 统一 Vercel 极简通知面板
function UpdateModal({ show, setShow, isUpdating, updateInfo, handleUpdate }: any) {
    const hasUpdate = updateInfo?.hasUpdate;
    const localVersion = updateInfo?.localVersion || '0.1.83';

    return (
        <Dialog open={show} onOpenChange={(open: boolean) => !isUpdating && setShow(open)}>
            <DialogContent className="sm:max-w-[480px] flex flex-col overflow-hidden bg-white shadow-2xl rounded-2xl border border-gray-100">
                <DialogHeader className="pt-2">
                    <DialogTitle className="flex items-center gap-2 text-lg text-black font-semibold">
                        <Sparkles className={`w-5 h-5 ${hasUpdate ? 'text-black' : 'text-emerald-500'}`} />
                        {hasUpdate ? 'New Update Available' : 'System Status'}
                    </DialogTitle>
                    <DialogDescription className="text-gray-500">
                        {hasUpdate 
                            ? 'A new version has been released. The update process will restart your services automatically.' 
                            : 'All systems are operational. You are currently running the latest stable build.'}
                    </DialogDescription>
                </DialogHeader>
                
                <div className="flex-1 py-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-400 font-medium">Current Build</span>
                            <span className="font-mono font-bold text-gray-800">{localVersion}</span>
                        </div>
                        {hasUpdate && (
                            <>
                                <div className="h-8 w-px bg-gray-100"></div>
                                <div className="flex flex-col gap-1 text-right">
                                    <span className="text-xs text-black font-medium">Latest Build</span>
                                    <span className="font-mono font-bold text-black flex items-center gap-2 justify-end">
                                        {updateInfo.remoteVersion}
                                        <Badge className="bg-black text-white hover:bg-neutral-800 rounded-md">New</Badge>
                                    </span>
                                </div>
                            </>
                        )}
                        {!hasUpdate && (
                            <div className="flex flex-col gap-1 text-right">
                                <span className="text-xs text-emerald-600 font-medium tracking-wide">Status</span>
                                <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 shadow-none font-semibold">Up to date</Badge>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-2 mt-2 pt-2 border-t border-gray-100/50">
                    <Button variant="outline" onClick={() => setShow(false)} disabled={isUpdating} className="rounded-lg shadow-sm border-gray-200">Close</Button>
                    {hasUpdate && (
                        <Button onClick={handleUpdate} disabled={isUpdating} className="bg-black text-white hover:bg-neutral-800 rounded-lg shadow-sm">
                            {isUpdating ? 'Deploying...' : 'Deploy Update'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
