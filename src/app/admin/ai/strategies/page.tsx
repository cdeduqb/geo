export const dynamic = 'force-dynamic';

import { db } from '@/lib/db';
import StrategyList from './_components/StrategyList';
import { Lightbulb } from 'lucide-react';

export const metadata = {
    title: 'AI 创作策略 - 企业官网 管理后台',
};

export default async function AIStrategiesPage() {
    const strategies = await db.aIStrategy.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { tasks: true },
            },
        },
    });

    return (
        <div className="space-y-6">
            {/* 页面头部 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                        <Lightbulb className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">AI 创作策略</h1>
                        <p className="text-[13px] text-gray-500 font-medium">
                            管理 Prompt 模板和生成参数，提升创作质量
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <StrategyList strategies={strategies} />
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm shadow-gray-100/50 p-8 sticky top-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                            <h2 className="text-lg font-black text-gray-900 tracking-tight">使用提示</h2>
                        </div>
                        <ul className="space-y-4 text-sm text-gray-600">
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                                <span>在 Prompt 中使用变量：<code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">{'{'}topic{'}'}</code> (主题)、<code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">{'{'}keywords{'}'}</code> (关键词)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                                <span>Temperature 越高生成内容越有创造性，建议 0.7-0.9</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                                <span>创建后的策略可用于批量 AI 创作任务</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
