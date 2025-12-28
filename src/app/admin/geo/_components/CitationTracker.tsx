'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Quote, TrendingUp, Award, RefreshCw, Sparkles, BarChart3, Loader2 } from 'lucide-react';

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
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        AI 引用追踪
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        追踪您的内容在各大AI平台的引用情况
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchData}
                    disabled={refreshing}
                >
                    <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    刷新数据
                </Button>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-green-100 bg-green-50/30">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <Quote className="w-4 h-4" />
                            总引用次数
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">{stats?.totalCitations || 0}</div>
                        <p className="text-xs text-gray-500 mt-1">近30天内</p>
                    </CardContent>
                </Card>

                <Card className="border-blue-100 bg-blue-50/30">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" />
                            活跃AI平台
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">{stats?.byPlatform?.length || 0}</div>
                        <p className="text-xs text-gray-500 mt-1">
                            {stats?.byPlatform?.[0]?.platform || '暂无'} 最活跃
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-purple-100 bg-purple-50/30">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            最受关注文章
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-purple-600">
                            {stats?.topArticles?.[0]?.citations || 0}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                            {stats?.topArticles?.[0]?.article?.title || '暂无数据'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* 趋势图和平台分布 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 7天趋势 */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            最近7天引用趋势
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] flex items-end justify-between gap-2 px-2">
                            {stats?.trend?.map((point, i) => {
                                const maxCount = Math.max(...(stats.trend.map(t => t.count) || [1]));
                                const height = maxCount > 0 ? (point.count / maxCount) * 180 : 10;

                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                        <div
                                            className="w-full bg-blue-200 rounded-t relative group-hover:bg-blue-300 transition-colors"
                                            style={{ height: `${Math.max(10, height)}px` }}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                {point.count}次
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-gray-500">
                                            {point.date.slice(5)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* 平台分布 */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">AI平台引用分布</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {stats?.byPlatform?.slice(0, 5).map((item, index) => {
                                const maxCount = stats.byPlatform[0]?.count || 1;
                                const percentage = (item.count / maxCount) * 100;

                                return (
                                    <div key={index} className="space-y-1">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className={`px-2 py-0.5 rounded ${platformColors[item.platform] || 'bg-gray-100 text-gray-700'}`}>
                                                {item.platform}
                                            </span>
                                            <span className="font-medium">{item.count}次</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                            {(!stats?.byPlatform || stats.byPlatform.length === 0) && (
                                <p className="text-sm text-gray-400 text-center py-8">暂无数据</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 最受AI关注的文章 */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">最受AI关注的文章 Top 10</CardTitle>
                    <CardDescription>近30天内被AI引用最多的内容</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {stats?.topArticles?.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
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
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Quote className="w-5 h-5" />
                                最近的AI引用记录
                            </CardTitle>
                            <CardDescription>查看AI如何引用您的内容</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {citations.map((citation) => (
                            <div key={citation.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
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
