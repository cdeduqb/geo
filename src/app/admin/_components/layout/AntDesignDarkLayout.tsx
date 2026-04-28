'use client';

import React from 'react';
import Link from 'next/link';
import { Bot, Home, Bell, ChevronRight, Menu, LogOut, Settings, Sparkles, GitCommit } from 'lucide-react';
import { useAdminLayout } from './AdminLayoutContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AntDesignDarkLayout({ children }: { children: React.ReactNode }) {
    const {
        user,
        logoutAction,
        siteName,
        siteLogo,
        expandedMenus,
        toggleMenu,
        isActive,
        filteredMenuItems,
        updateInfo,
        isUpdating,
        showUpdateModal,
        setShowUpdateModal,
        handleUpdate,
        setIsSettingDrawerOpen
    } = useAdminLayout();

    // ==========================================
    // 侧边栏菜单渲染 (采用完全移植的 CyberDark 风格)
    // ==========================================
    const renderMenuItem = (item: any) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedMenus.includes(item.label);
        const active = hasChildren
            ? item.children?.some((child: any) => isActive(child.href))
            : isActive(item.href);

        if (hasChildren) {
            return (
                <div key={item.label} className="mb-1">
                    <button
                        onClick={() => toggleMenu(item.label)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-[13px] font-medium transition-all duration-300 rounded hover:bg-white/5 group
                            ${active ? 'text-white bg-white/5' : 'text-slate-400 hover:text-slate-200'}
                        `}
                    >
                        <div className="flex items-center">
                            <item.icon className={`w-4 h-4 mr-3 transition-colors ${active ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                            <span>{item.label}</span>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${active ? 'text-slate-300' : 'text-slate-500'} ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>

                    {isExpanded && (
                        <div className="mt-1 space-y-0.5 pb-2 relative before:absolute before:left-[19px] before:top-1 before:bottom-1 before:w-px before:bg-slate-700">
                            {item.children!.map((child: any) => {
                                const isChildActive = isActive(child.href);
                                return (
                                    <Link
                                        key={child.href}
                                        href={child.href}
                                        className={`block pl-[42px] pr-3 py-1.5 text-[12px] font-medium transition-colors rounded hover:bg-white/5 mx-1
                                            ${isChildActive
                                                ? 'text-blue-400 font-bold relative before:absolute before:left-[14px] before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-1.5 before:bg-blue-400 before:rounded-full before:shadow-[0_0_8px_rgba(96,165,250,0.8)]'
                                                : 'text-slate-400 hover:text-slate-200'
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
                className={`flex items-center px-3 py-2 text-[13px] font-medium rounded transition-all duration-300 hover:bg-white/5 mb-1 group
                    ${active ? 'text-white bg-blue-500/20' : 'text-slate-400 hover:text-slate-200'}
                `}
            >
                <item.icon className={`w-4 h-4 mr-3 transition-colors ${active ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                <span>{item.label}</span>
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-[#f0f2f5] flex font-sans text-gray-900 selection:bg-blue-500/30">
            {/* Sidebar (Enterprise Modern Slate) */}
            <aside className="w-[240px] flex-shrink-0 bg-[#1e293b] shadow-[4px_0_24px_0_rgba(15,23,42,0.06)] flex flex-col h-screen sticky top-0 z-40 transition-all">
                <div className="h-14 flex items-center px-6">
                    <Link href="/admin/dashboard" className="flex items-center gap-3">
                        {siteLogo ? (
                            <img src={siteLogo} alt={siteName} className="w-7 h-7 object-cover rounded bg-white p-0.5" />
                        ) : (
                            <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center text-white shadow-sm">
                                <Bot className="w-4 h-4" />
                            </div>
                        )}
                        <h1 className="font-bold text-[14px] text-white tracking-wide">
                            {siteName?.toUpperCase() || 'MOLICMS'}
                        </h1>
                    </Link>
                </div>

                <div className="px-6 mb-4">
                    <div className="h-px w-full bg-white/10"></div>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 space-y-1 scrollbar-hide pb-10">
                    {filteredMenuItems.map(item => renderMenuItem(item))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 group transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-xs font-bold text-white group-hover:bg-blue-600 transition-colors">
                                {user.name?.[0] || 'A'}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[12px] font-medium text-white/90">{user.name || 'Admin'}</span>
                                <span className="text-[10px] text-white/40 uppercase">SYS_ADMIN</span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content (Bright Enterprise Space) */}
            <div className="flex-1 flex flex-col h-screen relative z-20 overflow-hidden bg-[#f0f2f5]">
                <header className="h-14 flex items-center justify-between px-6 bg-white sticky top-0 z-30 shadow-sm border-b border-gray-100">
                    <div className="flex items-center text-sm">
                        <button className="p-2 -ml-2 mr-2 text-gray-500 hover:bg-gray-50 rounded-lg lg:hidden">
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/" target="_blank" className="flex items-center gap-1.5 text-[13px] font-medium text-gray-500 hover:text-blue-600 transition-all">
                            <Home className="w-[15px] h-[15px]" />
                            <span>首页预览</span>
                        </Link>
                        
                        <div className="h-4 w-px bg-gray-200" />
                        
                        <button
                            onClick={() => setIsSettingDrawerOpen(true)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-gray-50 rounded transition"
                        >
                            <Settings className="w-[18px] h-[18px]" />
                        </button>

                        <button
                            onClick={() => setShowUpdateModal(true)}
                            className="relative p-1.5 text-gray-400 hover:bg-gray-50 hover:text-blue-600 rounded transition"
                        >
                            <Bell className="w-[18px] h-[18px]" />
                            {updateInfo?.hasUpdate && (
                                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white" />
                            )}
                        </button>

                        <div className="h-4 w-px bg-gray-200" />
                        
                        <Link href="/admin/profile" className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 -mr-1.5 rounded transition group">
                            <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-sm font-bold text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                {user.name?.[0] || 'A'}
                            </div>
                            <span className="text-[13px] font-medium text-gray-700">{user.name || 'Admin'}</span>
                        </Link>

                        <button onClick={() => logoutAction()} className="text-gray-400 hover:text-red-500 pl-2" title="退出">
                            <LogOut className="w-[15px] h-[15px]" />
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#f0f2f5]">
                    <div className="px-6 max-w-[1400px] mx-auto min-h-full">
                        <div className="bg-transparent py-6 min-h-[calc(100vh-100px)] rounded-sm">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
            
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

// 统一风格更新反馈窗口（含无更新状态防静默反馈）
function UpdateModal({ show, setShow, isUpdating, updateInfo, handleUpdate }: any) {
    const hasUpdate = updateInfo?.hasUpdate;
    const localVersion = updateInfo?.localVersion || '0.1.84';

    return (
        <Dialog open={show} onOpenChange={(open: boolean) => !isUpdating && setShow(open)}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Sparkles className={`w-5 h-5 ${hasUpdate ? 'text-blue-600' : 'text-emerald-500'}`} />
                        {hasUpdate ? '发现新版本' : '系统消息'}
                    </DialogTitle>
                    <DialogDescription>
                        {hasUpdate ? '系统将自动获取最新代码并重启服务。更新过程可能需要几分钟。' : '目前这里没有新的系统消息。您当前的系统由于已经稳定在前沿版本，所以十分健康。'}
                    </DialogDescription>
                </DialogHeader>
                
                <div className="flex-1 overflow-y-auto py-4 pr-2 -mr-2">
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl mb-6">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">当前版本</span>
                            <span className="font-mono font-bold text-gray-700">{localVersion}</span>
                        </div>
                        {hasUpdate && (
                            <>
                                <div className="h-8 w-px bg-gray-200"></div>
                                <div className="flex flex-col gap-1 text-right">
                                    <span className="text-xs text-blue-500 font-medium uppercase tracking-wider">最新版本</span>
                                    <span className="font-mono font-bold text-blue-600 flex items-center gap-2 justify-end">
                                        {updateInfo.remoteVersion}
                                        <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-200 border-0">New</Badge>
                                    </span>
                                </div>
                            </>
                        )}
                        {!hasUpdate && (
                            <div className="flex flex-col gap-1 text-right">
                                <span className="text-xs text-emerald-500 font-medium uppercase tracking-wider">状态</span>
                                <Badge className="bg-emerald-100 text-emerald-600 border-0 shadow-sm">已是最新</Badge>
                            </div>
                        )}
                    </div>

                    {hasUpdate && updateInfo?.updateLogs?.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                <GitCommit className="w-4 h-4 text-gray-500" /> 更新内容
                            </h4>
                            <div className="space-y-2">
                                {updateInfo.updateLogs.map((log: any) => (
                                    <div key={log.hash} className="text-sm border-l-2 border-blue-100 pl-3 py-1 hover:border-blue-500 transition-all">
                                        <div className="flex items-start justify-between gap-4">
                                            <p className="text-gray-700 font-medium">{log.message}</p>
                                            <span className="text-xs text-gray-400 whitespace-nowrap font-mono">{log.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0 mt-2 border-t pt-4">
                    <Button variant="ghost" onClick={() => setShow(false)} disabled={isUpdating}>关闭</Button>
                    {hasUpdate && (
                        <Button onClick={handleUpdate} disabled={isUpdating} className="bg-blue-600 hover:bg-blue-700 pl-3 text-white">
                            {isUpdating ? '正在更新...' : '立即更新系统'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
