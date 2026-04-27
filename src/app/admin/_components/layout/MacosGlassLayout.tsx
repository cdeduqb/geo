'use client';

import React from 'react';
import Link from 'next/link';
import { Bot, Home, Bell, ChevronRight, Menu, LogOut, Settings } from 'lucide-react';
import { useAdminLayout } from './AdminLayoutContext';

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
        <div className="min-h-screen flex font-sans text-gray-900 bg-[#f4f4f5] relative overflow-hidden">
            {/* Global Ambient Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-400/20 rounded-full blur-[140px]" />
                <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-rose-400/10 rounded-full blur-[100px]" />
            </div>

            {/* Floating Sidebar */}
            <div className="w-64 p-4 h-screen sticky top-0 flex-shrink-0 z-40 hidden md:block">
                <aside className="w-full h-full bg-white/40 backdrop-blur-2xl rounded-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden">
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

                    <div className="p-4 border-t border-black/5 bg-white/20">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-100 to-white border border-white/60 shadow-sm flex items-center justify-center text-xs font-bold text-gray-700">
                                    {user.name?.[0] || 'A'}
                                </div>
                                <div className="text-[12px] font-bold text-gray-700 truncate max-w-[80px]">{user.name || 'Admin'}</div>
                            </div>
                            <button
                                onClick={() => logoutAction()}
                                className="p-1.5 text-gray-500 hover:bg-white/50 hover:text-red-500 rounded-lg transition-colors border border-transparent hover:border-white/50"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen h-[100dvh] relative z-20 md:pr-4 md:py-4">
                <div className="flex-1 flex flex-col relative rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.04)] bg-white/60 border border-white/60 backdrop-blur-2xl">
                    <header className="h-14 flex items-center justify-between px-6 border-b border-black/5 bg-white/40">
                        <div className="flex items-center text-sm gap-2">
                            <button className="p-1.5 text-gray-500 hover:bg-white/60 rounded-md md:hidden">
                                <Menu className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/" target="_blank" className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-white/60 rounded-md transition-colors border border-transparent hover:border-white/50">
                                <Home className="w-4 h-4" />
                            </Link>
                            <button
                                onClick={() => setIsSettingDrawerOpen(true)}
                                className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-white/60 rounded-md transition-colors border border-transparent hover:border-white/50"
                            >
                                <Settings className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => updateInfo?.hasUpdate ? setShowUpdateModal(true) : {}}
                                className="relative p-1.5 text-gray-500 hover:text-gray-900 hover:bg-white/60 rounded-md transition-colors border border-transparent hover:border-white/50"
                            >
                                <Bell className="w-4 h-4" />
                                {updateInfo?.hasUpdate && (
                                    <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
                                )}
                            </button>
                        </div>
                    </header>
                    <main className="flex-1 overflow-y-auto">
                        <div className="p-6 h-full max-w-7xl mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
