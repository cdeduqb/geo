'use client';

import React from 'react';
import Link from 'next/link';
import { Bot, Home, Bell, ChevronRight, Menu, LogOut, Settings, Sparkles, GitCommit } from 'lucide-react';
import { useAdminLayout } from './AdminLayoutContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MacosGlassLayout({ children }: { children: React.ReactNode }) {
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

    const renderMenuItem = (item: any) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedMenus.includes(item.label);
        const active = hasChildren
            ? item.children?.some((child: any) => isActive(child.href))
            : isActive(item.href);

        if (hasChildren) {
            return (
                <div key={item.label} className="mb-0.5">
                    <button
                        onClick={() => toggleMenu(item.label)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-[13px] font-medium transition-all duration-300 rounded-lg group
                            ${active
                                ? 'text-blue-600 bg-white/40 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-white/60'
                                : 'text-gray-700 hover:bg-white/30'
                            }
                        `}
                    >
                        <div className="flex items-center drop-shadow-sm">
                            <item.icon className={`w-4 h-4 mr-2.5 transition-colors ${active ? 'text-blue-500' : 'text-gray-500'}`} />
                            <span>{item.label}</span>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>

                    {isExpanded && (
                        <div className="mt-1 space-y-0.5 pb-1">
                            {item.children!.map((child: any) => {
                                const isChildActive = isActive(child.href);
                                return (
                                    <Link
                                        key={child.href}
                                        href={child.href}
                                        className={`relative flex items-center pl-[40px] pr-3 py-1.5 text-[12px] font-medium rounded-lg transition-all duration-300
                                            ${isChildActive
                                                ? 'text-blue-700 bg-white/50 shadow-sm border border-white/60'
                                                : 'text-gray-500 hover:text-gray-800 hover:bg-white/30'
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
                className={`relative flex items-center px-3 py-2 text-[13px] font-medium rounded-lg transition-all duration-300 mb-0.5 group
                    ${active
                        ? 'text-blue-600 bg-white/40 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-white/60'
                        : 'text-gray-700 hover:bg-white/30 hover:text-gray-900'
                    }
                `}
            >
                <item.icon className={`w-4 h-4 mr-2.5 transition-colors drop-shadow-sm ${active ? 'text-blue-500' : 'text-gray-500 group-hover:text-gray-700'}`} />
                <span className="drop-shadow-sm">{item.label}</span>
            </Link>
        );
    };

    return (
        <div className="min-h-screen flex font-sans text-gray-900 bg-[#E9EEF4] relative overflow-hidden selection:bg-blue-500/30">
            {/* Global Ambient Background Effects (Apple Sonoma Style) */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-gradient-to-br from-indigo-400/30 via-purple-300/20 to-transparent rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-20%] right-[-20%] w-[80vw] h-[80vw] bg-gradient-to-tl from-cyan-300/20 via-blue-400/20 to-transparent rounded-full blur-[160px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
                <div className="absolute top-[10%] right-[20%] w-[50vw] h-[50vw] bg-gradient-to-b from-rose-300/10 to-transparent rounded-full blur-[120px]" />
            </div>

            {/* Floating Sidebar */}
            <div className="w-[280px] p-6 h-screen sticky top-0 flex-shrink-0 z-40 hidden md:flex flex-col">
                <aside className="w-full h-full bg-white/20 backdrop-blur-[60px] rounded-[36px] border border-white/40 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.1)] ring-1 ring-white/50 ring-inset flex flex-col overflow-hidden">
                    <div className="h-16 flex items-center px-5 pt-2 border-b border-black/5">
                        <Link href="/admin/dashboard" className="flex items-center gap-3 drop-shadow-sm">
                            {siteLogo ? (
                                <img src={siteLogo} alt={siteName} className="w-8 h-8 object-cover rounded-lg shadow-sm border border-white/60" />
                            ) : (
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm border border-white/40">
                                    <Bot className="w-4 h-4" />
                                </div>
                            )}
                            <h1 className="font-bold text-[14px] text-gray-800 drop-shadow-sm">
                                {siteName || 'Molicms OS'}
                            </h1>
                        </Link>
                    </div>

                    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-hide">
                        {filteredMenuItems.map(item => renderMenuItem(item))}
                    </nav>

                    <div className="p-4 border-t border-black/5 bg-white/20 space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <Link href="/" target="_blank" className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-white/50 rounded-lg transition-all" title="查看主页">
                                <Home className="w-4 h-4" />
                            </Link>
                            <button onClick={() => setIsSettingDrawerOpen(true)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-white/50 rounded-lg transition-all" title="UI 设置">
                                <Settings className="w-4 h-4" />
                            </button>
                            <button onClick={() => setShowUpdateModal(true)} className="relative p-1.5 text-gray-500 hover:text-blue-600 hover:bg-white/50 rounded-lg transition-all" title="通知">
                                <Bell className="w-4 h-4" />
                                {updateInfo?.hasUpdate && (
                                    <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
                                )}
                            </button>
                            <button onClick={() => logoutAction()} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-white/50 rounded-lg transition-all" title="退出登录">
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                        <Link href="/admin/profile" className="flex items-center gap-2 px-1 hover:bg-white/50 p-2 -ml-2 rounded-xl transition-all group">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-100 to-white border border-white/60 shadow-sm flex items-center justify-center text-xs font-bold text-gray-700 group-hover:scale-105 transition-transform">
                                {user.name?.[0] || 'A'}
                            </div>
                            <div className="flex flex-col">
                                <div className="text-[12px] font-bold text-gray-700 truncate max-w-[80px] group-hover:text-blue-600 transition-colors">{user.name || 'Admin'}</div>
                                <div className="text-[10px] text-gray-500 font-medium">个人中心</div>
                            </div>
                        </Link>
                    </div>
                </aside>
            </div>

            {/* Mobile Header (Only visible on small devices) */}
            <div className="md:hidden absolute top-4 right-4 z-50">
                <button className="p-2 bg-white/40 backdrop-blur-md rounded-full shadow-sm">
                    <Menu className="w-5 h-5 text-gray-700" />
                </button>
            </div>

            {/* Immersive Borderless Space (Main Area) */}
            <div className="flex-1 h-screen overflow-y-auto relative z-20 pt-16 md:pt-10 px-6 pb-20 custom-scrollbar-hide">
                <div className="max-w-[1400px] mx-auto min-h-full">
                    {children}
                </div>
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

function UpdateModal({ show, setShow, isUpdating, updateInfo, handleUpdate }: any) {
    const hasUpdate = updateInfo?.hasUpdate;
    const localVersion = updateInfo?.localVersion || '0.1.81';

    return (
        <Dialog open={show} onOpenChange={(open: boolean) => setShow(open)}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col overflow-hidden bg-white/70 backdrop-blur-3xl border border-white/60 rounded-[32px] p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] ring-1 ring-white/50 ring-inset">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl font-black text-gray-900 tracking-tight">
                        <Sparkles className={`w-6 h-6 drop-shadow-sm ${hasUpdate ? 'text-indigo-600' : 'text-emerald-500'}`} />
                        {hasUpdate ? '发现新版本' : '系统通知'}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 font-medium tracking-wide mt-2">
                        {hasUpdate ? '系统将自动获取最新代码并重启服务。更新过程可能需要几分钟。' : '目前这里没有新的系统消息。您当前的系统已经是最新状态。'}
                    </DialogDescription>
                </DialogHeader>
                
                <div className="flex-1 overflow-y-auto py-4 pr-3 -mr-3 custom-scrollbar">
                    <div className="flex items-center justify-between bg-white/40 p-5 rounded-2xl mb-6 shadow-sm border border-white/50">
                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">当前版本</span>
                            <span className="font-mono font-bold text-gray-800 text-base">{localVersion}</span>
                        </div>
                        {hasUpdate && (
                            <>
                                <div className="h-10 w-px bg-gray-300/40"></div>
                                <div className="flex flex-col gap-1 text-right">
                                    <span className="text-[11px] text-indigo-500 font-bold uppercase tracking-widest">最新版本</span>
                                    <span className="font-mono font-bold text-indigo-600 flex items-center gap-2 justify-end text-base">
                                        {updateInfo.remoteVersion}
                                        <Badge className="bg-indigo-100 text-indigo-600 hover:bg-indigo-200 border-0 shadow-sm">New</Badge>
                                    </span>
                                </div>
                            </>
                        )}
                        {!hasUpdate && (
                            <div className="flex flex-col gap-1 text-right">
                                <span className="text-[11px] text-emerald-500 font-bold uppercase tracking-widest">状态</span>
                                <Badge className="bg-emerald-100/60 text-emerald-600 border-0 shadow-sm">已是最新</Badge>
                            </div>
                        )}
                    </div>

                    {hasUpdate && updateInfo?.updateLogs?.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 tracking-wide">
                                <GitCommit className="w-5 h-5 text-gray-400" /> 更新内容速览
                            </h4>
                            <div className="space-y-3">
                                {updateInfo.updateLogs.map((log: any) => (
                                    <div key={log.hash} className="text-[13px] border-l-4 border-indigo-200 pl-4 py-1.5 hover:border-indigo-400 transition-all bg-gradient-to-r from-white/30 to-transparent pr-4 rounded-r-xl">
                                        <div className="flex items-center justify-between gap-4">
                                            <p className="text-gray-800 font-semibold">{log.message}</p>
                                            <span className="text-[11px] text-gray-500 whitespace-nowrap font-mono">{log.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-3 sm:gap-0 mt-6 border-t border-gray-200/50 pt-6">
                    <Button variant="ghost" onClick={() => setShow(false)} className="rounded-full hover:bg-gray-100 font-bold text-gray-600">
                        关闭
                    </Button>
                    {hasUpdate && (
                        <Button onClick={handleUpdate} disabled={isUpdating} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 shadow-md shadow-indigo-600/20 font-bold">
                            {isUpdating ? '正在更新...' : '立即更新系统'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
