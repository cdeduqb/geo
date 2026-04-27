'use client';

import React from 'react';
import { Settings, X, Check } from 'lucide-react';
import { useAdminLayout, ENABLED_LAYOUTS } from './AdminLayoutContext';

export default function ThemeSettingDrawer() {
    const { isSettingDrawerOpen, setIsSettingDrawerOpen, layoutType, setLayoutType } = useAdminLayout();

    if (!isSettingDrawerOpen) return null;

    const allLayouts = [
        {
            id: 'classic',
            name: '默认经典 (Classic)',
            description: '经典的左白右灰布局，高对比清爽体验',
            icon: (
                <div className="w-full flex h-16 border rounded bg-gray-50 overflow-hidden">
                    <div className="w-1/4 bg-white border-r"></div>
                    <div className="w-3/4 flex flex-col">
                        <div className="h-4 bg-white border-b"></div>
                        <div className="flex-1 p-2"><div className="w-full h-full bg-indigo-50/50 rounded"></div></div>
                    </div>
                </div>
            )
        },
        {
            id: 'ant-dark',
            name: '赛博企业级 (Cyber Ant)',
            description: '纯黑深灰极简侧栏 + 明亮高视口工作区',
            icon: (
                <div className="w-full flex h-16 border rounded bg-gray-50 overflow-hidden">
                    <div className="w-1/4 bg-[#0a0a0a] border-r border-neutral-800 flex flex-col gap-1 p-2">
                        <div className="h-1.5 w-full bg-neutral-800 rounded"></div>
                    </div>
                    <div className="w-3/4 flex flex-col">
                        <div className="h-4 bg-white border-b"></div>
                        <div className="flex-1 p-2"><div className="w-full h-full bg-gray-100 rounded"></div></div>
                    </div>
                </div>
            )
        },
        {
            id: 'vercel-top',
            name: '云原生极简 (Vercel Top)',
            description: '去侧边栏，顶级导航，最大化工作区',
            icon: (
                <div className="w-full flex flex-col h-16 border rounded bg-gray-50 overflow-hidden">
                    <div className="h-5 bg-white border-b flex justify-center items-center px-2 gap-1">
                        <div className="h-1 w-3 bg-gray-300 rounded"></div>
                        <div className="h-1 w-3 bg-gray-300 rounded"></div>
                    </div>
                    <div className="flex-1 p-2"><div className="w-full h-full border border-dashed border-gray-300 rounded"></div></div>
                </div>
            )
        },
        {
            id: 'macos-glass',
            name: 'Apple 拟物毛玻璃 (macOS)',
            description: '带有全局弥散背景光，全悬浮浮岛式高斯模糊组件',
            icon: (
                <div className="w-full flex h-16 border rounded bg-indigo-50/50 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-pink-200/40 via-purple-200/40 to-blue-200/40 opacity-70"></div>
                    <div className="w-1/4 p-1 z-10"><div className="w-full h-full bg-white/60 backdrop-blur-md rounded-md shadow-sm border border-white/50"></div></div>
                    <div className="w-3/4 flex flex-col p-1 pl-0 z-10">
                        <div className="h-3 w-full bg-white/60 backdrop-blur-md rounded-sm border border-white/50 mb-1"></div>
                        <div className="flex-1"><div className="w-full h-full bg-white/70 backdrop-blur-xl rounded-md shadow-sm border border-white/60"></div></div>
                    </div>
                </div>
            )
        }
    ];

    const layouts = allLayouts.filter(l => ENABLED_LAYOUTS.includes(l.id as any));

    // 如果只有一个启用的主题，但当前 Layout 状态与之不符，为了保证视觉一致性，最好通过某种方式让开发者明白当前应用的是该单一主题
    // 注意：实际状态仍受限于 AdminLayoutContext 中的缓存与默认值机制。

    return (
        <>
            <div 
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity" 
                onClick={() => setIsSettingDrawerOpen(false)}
            />
            <div className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-gray-700" />
                        <h2 className="font-bold text-gray-800">偏好设置</h2>
                    </div>
                    <button 
                        onClick={() => setIsSettingDrawerOpen(false)}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-4 tracking-wide uppercase">布局风格</h3>
                        <div className="space-y-3">
                            {layouts.map(l => (
                                <button
                                    key={l.id}
                                    onClick={() => setLayoutType(l.id as any)}
                                    className={`w-full text-left p-3 rounded-xl border-2 transition-all group ${
                                        layoutType === l.id 
                                        ? 'border-indigo-600 ring-2 ring-indigo-600/20 bg-indigo-50/10' 
                                        : 'border-transparent bg-gray-50 hover:bg-gray-100'
                                    }`}
                                >
                                    <div className="pointer-events-none">{l.icon}</div>
                                    <div className="mt-3 flex items-center justify-between pointer-events-none">
                                        <span className={`font-bold text-sm ${layoutType === l.id ? 'text-indigo-700' : 'text-gray-800'}`}>
                                            {l.name}
                                        </span>
                                        {layoutType === l.id && <Check className="w-4 h-4 text-indigo-600" />}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 pointer-events-none">{l.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
