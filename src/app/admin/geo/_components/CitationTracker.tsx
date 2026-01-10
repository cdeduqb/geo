'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Quote, TrendingUp, Award, RefreshCw, Sparkles, BarChart3, Loader2, Search } from 'lucide-react';

interface Citation {
    id: string;
    platform: string;
    query: string;
    citedAt: string;
    position: number;
    context?: string;
    citationType: string;
    article: {
        id: string;
        title: string;
        slug: string;
    };
}

interface Stats {
    totalCitations: number;
    byPlatform: { platform: string; count: number }[];
    trend: { date: string; count: number }[];
    topArticles: { article: { id: string; title: string; slug: string }; citations: number }[];
    byType: { type: string; count: number }[];
}

const platformColors: { [key: string]: string } = {
    'ChatGPT': 'bg-green-100 text-green-700',
    'Perplexity': 'bg-blue-100 text-blue-700',
    'Gemini': 'bg-purple-100 text-purple-700',
    'Claude': 'bg-orange-100 text-orange-700',
    'DeepSeek': 'bg-indigo-100 text-indigo-700',
    'Kimi': 'bg-cyan-100 text-cyan-700',
    '豆包': 'bg-pink-100 text-pink-700',
    '文心一言': 'bg-blue-50 text-blue-600',
    '通义千问': 'bg-orange-50 text-orange-600',
    '腾讯混元': 'bg-sky-50 text-sky-600',
    '智谱清言': 'bg-emerald-50 text-emerald-600',
    '讯飞星火': 'bg-cyan-50 text-cyan-600',
};

const citationTypeLabels: { [key: string]: string } = {
    'mention': '提及',
    'quote': '直接引用',
    'reference': '参考引用',
};

