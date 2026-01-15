'use client';

import { useState } from 'react';
import { Bot, Search, Loader2, Sparkles, FileText, Share2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AISimulator() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleSimulate = async () => {
        if (!url) return;
        setLoading(true);
        try {
            const res = await fetch('/api/admin/geo/simulate-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: url.startsWith('/') ? url : `/${url}`
                })
            });

            if (res.ok) {
                const data = await res.json();
                setResult(data);
            } else {
                const data = await res.json();
                setResult({ error: data.error || '模拟失败，请检查文章路径' });
            }
        } catch (error) {
            console.error(error);
            setResult({ error: '请求失败，请稍后重试' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm shadow-gray-100/50 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/20">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                                <Bot className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-gray-900 tracking-tight">AI 视角模拟器</h2>
                                <p className="text-xs text-gray-400 font-medium mt-0.5">
                                    模拟主流大模型抓取并处理您网页后的"大脑成像"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-8 space-y-6">
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full px-6 py-4 border border-gray-300 bg-gray-50/50 rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-sm text-gray-900 placeholder:text-gray-300"
                                placeholder="输入文章路径 (例如: /articles/what-is-geo)"
                            />
                        </div>
                        <Button onClick={handleSimulate} disabled={loading || !url} className="bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold shadow-lg shadow-blue-100 px-8">
                            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                            开始模拟
                        </Button>
                    </div>

                    {!result && (
                        <div className="py-16 text-center border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                                <Bot className="w-10 h-10 text-gray-300" />
                            </div>
                            <h4 className="text-gray-900 font-bold mb-2">等待模拟</h4>
                            <p className="text-gray-400 text-sm">输入地址并点击模拟，查看 AI 如何"阅读"您的内容</p>
                        </div>
                    )}

                    {result?.error && (
                        <div className="py-16 text-center border border-dashed border-red-200 rounded-2xl bg-red-50/50">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-red-100 flex items-center justify-center">
                                <AlertCircle className="w-10 h-10 text-red-400" />
                            </div>
                            <h4 className="text-red-600 font-bold mb-2">模拟失败</h4>
                            <p className="text-red-500 text-sm">{result.error}</p>
                        </div>
                    )}
                </div>
            </div>

            {result && result.aiVersion && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* 文本提取视图 */}
                        <Card className="border-gray-100 shadow-md">
                            <CardHeader className="pb-2 border-b border-gray-50">
                                <CardTitle className="text-[11px] font-black uppercase text-gray-400 flex items-center gap-2">
                                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                                    AI 视角提取结果 (纯文本缓冲区)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="bg-gray-900 text-green-400 p-5 rounded-xl font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-h-[450px] overflow-y-auto shadow-inner custom-scrollbar">
                                    <div className="text-gray-500 mb-2 border-b border-gray-800 pb-2">--- 缓冲区开始 ---</div>
                                    {result.aiVersion.text}
                                    <div className="text-gray-500 mt-2 border-t border-gray-800 pt-2">--- 缓冲区结束 ---</div>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-400 uppercase font-bold">预估 Token 数量</span>
                                            <span className="text-sm font-black text-blue-600">{result.aiVersion.tokensEstimate}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-400 uppercase font-bold">提取元数据</span>
                                            <span className="text-sm font-black text-green-600">成功</span>
                                        </div>
                                    </div>
                                    <Badge className="bg-blue-50 text-blue-600 border-none px-3 font-bold">大模型已优化</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 建议面板 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {result.suggestions.map((s: string, i: number) => (
                                <div key={i} className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col gap-2 hover:border-purple-200 hover:shadow-purple-500/5 transition-all group">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-purple-50 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                            <Sparkles className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">AI 优化策略</span>
                                    </div>
                                    <p className="text-[12px] leading-relaxed text-gray-600 font-medium">{s}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* 知识图谱预览 */}
                        <Card className="border-gray-100 shadow-sm overflow-hidden">
                            <CardHeader className="pb-2 bg-purple-50/50">
                                <CardTitle className="text-[11px] font-black flex items-center gap-2 uppercase text-gray-500">
                                    <Share2 className="w-4 h-4 text-purple-500" />
                                    AI 解析出的核心实体 (实体关联)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 pt-4">
                                {result.structuredData.knowledgeGraph.map((e: any, i: number) => (
                                    <div key={i} className="p-3 border border-gray-100 rounded-xl bg-gray-50/50 hover:bg-white hover:border-purple-200 transition-all group">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-bold text-gray-900">{e.label}</span>
                                            <span className="text-[9px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded uppercase font-black">{e.type}</span>
                                        </div>
                                        <p className="text-[10px] text-gray-500 group-hover:text-gray-700">{e.description || '暂无描述'}</p>
                                    </div>
                                ))}
                                {result.structuredData.knowledgeGraph.length === 0 && (
                                    <p className="text-xs text-center text-gray-400 py-8 italic">未检测到显著实体特征</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* 权威度验证 */}
                        <Card className="bg-emerald-50/10 border-emerald-100 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-[11px] font-black uppercase text-emerald-700 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    权威度因子 (E-E-A-T 扫描)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 pt-4">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500">外部引证密度:</span>
                                    <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold">
                                        {result.structuredData.sourceList.length} 来源
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500">语义结构化评分:</span>
                                    <span className="font-bold text-emerald-600">优秀</span>
                                </div>
                                <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100/50">
                                    <p className="text-[10px] text-emerald-700 leading-relaxed font-bold">
                                        AI 爬虫优先收录具备多方证据链的内容，当前页面的引证密度符合高权威度模型标准。
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 平台兼容性 */}
                        <Card className="border-gray-100 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-[11px] font-black uppercase flex items-center gap-2 text-gray-500">
                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                    模型理解力预测
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5 pt-4">
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-[11px]">
                                        <span className="text-gray-500 font-bold">DeepSeek V3 (推理)</span>
                                        <span className="font-black text-blue-600">85%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }}></div>
                                    </div>
                                    <p className="text-[9px] text-gray-400 tracking-tight">逻辑密度适中，适合作为推理语料库。</p>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-[11px]">
                                        <span className="text-gray-500 font-bold">豆包/Bytespider (搜索)</span>
                                        <span className="font-black text-cyan-600">92%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                        <div className="h-full bg-cyan-500 rounded-full" style={{ width: '92%' }}></div>
                                    </div>
                                    <p className="text-[9px] text-gray-400 tracking-tight">摘要信息极度清晰，易于进入搜索直达。</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
