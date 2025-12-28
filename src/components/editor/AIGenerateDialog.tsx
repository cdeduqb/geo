'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, X, Loader2 } from 'lucide-react';

interface AIGenerateDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (content: string) => void;
}

interface Strategy {
    id: string;
    name: string;
    targetType: string;
}

export default function AIGenerateDialog({ isOpen, onClose, onGenerate }: AIGenerateDialogProps) {
    const [topic, setTopic] = useState('');
    const [keywords, setKeywords] = useState('');
    const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
    const [strategyId, setStrategyId] = useState('');
    const [strategies, setStrategies] = useState<Strategy[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            const fetchStrategies = async () => {
                try {
                    const res = await fetch('/api/admin/ai-strategies/list');
                    if (res.ok) {
                        const data = await res.json();
                        // 过滤出适用于文章生成的策略
                        const articleStrategies = data.filter((s: Strategy) => s.targetType === 'article');
                        setStrategies(articleStrategies);
                        // 如果没有选定策略且有可用策略，默认选择第一个
                        if (!strategyId && articleStrategies.length > 0) {
                            setStrategyId(articleStrategies[0].id);
                        }
                    }
                } catch (error) {
                    console.error('Failed to fetch strategies:', error);
                }
            };
            fetchStrategies();
        }
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic,
                    keywords,
                    length,
                    strategyId,
                }),
            });

            if (!response.ok) {
                throw new Error('生成失败，请重试');
            }

            const data = await response.json();
            onGenerate(data.content);
            onClose();
        } catch (err) {
            setError('生成过程中发生错误，请稍后重试');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="bg-white  rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-100  bg-gradient-to-r from-blue-50 to-indigo-50   flex-shrink-0">
                    <div className="flex items-center gap-2 text-blue-600 ">
                        <Sparkles className="w-5 h-5" />
                        <h3 className="font-semibold">AI 智能创作</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 :text-gray-200 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
                    <div>
                        <label htmlFor="ai-strategy" className="block text-sm font-medium text-gray-700  mb-1">
                            创作策略
                        </label>
                        <select
                            id="ai-strategy"
                            value={strategyId}
                            onChange={(e) => setStrategyId(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200  rounded-lg bg-gray-50  focus:ring-2 focus:ring-blue-500 outline-none transition-all "
                        >
                            <option value="">默认通用策略</option>
                            {strategies.map((strategy) => (
                                <option key={strategy.id} value={strategy.id}>
                                    {strategy.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="ai-topic" className="block text-sm font-medium text-gray-700  mb-1">
                            文章主题 <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="ai-topic"
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSubmit(e as any);
                                }
                            }}
                            placeholder="例如：2025年人工智能发展趋势"
                            required
                            className="w-full px-4 py-2 border border-gray-200  rounded-lg bg-gray-50  focus:ring-2 focus:ring-blue-500 outline-none transition-all "
                        />
                    </div>

                    <div>
                        <label htmlFor="ai-keywords" className="block text-sm font-medium text-gray-700  mb-1">
                            关键词 (可选)
                        </label>
                        <input
                            id="ai-keywords"
                            type="text"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSubmit(e as any);
                                }
                            }}
                            placeholder="多个关键词用逗号分隔"
                            className="w-full px-4 py-2 border border-gray-200  rounded-lg bg-gray-50  focus:ring-2 focus:ring-blue-500 outline-none transition-all "
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700  mb-1">
                            篇幅长度
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['short', 'medium', 'long'] as const).map((l) => (
                                <button
                                    key={l}
                                    type="button"
                                    onClick={() => setLength(l)}
                                    className={`px-3 py-2 text-sm rounded-lg border transition-all ${length === l
                                        ? 'bg-blue-50 border-blue-500 text-blue-600  '
                                        : 'border-gray-200  text-gray-600 hover:bg-gray-50 :bg-gray-800 '
                                        }`}
                                >
                                    {l === 'short' ? '短篇' : l === 'medium' ? '中篇' : '长篇'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div className="text-sm text-red-500 bg-red-50  p-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="pt-2">
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e as any)}
                            disabled={loading || !topic.trim()}
                            className="w-full flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    正在生成中...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    开始生成
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
