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
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm shadow-gray-100/50 overflow-hidden">
                <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                        <h3 className="font-black text-gray-900 tracking-tight">编辑策略</h3>
                    </div>
                    <button
                        onClick={() => setEditingStrategy(null)}
                        className="text-sm text-gray-500 hover:text-gray-700 font-bold px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        取消
                    </button>
                </div>
                <div className="p-8">
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
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm shadow-gray-100/50 overflow-hidden">
                <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-green-600 rounded-full" />
                        <h3 className="font-black text-gray-900 tracking-tight">新建策略</h3>
                    </div>
                    <button
                        onClick={() => setShowCreateForm(false)}
                        className="text-sm text-gray-500 hover:text-gray-700 font-bold px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        取消
                    </button>
                </div>
                <div className="p-8">
                    <StrategyForm onSuccess={() => setShowCreateForm(false)} />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm shadow-gray-100/50 overflow-hidden">
            <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                    <h3 className="font-black text-gray-900 tracking-tight">策略列表</h3>
                </div>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    新建策略
                </button>
            </div>

            <div className="p-8">
                {strategies.length === 0 ? (
                    <div className="text-center py-16 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="font-medium">暂无 AI 策略，点击右上角按钮创建第一个策略</p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {strategies.map((strategy) => (
                            <div
                                key={strategy.id}
                                className="group relative flex flex-col bg-white rounded-[24px] border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="p-6 flex-1">
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
