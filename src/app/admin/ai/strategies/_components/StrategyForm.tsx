'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2 } from 'lucide-react';

interface StrategyFormProps {
    initialData?: any;
    onSuccess?: () => void;
}

export default function StrategyForm({ initialData, onSuccess }: StrategyFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [targetType, setTargetType] = useState(initialData?.targetType || 'article');
    const [type, setType] = useState(initialData?.type || 'WRITING');

    const handleTargetTypeChange = (newTargetType: string) => {
        setTargetType(newTargetType);
        // 自动切换类型
        if (newTargetType.startsWith('IMAGE_')) {
            setType('IMAGE');
        } else {
            setType('WRITING');
        }
    };

    const getVariableHint = (type: string) => {
        if (type === 'IMAGE_COVER' || type === 'IMAGE_CONTENT') {
            return "可用变量: {title} (标题), {summary} (摘要), {keywords} (关键词), {selection} (选中文本/仅配图)";
        }
        return "可用变量: {topic} (主题), {keywords} (关键词), {length} (篇幅)";
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            prompt: formData.get('prompt'),
            temperature: Number(formData.get('temperature')),
            maxTokens: formData.get('maxTokens') ? Number(formData.get('maxTokens')) : null,
            targetType: formData.get('targetType'),
            type: formData.get('type'),
        };

        try {
            const url = '/api/admin/ai-strategies';
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
            {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">策略名称</label>
                <input
                    type="text"
                    name="name"
                    defaultValue={initialData?.name || ''}
                    placeholder="例如：SEO 优化文章生成"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">策略类型</label>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="type"
                            value="WRITING"
                            checked={type === 'WRITING'}
                            onChange={(e) => setType(e.target.value)}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">文章生成 / 写作</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="type"
                            value="IMAGE"
                            checked={type === 'IMAGE'}
                            onChange={(e) => setType(e.target.value)}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">图片生成</span>
                    </label>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">目标类型</label>
                <select
                    name="targetType"
                    value={targetType}
                    onChange={(e) => handleTargetTypeChange(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    <option value="article">文章</option>
                    <option value="seo_desc">SEO 描述</option>
                    <option value="summary">摘要</option>
                    <option value="IMAGE_COVER">文章封面图</option>
                    <option value="IMAGE_CONTENT">正文配图</option>
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    Prompt 模板
                    <span className="ml-2 text-xs text-gray-500 font-normal">
                        {getVariableHint(targetType)}
                    </span>
                </label>
                <textarea
                    name="prompt"
                    defaultValue={initialData?.prompt || ''}
                    placeholder={targetType.startsWith('IMAGE') ? "一张{style}风格的图片，关于{title}，..." : `请以"{topic}"为主题写一篇文章...\n关键词：{keywords}`}
                    rows={10}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        Temperature (创造性)
                    </label>
                    <input
                        type="number"
                        name="temperature"
                        step="0.1"
                        min="0"
                        max="2"
                        defaultValue={initialData?.temperature ?? 0.7}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500">0-2，越高越有创造性</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        Max Tokens (最大长度)
                    </label>
                    <input
                        type="number"
                        name="maxTokens"
                        min="100"
                        max="8000"
                        defaultValue={initialData?.maxTokens || ''}
                        placeholder="留空使用默认值"
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500">可选，限制生成长度</p>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    {loading ? '保存中...' : '保存策略'}
                </button>
            </div>
        </form>
    );
}
