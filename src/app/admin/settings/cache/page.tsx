'use client';

import { useState } from 'react';
import { Trash2, RefreshCw, Layers, FileText, Bot, Search, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface CleanupSection {
    id: string;
    title: string;
    description: string;
    icon: any;
    color: string;
    type: string;
}

const SECTIONS: CleanupSection[] = [
    {
        id: 'temp_pages',
        title: '临时页面清理',
        description: '删除所有系统生成且未转正的临时页面 (以 temp- 开头)',
        icon: Layers,
        color: 'blue',
        type: 'temp_pages'
    },
    {
        id: 'draft_articles',
        title: '陈旧草稿清理',
        description: '清理创建时间超过 30 天且从未发布的草稿文章',
        icon: FileText,
        color: 'orange',
        type: 'draft_articles'
    },
    {
        id: 'failed_ai_tasks',
        title: 'AI 任务清理',
        description: '清除所有状态为“失败”的 AI 自动创作任务记录',
        icon: Bot,
        color: 'purple',
        type: 'failed_ai_tasks'
    },
    {
        id: 'logs_cleanup',
        title: '系统日志清理',
        description: '清理一周前的 SEO 推送日志及爬虫访问记录',
        icon: Search,
        color: 'emerald',
        type: 'seo_push_logs' // 简化处理，可以一次清多种日志
    },
    {
        id: 'cache_reset',
        title: '全站缓存重置',
        description: '刷新全站 Next.js 静态页面缓存，立即应用最新改动',
        icon: RefreshCw,
        color: 'red',
        type: 'nextjs_cache'
    }
];

export default function CacheManagementPage() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState<string | null>(null);
    const [confirmId, setConfirmId] = useState<string | null>(null);

    const handleCleanup = async (id: string, type: string) => {
        setConfirmId(null);
        setLoading(id);

        try {
            const res = await fetch('/api/admin/system/cleanup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type })
            });

            const data = await res.json();

            if (data.success) {
                showToast(data.message || '操作成功', 'success');
            } else {
                const errorMsg = data.details ? `${data.error} (${data.details})` : (data.error || '操作失败');
                throw new Error(errorMsg);
            }
        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                        <RefreshCw className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">清理缓存 & 系统优化</h1>
                    </div>
                </div>
            </div>

            {/* Introduction Card */}
            <div className="bg-white rounded-[24px] border border-gray-100 p-3 shadow-sm shadow-gray-100/50">
                <div className="px-4 py-2">
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                        定期清理系统冗余数据可以有效提升数据库性能与页面加载速度。执行重置操作将刷新全站静态缓存。
                    </p>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {SECTIONS.map((section) => {
                    const themeMap: Record<string, { primary: string, bg: string, ring: string, shadow: string, hoverShadow: string, text: string }> = {
                        blue: { primary: 'bg-blue-600', bg: 'bg-blue-50/50', ring: 'ring-blue-100/50', shadow: 'shadow-blue-100', hoverShadow: 'shadow-blue-200/50', text: 'text-blue-600' },
                        orange: { primary: 'bg-orange-500', bg: 'bg-orange-50/50', ring: 'ring-orange-100/50', shadow: 'shadow-orange-100', hoverShadow: 'shadow-orange-200/50', text: 'text-orange-600' },
                        purple: { primary: 'bg-purple-600', bg: 'bg-purple-50/50', ring: 'ring-purple-100/50', shadow: 'shadow-purple-100', hoverShadow: 'shadow-purple-200/50', text: 'text-purple-600' },
                        emerald: { primary: 'bg-emerald-600', bg: 'bg-emerald-50/50', ring: 'ring-emerald-100/50', shadow: 'shadow-emerald-100', hoverShadow: 'shadow-emerald-200/50', text: 'text-emerald-600' },
                        red: { primary: 'bg-red-600', bg: 'bg-red-50/50', ring: 'ring-red-100/50', shadow: 'shadow-red-100', hoverShadow: 'shadow-red-200/50', text: 'text-red-600' }
                    };

                    const theme = themeMap[section.color] || themeMap.blue;

                    return (
                        <div key={section.id} className="group relative bg-white rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-50/50 transition-all duration-700 overflow-hidden flex flex-col">
                            {/* Decorative Glow */}
                            <div className={`absolute top-0 right-0 w-40 h-40 ${theme.primary} opacity-[0.03] rounded-full blur-[80px] -mr-20 -mt-20 group-hover:opacity-[0.08] transition-opacity duration-700`} />

                            <div className="p-10 relative z-10 flex-1">
                                <div className="flex flex-col items-center text-center">
                                    <div className={`w-20 h-20 rounded-[28px] ${theme.primary} flex items-center justify-center text-white shadow-2xl ${theme.shadow} mb-6`}>
                                        <section.icon className="w-10 h-10" />
                                    </div>

                                    <h3 className="text-xl font-black text-gray-900 tracking-tight mb-4 group-hover:text-blue-600 transition-colors uppercase">
                                        {section.title}
                                    </h3>

                                    <p className="text-sm text-gray-400 font-bold leading-relaxed px-2">
                                        {section.description}
                                    </p>
                                </div>
                            </div>

                            <div className="px-10 pb-10 pt-0 relative z-10">
                                <button
                                    disabled={loading !== null}
                                    onClick={() => setConfirmId(section.id)}
                                    className="w-full h-14 rounded-2xl flex items-center justify-center gap-3 text-xs font-black transition-all duration-500 bg-gray-900 text-white hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 active:scale-95 disabled:opacity-50 group-hover:bg-blue-600 group-hover:shadow-xl group-hover:shadow-blue-200"
                                >
                                    {loading === section.id ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-5 h-5" />
                                    )}
                                    <span className="uppercase tracking-widest">立即执行</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 安全提示卡片深度优化 */}
            <div className="bg-blue-50/30 rounded-[40px] p-10 overflow-hidden relative border border-blue-100/50 group shadow-sm">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100/20 rounded-full blur-[100px] -mr-40 -mt-40 transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-[80px] -ml-32 -mb-32" />

                <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
                    <div className="w-20 h-20 rounded-[30px] bg-white flex items-center justify-center text-blue-600 shadow-2xl shadow-blue-100/50 ring-1 ring-blue-50 transition-transform duration-500 group-hover:scale-110">
                        <AlertCircle className="w-10 h-10 text-amber-400 animate-pulse" />
                    </div>
                    <div className="flex-1 text-center lg:text-left space-y-3">
                        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
                            <h4 className="text-2xl font-black text-gray-900 tracking-tight">安全指南 & 系统维护温馨提示</h4>
                            <span className="px-3 py-1 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg animate-bounce">
                                强烈建议
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm font-bold leading-relaxed max-w-3xl opacity-80">
                            执行清理操作后，相关数据将被永久从数据库中移除。建议定期执行此类维护操作，以保持系统的轻量化和响应速度。
                            重置缓存操作可能会导致下一次访问时加载速度略有降低（因为需要重新生成静态页）。
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-blue-50 flex items-center justify-center text-[10px] font-black text-blue-300">
                                    0{i}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {SECTIONS.map((section) => (
                <ConfirmDialog
                    key={`confirm-${section.id}`}
                    isOpen={confirmId === section.id}
                    onCancel={() => setConfirmId(null)}
                    onConfirm={() => handleCleanup(section.id, section.type)}
                    title={section.title}
                    message={`您确定要执行“${section.title}”吗？此操作无法撤销。`}
                    confirmText="确认清理"
                    confirmButtonClass={section.type === 'nextjs_cache' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600 hover:bg-red-700'}
                    isLoading={loading === section.id}
                />
            ))}
        </div>
    );
}
