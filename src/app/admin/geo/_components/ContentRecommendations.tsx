'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    BarChart3,
    TrendingUp,
    Target,
    Plus,
    Loader2,
    XCircle,
    Clock,
    Lightbulb,
    Globe,
    ShieldCheck,
    CheckCircle2,
    ArrowRight
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface Topic {
    id: string;
    topic: string;
    trendScore: number;
    growthRate: number;
    queryCount: number;
    status: string;
}

interface Recommendation {
    id: string;
    topicId: string;
    title: string;
    description: string;
    estimatedTraffic: number;
    difficulty: string;
    priority: number;
    status: string;
    topic: Topic;
    createdAt: string;
    keywords?: string; // 加入关键字字段存储 JSON
}

export default function ContentRecommendations() {
    const { showToast } = useToast();
    const [topics, setTopics] = useState<Topic[]>([]);
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [customKeywords, setCustomKeywords] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [topicsRes, recsRes] = await Promise.all([
                fetch('/api/admin/geo/trends?limit=10'),
                fetch('/api/admin/geo/recommendations?status=pending')
            ]);

            const topicsData = await topicsRes.json();
            const recsData = await recsRes.json();

            setTopics(topicsData.topics || []);
            setRecommendations(recsData.recommendations || []);
        } catch (error) {
            console.error('获取数据失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const runAnalysis = async () => {
        setAnalyzing(true);
        try {
            const keywordsArray = customKeywords.split(/[,，\s]+/).filter(k => k.trim());
            const res = await fetch('/api/admin/geo/trends', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customKeywords: keywordsArray })
            });
            const data = await res.json();
            if (res.ok) {
                showToast(`分析完成，识别出 ${data.count} 个话题`, 'success');
                setCustomKeywords('');
                // 自动触发制作建议，让体验更连贯
                await generateRecs();
            } else {
                showToast(data.message || '分析失败', 'error');
            }
        } catch (error) {
            showToast('分析请求失败', 'error');
        } finally {
            setAnalyzing(false);
        }
    };

    const generateRecs = async () => {
        setGenerating(true);
        try {
            const res = await fetch('/api/admin/geo/recommendations', { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                if (data.newCount > 0 || data.updatedCount > 0) {
                    showToast(data.message, 'success');
                }
                fetchData();
            } else {
                showToast(data.error || '生成失败', 'error');
            }
        } catch (error) {
            showToast('生成请求失败', 'error');
        } finally {
            setGenerating(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const res = await fetch('/api/admin/geo/recommendations', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });

            if (res.ok) {
                showToast(newStatus === 'accepted' ? '已收录到创作计划，并在“AI 创作 > 批量创作任务”中生成了任务' : '已忽略推荐', 'success');
                setRecommendations(prev => prev.filter(r => r.id !== id));
            }
        } catch (error) {
            showToast('更新状态失败', 'error');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 顶部操作 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-yellow-500 flex items-center justify-center text-white shadow-lg shadow-yellow-100">
                        <Lightbulb className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-gray-900 tracking-tight">智能内容推荐</h2>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">基于 AI 搜索趋势和内容缺口生成的创作建议</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="输入自定义关键词 (逗号分隔)..."
                            className="h-11 w-64 px-6 text-sm border border-gray-300 bg-gray-50/50 rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold placeholder:text-gray-300"
                            value={customKeywords}
                            onChange={(e) => setCustomKeywords(e.target.value)}
                        />
                        {customKeywords && (
                            <button
                                onClick={() => setCustomKeywords('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <XCircle className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <Button variant="outline" onClick={runAnalysis} disabled={analyzing} className="rounded-2xl font-bold shadow-sm">
                        {analyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BarChart3 className="w-4 h-4 mr-2" />}
                        分析趋势
                    </Button>
                    <Button onClick={generateRecs} disabled={generating || topics.length === 0} className="bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold shadow-lg shadow-blue-100">
                        {generating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                        制作建议
                    </Button>
                </div>
            </div>

            {/* 热门话题快报 */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {topics.map((topic) => (
                    <Card key={topic.id} className="border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <CardContent className="pt-4 pb-3">
                            <div className="flex items-center gap-1.5 mb-2">
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${topic.status === 'emerging' ? 'bg-red-100 text-red-600' :
                                    topic.status === 'active' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {topic.status === 'emerging' ? '新兴' : topic.status === 'active' ? '活跃' : '平稳'}
                                </span>
                            </div>
                            <h3 className="font-medium text-gray-900 truncate text-sm" title={topic.topic}>
                                {topic.topic}
                            </h3>
                            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                                <span className="text-blue-600 font-medium flex items-center gap-0.5">
                                    <TrendingUp className="w-3 h-3" />
                                    +{Math.round(topic.growthRate)}%
                                </span>
                                <span>查询: {topic.queryCount}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {topics.length === 0 && (
                    <div className="col-span-full py-8 text-center text-gray-400 border border-dashed rounded-xl">
                        暂无趋势数据，请点击“分析趋势”
                    </div>
                )}
            </div>

            {/* 推荐内容列表 */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-red-500" />
                    待选创作方向
                </h3>

                <div className="grid grid-cols-1 gap-4">
                    {recommendations.map((rec) => (
                        <Card key={rec.id} className="border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <CardContent className="p-4">
                                <div className="flex flex-col md:flex-row gap-4">
                                    {/* 优先级指标 */}
                                    <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg min-w-[80px]">
                                        <span className="text-xs text-gray-500">优先级</span>
                                        <span className={`text-2xl font-bold ${rec.priority >= 8 ? 'text-red-500' :
                                            rec.priority >= 5 ? 'text-orange-500' : 'text-blue-500'
                                            }`}>
                                            {rec.priority}
                                        </span>
                                        <span className="mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-600">
                                            {rec.difficulty === 'hard' ? '深度' : rec.difficulty === 'medium' ? '适中' : '入门'}
                                        </span>
                                    </div>

                                    {/* 核心内容 */}
                                    <div className="flex-1 space-y-2">
                                        {(() => {
                                            let extra = { range: `${rec.estimatedTraffic}+`, commercialValue: 'medium' };
                                            try { if (rec.keywords) extra = JSON.parse(rec.keywords); } catch (e) { }

                                            return (
                                                <>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="text-base font-medium text-gray-900">
                                                            {rec.title}
                                                        </h4>
                                                        {rec.priority >= 8 && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-600">必做</span>}
                                                        {extra.commercialValue === 'high' && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">高商机</span>}
                                                    </div>
                                                    <p className="text-sm text-gray-600 leading-relaxed">
                                                        {rec.description}
                                                    </p>
                                                    <div className="flex flex-wrap gap-4 pt-1 text-xs text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Globe className="w-3 h-3 text-blue-500" />
                                                            搜索量: {extra.range}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <TrendingUp className="w-3 h-3 text-green-500" />
                                                            话题: #{rec.topic.topic}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <ShieldCheck className="w-3 h-3 text-orange-500" />
                                                            竞争: {rec.difficulty === 'hard' ? '极高' : rec.difficulty === 'medium' ? '中等' : '蓝海'}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(rec.createdAt).toLocaleDateString('zh-CN')}
                                                        </span>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>

                                    {/* 操作按钮 */}
                                    <div className="flex md:flex-col gap-2 justify-center">
                                        <Button
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700"
                                            onClick={() => handleStatusUpdate(rec.id, 'accepted')}
                                        >
                                            <CheckCircle2 className="w-4 h-4 mr-1" />
                                            接受
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleStatusUpdate(rec.id, 'rejected')}
                                        >
                                            <XCircle className="w-4 h-4 mr-1" />
                                            忽略
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {recommendations.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-100">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm mb-4">
                                <Target className="w-8 h-8 text-gray-200" />
                            </div>
                            <h4 className="text-gray-900 font-medium">暂无待选方向</h4>
                            <p className="text-gray-400 text-sm mt-1">分析趋势后点击“制作建议”，让AI帮您寻找内容原型</p>
                            <Button variant="link" className="mt-4 text-blue-600" onClick={generateRecs}>
                                立即生成建议 <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
