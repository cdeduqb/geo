'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Search,
    TrendingUp,
    TrendingDown,
    Loader2,
    RefreshCw,
    Award,
    Activity,
    LineChart,
    ExternalLink,
    Trash2
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface RankingRecord {
    id: string;
    keyword: string;
    platform: string;
    ranking: number;
    mentionRate: number;
    context?: string;
    checkedAt: string;
    article?: {
        title: string;
        slug: string;
    };
}

const platformColors: { [key: string]: string } = {
    'ChatGPT': 'bg-green-100 text-green-700',
    'Perplexity': 'bg-blue-100 text-blue-700',
    'Gemini': 'bg-purple-100 text-purple-700',
    'Claude': 'bg-orange-100 text-orange-700',
    'DeepSeek': 'bg-indigo-100 text-indigo-700',
    '文心一言': 'bg-blue-50 text-blue-600',
    '通义千问': 'bg-orange-50 text-orange-600',
    'Kimi': 'bg-pink-50 text-pink-600',
    '腾讯混元': 'bg-sky-50 text-sky-600',
    '豆包': 'bg-teal-50 text-teal-600',
    '智谱清言': 'bg-emerald-50 text-emerald-600',
    '讯飞星火': 'bg-cyan-50 text-cyan-600',
};

export default function RankingTracker() {
    const { showToast } = useToast();
    const [rankings, setRankings] = useState<RankingRecord[]>([]);
    const [latestRankings, setLatestRankings] = useState<RankingRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [checking, setChecking] = useState(false);
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/geo/ranking');
            const data = await res.json();
            if (res.ok) {
                setRankings(data.rankings || []);
                setLatestRankings(data.latestRankings || []);
            }
        } catch (error) {
            console.error('获取排名数据失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const runCheck = async () => {
        if (!keyword.trim()) {
            showToast('请输入关键词', 'error');
            return;
        }

        setChecking(true);
        try {
            const res = await fetch('/api/admin/geo/ranking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keyword })
            });
            const data = await res.json();
            if (res.ok) {
                showToast(`关键词 "${keyword}" 检查完成`, 'success');
                setKeyword('');
                fetchData();
            } else {
                showToast(data.error || '检查失败', 'error');
            }
        } catch (error) {
            showToast('请求失败', 'error');
        } finally {
            setChecking(false);
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
            {/* 顶部搜索/检查栏 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-gray-900 tracking-tight">AI 搜索排名追踪</h2>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">
                            监控关键词在各大 AI 搜索引擎中的搜索排名和提及概率
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="输入监控关键词..."
                        className="px-6 py-4 text-sm border border-gray-300 bg-gray-50/50 rounded-2xl font-bold w-64 focus:border-blue-600 focus:bg-white outline-none transition-all placeholder:text-gray-300"
                    />
                    <Button onClick={runCheck} disabled={checking} className="bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold shadow-lg shadow-blue-100 px-6">
                        {checking ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                        立即检查
                    </Button>
                    <Button
                        onClick={async () => {
                            if (!confirm('确定要清空所有排名记录吗？此操作不可恢复。')) return;
                            try {
                                const res = await fetch('/api/admin/geo/ranking', { method: 'DELETE' });
                                if (res.ok) {
                                    showToast('记录已清空', 'success');
                                    setRankings([]);
                                    setLatestRankings([]);
                                } else {
                                    showToast('清空失败', 'error');
                                }
                            } catch (e) {
                                showToast('请求出错', 'error');
                            }
                        }}
                        variant="outline"
                        className="rounded-2xl font-bold px-4 text-gray-500 hover:text-red-600 hover:bg-red-50 border-gray-200"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        清空记录
                    </Button>
                </div>
            </div>

            {/* 核心指标统计 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-gray-100 shadow-sm">
                    <CardContent className="pt-4 pb-4">
                        <p className="text-xs text-gray-500">综合平均排名</p>
                        <div className="flex items-baseline gap-2 mt-1">
                            <div className="text-3xl font-bold text-blue-600">
                                {latestRankings.length > 0
                                    ? (latestRankings.reduce((acc, r) => acc + r.ranking, 0) / latestRankings.length).toFixed(1)
                                    : '0.0'}
                            </div>
                            <span className="text-sm text-gray-400">/ 10</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">数值越低越好</p>
                    </CardContent>
                </Card>
                <Card className="border-gray-100 shadow-sm">
                    <CardContent className="pt-4 pb-4">
                        <p className="text-xs text-gray-500">Top 3 覆盖率</p>
                        <div className="flex items-baseline gap-2 mt-1">
                            <div className="text-3xl font-bold text-emerald-600">
                                {latestRankings.length > 0
                                    ? ((latestRankings.filter(r => r.ranking <= 3).length / latestRankings.length) * 100).toFixed(0)
                                    : '0'}%
                            </div>
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">高曝光区域</p>
                    </CardContent>
                </Card>
                <Card className="border-gray-100 shadow-sm">
                    <CardContent className="pt-4 pb-4">
                        <p className="text-xs text-gray-500">峰值提及概率</p>
                        <div className="flex items-baseline gap-2 mt-1">
                            <div className="text-3xl font-bold text-purple-600">
                                {latestRankings.length > 0
                                    ? Math.max(...latestRankings.map(r => r.mentionRate))
                                    : '0'}%
                            </div>
                            <Award className="w-4 h-4 text-purple-500" />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">品牌权威度</p>
                    </CardContent>
                </Card>
            </div>

            {/* 最新看板 */}
            <Card className="border-gray-100 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-500" />
                        实时关键词表现监控
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs">
                                <tr>
                                    <th className="px-4 py-3 font-medium">监控关键词</th>
                                    <th className="px-4 py-3 font-medium">AI 平台</th>
                                    <th className="px-4 py-3 font-medium">排名位置</th>
                                    <th className="px-4 py-3 font-medium">提及概率</th>
                                    <th className="px-4 py-3 font-medium">关联本站文章</th>
                                    <th className="px-4 py-3 font-medium">最后检查</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {latestRankings.map((rank) => (
                                    <tr key={rank.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-gray-900">{rank.keyword}</td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                                {rank.platform}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {rank.ranking === 1 ? (
                                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">🥇 第 1 名</span>
                                            ) : rank.ranking === 2 ? (
                                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">🥈 第 2 名</span>
                                            ) : rank.ranking === 3 ? (
                                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">🥉 第 3 名</span>
                                            ) : (
                                                <span className="text-sm text-gray-500">#{rank.ranking}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${rank.mentionRate > 80 ? 'bg-green-500' : 'bg-blue-500'}`}
                                                        style={{ width: `${rank.mentionRate}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-700">{rank.mentionRate}%</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {rank.article ? (
                                                <a href={`/articles/${rank.article.slug}`} target="_blank" className="text-blue-600 hover:underline text-xs">
                                                    查看文章 <ExternalLink className="w-3 h-3 inline" />
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 text-xs">未关联</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-400">
                                            {new Date(rank.checkedAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                                {latestRankings.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                                            暂无排名监控记录，请在上方输入关键词开始追踪。
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* 历史记录摘要 */}
            <Card className="border-gray-100 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <LineChart className="w-4 h-4" />
                        历史排名记录
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {rankings.slice(0, 5).map((r) => (
                            <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-400">
                                        {new Date(r.checkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <span className="font-medium text-gray-900">{r.keyword}</span>
                                    <span className="text-gray-400">在</span>
                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{r.platform}</span>
                                    <span className="text-gray-400">获</span>
                                    <span className="font-medium text-blue-600">#{r.ranking}</span>
                                </div>
                                <span className="text-xs text-gray-400">
                                    {r.context ? r.context : '常规监测'}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
