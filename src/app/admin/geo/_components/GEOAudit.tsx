'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ShieldCheck,
    AlertTriangle,
    CheckCircle2,
    Zap,
    ArrowRight,
    Search,
    Globe,
    FileSearch,
    Loader2,
    Download,
    RefreshCw as RefreshIcon
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface AuditItem {
    id: string;
    title: string;
    status: 'pass' | 'warning' | 'fail';
    message: string;
    impact: 'high' | 'medium' | 'low';
}

interface GEOAuditProps {
    onNavigate?: (tab: string) => void;
}

export default function GEOAudit({ onNavigate }: GEOAuditProps) {
    const { showToast } = useToast();
    const [auditing, setAuditing] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [items, setItems] = useState<AuditItem[]>([]);

    const runAudit = async () => {
        setAuditing(true);
        setScore(null);

        try {
            const res = await fetch('/api/admin/geo/audit');

            // 确保返回的是 JSON，防止解析 HTML 报错
            const contentType = res.headers.get('content-type');
            if (res.ok && contentType && contentType.includes('application/json')) {
                const data = await res.json();
                setItems(data.items || []);
                setScore(data.score);
                showToast('GEO 综合诊断完成', 'success');
            } else {
                const text = await res.text();
                console.error('Audit failed:', text);
                showToast('诊断失败: 服务器未返回有效数据', 'error');
            }
        } catch (error) {
            showToast('请求失败', 'error');
        } finally {
            setAuditing(false);
        }
    };

    const handleExportReport = async () => {
        try {
            showToast('正在生成报告...', 'info');
            const res = await fetch('/api/admin/geo/export-report?format=html');
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `GEO_Report_${new Date().toISOString().split('T')[0]}.html`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                showToast('报告导出成功', 'success');
            }
        } catch (e) {
            showToast('导出失败', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-600 flex items-center justify-center text-white shadow-lg shadow-green-100">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-gray-900 tracking-tight">GEO 综合健康诊断</h2>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">
                            一键扫描全站优化状态，获取针对生成式引擎的改进建议
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    {score && (
                        <Button variant="outline" onClick={handleExportReport} className="rounded-2xl font-bold border-blue-200 text-blue-600 hover:bg-blue-50 shadow-sm">
                            <Download className="w-4 h-4 mr-2" />
                            导出评估报告
                        </Button>
                    )}
                    {!score && !auditing && (
                        <Button onClick={runAudit} className="bg-green-600 hover:bg-green-700 rounded-2xl font-bold shadow-lg shadow-green-100">
                            <Zap className="w-4 h-4 mr-2 fill-current" />
                            开始全站诊断
                        </Button>
                    )}
                    {score && (
                        <Button variant="outline" onClick={runAudit} className="rounded-2xl font-bold shadow-sm">
                            <RefreshIcon className="w-4 h-4 mr-2" />
                            重新扫描
                        </Button>
                    )}
                </div>
            </div>

            {/* 审计得分 */}
            {score !== null && (
                <Card className="border-gray-100 shadow-sm">
                    <CardContent className="pt-4 pb-4">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="relative w-24 h-24 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="48" cy="48" r="44"
                                        stroke="currentColor" strokeWidth="6" fill="transparent"
                                        className="text-gray-100"
                                    />
                                    <circle
                                        cx="48" cy="48" r="44"
                                        stroke="currentColor" strokeWidth="6" fill="transparent"
                                        strokeDasharray={276.5}
                                        strokeDashoffset={276.5 - (276.5 * score) / 100}
                                        className="text-green-500"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold text-green-700">{score}</span>
                                    <span className="text-xs text-gray-500">健康分</span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-2">
                                <h3 className="text-base font-medium text-gray-900">
                                    {score >= 80 ? '您的站点 GEO 状态非常健康！' :
                                        score >= 60 ? 'GEO 优化处于中等水平，仍有改进空间。' :
                                            'GEO 状态堪忧，急需进行内容和结构优化。'}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    检测了 {items.length} 个关键指标，涵盖内容质量、引用来源、结构化数据、关键词覆盖等核心维度。
                                </p>
                                <div className="flex gap-4 pt-1">
                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                        {items.filter(i => i.status === 'pass').length} 项通过
                                    </span>
                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                                        {items.filter(i => i.status === 'warning').length} 项待改进
                                    </span>
                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                                        {items.filter(i => i.status === 'fail').length} 项严重问题
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* 审计项列表 */}
            <div className="grid grid-cols-1 gap-4">
                {auditing && (
                    <Card className="border-dashed border border-gray-200 py-12">
                        <CardContent className="flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                            <div className="text-center">
                                <p className="font-medium text-gray-700">正在扫描全站 GEO 因子...</p>
                                <p className="text-sm text-gray-500">分析文章 Schema、检查爬虫日志、通过 AI 评估引证分布</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {!auditing && items.map((item) => (
                    <Card key={item.id} className={`group overflow-hidden border border-transparent transition-all hover:border-blue-100 hover:shadow-lg hover:shadow-blue-500/5 ${item.status === 'pass' ? 'bg-green-50/20' :
                        item.status === 'warning' ? 'bg-orange-50/20' : 'bg-red-50/20'
                        }`}>
                        <CardContent className="flex items-center justify-between py-5 px-6">
                            <div className="flex gap-5 items-start">
                                <div className={`mt-1 p-2.5 rounded-xl shadow-sm ${item.status === 'pass' ? 'bg-white text-green-600 border border-green-100' :
                                    item.status === 'warning' ? 'bg-white text-orange-500 border border-orange-100' :
                                        'bg-white text-red-600 border border-red-100'
                                    }`}>
                                    {item.status === 'pass' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5 transition-pulse" />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h4 className="font-bold text-gray-900 tracking-tight">{item.title}</h4>
                                        <div className="flex gap-1">
                                            <Badge variant="outline" className={`text-[9px] uppercase font-black px-1.5 h-4 border-none ${item.impact === 'high' ? 'text-red-600 bg-red-100' :
                                                item.impact === 'medium' ? 'text-orange-600 bg-orange-100' :
                                                    'text-blue-600 bg-blue-100'
                                                }`}>
                                                {item.impact === 'high' ? '高影响' : item.impact === 'medium' ? '中等影响' : '低影响'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1 leading-relaxed max-w-2xl">{item.message}</p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className={`rounded-full px-4 border-gray-200 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all group-hover:px-6`}
                                onClick={() => {
                                    if (!onNavigate) return;
                                    // 根据 ID 映射跳转
                                    if (['1', '5', 'robots_exists', 'sitemap_missing', 'robots_ok', 'crawler_limit', 'crawler_ok'].includes(item.id)) onNavigate('settings');
                                    else if (['2', '3', 'structured_coverage', 'entity_association', 'entity_ok', 'structured_ok', 'faq_missing', 'semantic_structure', 'semantic_ok'].includes(item.id)) onNavigate('optimization');
                                    else if (['4', 'citations', 'citation_trend', 'freshness_none', 'freshness_ok'].includes(item.id)) onNavigate('citations');
                                    else if (['eeat_author', 'eeat_ok'].includes(item.id)) onNavigate('quality');
                                    else onNavigate('optimization');
                                }}
                            >
                                快速处理 <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {items.length === 0 && !auditing && (
                <div className="text-center py-24 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <FileSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900">尚未进行 GEO 诊断</h3>
                    <p className="text-gray-500 mt-1 max-w-md mx-auto">
                        点击上方按钮，系统将根据当前的配置和数据生成一份完整的 GEO 健康报告。
                    </p>
                </div>
            )}
        </div>
    );
}

// Helper icons missing in lucide-react? No, RefreshCw is used.
function RefreshCw(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
        </svg>
    );
}
