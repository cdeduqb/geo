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
            // 从服务器获取配置的站点 URL，确保与系统设置一致
            let baseUrl = window.location.origin;
            try {
                const siteUrlRes = await fetch('/api/public/site-url');
                if (siteUrlRes.ok) {
                    const data = await siteUrlRes.json();
                    if (data.siteUrl && !data.siteUrl.includes('localhost')) {
                        baseUrl = data.siteUrl;
                    }
                }
            } catch (e) {
                console.warn('[SEO Push] 无法获取系统配置的站点 URL，使用当前浏览器地址');
            }

            // 构建 URL 列表
            const urls = selectedArticles.map(id => {
                const article = articles.find(a => a.id === id);
                return `${baseUrl}/articles/${article?.slug}`;
            });

            console.log('[SEO Push] 推送 URL:', urls);

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
                const successCount = data.results.filter((r: any) => r.success).length;
                const failCount = data.results.filter((r: any) => !r.success).length;
                alert(`推送完成！成功: ${successCount}, 失败: ${failCount}`);
                // 清空选择
                setSelectedArticles([]);
            } else {
                alert('推送失败：' + (data.error || '未知错误'));
            }
        } catch (error) {
            console.error('Push error:', error);
            alert('推送失败，请检查网络连接后重试');
        } finally {
            setIsPushing(false);
        }
    };


    return (
        <div className="space-y-6">
            {/* 平台选择 */}
            <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                    推送平台
                </label>
                <div className="relative">
                    <select
                        value={selectedPlatforms}
                        onChange={(e) => setSelectedPlatforms(e.target.value)}
                        className="w-full px-5 pr-12 py-3.5 border border-gray-300 bg-white rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-sm text-gray-700 appearance-none shadow-sm"
                    >
                        <option value="all">全部平台 ({platforms.length})</option>
                        {platforms.map(p => (
                            <option key={p.id} value={p.platform}>
                                {p.platform}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* 文章列表 */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                        选择文章 ({selectedArticles.length}/{articles.length})
                    </label>
                    <button
                        onClick={selectAll}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                    >
                        {selectedArticles.length === articles.length ? '取消全选' : '全选'}
                    </button>
                </div>

                <div className="max-h-80 overflow-y-auto border border-gray-100 rounded-2xl bg-gray-50/30">
                    {articles.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                                <Send className="w-8 h-8 text-gray-300" />
                            </div>
                            <p className="text-gray-400 font-bold">暂无已发布文章</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {articles.map(article => (
                                <div
                                    key={article.id}
                                    onClick={() => toggleArticle(article.id)}
                                    className={`p-4 cursor-pointer transition-all flex items-start gap-4 ${selectedArticles.includes(article.id)
                                        ? 'bg-blue-50/50'
                                        : 'hover:bg-white'
                                        }`}
                                >
                                    <div className="mt-0.5">
                                        {selectedArticles.includes(article.id) ? (
                                            <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center">
                                                <CheckSquare className="w-4 h-4 text-white" />
                                            </div>
                                        ) : (
                                            <div className="w-5 h-5 rounded-md border-2 border-gray-300 bg-white" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={`font-bold text-sm truncate ${selectedArticles.includes(article.id) ? 'text-blue-600' : 'text-gray-900'
                                            }`}>
                                            {article.title}
                                        </div>
                                        <div className="text-[10px] text-gray-400 mt-1 font-mono">
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
                className="w-full flex items-center justify-center rounded-2xl bg-blue-600 px-8 py-4 text-sm font-black text-white shadow-lg shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200 focus:outline-none focus:ring-4 focus:ring-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            >
                {isPushing ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        推送中...
                    </>
                ) : (
                    <>
                        <Send className="w-5 h-5 mr-3" />
                        开始推送 ({selectedArticles.length} 篇)
                    </>
                )}
            </button>

            {/* 推送结果 */}
            {pushResult && (
                <div className="space-y-3">
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">推送结果</h3>
                    <div className="space-y-2">
                        {pushResult.map((result: any, idx: number) => (
                            <div
                                key={idx}
                                className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-3 ${result.success
                                    ? 'bg-green-50 text-green-700 border border-green-100'
                                    : 'bg-red-50 text-red-700 border border-red-100'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${result.success ? 'bg-green-600' : 'bg-red-600'
                                    }`}>
                                    <span className="text-white text-xs">{result.success ? '✓' : '✕'}</span>
                                </div>
                                <span>{result.platform}: {result.message || (result.success ? '推送成功' : '推送失败')}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
