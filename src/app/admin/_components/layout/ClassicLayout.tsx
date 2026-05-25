'use client';

import React from 'react';
import Link from 'next/link';
import { Bot, Home, Bell, ChevronRight, Menu, LogOut, Sparkles, GitCommit, Settings } from 'lucide-react';
import { useAdminLayout } from './AdminLayoutContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ClassicLayout({ children }: { children: React.ReactNode }) {
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
                            {item.children!.map((child: any) => {
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
            <aside className="w-52 flex-shrink-0 bg-[#f8fafc] flex flex-col h-screen sticky top-0 z-40">
                <div className="h-20 flex items-center px-6">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 group">
                        {siteLogo ? (
                            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm ring-1 ring-gray-100">
                                <img src={siteLogo} alt={siteName} className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-indigo-100 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Bot className="w-5 h-5" />
                            </div>
                        )}
                        <div className="flex flex-col">
                            <h1 className="font-bold text-[15px] leading-tight text-gray-900 tracking-tight">
                                {siteName || 'molicms企业官网'}
                            </h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">管理后台</p>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1 scrollbar-hide">
                    {filteredMenuItems.map(item => renderMenuItem(item))}
                </nav>

                <div className="p-6 border-t border-gray-100/50 mt-auto">
                    <div className="flex items-center justify-between">
                        <Link href="/admin/profile" className="flex items-center gap-3.5 flex-1 hover:bg-white/60 p-2.5 -ml-2.5 rounded-2xl transition-all duration-300 group">
                            <div className="w-10 h-10 rounded-full bg-white border-2 border-primary-50 flex items-center justify-center text-sm font-bold text-primary-600 shadow-sm group-hover:scale-105 transition-transform">
                                {user.name?.[0] || 'A'}
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <div className="font-bold text-gray-800 text-sm group-hover:text-primary-700 truncate">{user.name || 'Admin'}</div>
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

            <div className="flex-1 py-2.5 pr-2.5 pl-1 overflow-hidden flex flex-col h-screen">
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100/50 overflow-hidden flex flex-col relative">
                    <header className="h-16 flex items-center justify-between px-8 bg-white/50 backdrop-blur-md sticky top-0 z-30 border-b border-gray-50/50">
                        <div className="flex items-center text-sm">
                            <button className="p-2 -ml-2 mr-2 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden">
                                <Menu className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-2.5">
                                <span className="text-gray-400 font-medium hover:text-gray-600 cursor-pointer transition-colors">工作台</span>
                                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                                <span className="text-indigo-600 font-bold bg-indigo-50/60 px-2.5 py-0.5 rounded-lg text-xs tracking-wide">
                                    当前模块
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-5">
                            <Link href="/" target="_blank" className="flex items-center gap-2 text-[13px] text-gray-500 hover:text-indigo-600 transition-all font-bold group">
                                <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span>查看首页</span>
                            </Link>
                            <div className="h-4 w-px bg-gray-200" />
                            <button
                                onClick={() => setIsSettingDrawerOpen(true)}
                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl transition"
                                title="布局与主题"
                            >
                                <Settings className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setShowUpdateModal(true)}
                                className={`relative p-2 rounded-xl transition-all duration-300 group ${updateInfo?.hasUpdate ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100' : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50/50'}`}
                            >
                                <Bell className={`w-5 h-5 ${updateInfo?.hasUpdate ? 'animate-pulse' : 'group-hover:rotate-12'} transition-transform`} />
                                {updateInfo?.hasUpdate && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                                )}
                            </button>
                        </div>
                    </header>
                    <main className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                        <div className="p-8 max-w-7xl mx-auto min-h-full">
                            {children}
                        </div>
                    </main>
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

// 统一风格更新反馈窗口（含无更新状态防静默反馈）
function UpdateModal({ show, setShow, isUpdating, updateInfo, handleUpdate }: any) {
    const hasUpdate = updateInfo?.hasUpdate;
    const localVersion = updateInfo?.localVersion || '0.1.84';

    return (
        <Dialog open={show} onOpenChange={(open: boolean) => setShow(open)}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Sparkles className={`w-5 h-5 ${hasUpdate ? 'text-indigo-600' : 'text-emerald-500'}`} />
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
                                    <span className="text-xs text-indigo-500 font-medium uppercase tracking-wider">最新版本</span>
                                    <span className="font-mono font-bold text-indigo-600 flex items-center gap-2 justify-end">
                                        {updateInfo.remoteVersion}
                                        <Badge className="bg-indigo-100 text-indigo-600 hover:bg-indigo-200 border-0">New</Badge>
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
                                    <div key={log.hash} className="text-sm border-l-2 border-indigo-100 pl-3 py-1 hover:border-indigo-500 transition-all">
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
                    <Button variant="ghost" onClick={() => setShow(false)}>关闭</Button>
                    {hasUpdate && (
                        <Button onClick={handleUpdate} disabled={isUpdating} className="bg-indigo-600 hover:bg-indigo-700 pl-3">
                            {isUpdating ? '正在更新...' : '立即更新系统'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
