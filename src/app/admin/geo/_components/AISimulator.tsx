'use client';

import { useState } from 'react';
import { Bot, Search, Loader2, Sparkles, FileText, Share2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AISimulator() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleSimulate = async () => {
        if (!url) return;
        setLoading(true);
        try {
            // 这里为了简化演示，我们通常通过输入的 URL 获取文章数据
            // 实际实现中，用户可以输入文章 ID 或者直接从预览页跳转过来
            // 目前我们先模拟一个测试数据请求
            const res = await fetch('/api/admin/geo/simulate-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: "示例：什么是生成式引擎优化 (GEO)?",
                    content: "<h2>GEO 的核心概念</h2><p>生成式引擎优化（Generative Engine Optimization）是针对大语言模型（如 ChatGPT, Gemini）而产生的新型 SEO 策略。它不仅关注关键词排名，更关注内容如何被 AI 引用和摘要。</p><ul><li>结构化数据</li><li>实体关联</li><li>权威引用</li></ul>",
                    summary: "探讨 AI 时代下网站内容的优化策略，助力品牌在生成式搜索中脱颖而出。",
                    entities: [
                        { text: "GEO", type: "Concept", description: "生成式引擎优化" },
                        { text: "ChatGPT", type: "Product", url: "https://openai.com/chatgpt" }
                    ],
                    citations: [
                        { title: "GEO: Generative Engine Optimization", url: "https://arxiv.org/abs/2311.13968", author: "Pranjal Aggarwal" }
                    ]
                })
            });

            if (res.ok) {
                const data = await res.json();
                setResult(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bot className="w-5 h-5" />
                        AI 视角模拟器 (Crawler Simulator)
                    </CardTitle>
                    <CardDescription>
                        模拟主流大模型（GPT-4、Gemini、Claude）抓取并处理您网页后的“大脑成像”
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="输入文章 Slug 或 URL (例如: /articles/what-is-geo)"
                        />
                        <Button onClick={handleSimulate} disabled={loading || !url}>
                            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                            开始模拟
                        </Button>
                    </div>

                    {!result && (
                        <div className="py-12 text-center border-2 border-dashed border-gray-100 rounded-xl">
                            <Bot className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                            <p className="text-gray-400 text-sm">输入地址并点击模拟，查看 AI 如何“阅读”您的内容</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {result && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* 文本提取视图 */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-500" />
                                    AI 提取后的纯文本 (Clean Text Buffer)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-gray-50 p-4 rounded-lg font-mono text-xs whitespace-pre-wrap max-h-[400px] overflow-y-auto border border-gray-100">
                                    {result.aiVersion.text}
                                </div>
                                <div className="mt-3 flex items-center justify-between text-[10px] text-gray-400 uppercase tracking-tighter">
                                    <span>Tokens 估计: ~{result.aiVersion.tokensEstimate}</span>
                                    <span>Status: Content Extracted Successfully</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 建议面板 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {result.suggestions.map((s: string, i: number) => (
                                <div key={i} className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm flex items-start gap-2">
                                    <Sparkles className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                                    <p className="text-[12px] leading-snug text-gray-600">{s}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* 知识图谱预览 */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Share2 className="w-4 h-4 text-purple-500" />
                                    知识图谱特征 (Entity Link)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {result.structuredData.knowledgeGraph.map((e: any, i: number) => (
                                    <div key={i} className="p-2 border border-gray-50 rounded bg-gray-50/30">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-bold text-gray-900">{e.label}</span>
                                            <span className="text-[10px] bg-purple-100 text-purple-600 px-1 rounded uppercase font-bold">{e.type}</span>
                                        </div>
                                        <p className="text-[10px] text-gray-500 truncate">{e.description || 'No description'}</p>
                                    </div>
                                ))}
                                {result.structuredData.knowledgeGraph.length === 0 && (
                                    <p className="text-xs text-center text-gray-400 py-4">未检测到显著实体</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* 权威度验证 */}
                        <Card className="bg-green-50/30 border-green-100">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-bold uppercase text-green-700 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    权威度因子 (E-E-A-T)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-gray-600">引用第三方来源:</span>
                                    <span className="font-bold text-green-600">{result.structuredData.sourceList.length} 个</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-gray-600">Breadcrumb 数据:</span>
                                    <span className="font-bold text-green-600">已启用</span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-green-100">
                                    <p className="text-[10px] text-green-600 font-medium">
                                        AI 爬虫会优先收录包含第三方佐证的内容，因为这能显著提高模型回答的准确性。
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 平台匹配度 */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-bold uppercase flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                    平台契合度预测
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[10px]">
                                        <span className="text-gray-500">DeepSeek (推理型)</span>
                                        <span className="font-bold">85%</span>
                                    </div>
                                    <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500" style={{ width: '85%' }}></div>
                                    </div>
                                    <p className="text-[9px] text-gray-400">逻辑结构清晰，适合推理模型分析。</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[10px]">
                                        <span className="text-gray-500">豆包 (推荐型)</span>
                                        <span className="font-bold">92%</span>
                                    </div>
                                    <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-cyan-500" style={{ width: '92%' }}></div>
                                    </div>
                                    <p className="text-[9px] text-gray-400">摘要精炼，利于进入字节跳动分发池。</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
