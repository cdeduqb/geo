'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Clock,
    MousePointer2,
    Zap,
    BarChart,
    PieChart,
    Activity,
    Loader2,
    RefreshCw
} from 'lucide-react';

interface Behavior {
    id: string;
    crawler: string;
    avgVisitHour: number;
    peakHours: string; // JSON string
    preferredPaths: string; // JSON string
    avgDepth: number;
    visitFrequency: number;
    lastAnalyzed: string;
}

export default function BehaviorAnalysis() {
    const [behaviors, setBehaviors] = useState<Behavior[]>([]);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/geo/behavior');
            const data = await res.json();
            if (res.ok) {
                setBehaviors(data.behaviors || []);
            }
        } catch (error) {
            console.error('获取行为数据失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const runAnalysis = async () => {
        setAnalyzing(true);
        await fetchData();
        setAnalyzing(false);
    };

    if (loading && !analyzing) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-100">
                        <MousePointer2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-gray-900 tracking-tight">爬虫行为深度分析</h2>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">
                            分析各大 AI 爬虫的抓取习惯、高峰时段和内容偏好
                        </p>
                    </div>
                </div>
                <Button onClick={runAnalysis} disabled={analyzing} variant="outline" className="rounded-2xl font-bold shadow-sm">
                    {analyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                    更新深度分析
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {behaviors.map((item) => {
                    const peakHours = JSON.parse(item.peakHours || '[]');
                    const paths = JSON.parse(item.preferredPaths || '[]');

                    return (
                        <Card key={item.id} className="border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                            <Activity className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-sm font-medium text-gray-900">
                                                {item.crawler}
                                            </CardTitle>
                                            <CardDescription className="text-xs text-gray-500">
                                                AI 爬虫行为分析
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                                        {item.visitFrequency.toFixed(1)} 次/天
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                {/* 高峰时段 */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500 flex items-center gap-1.5">
                                            <Clock className="w-3 h-3 text-orange-500" />
                                            活跃时段
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {peakHours.map((hour: number) => (
                                            <span key={hour} className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-100">
                                                {hour}:00
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* 路径偏好 */}
                                <div className="space-y-2">
                                    <span className="text-xs text-gray-500 flex items-center gap-1.5">
                                        <Zap className="w-3 h-3 text-blue-500" />
                                        采集路径偏好
                                    </span>
                                    <div className="space-y-1">
                                        {paths.map((path: string, idx: number) => (
                                            <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100">
                                                <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 text-[10px] font-medium">
                                                    {idx + 1}
                                                </span>
                                                <span className="text-xs text-gray-600 truncate flex-1">{path}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 综合指标 Footer */}
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 mt-2">
                                    <div className="text-center p-2 rounded-lg bg-gray-50">
                                        <p className="text-xs text-gray-500">平均访问时间</p>
                                        <p className="text-sm font-medium text-gray-900">{item.avgVisitHour}:00</p>
                                    </div>
                                    <div className="text-center p-2 rounded-lg bg-gray-50">
                                        <p className="text-xs text-gray-500">最后分析</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {new Date(item.lastAnalyzed).toLocaleDateString('zh-CN')}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {behaviors.length === 0 && (
                <div className="py-20 text-center border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                    <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">暂无深度分析数据，请点击“更新深度分析”</p>
                </div>
            )}
        </div>
    );
}
