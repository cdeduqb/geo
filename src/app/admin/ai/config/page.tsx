'use client';


import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
export const dynamic = 'force-dynamic';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { Save, Eye, EyeOff, Trash2, Plus, Check, X } from 'lucide-react';

interface AIConfigItem {
    id?: string;
    provider: string;
    apiKey: string;
    baseUrl?: string;
    modelName?: string;
    isActive: boolean;
    priority: number;
    dailyTokenLimit?: number | null;
    monthlyTokenLimit?: number | null;
    useCase?: 'GENERAL' | 'WRITING' | 'CODE';
}

const USE_CASE_OPTIONS = [
    { value: 'GENERAL', label: '通用' },
    { value: 'WRITING', label: '文章写作' },
    { value: 'CODE', label: '代码生成' },
];

// 预定义的 AI 平台配置
const AI_PROVIDERS = [
    {
        id: 'kimi',
        name: 'Kimi (月之暗面)',
        description: '支持 $web_search 联网搜索',
        baseUrl: 'https://api.moonshot.cn/v1',
        defaultModel: 'moonshot-v1-32k',
        envKey: 'KIMI_API_KEY',
        docUrl: 'https://platform.moonshot.cn/'
    },
    {
        id: 'qwen',
        name: '通义千问 (Qwen)',
        description: '支持 enable_search 联网搜索',
        baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
        defaultModel: 'qwen-max',
        envKey: 'QWEN_API_KEY',
        docUrl: 'https://dashscope.aliyun.com/'
    },
    {
        id: 'doubao',
        name: '豆包 (火山引擎)',
        description: '支持联网问答 Agent',
        baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
        defaultModel: '',
        envKey: 'DOUBAO_API_KEY',
        docUrl: 'https://console.volcengine.com/ark',
        note: '需要配置 Endpoint ID 作为模型名'
    },
    {
        id: 'deepseek',
        name: 'DeepSeek',
        description: 'API 不支持联网搜索，仅用于内容生成',
        baseUrl: 'https://api.deepseek.com/v1',
        defaultModel: 'deepseek-chat',
        envKey: 'DEEPSEEK_API_KEY',
        docUrl: 'https://platform.deepseek.com/'
    },
    {
        id: 'hunyuan',
        name: '腾讯混元',
        description: '腾讯云 AI 服务',
        baseUrl: 'https://hunyuan.tencentcloudapi.com',
        defaultModel: 'hunyuan-pro',
        envKey: 'HUNYUAN_API_KEY',
        docUrl: 'https://cloud.tencent.com/product/hunyuan'
    }
];

