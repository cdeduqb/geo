
'use client';

import { useState, useEffect } from 'react';
import { Loader2, Check, Sparkles, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Strategy {
    id: string;
    name: string;
    prompt: string;
    targetType: string;
    type: string;
}

interface StrategySelectorProps {
    targetType?: string;
    type?: string;
    onSelect: (strategyId: string) => void;
    onCancel: () => void;
}

export default function StrategySelector({ targetType, type, onSelect, onCancel }: StrategySelectorProps) {
    const [strategies, setStrategies] = useState<Strategy[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string>('');

    useEffect(() => {
        const fetchStrategies = async () => {
            try {
                const params = new URLSearchParams();
                if (targetType) params.append('targetType', targetType);
                if (type) params.append('type', type);

                const res = await fetch(`/api/admin/ai-strategies?${params.toString()}`);
                if (!res.ok) throw new Error('Failed to load strategies');
                const data = await res.json();
                setStrategies(data);
                if (data.length > 0) {
                    setSelectedId(data[0].id);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchStrategies();
    }, [targetType, type]);

    const handleGenerate = () => {
        if (!selectedId) return;
        onSelect(selectedId);
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
        );
    }

    if (strategies.length === 0) {
        return (
            <div className="text-center py-6">
                <Target className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-gray-500 mb-4">未找到匹配的 AI 策略。</p>
                <div className="flex justify-center gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        关闭
                    </button>
                    <a
                        href="/admin/ai/strategies"
                        target="_blank"
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        去创建策略
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {strategies.map((strategy) => (
                    <div
                        key={strategy.id}
                        onClick={() => setSelectedId(strategy.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedId === strategy.id
                            ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                            }`}
                    >
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 overflow-hidden flex-1">
                                <h4 className="font-medium text-gray-900 truncate">{strategy.name}</h4>
                                <Badge variant={strategy.type === 'IMAGE' ? 'outline' : 'secondary'} className={`text-[10px] h-4 px-1 leading-none ${strategy.type === 'IMAGE' ? 'text-green-600 border-green-200 bg-green-50' : 'text-blue-600 border-blue-200 bg-blue-50'}`}>
                                    {strategy.type === 'IMAGE' ? '图片' : '写作'}
                                </Badge>
                            </div>
                            {selectedId === strategy.id && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{strategy.prompt}</p>
                    </div>
                ))}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                    取消
                </button>
                <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={!selectedId}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                    <Sparkles className="w-4 h-4" />
                    立即生成
                </button>
            </div>
        </div>
    );
}
