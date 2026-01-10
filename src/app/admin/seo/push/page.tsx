import { db } from '@/lib/db';
import Link from 'next/link';
import { ArrowLeft, Send, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import BatchPushForm from './_components/BatchPushForm';
import PushHistory from './_components/PushHistory';

export default async function BatchPushPage() {
    // 获取所有已发布文章
    const articles = await db.article.findMany({
        where: { status: 'PUBLISHED' },
        select: {
            id: true,
            title: true,
            slug: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
    });

    // 获取活跃的推送配置
    const activeConfigs = await db.sEOPushConfig.findMany({
        where: { isActive: true },
        select: {
            id: true,
            platform: true,
            lastPushAt: true,
        },
    });

    // 获取最近的推送记录
    const recentLogs = await db.sEOPushLog.findMany({
        include: {
            config: {
                select: {
                    platform: true,
                }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
    });

    // 统计
    const totalPushed = await db.sEOPushLog.count();
    const successCount = await db.sEOPushLog.count({ where: { status: 'success' } });
    const failedCount = await db.sEOPushLog.count({ where: { status: 'failed' } });

    return (
        <div className="space-y-6">
            {/* 页面头部 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-100/50">
                        <Send className="w-7 h-7" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight">搜索引擎推送</h1>
                            <span className="text-blue-600 font-bold bg-blue-50 px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider">SEO</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs mt-1">
                            <span className="text-gray-400 font-medium">SEO 工具</span>
                            <span className="text-gray-300">›</span>
                            <span className="text-gray-400 font-bold">批量推送</span>
                        </div>
                    </div>
                </div>

                <Link
                    href="/admin/seo/configs"
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm hover:shadow-md"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>返回配置</span>
                </Link>
            </div>

            {/* 统计面板 */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm shadow-gray-100/50 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                    <div className="p-8 group hover:bg-blue-50/30 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">总推送次数</p>
                                <p className="text-3xl font-black text-gray-900 mt-2 font-mono">{totalPushed}</p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:shadow-lg group-hover:shadow-blue-100 transition-all">
                                <RefreshCw className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                            </div>
                        </div>
                    </div>

                    <div className="p-8 group hover:bg-green-50/30 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">推送成功</p>
                                <p className="text-3xl font-black text-green-600 mt-2 font-mono">{successCount}</p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center group-hover:bg-green-600 group-hover:shadow-lg group-hover:shadow-green-100 transition-all">
                                <CheckCircle className="w-7 h-7 text-green-600 group-hover:text-white transition-colors" />
                            </div>
                        </div>
                    </div>

                    <div className="p-8 group hover:bg-red-50/30 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">推送失败</p>
                                <p className="text-3xl font-black text-red-600 mt-2 font-mono">{failedCount}</p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center group-hover:bg-red-600 group-hover:shadow-lg group-hover:shadow-red-100 transition-all">
                                <XCircle className="w-7 h-7 text-red-600 group-hover:text-white transition-colors" />
                            </div>
                        </div>
                    </div>

                    <div className="p-8 group hover:bg-purple-50/30 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">活跃平台</p>
                                <p className="text-3xl font-black text-purple-600 mt-2 font-mono">{activeConfigs.length}</p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-600 group-hover:shadow-lg group-hover:shadow-purple-100 transition-all">
                                <Send className="w-7 h-7 text-purple-600 group-hover:text-white transition-colors" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 主要操作区 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 批量推送表单 */}
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm shadow-gray-100/50 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/20">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                            <h2 className="text-lg font-black text-gray-900 tracking-tight">批量推送文章</h2>
                        </div>
                    </div>
                    <div className="p-8">
                        <BatchPushForm articles={articles} platforms={activeConfigs} />
                    </div>
                </div>

                {/* 推送历史 */}
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm shadow-gray-100/50 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/20">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-gray-900 rounded-full" />
                            <h2 className="text-lg font-black text-gray-900 tracking-tight">推送历史记录</h2>
                        </div>
                    </div>
                    <div className="p-8">
                        <PushHistory logs={recentLogs} />
                    </div>
                </div>
            </div>
        </div>
    );
}
