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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">AI 平台配置</h1>
                    <p className="text-gray-500 mt-1">配置各 AI 平台的 API Key 以启用联网搜索和内容生成功能</p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? '保存中...' : '保存配置'}
                </Button>
            </div>

            <div className="grid gap-4">
                {AI_PROVIDERS.map(provider => {
                    const config = configs.find(c => c.provider === provider.id);
                    const hasApiKey = !!config?.apiKey?.trim();

                    return (
                        <Card key={provider.id} className={hasApiKey ? 'border-green-200 bg-green-50/50' : ''}>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <CardTitle className="text-lg">{provider.name}</CardTitle>
                                        {hasApiKey && (
                                            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                                                <Check className="w-3 h-3" /> 已配置
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={config?.isActive || false}
                                                onChange={(e) => updateConfig(provider.id, 'isActive', e.target.checked)}
                                                className="rounded border-gray-300"
                                            />
                                            启用
                                        </label>
                                    </div>
                                </div>
                                <CardDescription>{provider.description}</CardDescription>
                                {provider.note && (
                                    <p className="text-xs text-amber-600 mt-1">⚠️ {provider.note}</p>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-4">
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => testConnection(provider.id)}
                                        disabled={!hasApiKey}
                                    >
                                        测试连接
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                    <h3 className="font-medium text-blue-900 mb-2">💡 使用说明</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• <strong>Kimi</strong> 和 <strong>通义千问</strong> 的 API 支持联网搜索，可获取 AI 引用的来源文章</li>
                        <li>• <strong>豆包</strong> 需要在火山方舟创建带联网功能的 Endpoint，并填写 Endpoint ID 作为模型名</li>
                        <li>• <strong>DeepSeek</strong> API 不支持联网搜索，但可用于内容生成和分析</li>
                        <li>• 建议至少配置一个支持联网搜索的平台（Kimi 或 通义千问）</li>
                        <li>• 配置多个平台时，系统会并行请求所有启用的平台并合并结果</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
