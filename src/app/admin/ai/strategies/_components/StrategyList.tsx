'use client';

import { useState } from 'react';
import { Edit, Plus, Thermometer, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';
import StrategyForm from './StrategyForm';
import { Badge } from "@/components/ui/badge";
import DeleteStrategyButton from './DeleteStrategyButton';

interface StrategyListProps {
    strategies: any[];
}

export default function StrategyList({ strategies }: StrategyListProps) {
    const router = useRouter();
    const [editingStrategy, setEditingStrategy] = useState<any>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);

    if (editingStrategy) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h3 className="font-semibold text-gray-900">编辑策略</h3>
                    <button
                        onClick={() => setEditingStrategy(null)}
                        className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                    >
                        取消
                    </button>
                </div>
                <div className="p-6">
                    <StrategyForm
                        initialData={editingStrategy}
                        onSuccess={() => setEditingStrategy(null)}
                    />
                </div>
            </div>
        );
    }

    if (showCreateForm) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h3 className="font-semibold text-gray-900">新建策略</h3>
                    <button
                        onClick={() => setShowCreateForm(false)}
                        className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                    >
                        取消
                    </button>
                </div>
                <div className="p-6">
                    <StrategyForm onSuccess={() => setShowCreateForm(false)} />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-semibold text-gray-900">策略列表</h3>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    <Plus className="h-4 w-4 mr-1.5" />
                    新建策略
                </button>
            </div>

            <div className="p-6">
                {strategies.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <Target className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                        <p>暂无 AI 策略，点击右上角按钮创建第一个策略</p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {strategies.map((strategy) => (
                            <div
                                key={strategy.id}
                                className="group relative flex flex-col bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all duration-200"
                            >
                                <div className="p-5 flex-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-1" title={strategy.name}>
                                                {strategy.name}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Badge variant={strategy.type === 'IMAGE' ? 'outline' : 'secondary'} className={`font-normal text-xs ${strategy.type === 'IMAGE' ? 'text-green-600 border-green-200 bg-green-50' : 'text-blue-600 border-blue-200 bg-blue-50'}`}>
                                                    {strategy.type === 'IMAGE' ? '图片' : '写作'}
                                                </Badge>
                                                <Badge variant="outline" className="font-normal text-xs text-gray-500 border-gray-200 bg-gray-50">
                                                    {strategy.targetType}
                                                </Badge>
                                                {strategy._count && (
                                                    <span className="text-xs text-gray-400">
                                                        {strategy._count.tasks} 个任务
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => setEditingStrategy(strategy)}
                                                className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                                                title="编辑"
                                            >
                                                <Edit className="h-3.5 w-3.5" />
                                            </button>
                                            <DeleteStrategyButton strategyId={strategy.id} />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                                            <Thermometer className="w-3.5 h-3.5" />
                                            <span>创造性 (Temperature): {strategy.temperature}</span>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                            <p className="line-clamp-3 text-xs text-gray-600 font-mono leading-relaxed">
                                                {strategy.prompt}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
