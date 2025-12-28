import { useState, useEffect } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { Outline } from './CopilotWizard';

interface Step1OutlineProps {
    topic: string;
    setTopic: (topic: string) => void;
    keywords: string;
    setKeywords: (keywords: string) => void;
    strategyId: string;
    setStrategyId: (id: string) => void;
    onNext: (outline: Outline) => void;
}

interface Strategy {
    id: string;
    name: string;
    targetType: string;
}

export default function Step1Outline({ topic, setTopic, keywords, setKeywords, strategyId, setStrategyId, onNext }: Step1OutlineProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [strategies, setStrategies] = useState<Strategy[]>([]);

    useEffect(() => {
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
    }, [strategyId, setStrategyId]);

    const handleGenerate = async () => {
        if (!topic) {
            alert('请输入文章主题');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/ai/outline', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, keywords, strategyId }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
                const errorMessage = errorData.error || `HTTP ${res.status}: ${res.statusText}`;
                throw new Error(errorMessage);
            }

            const data = await res.json();
            onNext(data);
        } catch (error) {
            console.error('Outline generation error:', error);
            const errorMessage = error instanceof Error ? error.message : '生成大纲失败';
            alert(`生成大纲失败: ${errorMessage}\n\n请检查AI配置是否正确，或稍后重试。`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900">第一步：确定主题与大纲</h2>
                <p className="mt-2 text-gray-500">
                    选择创作策略并输入主题，AI 将为您生成一份结构化的大纲。
                </p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="strategy" className="text-sm font-medium text-gray-700">
                        创作策略
                    </label>
                    <select
                        id="strategy"
                        value={strategyId}
                        onChange={(e) => setStrategyId(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="">默认通用策略</option>
                        {strategies.map((strategy) => (
                            <option key={strategy.id} value={strategy.id}>
                                {strategy.name}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500">
                        不同的策略会影响生成内容的风格、结构和侧重点。
                    </p>
                </div>

                <div className="space-y-2">
                    <label htmlFor="topic" className="text-sm font-medium text-gray-700">
                        文章主题 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="例如：2024年人工智能发展趋势"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="keywords" className="text-sm font-medium text-gray-700">
                        关键词 (可选)
                    </label>
                    <input
                        type="text"
                        id="keywords"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="例如：AI, LLM, 机器学习 (用逗号分隔)"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !topic}
                    className="w-full flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3.5 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            正在思考大纲...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            生成大纲
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
