'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Wand2,
    CheckCircle2,
    XCircle,
    Loader2,
    FileText,
    Sparkles,
    Zap
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface Article {
    id: string;
    title: string;
    status: string;
}

export default function BulkOptimizer() {
    const { showToast } = useToast();
    const [articles, setArticles] = useState<Article[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [optimizing, setOptimizing] = useState(false);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            // 获取最近的文章用于优化演示 (使用正确的公开 API 路径)
            const res = await fetch('/api/articles?limit=10');

            const contentType = res.headers.get('content-type');
            if (res.ok && contentType && contentType.includes('application/json')) {
                const data = await res.json();
                setArticles(data.articles || []);
            } else {
                console.error('Failed to fetch articles:', await res.text());
                showToast('获取文章列表失败', 'error');
            }
        } catch (error) {
            console.error('获取文章失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSelect = (id: string) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const runBulkOptimize = async () => {
        if (selected.length === 0) {
            showToast('请至少选择一篇文章', 'error');
            return;
        }

        setOptimizing(true);
        try {
            const res = await fetch('/api/admin/geo/bulk-optimize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ articleIds: selected })
            });
            const data = await res.json();
            if (res.ok) {
                showToast(`成功发起 ${data.results.length} 篇文章的 GEO 增强任务`, 'success');
                setSelected([]);
            } else {
                showToast(data.error || '优化失败', 'error');
            }
        } catch (error) {
            showToast('请求失败', 'error');
        } finally {
            setOptimizing(false);
        }
    };

    return (
        <div className="bg-white rounded-[32px] border border-blue-100 shadow-sm shadow-blue-50 overflow-hidden">
            <div className="px-8 py-6 bg-blue-50/30 border-b border-blue-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-gray-900 tracking-tight">内容缺口一键补齐</h2>
                            <p className="text-xs text-gray-400 font-medium mt-0.5">
                                AI 将分析文意并自动插入 FAQ 或操作步骤元数据，提升被引几率
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={runBulkOptimize}
                        disabled={optimizing || selected.length === 0}
                        className="bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold shadow-lg shadow-blue-100 px-6"
                    >
                        {optimizing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2 fill-current" />}
                        执行 AI 自动增强 ({selected.length})
                    </Button>
                </div>
            </div>
            <div>
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                        {articles.map((article) => (
                            <div
                                key={article.id}
                                className={`flex items-center justify-between px-6 py-4 transition-colors cursor-pointer hover:bg-blue-50/20 ${selected.includes(article.id) ? 'bg-blue-50' : ''
                                    }`}
                                onClick={() => toggleSelect(article.id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selected.includes(article.id) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                                        }`}>
                                        {selected.includes(article.id) && <CheckCircle2 className="w-3 h-3 text-white" />}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-700 truncate max-w-[400px]">
                                            {article.title}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-[10px] scale-90">
                                        {article.status === 'PUBLISHED' ? '已发布' : '草稿'}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {articles.length === 0 && !loading && (
                    <div className="py-12 text-center text-gray-400 text-sm">
                        暂无文章数据
                    </div>
                )}
            </div>
        </div>
    );
}