export default function AIConfigPage() {
    const { showToast } = useToast();
    const [configs, setConfigs] = useState<AIConfigItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        try {
            const res = await fetch('/api/admin/ai-config');
            if (res.ok) {
                const data = await res.json();
                // 合并已保存的配置和预定义平台
                const savedConfigs: AIConfigItem[] = data.configs || [];
                const mergedConfigs = AI_PROVIDERS.map(provider => {
                    const saved = savedConfigs.find(c => c.provider === provider.id);
                    return saved || {
                        provider: provider.id,
                        apiKey: '',
                        baseUrl: provider.baseUrl,
                        modelName: provider.defaultModel,
                        isActive: false,
                        priority: 0
                    };
                });
                setConfigs(mergedConfigs);
            }
        } catch (error) {
            console.error('Failed to fetch AI configs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // 保存有 API Key 的配置,或者已存在的配置(即使 API Key 被掩碼)
            const configsToSave = configs.filter(c =>
                c.apiKey.trim() || c.id  // 发送有 API Key 的新配置或已存在的配置
            );

            console.log('Saving configs:', configsToSave);

            const res = await fetch('/api/admin/ai-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ configs: configsToSave })
            });

            if (res.ok) {
                showToast('配置已保存', 'success');
                fetchConfigs();
            } else {
                const data = await res.json();
                throw new Error(data.error || '保存失败');
            }
        } catch (error) {
            console.error('Save error:', error);
            showToast(`保存失败: ${error instanceof Error ? error.message : '未知错误'}`, 'error');
        } finally {
            setSaving(false);
        }
    };

    const updateConfig = (provider: string, field: keyof AIConfigItem, value: string | boolean | number) => {
        setConfigs(prev => prev.map(c =>
            c.provider === provider ? { ...c, [field]: value } : c
        ));
    };

    const toggleShowApiKey = (provider: string) => {
        setShowApiKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
    };

    const testConnection = async (provider: string) => {
        const config = configs.find(c => c.provider === provider);
        if (!config?.apiKey) {
            showToast('请先填写 API Key', 'error');
            return;
        }

        showToast('正在测试连接...', 'info');

        try {
            const res = await fetch('/api/admin/ai-config/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ provider, config })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                showToast(`${provider} 连接成功!`, 'success');
            } else {
                showToast(`连接失败: ${data.error || '未知错误'}`, 'error');
            }
        } catch (error) {
            showToast('连接测试失败', 'error');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 页面头部 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-100">
                        <Save className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">AI 平台配置</h1>
                        <p className="text-[13px] text-gray-500 font-medium">
                            配置各 AI 平台的 API Key 以启用智能创作功能
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2.5 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg bg-purple-600 text-white hover:bg-purple-700 shadow-purple-100 hover:shadow-purple-200 disabled:opacity-50 active:scale-95"
                >
                    {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                    保存配置
                </button>
            </div>

            <div className="grid gap-6">
                {AI_PROVIDERS.map(provider => {
                    const config = configs.find(c => c.provider === provider.id);
                    const hasApiKey = !!config?.apiKey?.trim();

                    return (
                        <div key={provider.id} className={`bg-white rounded-[32px] border shadow-sm overflow-hidden ${hasApiKey ? 'border-green-200 shadow-green-50' : 'border-gray-100 shadow-gray-100/50'}`}>
                            <div className="px-8 py-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${hasApiKey ? 'bg-green-600 shadow-green-100' : 'bg-gray-300 shadow-gray-100'}`}>
                                            <span className="text-white text-lg font-black">{provider.name.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-gray-900 tracking-tight">{provider.name}</h3>
                                            <p className="text-xs text-gray-400 font-medium">{provider.description}</p>
                                        </div>
                                        {hasApiKey && (
                                            <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-100 px-3 py-1.5 rounded-full">
                                                <Check className="w-3.5 h-3.5" /> 已配置
                                            </span>
                                        )}
                                    </div>
                                    <label className="flex items-center gap-2.5 text-sm font-bold text-gray-600 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={config?.isActive || false}
                                            onChange={(e) => updateConfig(provider.id, 'isActive', e.target.checked)}
                                            className="w-5 h-5 rounded-lg border-gray-300 text-purple-600 focus:ring-purple-500"
                                        />
                                        启用
                                    </label>
                                </div>
                                {provider.note && (
                                    <p className="text-xs text-amber-600 font-medium bg-amber-50 px-4 py-2 rounded-xl mb-4">⚠️ {provider.note}</p>
                                )}
                            </div>
                            <div className="px-8 pb-8 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            API Key <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Input
                                                type={showApiKeys[provider.id] ? 'text' : 'password'}
                                                value={config?.apiKey || ''}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig(provider.id, 'apiKey', e.target.value)}
                                                placeholder={`输入 ${provider.name} API Key`}
                                                className="pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => toggleShowApiKey(provider.id)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showApiKeys[provider.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            模型名称
                                        </label>
                                        <Input
                                            value={config?.modelName || ''}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig(provider.id, 'modelName', e.target.value)}
                                            placeholder={provider.defaultModel || '输入模型名称'}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        API 端点 (Base URL)
                                    </label>
                                    <Input
                                        value={config?.baseUrl || ''}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig(provider.id, 'baseUrl', e.target.value)}
                                        placeholder={provider.baseUrl}
                                    />
                                </div>

                                {/* Token 限额和用途配置 */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-gray-100">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            每日 Token 限额
                                        </label>
                                        <Input
                                            type="number"
                                            value={config?.dailyTokenLimit ?? ''}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig(provider.id, 'dailyTokenLimit', e.target.value ? parseInt(e.target.value) : 0)}
                                            placeholder="无限制"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            每月 Token 限额
                                        </label>
                                        <Input
                                            type="number"
                                            value={config?.monthlyTokenLimit ?? ''}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfig(provider.id, 'monthlyTokenLimit', e.target.value ? parseInt(e.target.value) : 0)}
                                            placeholder="无限制"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            用途分类
                                        </label>
                                        <select
                                            value={config?.useCase || 'GENERAL'}
                                            onChange={(e) => updateConfig(provider.id, 'useCase', e.target.value as 'GENERAL' | 'WRITING' | 'CODE')}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-primary-500"
                                        >
                                            {USE_CASE_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t">
                                    <a
                                        href={provider.docUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-primary-600 hover:underline"
                                    >
                                        查看平台文档 →
                                    </a>
                                    <button
                                        onClick={() => testConnection(provider.id)}
                                        disabled={!hasApiKey}
                                        className="px-5 py-2.5 rounded-2xl text-sm font-bold border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50 transition-all"
                                    >
                                        测试连接
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-blue-50 rounded-[32px] border border-blue-200 p-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                    <h3 className="font-black text-blue-900 tracking-tight">使用说明</h3>
                </div>
                <ul className="text-sm text-blue-800 space-y-2">
                    <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <strong>Kimi</strong> 和 <strong>通义千问</strong> 的 API 支持联网搜索，可获取 AI 引用的来源文章
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <strong>豆包</strong> 需要在火山方舟创建带联网功能的 Endpoint，并填写 Endpoint ID 作为模型名
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <strong>DeepSeek</strong> API 不支持联网搜索，但可用于内容生成和分析
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        建议至少配置一个支持联网搜索的平台（Kimi 或 通义千问）
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        配置多个平台时，系统会并行请求所有启用的平台并合并结果
                    </li>
                </ul>
            </div>
        </div >
    );
}
