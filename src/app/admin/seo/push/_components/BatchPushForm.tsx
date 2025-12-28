'use client';

import { useState } from 'react';
import { Send, Loader2, CheckSquare, Square } from 'lucide-react';

interface Article {
    id: string;
    title: string;
    slug: string;
    createdAt: Date;
}

interface Platform {
    id: string;
    platform: string;
    lastPushAt: Date | null;
}

interface BatchPushFormProps {
    articles: Article[];
    platforms: Platform[];
}

export default function BatchPushForm({ articles, platforms }: BatchPushFormProps) {
    const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
    const [selectedPlatforms, setSelectedPlatforms] = useState<string>('all');
    const [isPushing, setIsPushing] = useState(false);
    const [pushResult, setPushResult] = useState<any>(null);

    const toggleArticle = (id: string) => {
        setSelectedArticles(prev =>
            prev.includes(id)
                ? prev.filter(a => a !== id)
                : [...prev, id]
        );
    };

    const selectAll = () => {
        if (selectedArticles.length === articles.length) {
            setSelectedArticles([]);
        } else {
            setSelectedArticles(articles.map(a => a.id));
        }
    };

    const handlePush = async () => {
        if (selectedArticles.length === 0) {
            alert('请至少选择一篇文章');
            return;
        }

        if (platforms.length === 0) {
            alert('没有活跃的推送配置，请先配置搜索引擎推送');
            return;
        }

        setIsPushing(true);
        setPushResult(null);

        try {
            // 构建 URL 列表
            const baseUrl = window.location.origin;
            const urls = selectedArticles.map(id => {
                const article = articles.find(a => a.id === id);
                return `${baseUrl}/articles/${article?.slug}`;
            });

            const res = await fetch('/api/admin/seo/push', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    urls,
                    platforms: selectedPlatforms,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setPushResult(data.results);
                alert(`推送完成！成功: ${data.results.filter((r: any) => r.success).length}, 失败: ${data.results.filter((r: any) => !r.success).length}`);
                // 清空选择
                setSelectedArticles([]);
            } else {
                alert('推送失败：' + data.error);
            }
        } catch (error) {
            console.error('Push error:', error);
            alert('推送失败，请重试');
        } finally {
            setIsPushing(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* 平台选择 */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    推送平台
                </label>
                <select
                    value={selectedPlatforms}
                    onChange={(e) => setSelectedPlatforms(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    <option value="all">全部平台 ({platforms.length})</option>
                    {platforms.map(p => (
                        <option key={p.id} value={p.platform}>
                            {p.platform}
                        </option>
                    ))}
                </select>
            </div>

            {/* 文章列表 */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                        选择文章 ({selectedArticles.length}/{articles.length})
                    </label>
                    <button
                        onClick={selectAll}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        {selectedArticles.length === articles.length ? '取消全选' : '全选'}
                    </button>
                </div>

                <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                    {articles.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            暂无已发布文章
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {articles.map(article => (
                                <div
                                    key={article.id}
                                    onClick={() => toggleArticle(article.id)}
                                    className="p-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-start gap-3"
                                >
                                    <div className="mt-0.5">
                                        {selectedArticles.includes(article.id) ? (
                                            <CheckSquare className="w-5 h-5 text-blue-600" />
                                        ) : (
                                            <Square className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm text-gray-900 truncate">
                                            {article.title}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            /{article.slug}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 推送按钮 */}
            <button
                onClick={handlePush}
                disabled={isPushing || selectedArticles.length === 0 || platforms.length === 0}
                className="w-full flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {isPushing ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        推送中...
                    </>
                ) : (
                    <>
                        <Send className="w-4 h-4 mr-2" />
                        开始推送 ({selectedArticles.length} 篇)
                    </>
                )}
            </button>

            {/* 推送结果 */}
            {pushResult && (
                <div className="mt-4 space-y-2">
                    <h3 className="text-sm font-semibold text-gray-900">推送结果：</h3>
                    {pushResult.map((result: any, idx: number) => (
                        <div
                            key={idx}
                            className={`p-3 rounded-lg text-sm ${result.success
                                    ? 'bg-green-50 text-green-700'
                                    : 'bg-red-50 text-red-700'
                                }`}
                        >
                            <span className="font-semibold">{result.platform}:</span> {result.message || (result.success ? '成功' : '失败')}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
