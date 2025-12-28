'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader2 } from 'lucide-react';

interface CreateTaskFormProps {
    strategies: any[];
    onSuccess?: () => void;
}

export default function CreateTaskForm({ strategies, onSuccess }: CreateTaskFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [topics, setTopics] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const strategyId = formData.get('strategyId');

        // Parse topics (one per line)
        const topicLines = topics.trim().split('\n').filter(line => line.trim());
        const parsedTopics = topicLines.map(line => {
            // Format: "Topic | keywords" or just "Topic"
            const parts = line.split('|').map(p => p.trim());
            return {
                topic: parts[0],
                keywords: parts[1] || '',
            };
        });

        if (parsedTopics.length === 0) {
            setError('请至少输入一个主题');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/admin/ai-tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    strategyId,
                    topics: parsedTopics,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || '创建失败');
            }

            const result = await res.json();
            setTopics('');
            router.refresh();
            // alert(`成功创建 ${result.created} 个任务！`);
            if (onSuccess) onSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">选择策略</label>
                    <select
                        name="strategyId"
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                    >
                        <option value="">请选择策略</option>
                        {strategies
                            .filter(s => s.type === 'WRITING' || !s.type)
                            .map(strategy => (
                                <option key={strategy.id} value={strategy.id}>
                                    {strategy.name}
                                </option>
                            ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        主题列表
                        <span className="ml-2 text-xs text-gray-500 font-normal">
                            每行一个，格式：主题 | 关键词（可选）
                        </span>
                    </label>
                    <textarea
                        value={topics}
                        onChange={e => setTopics(e.target.value)}
                        placeholder="AI 在医疗领域的应用 | 人工智能,医疗,诊断&#10;区块链技术如何改变金融行业 | 区块链,金融,去中心化&#10;元宇宙的未来发展趋势"
                        rows={8}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                        required
                    />
                    <p className="text-xs text-gray-500">
                        共 {topics.trim().split('\n').filter(line => line.trim()).length} 个主题
                    </p>
                </div>

                <div className="flex justify-end border-t border-gray-200 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                        {loading ? '创建中...' : '批量创建'}
                    </button>
                </div>
            </form>
        </div>
    );
}
