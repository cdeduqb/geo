'use client';

import { useState, useEffect } from 'react';
import { Globe, FileText, Layers, ShoppingBag, Folder, Settings, ArrowRight, Check, AlertCircle, Play, Loader2 } from 'lucide-react';

interface Stats {
    articles: { zh: number; en: number };
    pages: { zh: number; en: number };
    products: { zh: number; en: number };
    categories: { zh: number; en: number };
    siteSettings: { hasEn: boolean };
}

export default function TranslationDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [processing, setProcessing] = useState<{ type: string; current: number; total: number } | null>(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/i18n/stats');
            if (!res.ok) {
                console.error('Stats API error:', res.status, res.statusText);
                return;
            }
            const data = await res.json();
            if (data.error) {
                console.error('Stats API returned logic error:', data.error);
                return;
            }
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBatchTranslate = async (type: string, totalMissing: number) => {
        if (processing) return;

        // Start processing loop
        setProcessing({ type, current: 0, total: totalMissing });

        let processedCount = 0;
        let successCount = 0;
        let failCount = 0;
        let hasMore = true;
        let consecutiveFailures = 0;

        try {
            while (hasMore && processedCount < totalMissing) {
                try {
                    const res = await fetch('/api/admin/i18n/translate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ type, limit: 1 }) // Process 1 at a time
                    });

                    if (!res.ok) {
                        const errData = await res.json().catch(() => ({}));
                        throw new Error(errData.error || `HTTP ${res.status}`);
                    }

                    const data = await res.json();

                    if (data.success && data.processed > 0) {
                        processedCount += data.processed;
                        successCount += data.processed;
                        consecutiveFailures = 0; // Reset consecutive failures
                        setProcessing(prev => prev ? { ...prev, current: processedCount } : null);
                    } else {
                        hasMore = false; // No more items found to translate
                    }
                } catch (innerError: any) {
                    console.warn(`Item translation failed (${failCount + 1}):`, innerError);
                    failCount++;
                    consecutiveFailures++;

                    // If we have too many consecutive failures (e.g., 5), likely a systemic issue (network/auth), so we abort.
                    if (consecutiveFailures >= 5) {
                        throw new Error(`连续失败 5 次，已自动停止任务。最后一次错误：${innerError.message || '未知'}`);
                    }

                    // Otherwise, we continue to the next item
                    // But we need to make sure we don't loop infinitely on the SAME item if the API keeps picking up the same failed item.
                    // The API finds "first item without translation". If translation fails and db is not updated, API gets same item next time.
                    // CRITICAL: If we MUST stop if we can't mark it as 'skipped/failed' in backend.

                    // Since the current backend API doesn't support "skip" flag,
                    // we actually CANNOT safely continue without an infinite loop on the same problematic item.
                    // HENCE: The "Resilient Loop" is dangerous unless backend supports it.

                    // RETREAT STRATEGY:
                    // Instead of ignoring, we throw to stop, BUT we give a better UX for "Timeout".
                    // OR: We imply that the user interprets "Optimization" as "Make it not fail".

                    throw innerError; // Re-throw to outer catch for now.
                }
            }
        } catch (error: any) {
            console.error('Batch translation failed', error);
            let errMsg = error.message || '未知错误';
            if (errMsg.includes('timed out')) errMsg = '单条内容过长导致 AI 响应超时';
            if (errMsg.includes('HTTP')) errMsg = `网络请求失败 (${errMsg})`;

            // Show more detailed report
            alert(`批量翻译任务已停止。\n\n原因：${errMsg}\n\n当前进度：\n✅ 成功：${successCount}\n❌ 失败：${failCount + (error ? 1 : 0)}`);
        } finally {
            setProcessing(null);
            fetchStats(); // Refresh stats

            if (successCount > 0 && failCount === 0) {
                // Only show pure success message if no errors occurred
                const typeNameMap: Record<string, string> = {
                    'article': '文章',
                    'page': '页面',
                    'product': '产品',
                    'category': '分类',
                    'site_settings': '站点配置'
                };
                const name = typeNameMap[type] || type;
                alert(`${name} 翻译任务已完成！\n共成功处理 ${successCount} 个条目。`);
            }
        }
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">正在加载统计数据...</div>;
    // Ensure stats has required structure before rendering
    if (!stats || !stats.siteSettings || !stats.articles) {
        return <div className="p-8 text-center text-red-500">加载统计数据失败，请检查控制台详情。</div>;
    }

    const sections = [
        {
            id: 'site_settings',
            title: '站点配置',
            icon: Settings,
            zhCount: 1,
            enCount: stats.siteSettings?.hasEn ? 1 : 0,
            description: '页眉、页脚、品牌信息',
            actionText: stats.siteSettings?.hasEn ? '重新翻译' : '立即翻译',
            link: '/admin/settings/site' // Redirect to manual page for this one as it has dedicated UI
        },
        {
            id: 'article',
            title: '文章',
            icon: FileText,
            zhCount: stats.articles.zh,
            enCount: stats.articles.en,
            description: '博客文章和新闻动态',
            actionText: '批量翻译缺失项'
        },
        {
            id: 'page',
            title: '页面',
            icon: Layers,
            zhCount: stats.pages.zh,
            enCount: stats.pages.en,
            description: '自定义页面（首页、关于等）',
            actionText: '批量翻译缺失项'
        },
        {
            id: 'product',
            title: '产品',
            icon: ShoppingBag,
            zhCount: stats.products.zh,
            enCount: stats.products.en,
            description: '产品目录',
            actionText: '批量翻译缺失项'
        },
        {
            id: 'category',
            title: '分类',
            icon: Folder,
            zhCount: stats.categories.zh,
            enCount: stats.categories.en,
            description: '内容分类',
            actionText: '批量翻译缺失项'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                    <Globe className="w-10 h-10 opacity-80" />
                    <h1 className="text-3xl font-bold">全球化翻译中心</h1>
                </div>
                <p className="text-blue-100 text-lg max-w-2xl">
                    管理和自动化您的网站国际化进程。监控多语言内容覆盖率，并执行 AI 批量翻译任务。
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map(section => {
                    const missing = Math.max(0, section.zhCount - section.enCount);
                    const progress = section.zhCount > 0 ? (section.enCount / section.zhCount) * 100 : 0;
                    const isProcessing = processing?.type === section.id;

                    return (
                        <div key={section.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                    <section.icon className="w-6 h-6" />
                                </div>
                                <div className={`text-xs font-bold px-2 py-1 rounded-full ${missing === 0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {missing === 0 ? '已全部翻译' : `${missing} 个待翻译`}
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-1">{section.title}</h3>
                            <p className="text-sm text-gray-500 mb-6">{section.description}</p>

                            {/* Progress Bar */}
                            <div className="mb-6">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">覆盖率</span>
                                    <span className="font-bold text-gray-900">{Math.round(progress)}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                    <span>中文: {section.zhCount}</span>
                                    <span>英文: {section.enCount}</span>
                                </div>
                            </div>

                            {/* Action Button */}
                            {section.id === 'site_settings' ? (
                                <a
                                    href={section.link}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-200 hover:border-blue-500 hover:text-blue-600 font-medium transition-colors"
                                >
                                    前往设置 <ArrowRight className="w-4 h-4" />
                                </a>
                            ) : (
                                <button
                                    onClick={() => handleBatchTranslate(section.id, missing)}
                                    disabled={missing === 0 || isProcessing || processing !== null}
                                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-colors ${missing === 0
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : isProcessing
                                            ? 'bg-blue-100 text-blue-700 cursor-wait'
                                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow'
                                        }`}
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            正在翻译 {processing?.current} / {processing?.total}...
                                        </>
                                    ) : (
                                        <>
                                            {missing === 0 ? <Check className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                            {section.actionText}
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                    <p className="font-bold mb-1">重要提示</p>
                    <p>AI 翻译会消耗 Token。批量翻译大量条目可能会导致高昂的成本或触发 API 速率限制。请确保您的 AI 配置有足够的配额。</p>
                </div>
            </div>
        </div>
    );
}
