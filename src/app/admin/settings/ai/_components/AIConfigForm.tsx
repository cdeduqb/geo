'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2 } from 'lucide-react';
import ValidateButton from './ValidateButton';

interface AIConfigFormProps {
    initialData?: any;
    onSuccess?: () => void;
}

export default function AIConfigForm({ initialData, onSuccess }: AIConfigFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedProvider, setSelectedProvider] = useState(initialData?.provider || 'deepseek');
    const [apiKey, setApiKey] = useState(initialData?.apiKey || '');
    const [baseUrl, setBaseUrl] = useState(initialData?.baseUrl || '');
    const [modelName, setModelName] = useState(initialData?.modelName || '');
    const [secretKey, setSecretKey] = useState(initialData?.secretKey || '');
    const [dailyTokenLimit, setDailyTokenLimit] = useState<string>(initialData?.dailyTokenLimit?.toString() || '');
    const [monthlyTokenLimit, setMonthlyTokenLimit] = useState<string>(initialData?.monthlyTokenLimit?.toString() || '');
    const [useCase, setUseCase] = useState<string>(initialData?.useCase || 'GENERAL');

    // Provider default configurations
    const providerDefaults: Record<string, { baseUrl: string; modelName: string }> = {
        deepseek: {
            baseUrl: 'https://api.deepseek.com',
            modelName: 'deepseek-chat'
        },
        openai: {
            baseUrl: 'https://api.openai.com/v1',
            modelName: 'gpt-4o-mini'
        },
        volcengine: {
            baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
            modelName: 'ep-xxxxx-xxxxx'
        },
        qwen: {
            baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
            modelName: 'qwen-turbo'
        },
        minimax: {
            baseUrl: 'https://api.minimax.chat/v1',
            modelName: 'abab6.5-chat'
        },
        gemini: {
            baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
            modelName: 'gemini-pro'
        },
        kimi: {
            baseUrl: 'https://api.moonshot.cn/v1',
            modelName: 'moonshot-v1-8k'
        },
        zhipu: {
            baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
            modelName: 'glm-4'
        },
        baidu: {
            baseUrl: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat',
            modelName: 'completions_pro'
        },
        custom: {
            baseUrl: '',
            modelName: ''
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const data: any = Object.fromEntries(formData.entries());

        // Convert checkbox to boolean
        data.isActive = (data.isActive === 'on') as any;
        data.priority = Number(data.priority) as any;
        // Add token limit and use case
        data.dailyTokenLimit = dailyTokenLimit ? Number(dailyTokenLimit) : null;
        data.monthlyTokenLimit = monthlyTokenLimit ? Number(monthlyTokenLimit) : null;
        data.useCase = useCase;

        try {
            const url = '/api/admin/ai-configs';
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
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">提供商 (Provider)</label>
                    <select
                        name="provider"
                        value={selectedProvider}
                        onChange={(e) => setSelectedProvider(e.target.value)}
                        className="w-full p-2 border border-gray-100 rounded-lg"
                        required
                    >
                        <option value="deepseek">DeepSeek</option>
                        <option value="openai">OpenAI</option>
                        <option value="volcengine">火山引擎 (Doubao)</option>
                        <option value="qwen">通义千问 (Qwen)</option>
                        <option value="minimax">MiniMax</option>
                        <option value="gemini">Google Gemini</option>
                        <option value="kimi">Kimi (Moonshot)</option>
                        <option value="zhipu">智谱AI (GLM)</option>
                        <option value="baidu">百度文心 (Baidu)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">模型名称 (Model Name)</label>
                    <input
                        type="text"
                        name="modelName"
                        defaultValue={initialData?.modelName || providerDefaults[selectedProvider]?.modelName}
                        key={`model-${selectedProvider}`}
                        placeholder={providerDefaults[selectedProvider]?.modelName || 'e.g. gpt-4o-mini'}
                        className="w-full p-2 border border-gray-100 rounded-lg"
                    />
                </div>

                <div className={selectedProvider === 'baidu' ? '' : 'md:col-span-2'}>
                    <label className="block text-sm font-medium mb-1">API Key</label>
                    <input
                        type="password"
                        name="apiKey"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder={initialData ? '如果不修改请留空' : 'sk-...'}
                        className="w-full p-2 border border-gray-100 rounded-lg"
                        required={!initialData}
                    />
                </div>

                {selectedProvider === 'baidu' && (
                    <div>
                        <label className="block text-sm font-medium mb-1">Secret Key</label>
                        <input
                            type="password"
                            name="secretKey"
                            value={secretKey}
                            onChange={(e) => setSecretKey(e.target.value)}
                            placeholder={initialData?.secretKey ? '如果不修改请留空' : '...'}
                            className="w-full p-2 border border-gray-100 rounded-lg"
                            required={!initialData?.secretKey}
                        />
                    </div>
                )}

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Base URL</label>
                    <input
                        type="url"
                        name="baseUrl"
                        value={baseUrl || providerDefaults[selectedProvider]?.baseUrl}
                        onChange={(e) => setBaseUrl(e.target.value)}
                        key={`baseurl-${selectedProvider}`}
                        placeholder={providerDefaults[selectedProvider]?.baseUrl || 'https://api.example.com'}
                        className="w-full p-2 border border-gray-100 rounded-lg"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">优先级 (Priority)</label>
                    <input
                        type="number"
                        name="priority"
                        defaultValue={initialData?.priority || 0}
                        className="w-full p-2 border border-gray-100 rounded-lg"
                    />
                </div>

                <div className="flex items-center h-full pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="isActive"
                            defaultChecked={initialData?.isActive ?? true}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium">启用此配置</span>
                    </label>
                </div>

                {/* Token 限额和用途配置 */}
                <div className="md:col-span-2 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Token 限额与用途</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">每日 Token 限额</label>
                            <input
                                type="number"
                                value={dailyTokenLimit}
                                onChange={(e) => setDailyTokenLimit(e.target.value)}
                                placeholder="无限制"
                                className="w-full p-2 border border-gray-100 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">每月 Token 限额</label>
                            <input
                                type="number"
                                value={monthlyTokenLimit}
                                onChange={(e) => setMonthlyTokenLimit(e.target.value)}
                                placeholder="无限制"
                                className="w-full p-2 border border-gray-100 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">用途分类</label>
                            <select
                                value={useCase}
                                onChange={(e) => setUseCase(e.target.value)}
                                className="w-full p-2 border border-gray-100 rounded-lg"
                            >
                                <option value="GENERAL">通用</option>
                                <option value="WRITING">文章写作</option>
                                <option value="CODE">代码生成</option>
                                <option value="IMAGE">图片生成</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <ValidateButton
                    provider={selectedProvider}
                    baseUrl={baseUrl || providerDefaults[selectedProvider]?.baseUrl}
                    apiKey={apiKey}
                    secretKey={secretKey}
                    modelName={modelName || providerDefaults[selectedProvider]?.modelName}
                    configId={initialData?.id}
                />
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    保存配置
                </button>
            </div>
        </form>
    );
}
