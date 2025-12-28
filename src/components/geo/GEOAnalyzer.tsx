'use client';

import { useState } from 'react';
import { Sparkles, Loader2, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';

interface GEOAnalyzerProps {
    title: string;
    content: string;
    summary?: string;
}

interface AnalysisResult {
    score: number;
    suggestions: Array<{
        type: 'info' | 'warning' | 'success' | 'error';
        category: string;
        title: string;
        description: string;
    }>;
    contentAnalysis: {
        wordCount: number;
        hasHeadings: boolean;
        hasLists: boolean;
        hasImages: boolean;
        readabilityScore: number;
    };
}

export default function GEOAnalyzer({ title, content, summary }: GEOAnalyzerProps) {
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const analyze = async () => {
        if (!content || content.length < 50) {
            setError('请先填写足够的内容（至少 50 字）');
            return;
        }

        setAnalyzing(true);
        setError(null);

        try {
            const res = await fetch('/api/admin/geo/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, summary })
            });

            if (!res.ok) {
                throw new Error('分析失败');
            }

            const data = await res.json();
            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : '分析失败');
        } finally {
            setAnalyzing(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBg = (score: number) => {
        if (score >= 80) return 'bg-green-100';
        if (score >= 60) return 'bg-yellow-100';
        return 'bg-red-100';
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
            case 'error': return <XCircle className="w-4 h-4 text-red-600" />;
            default: return <Info className="w-4 h-4 text-blue-600" />;
        }
    };

    const getBgColor = (type: string) => {
        switch (type) {
            case 'success': return 'bg-green-50 border-green-200';
            case 'warning': return 'bg-yellow-50 border-yellow-200';
            case 'error': return 'bg-red-50 border-red-200';
            default: return 'bg-blue-50 border-blue-200';
        }
    };

    return (
        <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    GEO 优化分析
                </h3>
                <button
                    onClick={analyze}
                    disabled={analyzing}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50 transition-colors"
                    type="button"
                >
                    {analyzing ? (
                        <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            分析中...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-3 h-3" />
                            分析内容
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg mb-4">
                    {error}
                </div>
            )}

            {result && (
                <div className="space-y-4">
                    {/* 分数展示 */}
                    <div className={`flex items-center justify-between p-4 rounded-lg ${getScoreBg(result.score)}`}>
                        <div>
                            <p className="text-sm font-medium text-gray-700">GEO 优化得分</p>
                            <p className="text-xs text-gray-500">基于内容结构、长度、可读性等评估</p>
                        </div>
                        <div className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
                            {result.score}
                        </div>
                    </div>

                    {/* 内容统计 */}
                    <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="p-2 bg-gray-50 rounded">
                            <p className="text-lg font-semibold text-gray-900">{result.contentAnalysis.wordCount}</p>
                            <p className="text-xs text-gray-500">字数</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                            <p className="text-lg font-semibold text-gray-900">
                                {result.contentAnalysis.hasHeadings ? '✓' : '✗'}
                            </p>
                            <p className="text-xs text-gray-500">标题结构</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                            <p className="text-lg font-semibold text-gray-900">
                                {result.contentAnalysis.hasLists ? '✓' : '✗'}
                            </p>
                            <p className="text-xs text-gray-500">列表</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                            <p className="text-lg font-semibold text-gray-900">{result.contentAnalysis.readabilityScore}</p>
                            <p className="text-xs text-gray-500">可读性</p>
                        </div>
                    </div>

                    {/* 优化建议 */}
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-700">优化建议</p>
                        {result.suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg border ${getBgColor(suggestion.type)}`}
                            >
                                <div className="flex items-start gap-2">
                                    {getIcon(suggestion.type)}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">
                                            {suggestion.title}
                                            <span className="ml-2 text-xs font-normal text-gray-500">
                                                {suggestion.category}
                                            </span>
                                        </p>
                                        <p className="text-xs text-gray-600 mt-0.5">
                                            {suggestion.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!result && !error && (
                <p className="text-xs text-gray-500 text-center py-6">
                    点击"分析内容"获取 GEO 优化建议
                </p>
            )}
        </div>
    );
}
