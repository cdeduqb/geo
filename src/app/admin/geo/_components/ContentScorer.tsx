'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, AlertCircle, CheckCircle, Loader2, RefreshCw, Wand2, Search, ChevronDown, Check } from 'lucide-react';
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
    const [optimizing, setOptimizing] = useState(false);
    const [currentScore, setCurrentScore] = useState<ContentScore | null>(null);
    const [topScores, setTopScores] = useState<ContentScore[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);


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
                // 确保 suggestions 是数组
                const score = data.score;
                if (score && typeof score.suggestions === 'string') {
                    try {
                        score.suggestions = JSON.parse(score.suggestions);
                    } catch {
                        score.suggestions = [];
                    }
                }
                if (score && !Array.isArray(score.suggestions)) {
                    score.suggestions = [];
                }
                setCurrentScore(score);
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

    // 一键优化文章
    const handleOptimize = async () => {
        if (!currentScore || !currentScore.articleId) {
            showToast('请先对文章进行评分', 'error');
            return;
        }

        if (currentScore.suggestions.length === 0) {
            showToast('该文章已达到高质量标准，无需优化', 'info');
            return;
        }

        setOptimizing(true);

        try {
            const res = await fetch('/api/admin/geo/optimize-article', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    articleId: currentScore.articleId,
                    suggestions: currentScore.suggestions,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                showToast('文章优化成功！正在重新评分...', 'success');
                // 优化完成后重新评分
                setTimeout(() => {
                    handleScore(true);
                }, 1000);
            } else {
                showToast(data.error || '优化失败', 'error');
            }
        } catch (error) {
            showToast('优化失败，请稍后重试', 'error');
        } finally {
            setOptimizing(false);
        }
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
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-100">
                    <Sparkles className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-lg font-black text-gray-900 tracking-tight">AI 内容质量评分</h2>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                        使用 AI 评估内容质量，获得多维度评分和改进建议
                    </p>
                </div>
            </div>

            {/* 评分操作 */}
            <Card className="border-gray-100 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-900">开始评分</CardTitle>
                    <CardDescription>选择文章进行AI质量评估</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            {/* 搜索式下拉菜单 */}
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="搜索文章标题..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setIsDropdownOpen(true);
                                    }}
                                    onFocus={() => setIsDropdownOpen(true)}
                                    className="w-full pl-10 pr-10 py-4 text-sm font-bold text-gray-900 bg-gray-50/50 border border-gray-300 rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all placeholder:text-gray-300"
                                    disabled={scoring}
                                />
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                            </div>

                            {/* 下拉列表 */}
                            {isDropdownOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsDropdownOpen(false)}
                                    />
                                    <div className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-purple-100/50 max-h-[300px] overflow-y-auto no-scrollbar py-2 animate-in fade-in zoom-in-95 duration-200">
                                        {articles.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase())).length > 0 ? (
                                            articles
                                                .filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()))
                                                .map((article) => (
                                                    <button
                                                        key={article.id}
                                                        onClick={() => {
                                                            setSelectedArticleId(article.id);
                                                            setSearchTerm(article.title);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-purple-50 transition-colors ${selectedArticleId === article.id ? 'bg-purple-50 text-purple-600 font-bold' : 'text-gray-700 font-medium'}`}
                                                    >
                                                        <span className="truncate">{article.title}</span>
                                                        {selectedArticleId === article.id && <Check className="w-4 h-4" />}
                                                    </button>
                                                ))
                                        ) : (
                                            <div className="px-4 py-8 text-center text-gray-400 text-xs">
                                                未找到匹配的文章
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                        <Button onClick={() => handleScore(false)} disabled={scoring || !selectedArticleId} className="bg-purple-600 hover:bg-purple-700">
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

            {currentScore && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* 总分 */}
                    <Card className="md:col-span-1 border-gray-100 shadow-sm">
                        <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center text-center">
                            <div className="relative mb-2">
                                <div className="text-5xl font-bold text-purple-600">
                                    {currentScore.overallScore}
                                </div>
                                <span className="absolute -top-1 -right-4 text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                                    {getScoreGrade(currentScore.overallScore)}
                                </span>
                            </div>
                            <div className="text-xs text-gray-500">
                                综合质量指数
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                                分析时间: {new Date(currentScore.analyzedAt).toLocaleDateString()}
                            </p>
                        </CardContent>
                    </Card>

                    {/* 5维度评分 */}
                    <Card className="md:col-span-1 border-gray-100 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs text-gray-500">多维度评估分析</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-2">
                            {[
                                { label: '内容结构', score: currentScore.structureScore, color: 'bg-blue-500' },
                                { label: '事实密度', score: currentScore.factualScore, color: 'bg-indigo-500' },
                                { label: '可引用性', score: currentScore.citationScore, color: 'bg-cyan-500' },
                                { label: '实体覆盖', score: currentScore.entityScore, color: 'bg-purple-500' },
                                { label: '语义广度', score: currentScore.semanticScore, color: 'bg-pink-500' },
                            ].map((dimension, index) => (
                                <div key={index} className="space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-600">{dimension.label}</span>
                                        <span className="font-medium text-gray-900">{dimension.score}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${dimension.color}`}
                                            style={{ width: `${dimension.score}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* 改进建议 */}
                    <Card className="md:col-span-1 border-gray-100 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs text-gray-500">AI 优化建议</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 pt-2">
                            {currentScore.suggestions.map((suggestion, index) => (
                                <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-medium">
                                        {index + 1}
                                    </span>
                                    <p className="text-xs text-gray-600">{suggestion}</p>
                                </div>
                            ))}
                            {currentScore.suggestions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-6 text-center">
                                    <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                                    <p className="text-xs text-gray-500">内容已达到高 GEO 标准</p>
                                </div>
                            ) : (
                                <Button
                                    onClick={handleOptimize}
                                    disabled={optimizing || scoring}
                                    className="w-full mt-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                >
                                    {optimizing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            优化中...
                                        </>
                                    ) : (
                                        <>
                                            <Wand2 className="w-4 h-4 mr-2" />
                                            一键优化文章
                                        </>
                                    )}
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* 高分文章榜 */}
            {topScores.length > 0 && (
                <Card className="border-gray-100 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-900">高质量内容 Top 10</CardTitle>
                        <CardDescription>AI评分最高的文章</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {topScores.slice(0, 10).map((score, index) => (
                                <div key={score.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 bg-white">
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