export default function CitationTracker() {
    const [citations, setCitations] = useState<Citation[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setRefreshing(true);
        try {
            await Promise.all([fetchCitations(), fetchStats()]);
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    };

    const fetchCitations = async () => {
        try {
            const res = await fetch('/api/admin/geo/citations?limit=20');
            const data = await res.json();
            setCitations(data.citations || []);
        } catch (error) {
            console.error('获取引用数据失败:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/geo/citations/stats?days=30');
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error('获取统计数据失败:', error);
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
            {/* 顶部操作栏 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-yellow-500 flex items-center justify-center text-white shadow-lg shadow-yellow-100">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-gray-900 tracking-tight">AI 引用追踪</h2>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">
                            追踪您的内容在各大 AI 平台的引用情况
                        </p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    onClick={fetchData}
                    disabled={refreshing}
                    className="rounded-2xl font-bold shadow-sm"
                >
                    <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    刷新数据
                </Button>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-gray-100 shadow-sm">
                    <CardContent className="pt-4 pb-4">
                        <p className="text-xs text-gray-500 flex items-center gap-1.5">
                            <Quote className="w-3 h-3" />
                            总引用次数
                        </p>
                        <div className="text-3xl font-bold text-green-600 mt-1">{stats?.totalCitations || 0}</div>
                        <p className="text-xs text-gray-400 mt-1">近30天内</p>
                    </CardContent>
                </Card>

                <Card className="border-gray-100 shadow-sm">
                    <CardContent className="pt-4 pb-4">
                        <p className="text-xs text-gray-500 flex items-center gap-1.5">
                            <BarChart3 className="w-3 h-3" />
                            活跃AI平台
                        </p>
                        <div className="text-3xl font-bold text-blue-600 mt-1">{stats?.byPlatform?.length || 0}</div>
                        <p className="text-xs text-gray-400 mt-1">
                            {stats?.byPlatform?.[0]?.platform || '暂无'} 最活跃
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-gray-100 shadow-sm">
                    <CardContent className="pt-4 pb-4">
                        <p className="text-xs text-gray-500 flex items-center gap-1.5">
                            <Award className="w-3 h-3" />
                            最受关注文章
                        </p>
                        <div className="text-3xl font-bold text-purple-600 mt-1">
                            {stats?.topArticles?.[0]?.citations || 0}
                        </div>
                        <p className="text-xs text-gray-400 mt-1 truncate">
                            {stats?.topArticles?.[0]?.article?.title || '暂无数据'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* 趋势图和平台分布 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 7天趋势 */}
                <Card className="border-gray-100 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs text-gray-500 flex items-center justify-between">
                            <span>引用热度趋势 (近7天)</span>
                            <TrendingUp className="w-3 h-3 text-green-500" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="h-[220px] flex items-end justify-between gap-3 px-2">
                            {stats?.trend?.map((point, i) => {
                                const maxCount = Math.max(...(stats.trend.map(t => t.count) || [1]));
                                const height = maxCount > 0 ? (point.count / maxCount) * 160 : 10;

                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                                        <div
                                            className="w-full bg-blue-50/50 border border-blue-100 rounded-t-lg relative group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-300"
                                            style={{ height: `${Math.max(10, height)}px` }}
                                        >
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-all shadow-xl pointer-events-none whitespace-nowrap z-10">
                                                {point.count} 引用
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-gray-400 font-medium tracking-tighter group-hover:text-gray-900 transition-colors">
                                            {point.date.slice(5)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* 平台分布 */}
                <Card className="border-gray-100 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs text-gray-500">AI 引擎覆盖规模</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-2">
                        {stats?.byPlatform?.slice(0, 5).map((item, index) => {
                            const maxCount = stats.byPlatform[0]?.count || 1;
                            const percentage = (item.count / maxCount) * 100;

                            return (
                                <div key={index} className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                            {item.platform}
                                        </span>
                                        <span className="text-xs font-medium text-gray-900">{item.count}次</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                        {(!stats?.byPlatform || stats.byPlatform.length === 0) && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Search className="w-10 h-10 text-gray-200 mb-2" />
                                <p className="text-xs text-gray-400 italic">尚未在 AI 引擎中发现引用轨迹</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* 最受AI关注的文章 */}
            <Card className="border-gray-100 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-900">最受AI关注的文章 Top 10</CardTitle>
                    <CardDescription>近30天内被AI引用最多的内容</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {stats?.topArticles?.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors bg-white">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                        index === 1 ? 'bg-gray-100 text-gray-700' :
                                            index === 2 ? 'bg-orange-100 text-orange-700' :
                                                'bg-gray-50 text-gray-600'
                                        } font-bold text-sm`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900 text-sm truncate">
                                            {item.article?.title}
                                        </h4>
                                        <p className="text-xs text-gray-500">/{item.article?.slug}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Quote className="w-4 h-4 text-gray-400" />
                                    <span className="font-bold text-blue-600">{item.citations}</span>
                                    <span className="text-xs text-gray-500">次</span>
                                </div>
                            </div>
                        ))}
                        {(!stats?.topArticles || stats.topArticles.length === 0) && (
                            <p className="text-sm text-gray-400 text-center py-8">
                                暂无数据。创作优质内容，让AI发现并引用！
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* 最近的引用记录 */}
            <Card className="border-gray-100 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                <Quote className="w-4 h-4" />
                                最近的AI引用记录
                            </CardTitle>
                            <CardDescription>查看AI如何引用您的内容</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {citations.map((citation) => (
                            <div key={citation.id} className="p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow bg-white">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        {/* 平台和时间 */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-2 py-1 text-xs font-medium rounded ${platformColors[citation.platform] || 'bg-gray-100 text-gray-700'}`}>
                                                {citation.platform}
                                            </span>
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                                {citationTypeLabels[citation.citationType] || citation.citationType}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(citation.citedAt).toLocaleString('zh-CN')}
                                            </span>
                                        </div>

                                        {/* 文章标题 */}
                                        <h4 className="font-medium text-gray-900 mb-2">
                                            {citation.article.title}
                                        </h4>

                                        {/* 用户查询 */}
                                        <div className="mb-2">
                                            <span className="text-xs text-gray-500">用户查询：</span>
                                            <p className="text-sm text-gray-700 italic">"{citation.query}"</p>
                                        </div>

                                        {/* 引用上下文 */}
                                        {citation.context && (
                                            <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600 border-l-2 border-blue-400">
                                                {citation.context}
                                            </div>
                                        )}

                                        {/* 排名位置 */}
                                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                            <Award className="w-3 h-3" />
                                            排名位置: #{citation.position}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {citations.length === 0 && (
                            <div className="text-center py-12">
                                <Quote className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 mb-2">暂无引用数据</p>
                                <p className="text-sm text-gray-400">
                                    开始创作优质内容，让AI发现并引用您的网站！
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
