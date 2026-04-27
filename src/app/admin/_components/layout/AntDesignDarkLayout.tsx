'use client';

import React from 'react';
import Link from 'next/link';
import { Bot, Home, Bell, ChevronRight, Menu, LogOut, Settings } from 'lucide-react';
import { useAdminLayout } from './AdminLayoutContext';

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
        setShowUpdateModal,
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
                        className={`w-full flex items-center justify-between px-3 py-2 text-[13px] font-medium transition-all duration-300 rounded hover:bg-neutral-800/50 group
                            ${active ? 'text-neutral-200' : 'text-neutral-500'}
                        `}
                    >
                        <div className="flex items-center">
                            <item.icon className={`w-4 h-4 mr-3 transition-colors ${active ? 'text-neutral-300' : 'text-neutral-500 group-hover:text-neutral-400'}`} />
                            <span>{item.label}</span>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 text-neutral-600 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>

                    {isExpanded && (
                        <div className="mt-1 space-y-0.5 pb-2 relative before:absolute before:left-[19px] before:top-1 before:bottom-1 before:w-px before:bg-neutral-800">
                            {item.children!.map((child: any) => {
                                const isChildActive = isActive(child.href);
                                return (
                                    <Link
                                        key={child.href}
                                        href={child.href}
                                        className={`block pl-[42px] pr-3 py-1.5 text-[12px] font-medium transition-colors
                                            ${isChildActive
                                                ? 'text-green-400 font-bold relative before:absolute before:left-[18px] before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-[3px] before:bg-green-400 before:rounded-full before:shadow-[0_0_8px_rgba(74,222,128,0.8)]'
                                                : 'text-neutral-500 hover:text-neutral-300'
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
                className={`flex items-center px-3 py-2 text-[13px] font-medium rounded transition-all duration-300 hover:bg-neutral-800/50 mb-1 group
                    ${active ? 'text-neutral-200' : 'text-neutral-500'}
                `}
            >
                <item.icon className={`w-4 h-4 mr-3 transition-colors ${active ? 'text-neutral-300' : 'text-neutral-500 group-hover:text-neutral-400'}`} />
                <span>{item.label}</span>
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-[#f0f2f5] flex font-sans text-gray-900 selection:bg-green-500/30">
            {/* Sidebar (Cyber Dark 风格) */}
            <aside className="w-[240px] flex-shrink-0 bg-[#0a0a0a] border-r border-neutral-800/60 flex flex-col h-screen sticky top-0 z-40">
                <div className="h-14 flex items-center px-6">
                    <Link href="/admin/dashboard" className="flex items-center gap-3">
                        {siteLogo ? (
                            <img src={siteLogo} alt={siteName} className="w-6 h-6 object-cover rounded opacity-90" />
                        ) : (
                            <div className="w-6 h-6 bg-neutral-800 rounded flex items-center justify-center text-neutral-400 border border-neutral-700">
                                <Bot className="w-3.5 h-3.5" />
                            </div>
                        )}
                        <h1 className="font-semibold text-[13px] text-neutral-300 tracking-wider">
                            {siteName?.toUpperCase() || 'MOLICMS'}
                        </h1>
                    </Link>
                </div>

                <div className="px-6 mb-4">
                    <div className="h-px w-full bg-gradient-to-r from-neutral-800 to-transparent"></div>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 space-y-1 scrollbar-hide pb-10">
                    {filteredMenuItems.map(item => renderMenuItem(item))}
                </nav>

                <div className="p-4 border-t border-neutral-800/60">
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-900 group transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-bold text-neutral-400 group-hover:border-neutral-600 transition-colors">
                                {user.name?.[0] || 'A'}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[12px] font-medium text-neutral-300">{user.name || 'Admin'}</span>
                                <span className="text-[10px] text-neutral-600 uppercase">SYS_ADMIN</span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content (Ant Dark 原本风格: 明亮白) */}
            <div className="flex-1 flex flex-col h-screen relative z-20 overflow-hidden">
                <header className="h-14 flex items-center justify-between px-6 bg-white sticky top-0 z-30 shadow-[0_1px_4px_rgba(0,21,41,0.08)]">
                    <div className="flex items-center text-sm">
                        <button className="p-2 -ml-2 mr-2 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden">
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/" target="_blank" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-500 transition-all">
                            <Home className="w-[15px] h-[15px]" />
                            <span>首页预览</span>
                        </Link>
                        
                        <div className="h-4 w-px bg-gray-200" />
                        
                        <button
                            onClick={() => setIsSettingDrawerOpen(true)}
                            className="p-1.5 text-gray-600 hover:text-green-500 hover:bg-gray-100 rounded transition"
                        >
                            <Settings className="w-[18px] h-[18px]" />
                        </button>

                        <button
                            onClick={() => updateInfo?.hasUpdate ? setShowUpdateModal(true) : {}}
                            className="relative p-1.5 text-gray-600 hover:bg-gray-100 hover:text-green-500 rounded transition"
                        >
                            <Bell className="w-[18px] h-[18px]" />
                            {updateInfo?.hasUpdate && (
                                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
                            )}
                        </button>

                        <div className="h-4 w-px bg-gray-200" />
                        
                        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded transition group">
                            <div className="w-7 h-7 rounded-sm bg-neutral-100 border border-neutral-200 flex items-center justify-center text-sm font-semibold text-neutral-700">
                                {user.name?.[0] || 'A'}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{user.name || 'Admin'}</span>
                        </div>

                        <button onClick={() => logoutAction()} className="text-gray-400 hover:text-red-500 pl-2" title="退出">
                            <LogOut className="w-[15px] h-[15px]" />
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-[#f0f2f5]">
                    <div className="px-6 max-w-[1400px] mx-auto min-h-full">
                        <div className="bg-transparent py-6 min-h-[calc(100vh-100px)] rounded-sm">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
