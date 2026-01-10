'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, TestTube, CheckCircle, XCircle, ExternalLink, BookOpen, Code, Zap, Globe, Shield, Sparkles } from 'lucide-react';
import { SEO_PLATFORMS, AVAILABLE_PLATFORMS } from '@/lib/seo/platform-config';

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

    // 样式常量
    const inputClass = "w-full rounded-2xl border border-gray-300 bg-gray-50/50 px-6 py-4 text-sm font-bold text-gray-900 focus:border-blue-600 focus:bg-white transition-all outline-none placeholder:text-gray-300";
    const labelClass = "text-[13px] font-bold text-gray-700 ml-1 block mb-2";
    const cardClass = "bg-white rounded-[32px] border border-gray-100 shadow-sm ring-1 ring-gray-100/50 p-10";

    const platformConfig = SEO_PLATFORMS[selectedPlatform];

    // 判断当前平台是否支持 API 推送
    const supportsApi = platformConfig?.pushType === 'api' || platformConfig?.pushType === 'both';
    // 判断当前平台是否支持脚本注入
    const supportsScript = platformConfig?.pushType === 'script' || platformConfig?.pushType === 'both';

    const handleTest = async (e: React.MouseEvent) => {
        setTesting(true);
        setTestResult(null);
        setError('');

        const form = (e.currentTarget as HTMLElement).closest('form');
        if (!form) {
            setError('找不到表单对象');
            setTesting(false);
            return;
        }

        const formData = new FormData(form);

        const data = {
            platform: selectedPlatform,
            apiUrl: formData.get('apiUrl'),
            token: formData.get('token'),
            siteId: formData.get('siteId') || undefined,
        };

        // 对于只支持脚本的平台，跳过 API 测试
        if (!supportsApi) {
            setTestResult({
                success: true,
                message: `${platformConfig?.name} 平台主要使用 JS 脚本方式，无需测试 API 连接`
            });
            setTesting(false);
            return;
        }

        try {
            const res = await fetch('/api/admin/seo/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            if (!res.ok) {
                setTestResult({
                    success: false,
                    message: result.error || result.message || '测试接口返回错误'
                });
            } else {
                setTestResult(result);
            }
        } catch (err: any) {
            setError('测试连接失败: ' + err.message);
        } finally {
            setTesting(false);
        }
    };

    const handleUseTemplate = (e: React.MouseEvent, type: 'normal' | 'fast' = 'normal') => {
        if (!platformConfig?.apiTemplates) return;

        const template = type === 'fast'
            ? platformConfig.apiTemplates.fast
            : platformConfig.apiTemplates.normal;

        if (!template) return;

        const form = e.currentTarget.closest('form') as HTMLFormElement;
        const apiUrlInput = form.querySelector('[name="apiUrl"]') as HTMLInputElement;

        if (apiUrlInput) {
            apiUrlInput.value = template;
            apiUrlInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const data = {
            platform: selectedPlatform,
            apiUrl: formData.get('apiUrl') || null,
            token: formData.get('token') || null,
            siteId: formData.get('siteId') || null,
            script: formData.get('script') || null,
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
                throw new Error(errorData.error || errorData.message || '保存失败');
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
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* 错误提示 */}
            {error && (
                <div className="rounded-[20px] bg-red-50 border border-red-100 p-6 text-sm text-red-600 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="font-bold">{error}</span>
                </div>
            )}

            {/* 测试结果 */}
            {testResult && (
                <div className={`rounded-[20px] border p-6 text-sm animate-in fade-in slide-in-from-top-2 ${testResult.success
                    ? 'bg-green-50 border-green-100 text-green-700'
                    : 'bg-red-50 border-red-100 text-red-600'
                    }`}>
                    <div className="flex items-start gap-4">
                        {testResult.success ? (
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                <XCircle className="w-5 h-5" />
                            </div>
                        )}
                        <div className="flex-1">
                            <div className="font-black mb-1 text-base">{testResult.message}</div>
                            {testResult.details?.suggestion && (
                                <div className="text-xs mt-2 font-bold bg-white/50 px-3 py-2 rounded-lg inline-block">
                                    💡 专家建议: {testResult.details.suggestion}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm ring-1 ring-gray-100/50 p-10 space-y-8">
                {/* 平台选择 */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                        <h3 className="text-lg font-black text-gray-900 tracking-tight">核心引擎选择</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                        <div className="space-y-3">
                            <label className={labelClass}>
                                搜索引擎平台 <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="platform"
                                value={selectedPlatform}
                                onChange={(e) => setSelectedPlatform(e.target.value)}
                                disabled={!!initialData}
                                className={inputClass}
                                required
                            >
                                {AVAILABLE_PLATFORMS.map(id => (
                                    <option key={id} value={id}>{SEO_PLATFORMS[id].name}</option>
                                ))}
                            </select>
                            {initialData && (
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1">平台类型创建后不可修改</p>
                            )}
                        </div>

                        {platformConfig && (
                            <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 space-y-4">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-black text-gray-900 text-sm">平台特征:</h4>
                                    <div className="flex gap-2">
                                        {supportsApi && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 text-[10px] font-black rounded-lg uppercase tracking-wider">
                                                <Zap className="w-3 h-3" /> API 推送
                                            </span>
                                        )}
                                        {supportsScript && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-700 text-[10px] font-black rounded-lg uppercase tracking-wider">
                                                <Code className="w-3 h-3" /> JS 脚本注入
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed">{platformConfig.description}</p>
                                <a
                                    href={platformConfig.documentUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    <BookOpen className="w-3.5 h-3.5" />
                                    阅读{platformConfig.name}官方开发手册
                                    <ExternalLink className="w-3 h-3 opacity-50" />
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* ===== API 推送配置区域 ===== */}
                {supportsApi && (
                    <div className="pt-10 border-t border-gray-50 space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                            <h3 className="text-lg font-black text-gray-900 tracking-tight">API 数据网关配置</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* API URL */}
                            <div className="md:col-span-2 space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <label className={labelClass}>
                                        API 调用地址 {platformConfig?.requiresToken && '*'}
                                    </label>
                                    {platformConfig?.apiTemplates && (
                                        <div className="flex gap-3 -mt-2">
                                            {platformConfig.apiTemplates.normal && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleUseTemplate(e, 'normal')}
                                                    className="text-[10px] font-black text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-100 px-3 py-1 rounded-lg transition-all"
                                                >
                                                    使用普通模板
                                                </button>
                                            )}
                                            {platformConfig.apiTemplates.fast && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleUseTemplate(e, 'fast')}
                                                    className="text-[10px] font-black text-purple-600 hover:text-white hover:bg-purple-600 border border-purple-100 px-3 py-1 rounded-lg transition-all"
                                                >
                                                    🚀 快速收录模板
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="url"
                                    name="apiUrl"
                                    defaultValue={initialData?.apiUrl || ''}
                                    placeholder="https://data.zz.baidu.com/urls?site=..."
                                    className={`${inputClass} font-mono`}
                                />
                            </div>

                            {/* Token */}
                            <div className="space-y-3">
                                <label className={labelClass}>
                                    安全密钥 (Token / Proxy Key) {platformConfig?.requiresToken && '*'}
                                </label>
                                <input
                                    type="text"
                                    name="token"
                                    defaultValue={initialData?.token || ''}
                                    placeholder="请输入平台分配的密钥"
                                    className={`${inputClass} font-mono`}
                                />
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1">{platformConfig?.tokenGuide}</p>
                            </div>

                            {/* 站点ID */}
                            {platformConfig?.requiresSiteId && (
                                <div className="space-y-3">
                                    <label className={labelClass}>
                                        站点标识符 (Site ID) *
                                    </label>
                                    <input
                                        type="text"
                                        name="siteId"
                                        defaultValue={initialData?.siteId || ''}
                                        placeholder="例如: www.example.com"
                                        className={`${inputClass} font-mono`}
                                    />
                                    <p className="text-[10px] text-orange-500 font-black uppercase tracking-widest ml-1">
                                        ⚠️ {platformConfig.name}环境必须绑定合法标识
                                    </p>
                                </div>
                            )}
                        </div>

                        {platformConfig?.rateLimit && (
                            <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-[20px] border border-blue-100/50">
                                <Shield className="w-5 h-5 text-blue-400" />
                                <span className="text-xs font-black text-blue-800 uppercase tracking-tight">
                                    配额限制: {platformConfig.rateLimit.perDay} 条/24H
                                    {platformConfig.rateLimit.perMinute && ` | 瞬间并发: ${platformConfig.rateLimit.perMinute} 条/MIN`}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* ===== JS 脚本配置区域 ===== */}
                {supportsScript && (
                    <div className="pt-10 border-t border-gray-50 space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
                            <h3 className="text-lg font-black text-gray-900 tracking-tight">自动推送脚本 (客户端实现)</h3>
                        </div>

                        <div className="space-y-4">
                            <label className={labelClass}>
                                JavaScript 实现代码
                            </label>
                            <div className="rounded-[24px] border border-gray-100 overflow-hidden ring-1 ring-gray-100/50">
                                <textarea
                                    name="script"
                                    defaultValue={initialData?.script || ''}
                                    rows={10}
                                    className="w-full bg-slate-900 p-8 outline-none font-mono text-sm text-blue-400 leading-relaxed transition-all focus:ring-4 focus:ring-blue-500/10"
                                    placeholder={selectedPlatform === 'toutiao'
                                        ? `(function(){
  var el = document.createElement("script");
  el.src = "https://lf1-cdn-tos.bytegoofy.com/goofy/ttzz/push.js?xxxxxxx";
  el.id = "ttzz";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(el, s);
})(window)`
                                        : `(function(){
  var bp = document.createElement('script');
  var curProtocol = window.location.protocol.split(':')[0];
  bp.src = curProtocol + '//push.zhanzhang.baidu.com/push.js';
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(bp, s);
})();`}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-5 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="w-4 h-4 text-orange-500" />
                                        <h5 className="text-[11px] font-black text-orange-900 uppercase">部署建议</h5>
                                    </div>
                                    <p className="text-[11px] text-gray-500 font-bold leading-relaxed">{platformConfig?.scriptGuide || '直接复制平台提供的完整JS片段即可。'}</p>
                                </div>
                                <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Globe className="w-4 h-4 text-blue-500" />
                                        <h5 className="text-[11px] font-black text-blue-900 uppercase">系统自动化</h5>
                                    </div>
                                    <p className="text-[11px] text-gray-500 font-bold leading-relaxed">系统将自动剔除 &lt;script&gt; 标签并将纯逻辑异步注入到所有公共页面。</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 非 API/脚本平台的站点 ID（如果需要但上面没展示） */}
                {!supportsApi && !supportsScript && platformConfig?.requiresSiteId && (
                    <div className="pt-10 border-t border-gray-50 space-y-4">
                        <label className={labelClass}>
                            站点标识符符 (Site ID) *
                        </label>
                        <input
                            type="text"
                            name="siteId"
                            defaultValue={initialData?.siteId || ''}
                            placeholder="如: https://www.example.com"
                            className={`${inputClass} font-mono`}
                            required
                        />
                    </div>
                )}

                {/* 启用开关 */}
                <div className="pt-8 border-t border-gray-50">
                    <div
                        className={`flex items-center justify-between p-6 rounded-[24px] border transition-all cursor-pointer ${initialData?.isActive !== false ? 'bg-green-50/50 border-green-100' : 'bg-gray-50 border-gray-100 opacity-60'}`}
                        onClick={(e) => {
                            const checkbox = e.currentTarget.querySelector('input[type="checkbox"]') as HTMLInputElement;
                            checkbox.checked = !checkbox.checked;
                            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                        }}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${initialData?.isActive !== false ? 'bg-green-500 text-white shadow-lg shadow-green-100' : 'bg-white text-gray-300'}`}>
                                <Zap className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className={`text-base font-black ${initialData?.isActive !== false ? 'text-green-900' : 'text-gray-900'}`}>启用引擎推送</h4>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">实时激活数据收录链路</p>
                            </div>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="isActive"
                                defaultChecked={initialData?.isActive ?? true}
                                className="sr-only peer"
                                onChange={(e) => {
                                    const parent = e.target.closest('div.flex.items-center.justify-between');
                                    if (parent) {
                                        if (e.target.checked) {
                                            parent.classList.replace('bg-gray-50', 'bg-green-50/50');
                                            parent.classList.replace('border-gray-100', 'border-green-100');
                                            parent.classList.remove('opacity-60');
                                        } else {
                                            parent.classList.replace('bg-green-50/50', 'bg-gray-50');
                                            parent.classList.replace('border-green-100', 'border-gray-100');
                                            parent.classList.add('opacity-60');
                                        }
                                    }
                                }}
                            />
                            <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500 shadow-inner"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 底部操作栏 */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-10">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    <span className="text-[11px] font-black text-gray-400 tracking-widest uppercase">系统实时处理引擎已就绪</span>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                    {supportsApi && (
                        <button
                            type="button"
                            onClick={(e) => handleTest(e)}
                            disabled={testing || loading}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-2xl border-2 border-blue-600 text-blue-600 bg-white px-8 py-4 font-black text-sm transition-all hover:bg-blue-50 active:scale-95 disabled:opacity-50"
                        >
                            {testing ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    请求发送中...
                                </>
                            ) : (
                                <>
                                    <TestTube className="h-5 w-5" />
                                    测试连通性
                                </>
                            )}
                        </button>
                    )}

                    <button
                        type="submit"
                        disabled={loading || testing}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-10 py-4 font-black text-sm text-white shadow-xl shadow-blue-100 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                正在保存...
                            </>
                        ) : (
                            <>
                                <Save className="h-5 w-5" />
                                更新推送配置
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}
