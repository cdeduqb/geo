'use client';

import React from 'react';
import Link from 'next/link';
import { Bot, Home, Bell, ChevronRight, Menu, LogOut, Settings } from 'lucide-react';
import { useAdminLayout } from './AdminLayoutContext';

export default function CyberDarkLayout({ children }: { children: React.ReactNode }) {
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
        <div className="min-h-screen bg-[#0a0a0a] flex font-sans text-neutral-200 selection:bg-green-500/30 selection:text-green-200">
            {/* Sidebar */}
            <aside className="w-[240px] flex-shrink-0 bg-[#0a0a0a] border-r border-neutral-800/60 flex flex-col h-screen sticky top-0 z-40">
                <div className="h-16 flex items-center px-6">
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

                <nav className="flex-1 overflow-y-auto px-4 space-y-1 scrollbar-hide">
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
                        <button onClick={() => logoutAction()} className="text-neutral-600 hover:text-red-400 transition-colors">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen relative z-20">
                <header className="h-14 flex items-center justify-between px-6 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-30 border-b border-neutral-800/60">
                    <div className="flex items-center text-sm gap-2">
                        <button className="p-2 -ml-2 text-neutral-500 hover:text-neutral-300 rounded md:hidden">
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/" target="_blank" className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-300 transition-colors">
                            <Home className="w-4 h-4" />
                            <span>预览前端</span>
                        </Link>
                        <div className="h-4 w-px bg-neutral-800" />
                        <button onClick={() => setIsSettingDrawerOpen(true)} className="text-neutral-500 hover:text-neutral-300 transition-colors">
                            <Settings className="w-4 h-4" />
                        </button>
                        <button onClick={() => updateInfo?.hasUpdate ? setShowUpdateModal(true) : {}} className="relative text-neutral-500 hover:text-neutral-300 transition-colors">
                            <Bell className="w-4 h-4" />
                            {updateInfo?.hasUpdate && (
                                <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                            )}
                        </button>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto">
                    <div className="p-8 h-full max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
