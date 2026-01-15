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
    ourStats: { mentionShare: number; authority: number; analysis?: string };
    competitorStats: { name: string; mentionShare: number; authority: number; strengths?: string; weaknesses?: string }[];
    contentGap: string[];
    recommendation: { shortTerm?: string; midTerm?: string } | string;
    seoComparison?: {
        keywordOptimization?: string;
        contentDepth?: string;
        technicalSeo?: string;
    };
    realData?: {
        keyword: string;
        articleCount: number;
        totalWords: number;
        entitiesCount: number;
        citationsCount: number;
        sampleTitles?: string[];
        keywordDensity?: number;
    };
    competitorCrawlResults?: {
        domain: string;
        pagesCount?: number;
        homeTitle: string | null;
        homeWordCount: number;
        aggregated?: {
            totalWords: number;
            avgLoadTime: number;
            h1Count: number;
            hasKeywordInTitle: boolean;
            hasKeywordInDesc: boolean;
            linksInternal: number;
            linksExternal: number;
            imageCount: number;
        };
    }[];
}

export default function CompetitorAnalysis() {
    const { showToast } = useToast();
    const [keyword, setKeyword] = useState('');
    const [competitors, setCompetitors] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    // 加载历史记录
    const loadHistory = async () => {
        try {
            const res = await fetch('/api/admin/geo/competitor?limit=5');
            const data = await res.json();
            if (res.ok && data.history) {
                setHistory(data.history);
            }
        } catch (error) {
            console.error('加载历史失败:', error);
        }
    };

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
                loadHistory(); // 刷新历史记录
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
                    <div className="flex gap-3 mt-4">
                        <Button
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                            onClick={runAnalysis}
                            disabled={analyzing}
                        >
                            {analyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BrainCircuit className="w-4 h-4 mr-2" />}
                            开始 AI 竞品扫描
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                loadHistory();
                                setShowHistory(!showHistory);
                            }}
                        >
                            历史记录
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* 历史记录面板 */}
            {showHistory && (
                <Card className="border-gray-100 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs text-gray-500">分析历史（最近5条）</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {history.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-4">暂无历史记录</p>
                        ) : (
                            <div className="space-y-2">
                                {history.map((item: any) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                                        onClick={() => {
                                            setResult(item.analysis);
                                            setKeyword(item.keyword);
                                            setShowHistory(false);
                                        }}
                                    >
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{item.keyword}</div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(item.createdAt).toLocaleString('zh-CN')}
                                            </div>
                                        </div>
                                        <Badge className="bg-gray-100 text-gray-600">
                                            查看
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* 分析结果 */}
            {result && result.ourStats && (
                <div className="space-y-4">
                    {/* 本站真实数据统计 */}
                    {result.realData && (
                        <Card className="border-blue-100 bg-blue-50/30 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs text-blue-600 flex items-center gap-2">
                                    <BarChart2 className="w-4 h-4" />
                                    本站真实内容数据 - "{result.realData.keyword}"
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-3 bg-white rounded-xl border border-blue-100">
                                        <div className="text-2xl font-bold text-blue-600">{result.realData.articleCount}</div>
                                        <div className="text-xs text-gray-500">相关文章</div>
                                    </div>
                                    <div className="text-center p-3 bg-white rounded-xl border border-blue-100">
                                        <div className="text-2xl font-bold text-blue-600">{Math.round(result.realData.totalWords / 1000)}k</div>
                                        <div className="text-xs text-gray-500">总字数</div>
                                    </div>
                                    <div className="text-center p-3 bg-white rounded-xl border border-blue-100">
                                        <div className="text-2xl font-bold text-blue-600">{result.realData.entitiesCount}</div>
                                        <div className="text-xs text-gray-500">实体标注</div>
                                    </div>
                                    <div className="text-center p-3 bg-white rounded-xl border border-blue-100">
                                        <div className="text-2xl font-bold text-blue-600">{result.realData.citationsCount}</div>
                                        <div className="text-xs text-gray-500">引用来源</div>
                                    </div>
                                </div>
                                {result.ourStats.analysis && (
                                    <div className="mt-3 p-3 bg-white rounded-lg border border-blue-100 text-sm text-gray-600">
                                        <span className="font-medium text-blue-600">AI 评估：</span> {result.ourStats.analysis}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* 竞品抓取结果 */}
                    {result.competitorCrawlResults && result.competitorCrawlResults.length > 0 && (
                        <Card className="border-purple-100 bg-purple-50/30 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs text-purple-600 flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    竞品网站抓取结果
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className="space-y-2">
                                    {result.competitorCrawlResults.map((crawl, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-100">
                                            <div className="flex items-center gap-3">
                                                <span className={`w-2 h-2 rounded-full ${(crawl.pagesCount || 0) > 0 ? 'bg-green-500' : 'bg-red-400'}`} />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{crawl.domain}</div>
                                                    {crawl.homeTitle && (
                                                        <div className="text-xs text-gray-500 truncate max-w-[300px]">{crawl.homeTitle}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs">
                                                <div className="text-center">
                                                    <div className="font-bold text-purple-600">{crawl.aggregated?.totalWords ? `${Math.round(crawl.aggregated.totalWords / 1000)}k` : '-'}</div>
                                                    <div className="text-gray-400">总字数</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="font-bold text-purple-600">{crawl.aggregated?.avgLoadTime || '-'}ms</div>
                                                    <div className="text-gray-400">加载速度</div>
                                                </div>
                                                <Badge className={(crawl.pagesCount || 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                                                    {(crawl.pagesCount || 0) > 0 ? `${crawl.pagesCount}页` : '抓取失败'}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

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
                                {(result.competitorStats || []).map((comp, idx) => (
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
                                {(result.competitorStats || []).map((comp, idx) => (
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

                    {/* SEO 对比分析 */}
                    {result.seoComparison && (
                        <Card className="border-cyan-100 bg-cyan-50/30 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs text-cyan-600 flex items-center gap-2">
                                    <Search className="w-4 h-4" />
                                    SEO 对比分析
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {result.seoComparison.keywordOptimization && (
                                        <div className="p-4 bg-white rounded-xl border border-cyan-100">
                                            <div className="text-xs font-bold text-cyan-600 mb-2">关键词优化</div>
                                            <div className="text-sm text-gray-600">{result.seoComparison.keywordOptimization}</div>
                                        </div>
                                    )}
                                    {result.seoComparison.contentDepth && (
                                        <div className="p-4 bg-white rounded-xl border border-cyan-100">
                                            <div className="text-xs font-bold text-cyan-600 mb-2">内容深度</div>
                                            <div className="text-sm text-gray-600">{result.seoComparison.contentDepth}</div>
                                        </div>
                                    )}
                                    {result.seoComparison.technicalSeo && (
                                        <div className="p-4 bg-white rounded-xl border border-cyan-100">
                                            <div className="text-xs font-bold text-cyan-600 mb-2">技术 SEO</div>
                                            <div className="text-sm text-gray-600">{result.seoComparison.technicalSeo}</div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

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
                                    {(result.contentGap || []).map((gap, i) => (
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
                            <CardContent className="pt-2 space-y-3">
                                {typeof result.recommendation === 'string' ? (
                                    <div className="text-sm text-gray-700 leading-relaxed p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                                        {result.recommendation}
                                    </div>
                                ) : (
                                    <>
                                        {result.recommendation?.shortTerm && (
                                            <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">短期行动</span>
                                                </div>
                                                <div className="text-sm text-gray-700">{result.recommendation.shortTerm}</div>
                                            </div>
                                        )}
                                        {result.recommendation?.midTerm && (
                                            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">中期目标</span>
                                                </div>
                                                <div className="text-sm text-gray-700">{result.recommendation.midTerm}</div>
                                            </div>
                                        )}
                                    </>
                                )}
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
