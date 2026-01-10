'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Users,
    ChevronRight,
    BarChart2,
    Target,
    AlertCircle,
    Loader2,
    Search,
    BrainCircuit
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface AnalysisResult {
    ourStats: { mentionShare: number; authority: number };
    competitorStats: { name: string; mentionShare: number; authority: number }[];
    contentGap: string[];
    recommendation: string;
}

export default function CompetitorAnalysis() {
    const { showToast } = useToast();
    const [keyword, setKeyword] = useState('');
    const [competitors, setCompetitors] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);

    const runAnalysis = async () => {
        if (!keyword.trim()) {
            showToast('请输入分析关键词', 'error');
            return;
        }

        setAnalyzing(true);
        setResult(null);
        try {
            const res = await fetch('/api/admin/geo/competitor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    keyword,
                    competitors: competitors.split(/[,，\\s]+/).filter(Boolean)
                })
            });
            const data = await res.json();
            if (res.ok) {
                setResult(data.analysis);
                showToast('竞品分析完成', 'success');
            } else {
                showToast(data.error || '分析失败', 'error');
            }
        } catch (error) {
            showToast('请求失败', 'error');
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                    <Users className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-lg font-black text-gray-900 tracking-tight">竞品 GEO 深度对比</h2>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                        在 AI 搜索环境中，对比本站与竞品的提及率、权威度及内容覆盖情况
                    </p>
                </div>
            </div>

            {/* 输入栏 */}
            <Card className="border-gray-100 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <Target className="w-4 h-4 text-indigo-500" />
                        设置分析参数
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs text-gray-500">对比核心关键词</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    placeholder="例如：AI 创作助手"
                                    className="w-full pl-10 pr-5 py-3.5 bg-gray-50/50 border border-gray-300 rounded-2xl text-sm font-bold text-gray-900 focus:border-blue-600 focus:bg-white outline-none transition-all placeholder:text-gray-300"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs text-gray-500">竞争对手域名</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={competitors}
                                    onChange={(e) => setCompetitors(e.target.value)}
                                    placeholder="例如：notion.so, jasper.ai (逗号分隔)"
                                    className="w-full pl-10 pr-5 py-3.5 bg-gray-50/50 border border-gray-300 rounded-2xl text-sm font-bold text-gray-900 focus:border-blue-600 focus:bg-white outline-none transition-all placeholder:text-gray-300"
                                />
                            </div>
                        </div>
                    </div>
                    <Button
                        className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700"
                        onClick={runAnalysis}
                        disabled={analyzing}
                    >
                        {analyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BrainCircuit className="w-4 h-4 mr-2" />}
                        开始 AI 竞品扫描
                    </Button>
                </CardContent>
            </Card>

            {/* 分析结果 */}
            {result && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 核心数据看板 */}
                        <Card className="border-gray-100 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs text-gray-500">提及占有率</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-2">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-indigo-500" />
                                            <span className="font-medium text-gray-900">本站</span>
                                        </div>
                                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">{result.ourStats.mentionShare}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500" style={{ width: `${result.ourStats.mentionShare}%` }} />
                                    </div>
                                </div>
                                {result.competitorStats.map((comp, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-600 items-center">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-gray-300" />
                                                <span>{comp.name}</span>
                                            </div>
                                            <span className="font-medium bg-gray-50 px-2 py-0.5 rounded text-xs text-gray-500">{comp.mentionShare}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-gray-400" style={{ width: `${comp.mentionShare}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* 权威度雷达/对比 */}
                        <Card className="border-gray-100 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs text-gray-500">AI 权威度</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-2">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                            <span className="font-medium text-gray-900">本站</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{result.ourStats.authority}</span>
                                            <span className="text-xs text-gray-400">/100</span>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500" style={{ width: `${result.ourStats.authority}%` }} />
                                    </div>
                                </div>
                                {result.competitorStats.map((comp, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-600 items-center">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-gray-300" />
                                                <span>{comp.name}</span>
                                            </div>
                                            <span className="font-medium bg-gray-50 px-2 py-0.5 rounded text-xs text-gray-500">{comp.authority}</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-gray-300" style={{ width: `${comp.authority}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* 内容补齐建议 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="md:col-span-1 border-gray-100 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs text-gray-500 flex items-center gap-1.5">
                                    <AlertCircle className="w-3.5 h-3.5 text-orange-500" />
                                    内容缺口
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <ul className="space-y-2">
                                    {result.contentGap.map((gap, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700 p-2 rounded-lg bg-orange-50 border border-orange-100">
                                            <ChevronRight className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                                            <span>{gap}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2 border-gray-100 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs text-gray-500 flex items-center gap-1.5">
                                    <Target className="w-3.5 h-3.5 text-emerald-500" />
                                    GEO 超越策略
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className="text-sm text-gray-700 leading-relaxed p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                                    {result.recommendation}
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">可执行</span>
                                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">高优先级</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {!result && !analyzing && (
                <div className="py-20 text-center border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">输入关键词和竞争对手，一键获取 GEO 洞察报表</p>
                </div>
            )}
        </div>
    );
}
