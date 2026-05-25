'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, ShieldAlert, ArrowRight, Lock, Home, Loader2 } from 'lucide-react';

export default function AIProtectWall({ children }: { children?: React.ReactNode }) {
    const pathname = usePathname();
    const isStrategyPage = pathname === '/admin/ai/strategies' || pathname?.startsWith('/admin/ai/strategies/');
    const [isLoading, setIsLoading] = useState(true);
    const [isLicensed, setIsLicensed] = useState(false);

    useEffect(() => {
        const checkLicense = async () => {
            try {
                const res = await fetch('/api/license/info');
                if (res.ok) {
                    const data = await res.json();
                    if (data.licensed) {
                        setIsLicensed(true);
                    }
                }
            } catch (error) {
                console.error('AIProtectWall 客户端二次授权验证失败:', error);
            } finally {
                setIsLoading(false);
            }
        };
        checkLicense();
    }, []);

    // 如果仍在检测中，展示科技感加载状态以防界面突兀闪烁
    if (isLoading) {
        return (
            <div className="min-h-[600px] flex flex-col items-center justify-center p-6 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-indigo-500/50" />
                <p className="text-[13px] font-black tracking-widest text-slate-500 animate-pulse">正在校验系统安全授权...</p>
            </div>
        );
    }

    // 如果客户端二次校验确认系统已获授权，或者当前是创作策略页面，则直接放行渲染子组件
    if ((isLicensed || isStrategyPage) && children) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-[600px] flex items-center justify-center p-6">
            <div className="relative max-w-2xl w-full bg-slate-950 rounded-[40px] p-12 overflow-hidden shadow-2xl border border-slate-800 shadow-slate-900/50">
                {/* 科技感背景微光特效 */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] -mr-32 -mt-32 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] -ml-24 -mb-24 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[2px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent blur-[2px] pointer-events-none" />

                <div className="flex flex-col items-center text-center relative z-10">
                    {/* 呼吸灯特效的锁标志 */}
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-indigo-500/20 rounded-3xl blur-2xl animate-pulse" />
                        <div className="w-20 h-20 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 flex items-center justify-center shadow-xl ring-1 ring-white/10">
                            <Lock className="w-8 h-8 text-indigo-400 animate-pulse" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-indigo-600 border-2 border-slate-950 flex items-center justify-center">
                            <Sparkles className="w-3.5 h-3.5 text-white" />
                        </div>
                    </div>

                    {/* 功能标签 */}
                    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black tracking-wider uppercase mb-6">
                        <ShieldAlert className="w-3.5 h-3.5" /> AI 创作工厂商业授权版专属
                    </div>

                    {/* 主标题 */}
                    <h2 className="text-3xl font-black text-white tracking-tight mb-4 leading-tight">
                        解锁 AI 创作工厂，开启智能内容生产线
                    </h2>

                    {/* 描述 */}
                    <p className="text-slate-400 text-[14px] leading-relaxed max-w-md mb-10 font-medium">
                        AI 创作工厂是专为企业打造的批量文章与知识库自动化生产线。
                        当前系统未检测到有效的 AI 商业授权许可。激活授权后，您可即刻解锁
                        <span className="text-indigo-400">“批量任务自动生成”</span>、
                        <span className="text-indigo-400">“全网热点趋势监控”</span>以及
                        <span className="text-indigo-400">“企业自有知识库”</span>等高阶 AI 出海增长能力。
                    </p>

                    {/* 按钮动作 */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <Link
                            href="/admin/license"
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-black rounded-2xl hover:from-indigo-500 hover:to-purple-500 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all shadow-xl shadow-black/10 group"
                        >
                            立即激活商业授权 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/admin/dashboard"
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-slate-300 text-sm font-black rounded-2xl hover:bg-slate-800 hover:text-white border border-slate-800 transition-all active:scale-95"
                        >
                            <Home className="w-4 h-4" /> 返回控制台
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
