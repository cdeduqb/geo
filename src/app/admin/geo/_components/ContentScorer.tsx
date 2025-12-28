'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, AlertCircle, CheckCircle, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface ContentScore {
    id: string;
    articleId: string;
    overallScore: number;
    structureScore: number;
    factualScore: number;
    citationScore: number;
    entityScore: number;
    semanticScore: number;
    suggestions: string[];
    analyzedAt: string;
    article?: {
        id: string;
        title: string;
        slug: string;
    };
}

interface Article {
    id: string;
    title: string;
    slug: string;
}

export default function ContentScorer() {
    const { showToast } = useToast();
    const [articles, setArticles] = useState<Article[]>([]);
    const [selectedArticleId, setSelectedArticleId] = useState('');
    const [scoring, setScoring] = useState(false);
    const [currentScore, setCurrentScore] = useState<ContentScore | null>(null);
    const [topScores, setTopScores] = useState<ContentScore[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticles();
        fetchTopScores();
    }, []);

    const fetchArticles = async () => {
        try {
            const res = await fetch('/api/articles?limit=100');
            const data = await res.json();
            setArticles(data.articles || []);
            setLoading(false);
        } catch (error) {
            console.error('获取文章列表失败:', error);
            setLoading(false);
        }
    };

    const fetchTopScores = async () => {
        try {
            const res = await fetch('/api/admin/geo/score');
            const data = await res.json();
            setTopScores(data.scores || []);
        } catch (error) {
            console.error('获取评分列表失败:', error);
        }
    };

    const handleScore = async (forceRefresh = false) => {
        if (!selectedArticleId) {
            showToast('请先选择文章', 'error');
            return;
        }

        setScoring(true);
        setCurrentScore(null);

        try {
            const res = await fetch('/api/admin/geo/score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    articleId: selectedArticleId,
                    forceRefresh,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setCurrentScore(data.score);
                showToast('评分完成！', 'success');
                fetchTopScores();
            } else {
                showToast(data.error || '评分失败', 'error');
            }
        } catch (error) {
            showToast('评分失败', 'error');
        } finally {
            setScoring(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-blue-600';
        if (score >= 40) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreGrade = (score: number) => {
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'E';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 标题 */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    AI 内容质量评分
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    使用AI评估内容质量，获得多维度评分和改进建议
                </p>
            </div>

            {/* 评分操作 */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">开始评分</CardTitle>
                    <CardDescription>选择文章进行AI质量评估</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-3">
                        <select
                            value={selectedArticleId}
                            onChange={(e) => setSelectedArticleId(e.target.value)}
                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            disabled={scoring}
                        >
                            <option value="">选择文章...</option>
                            {articles.map((article) => (
                                <option key={article.id} value={article.id}>
                                    {article.title}
                                </option>
                            ))}
                        </select>
                        <Button onClick={() => handleScore(false)} disabled={scoring || !selectedArticleId}>
                            {scoring ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                            {scoring ? '评分中...' : '开始评分'}
                        </Button>
                        {currentScore && (
                            <Button variant="outline" onClick={() => handleScore(true)} disabled={scoring}>
                                <RefreshCw className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* 评分结果 */}
            {currentScore && (
                <div className="space-y-4">
                    {/* 总分 */}
                    <Card className="border-purple-100 bg-purple-50/30">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-6xl font-bold text-purple-600 mb-2">
                                    {currentScore.overallScore}
                                </div>
                                <div className="text-2xl font-bold text-gray-700 mb-1">
                                    等级: {getScoreGrade(currentScore.overallScore)}
                                </div>
                                <p className="text-sm text-gray-500">
                                    综合质量评分 · 已分析于 {new Date(currentScore.analyzedAt).toLocaleString('zh-CN')}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 5维度评分 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">多维度分析</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {[
                                    { label: '结构清晰度', score: currentScore.structureScore, icon: '📐' },
                                    { label: '事实密度', score: currentScore.factualScore, icon: '📊' },
                                    { label: '可引用性', score: currentScore.citationScore, icon: '📑' },
                                    { label: '实体丰富度', score: currentScore.entityScore, icon: '🏷️' },
                                    { label: '语义深度', score: currentScore.semanticScore, icon: '🧠' },
                                ].map((dimension, index) => (
                                    <div key={index} className="space-y-1">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="flex items-center gap-2">
                                                <span>{dimension.icon}</span>
                                                {dimension.label}
                                            </span>
                                            <span className={`font-bold ${getScoreColor(dimension.score)}`}>
                                                {dimension.score}分
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${dimension.score >= 80 ? 'bg-green-500' :
                                                        dimension.score >= 60 ? 'bg-blue-500' :
                                                            dimension.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${dimension.score}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* 改进建议 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <TrendingUp className="w-4 h-4" />
                                AI改进建议
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {currentScore.suggestions.map((suggestion, index) => (
                                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-gray-700">{suggestion}</p>
                                    </div>
                                ))}
                                {currentScore.suggestions.length === 0 && (
                                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <p className="text-sm text-gray-700">内容质量excellent！暂无改进建议。</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* 高分文章榜 */}
            {topScores.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">高质量内容 Top 10</CardTitle>
                        <CardDescription>AI评分最高的文章</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {topScores.slice(0, 10).map((score, index) => (
                                <div key={score.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${index === 0 ? 'bg-yellow-100 text-yellow-700 font-bold' :
                                                index === 1 ? 'bg-gray-100 text-gray-700 font-bold' :
                                                    index === 2 ? 'bg-orange-100 text-orange-700 font-bold' :
                                                        'bg-gray-50 text-gray-600'
                                            } text-sm`}>
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 text-sm truncate">
                                                {score.article?.title}
                                            </h4>
                                            <p className="text-xs text-gray-500">{new Date(score.analyzedAt).toLocaleDateString('zh-CN')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-2xl font-bold ${getScoreColor(score.overallScore)}`}>
                                            {score.overallScore}
                                        </span>
                                        <span className="text-xs text-gray-500">分</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
