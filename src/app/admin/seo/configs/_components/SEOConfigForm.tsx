'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, TestTube, CheckCircle, XCircle, ExternalLink, BookOpen } from 'lucide-react';
import { SEO_PLATFORMS, fillApiTemplate } from '@/lib/seo/platform-config';

interface SEOConfigFormProps {
    initialData?: any;
    onSuccess?: () => void;
}

export default function SEOConfigForm({ initialData, onSuccess }: SEOConfigFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [testing, setTesting] = useState(false);
    const [error, setError] = useState('');
    const [testResult, setTestResult] = useState<any>(null);
    const [selectedPlatform, setSelectedPlatform] = useState(initialData?.platform || 'baidu');

    const platformConfig = SEO_PLATFORMS[selectedPlatform];

    const handleTest = async () => {
        setTesting(true);
        setTestResult(null);
        setError('');

        const form = document.querySelector('form') as HTMLFormElement;
        const formData = new FormData(form);

        const data = {
            platform: formData.get('platform'),
            apiUrl: formData.get('apiUrl'),
            token: formData.get('token'),
            siteId: formData.get('siteId') || undefined,
        };

        try {
            const res = await fetch('/api/admin/seo/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            setTestResult(result);
        } catch (err: any) {
            setError('测试连接失败: ' + err.message);
        } finally {
            setTesting(false);
        }
    };

    const handleUseTemplate = (type: 'normal' | 'fast' = 'normal') => {
        if (!platformConfig) return;

        const template = type === 'fast'
            ? platformConfig.apiTemplates.fast
            : platformConfig.apiTemplates.normal;

        if (!template) return;

        const form = document.querySelector('form') as HTMLFormElement;
        const apiUrlInput = form.querySelector('[name="apiUrl"]') as HTMLInputElement;

        // 只填充模板，不填充实际值
        apiUrlInput.value = template;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const data = {
            platform: formData.get('platform'),
            apiUrl: formData.get('apiUrl'),
            token: formData.get('token'),
            siteId: formData.get('siteId') || null,
            isActive: formData.get('isActive') === 'on',
        };

        try {
            const url = '/api/admin/seo/configs';
            const method = initialData ? 'PUT' : 'POST';
            const body = initialData ? { ...data, id: initialData.id } : data;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || '保存失败');
            }

            router.refresh();
            if (onSuccess) onSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* 错误提示 */}
            {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600 flex items-start gap-2">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {/* 测试结果 */}
            {testResult && (
                <div className={`rounded-lg border p-4 text-sm ${testResult.success
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-red-50 border-red-200 text-red-600'
                    }`}>
                    <div className="flex items-start gap-2">
                        {testResult.success ? (
                            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        ) : (
                            <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                            <div className="font-medium mb-1">{testResult.message}</div>
                            {testResult.details?.suggestion && (
                                <div className="text-xs mt-2 opacity-90">
                                    💡 建议: {testResult.details.suggestion}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 平台选择 */}
            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    搜索引擎平台 *
                </label>
                <select
                    name="platform"
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    disabled={!!initialData}
                    className="w-full rounded-lg border border-gray-300 bg-white p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:bg-gray-100"
                    required
                >
                    <option value="baidu">百度</option>
                    <option value="360">360 搜索</option>
                    <option value="sogou">搜狗</option>
                    <option value="toutiao">头条搜索</option>
                    <option value="indexnow">IndexNow (Bing/AI)</option>
                </select>
                {initialData && (
                    <p className="mt-1.5 text-xs text-gray-500">平台类型创建后不可修改</p>
                )}

                {/* 平台文档链接 */}
                {platformConfig && (
                    <div className="mt-2 space-y-2">
                        <a
                            href={platformConfig.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                        >
                            <BookOpen className="w-3 h-3" />
                            查看{platformConfig.name}站长平台文档
                            <ExternalLink className="w-3 h-3" />
                        </a>
                        <div className="text-xs text-gray-600 bg-blue-50 rounded p-2 border border-blue-100">
                            <span className="font-medium">获取Token: </span>
                            {platformConfig.tokenGuide}
                        </div>
                        {platformConfig.rateLimit && (
                            <div className="text-xs text-gray-500">
                                ⚡ 速率限制: {platformConfig.rateLimit.perDay} 条/天
                                {platformConfig.rateLimit.perMinute && ` / ${platformConfig.rateLimit.perMinute} 条/分钟`}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* API URL */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                        API URL *
                    </label>
                    {platformConfig && (
                        <div className="flex gap-2">
                            {platformConfig.apiTemplates.normal && (
                                <button
                                    type="button"
                                    onClick={() => handleUseTemplate('normal')}
                                    className="text-xs text-blue-600 hover:text-blue-700"
                                >
                                    使用模板
                                </button>
                            )}
                            {platformConfig.apiTemplates.fast && (
                                <button
                                    type="button"
                                    onClick={() => handleUseTemplate('fast')}
                                    className="text-xs text-purple-600 hover:text-purple-700"
                                >
                                    快速收录
                                </button>
                            )}
                        </div>
                    )}
                </div>
                <input
                    type="url"
                    name="apiUrl"
                    defaultValue={initialData?.apiUrl || ''}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-mono text-sm"
                    required
                />
                <p className="mt-1.5 text-xs text-gray-500">
                    {platformConfig?.requiresSiteId
                        ? '注意: 需要将 {siteId} 和 {token} 替换为实际值'
                        : '请填写完整的API地址'}
                </p>
            </div>

            {/* Token */}
            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Token / API Key *
                </label>
                <input
                    type="text"
                    name="token"
                    defaultValue={initialData?.token || ''}
                    placeholder="请输入 API Token"
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-mono"
                    required
                />
            </div>

            {/* 站点ID */}
            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    站点 ID {platformConfig?.requiresSiteId && '*'}
                </label>
                <input
                    type="text"
                    name="siteId"
                    defaultValue={initialData?.siteId || ''}
                    placeholder={platformConfig?.requiresSiteId ? '必填' : '可选'}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-mono"
                    required={platformConfig?.requiresSiteId}
                />
                {platformConfig?.requiresSiteId && (
                    <p className="mt-1.5 text-xs text-orange-600">
                        ⚠️ {platformConfig.name}平台必须提供站点ID
                    </p>
                )}
            </div>

            {/* 启用开关 */}
            <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        name="isActive"
                        defaultChecked={initialData?.isActive ?? true}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">启用此配置</span>
                </label>
            </div>

            {/* 按钮组 */}
            <div className="flex justify-between pt-4 border-t border-gray-200">
                <button
                    type="button"
                    onClick={handleTest}
                    disabled={testing || loading}
                    className="flex items-center gap-2 rounded-lg border-2 border-blue-600 text-blue-600 bg-white px-5 py-2.5 font-semibold transition-colors hover:bg-blue-50 disabled:opacity-50"
                >
                    {testing ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            测试中...
                        </>
                    ) : (
                        <>
                            <TestTube className="h-5 w-5" />
                            测试连接
                        </>
                    )}
                </button>

                <button
                    type="submit"
                    disabled={loading || testing}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            保存中...
                        </>
                    ) : (
                        <>
                            <Save className="h-5 w-5" />
                            保存配置
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
