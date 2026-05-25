'use client';

import React from 'react';
import {
    FileText,
    Files,
    ShoppingBag,
    Image as ImageIcon,
    LayoutDashboard,
    Clock,
    Sparkles,
    Zap,
    ArrowRight,
    Settings
} from 'lucide-react';
import Link from 'next/link';
import { useAdminLayout } from '@/app/admin/_components/layout/AdminLayoutContext';

interface DashboardUIProps {
    stats: any;
    recent: any;
}

function formatDate(date: Date) {
    return new Date(date).toLocaleDateString('zh-CN', {
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });
}

function formatPrice(price: number) {
    return new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: 'CNY'
    }).format(price);
}

export default function DashboardUI({ stats, recent }: DashboardUIProps) {
    const { layoutType } = useAdminLayout();
    
    const now = new Date();
    const hours = now.getHours();
    let greeting = '你好';
    if (hours < 12) greeting = '早上好';
    else if (hours < 18) greeting = '下午好';
    else greeting = '晚上好';

    // === 根据不同布局动态生成卡片骨架的基础类 (仅保留 classic 和 vercel-top) ===
    
    // 欢迎大卡的风格
    const welcomeCardStyleMap: Record<string, string> = {
        'classic': 'bg-[#0F172A] rounded-[32px] shadow-2xl shadow-gray-200/50',
        'vercel-top': 'bg-black rounded-xl border border-gray-800',
    };

    const welcomeTitleStyleMap: Record<string, string> = {
        'classic': 'text-3xl font-black text-white tracking-tight',
        'vercel-top': 'text-3xl font-bold text-white tracking-tighter',
    };

    // 数据小卡片的风格
    const statCardStyleMap: Record<string, string> = {
        'classic': 'bg-white rounded-[28px] border border-gray-100 shadow-sm shadow-gray-100/50 hover:shadow-xl hover:-translate-y-1',
        'vercel-top': 'bg-white rounded-xl border border-gray-200 shadow-sm transition-shadow hover:shadow-md',
    };
    
    const statIconWrapperMap: Record<string, string> = {
        'classic': 'w-14 h-14 rounded-2xl',
        'vercel-top': 'w-12 h-12 rounded-lg border',
    };

    const statNumStyleMap: Record<string, string> = {
        'classic': 'text-3xl font-black text-gray-900 tracking-tight',
        'vercel-top': 'text-3xl font-bold text-black tracking-tighter',
    };

    // 模块通用外壳的风格 (比如快捷操作/最近动态的外壳)
    const blockCardStyleMap: Record<string, string> = {
        'classic': 'bg-white rounded-[24px] border border-gray-100 shadow-sm shadow-gray-100/50',
        'vercel-top': 'bg-white rounded-xl border border-gray-200 shadow-sm',
    };
    
    const blockTitleStyleMap: Record<string, string> = {
        'classic': 'text-lg font-black text-gray-900 tracking-tight',
        'vercel-top': 'text-[16px] font-medium text-gray-900 tracking-tight',
    };

    const actionItemStyleMap: Record<string, string> = {
        'classic': 'rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-white',
        'vercel-top': 'rounded-lg border border-gray-200 hover:border-black transition-colors bg-white',
    };

    return (
        <div className="space-y-6 lg:space-y-8 max-w-7xl mx-auto w-full transition-all duration-300">
            {/* 顶部欢迎区域 */}
            <div className={`relative overflow-hidden p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700 group ${welcomeCardStyleMap[layoutType] || welcomeCardStyleMap.classic}`}>
                {/* 背景装饰 (Classic专属动态背景) */}
                {layoutType === 'classic' && (
                    <>
                        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-purple-600/20 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-600/10 to-transparent blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
                    </>
                )}

                <div className="relative z-10 flex items-center gap-6">
                    {layoutType === 'classic' && (
                        <div className="flex items-center justify-center text-white w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
                            <LayoutDashboard className="w-8 h-8" />
                        </div>
                    )}
                    <div>
                        <h1 className={`${welcomeTitleStyleMap[layoutType] || welcomeTitleStyleMap.classic} flex items-center gap-3 mb-2`}>
                            {greeting}，管理员
                            {layoutType === 'classic' && (
                                <div className="relative">
                                    <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                                </div>
                            )}
                        </h1>
                        <p className={`text-sm ${layoutType === 'vercel-top' ? 'text-gray-400' : 'text-slate-400'} font-medium`}>
                            欢迎来到您的数字指挥中心，今天又是充满活力的一天
                        </p>
                    </div>
                </div>
                <div className={`relative z-10 flex items-center gap-4 text-sm ${layoutType === 'classic' ? 'font-bold bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-slate-300' : 'bg-white/10 rounded-lg px-4 py-2 border border-white/20 text-slate-300'} transition-colors cursor-default`}>
                    <Clock className={`w-4 h-4 ${layoutType === 'classic' ? 'text-blue-400' : 'text-gray-300'}`} />
                    <span>{now.toLocaleDateString('zh-CN')}</span>
                    <span className="w-px h-3 bg-white/20" />
                    <span>{now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>

            {/* 统计卡片区域 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 fill-mode-backwards">
                {/* 统一渲染卡片的方法 */}
                {[
                    { title: '总文章数', unit: '篇', count: stats.articleCount, icon: FileText, color: 'blue' },
                    { title: '总产品数', unit: '款', count: stats.productCount, icon: ShoppingBag, color: 'purple' },
                    { title: '页面总数', unit: '个', count: stats.pageCount, icon: Files, color: 'green' },
                    { title: '资源文件', unit: '个', count: stats.fileCount, icon: ImageIcon, color: 'orange' }
                ].map((item, index) => {
                    // 颜色配置映射
                    const colorMap: any = {
                        blue: { bg: 'bg-blue-50', text: 'text-blue-600', hoverBg: 'group-hover:bg-blue-600', border: 'border-blue-100' },
                        purple: { bg: 'bg-purple-50', text: 'text-purple-600', hoverBg: 'group-hover:bg-purple-600', border: 'border-purple-100' },
                        green: { bg: 'bg-green-50', text: 'text-green-600', hoverBg: 'group-hover:bg-green-600', border: 'border-green-100' },
                        orange: { bg: 'bg-orange-50', text: 'text-orange-600', hoverBg: 'group-hover:bg-orange-600', border: 'border-orange-100' }
                    };
                    const c = colorMap[item.color];

                    return (
                        <div key={index} className={`relative overflow-hidden p-6 transition-all duration-300 group ${statCardStyleMap[layoutType] || statCardStyleMap.classic}`}>
                            <div className="relative z-10 flex items-center gap-5">
                                <div className={`${statIconWrapperMap[layoutType] || statIconWrapperMap.classic} flex items-center justify-center ${c.bg} ${c.text} ${c.hoverBg} group-hover:text-white transition-colors duration-300 ${layoutType === 'vercel-top' ? c.border : ''}`}>
                                    <item.icon className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className={`mb-1 transition-colors ${layoutType === 'classic' ? 'text-xs font-black uppercase tracking-widest text-gray-400 group-hover:' + c.text : 'text-[13px] font-medium text-gray-500'}`}>
                                        {item.title}
                                    </h3>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className={`${statNumStyleMap[layoutType] || statNumStyleMap.classic}`}>{item.count}</span>
                                        <span className={`font-bold ${layoutType === 'classic' ? 'text-xs text-gray-400' : 'text-sm text-gray-500'}`}>{item.unit}</span>
                                    </div>
                                </div>
                            </div>
                            {layoutType === 'classic' && (
                                <div className={`absolute -bottom-6 -right-6 text-${item.color}-50 transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500`}>
                                    <item.icon className="w-32 h-32 text-gray-100 opacity-50" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* 快捷入口 */}
            <div className={`p-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-backwards ${blockCardStyleMap[layoutType] || blockCardStyleMap.classic}`}>
                <div className="flex items-center gap-3 mb-6">
                    {layoutType === 'classic' && <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full" />}
                    <h3 className={`${blockTitleStyleMap[layoutType] || blockTitleStyleMap.classic} flex items-center gap-2`}>
                        {layoutType === 'classic' && <Zap className="w-5 h-5 text-yellow-500" />}
                        快捷操作
                    </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { href: '/admin/articles/create', title: '发布文章', desc: '撰写并发布新博文', icon: FileText, colorHover: 'hover:border-blue-300' },
                        { href: '/admin/products/create', title: '发布产品', desc: '上架新的商品信息', icon: ShoppingBag, colorHover: 'hover:border-purple-300' },
                        { href: '/admin/files', title: '管理资源', desc: '查看图库与媒体', icon: ImageIcon, colorHover: 'hover:border-green-300' },
                        { href: '/admin/settings/site', title: '系统设置', desc: '配置站点参数', icon: Settings, colorHover: 'hover:border-orange-300' },
                    ].map((btn, index) => (
                        <Link
                            key={index}
                            href={btn.href}
                            className={`relative overflow-hidden group p-4 sm:p-5 transition-all duration-300 flex items-center gap-4 z-10 ${actionItemStyleMap[layoutType] || actionItemStyleMap.classic} ${btn.colorHover}`}
                        >
                            <div className="w-12 h-12 flex items-center justify-center shadow-sm transition-all duration-300 rounded-xl border border-gray-100 bg-white text-gray-600 group-hover:bg-gray-900 group-hover:text-white group-hover:border-gray-900">
                                <btn.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className={`truncate transition-colors ${layoutType === 'classic' ? 'text-sm font-black text-gray-900' : 'text-[14px] font-semibold text-gray-800 group-hover:text-black'}`}>{btn.title}</h4>
                                <p className={`truncate transition-colors mt-0.5 ${layoutType === 'classic' ? 'text-[10px] text-gray-400 font-medium' : 'text-xs text-gray-500'}`}>{btn.desc}</p>
                            </div>
                            {layoutType === 'classic' && <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-white transition-all" />}
                        </Link>
                    ))}
                </div>
            </div>

            {/* 最近动态 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300 fill-mode-backwards">
                {/* 最新文章 */}
                <div className={`p-6 flex flex-col ${blockCardStyleMap[layoutType] || blockCardStyleMap.classic}`}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            {layoutType === 'classic' && <div className="w-1.5 h-6 bg-blue-600 rounded-full" />}
                            <h3 className={`${blockTitleStyleMap[layoutType] || blockTitleStyleMap.classic}`}>最新文章</h3>
                        </div>
                        <Link href="/admin/articles" className={`flex items-center gap-1 transition-colors ${layoutType === 'classic' ? 'text-sm text-blue-600 font-bold bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-100' : 'text-[13px] text-[#1677ff] hover:text-blue-500'}`}>
                            {layoutType === 'classic' ? '查看全部' : '更多'} <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    {recent.articles.length > 0 ? (
                        <div className="space-y-3 flex-1">
                            {recent.articles.map((article: any) => (
                                <Link key={article.id} href={`/admin/articles/${article.id}`} className={`flex items-start gap-4 group transition-colors ${layoutType === 'classic' ? 'hover:bg-gray-50 p-3 -mx-3 rounded-2xl' : 'hover:bg-gray-50 p-2 -mx-2 rounded-md border-b border-transparent hover:border-gray-100'}`}>
                                    <div className={`flex-shrink-0 overflow-hidden bg-gray-100 ${layoutType === 'classic' ? 'w-12 h-12 rounded-2xl border border-gray-200' : 'w-10 h-10 rounded-md border border-gray-200'}`}>
                                        {article.coverImage ? (
                                            <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-blue-600 bg-blue-50">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 py-0.5">
                                        <div className={`truncate transition-colors ${layoutType === 'classic' ? 'text-sm font-bold text-gray-900 group-hover:text-blue-600' : 'text-[14px] text-gray-800 hover:text-blue-600'}`}>{article.title}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`font-medium ${layoutType === 'classic' ? 'text-xs text-gray-400' : 'text-[12px] text-gray-400'}`}>{formatDate(article.createdAt)}</span>
                                            {article.author?.name && (
                                                <span className={`font-medium ${layoutType === 'classic' ? 'text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-lg' : 'text-[12px] text-gray-400'}`}>
                                                    {layoutType !== 'classic' ? '· ' : ''}{article.author.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-12">
                            <FileText className="w-8 h-8 opacity-30 mb-2" />
                            <p className="text-sm">暂无数据</p>
                        </div>
                    )}
                </div>

                {/* 最新产品 */}
                <div className={`p-6 flex flex-col ${blockCardStyleMap[layoutType] || blockCardStyleMap.classic}`}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            {layoutType === 'classic' && <div className="w-1.5 h-6 bg-purple-600 rounded-full" />}
                            <h3 className={`${blockTitleStyleMap[layoutType] || blockTitleStyleMap.classic}`}>最新产品</h3>
                        </div>
                        <Link href="/admin/products" className={`flex items-center gap-1 transition-colors ${layoutType === 'classic' ? 'text-sm text-purple-600 font-bold bg-purple-50 px-3 py-1.5 rounded-xl hover:bg-purple-100' : 'text-[13px] text-[#1677ff] hover:text-blue-500'}`}>
                            {layoutType === 'classic' ? '查看全部' : '更多'} <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    {recent.products.length > 0 ? (
                        <div className="space-y-3 flex-1">
                            {recent.products.map((product: any) => (
                                <Link key={product.id} href={`/admin/products/${product.id}`} className={`flex items-start gap-4 group transition-colors ${layoutType === 'classic' ? 'hover:bg-gray-50 p-3 -mx-3 rounded-2xl' : 'hover:bg-gray-50 p-2 -mx-2 rounded-md border-b border-transparent hover:border-gray-100'}`}>
                                    <div className={`flex-shrink-0 overflow-hidden bg-gray-100 ${layoutType === 'classic' ? 'w-12 h-12 rounded-2xl border border-gray-200' : 'w-10 h-10 rounded-md border border-gray-200'}`}>
                                        {product.coverImage ? (
                                            <img src={product.coverImage} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-purple-400 bg-purple-50">
                                                <ShoppingBag className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 py-0.5">
                                        <div className={`truncate transition-colors ${layoutType === 'classic' ? 'text-sm font-bold text-gray-900 group-hover:text-purple-600' : 'text-[14px] text-gray-800 hover:text-blue-600'}`}>{product.name}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`font-bold ${layoutType === 'classic' ? 'text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg' : 'text-[13px] text-gray-900'}`}>{formatPrice(Number(product.price))}</span>
                                            <span className={`font-medium ${layoutType === 'classic' ? 'text-[10px] text-gray-400' : 'text-[12px] text-gray-400'} before:content-['·'] before:mr-1`}>{formatDate(product.createdAt)}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-12">
                            <ShoppingBag className="w-8 h-8 opacity-30 mb-2" />
                            <p className="text-sm">暂无数据</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
