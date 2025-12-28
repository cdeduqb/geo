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
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/admin/seo/configs"
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Send className="w-8 h-8 text-blue-600" />
                            批量 SEO 推送
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            一键推送文章到搜索引擎，加速收录
                        </p>
                    </div>
                </div>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">总推送次数</p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">{totalPushed}</p>
                        </div>
                        <RefreshCw className="w-10 h-10 text-blue-500 opacity-20" />
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">成功</p>
                            <p className="text-2xl font-bold text-green-600 mt-2">{successCount}</p>
                        </div>
                        <CheckCircle className="w-10 h-10 text-green-500 opacity-20" />
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">失败</p>
                            <p className="text-2xl font-bold text-red-600 mt-2">{failedCount}</p>
                        </div>
                        <XCircle className="w-10 h-10 text-red-500 opacity-20" />
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">活跃平台</p>
                            <p className="text-2xl font-bold text-blue-600 mt-2">{activeConfigs.length}</p>
                        </div>
                        <Send className="w-10 h-10 text-blue-500 opacity-20" />
                    </div>
                </div>
            </div>

            {/* 批量推送表单 */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">批量推送文章</h2>
                <BatchPushForm articles={articles} platforms={activeConfigs} />
            </div>

            {/* 推送历史 */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">推送历史</h2>
                <PushHistory logs={recentLogs} />
            </div>
        </div>
    );
}
