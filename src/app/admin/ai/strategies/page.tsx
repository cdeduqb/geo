export const dynamic = 'force-dynamic';

import { db } from '@/lib/db';
import StrategyList from './_components/StrategyList';
import { Lightbulb } from 'lucide-react';

export const metadata = {
    title: 'AI 创作策略 - GeoCMS 管理后台',
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Lightbulb className="w-8 h-8 text-blue-600" />
                        AI 创作策略
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        管理 Prompt 模板和生成参数，提升 AI 创作质量
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <StrategyList strategies={strategies} />
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
                        <h2 className="text-lg font-semibold mb-4 text-gray-900">💡 使用提示</h2>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">•</span>
                                <span>在 Prompt 中使用变量：<code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">{'{'}topic{'}'}</code> (主题)、<code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">{'{'}keywords{'}'}</code> (关键词)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">•</span>
                                <span>Temperature 越高生成内容越有创造性，建议 0.7-0.9</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">•</span>
                                <span>创建后的策略可用于批量 AI 创作任务</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
