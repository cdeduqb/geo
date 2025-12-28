'use client';

import { useState } from 'react';
import { Play, Trash2, ExternalLink, CheckCircle, XCircle, Clock, Loader2, ListTodo } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";

import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface TaskListProps {
    tasks: any[];
}

export default function TaskList({ tasks }: TaskListProps) {
    const router = useRouter();
    const [processing, setProcessing] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isBatchDeleting, setIsBatchDeleting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isBatchConfirmOpen, setIsBatchConfirmOpen] = useState(false);

    const handleProcess = async (id: string) => {
        setProcessing(id);
        try {
            const res = await fetch('/api/admin/ai-tasks/process', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taskId: id }),
            });

            if (res.ok) {
                router.refresh();
            } else {
                console.error('Failed to start processing');
            }
        } catch (error) {
            console.error('Error starting process:', error);
        } finally {
            setProcessing(null);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deletingId) return;
        setIsDeleting(true);

        try {
            const res = await fetch(`/api/admin/ai-tasks?id=${deletingId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                router.refresh();
                setSelectedIds(prev => prev.filter(id => id !== deletingId));
            }
        } catch (error) {
            console.error('Delete failed', error);
        } finally {
            setIsDeleting(false);
            setDeletingId(null);
        }
    };

    const handleBatchDelete = async () => {
        setIsBatchDeleting(true);
        try {
            const res = await fetch(`/api/admin/ai-tasks?ids=${selectedIds.join(',')}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setSelectedIds([]);
                setIsBatchConfirmOpen(false);
                router.refresh();
            } else {
                alert('批量删除失败');
            }
        } catch (error) {
            console.error('Batch delete failed', error);
            alert('批量删除出错');
        } finally {
            setIsBatchDeleting(false);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === tasks.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(tasks.map(t => t.id));
        }
    };

    const toggleSelect = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(prev => prev.filter(i => i !== id));
        } else {
            setSelectedIds(prev => [...prev, id]);
        }
    };

    const getStatusBadge = (status: string) => {
        // ... existing getStatusBadge code ...
        switch (status) {
            case 'PENDING':
                return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" /> 待处理</Badge>;
            case 'PROCESSING':
                return <Badge variant="default" className="gap-1 bg-blue-600"><Loader2 className="w-3 h-3 animate-spin" /> 处理中</Badge>;
            case 'COMPLETED':
                return <Badge variant="success" className="gap-1"><CheckCircle className="w-3 h-3" /> 已完成</Badge>;
            case 'FAILED':
                return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" /> 失败</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {selectedIds.length > 0 && (
                <div className="bg-blue-50 px-6 py-2 flex items-center justify-between border-b border-blue-100">
                    <span className="text-sm text-blue-700">
                        已选择 {selectedIds.length} 个任务
                    </span>
                    <button
                        onClick={() => setIsBatchConfirmOpen(true)}
                        disabled={isBatchDeleting}
                        className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1 disabled:opacity-50"
                    >
                        {isBatchDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        批量删除
                    </button>

                    <ConfirmDialog
                        isOpen={isBatchConfirmOpen}
                        onCancel={() => setIsBatchConfirmOpen(false)}
                        onConfirm={handleBatchDelete}
                        title="批量删除任务"
                        message={`确定要删除选中的 ${selectedIds.length} 个任务吗？此操作无法撤销。`}
                        confirmText="批量删除"
                        confirmButtonClass="bg-red-600 hover:bg-red-700 text-white"
                        isLoading={isBatchDeleting}
                    />
                </div>
            )}

            {tasks.length === 0 ? (
                <div className="py-12 text-center">
                    <ListTodo className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">暂无任务</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        请创建批量任务以开始
                    </p>
                </div>
            ) : (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 w-4">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    checked={tasks.length > 0 && selectedIds.length === tasks.length}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                主题
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                策略
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                状态
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                关键词
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                操作
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tasks.map((task) => (
                            <tr key={task.id} className={selectedIds.includes(task.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                                <td className="px-6 py-6">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        checked={selectedIds.includes(task.id)}
                                        onChange={() => toggleSelect(task.id)}
                                    />
                                </td>
                                <td className="px-6 py-6">
                                    <div className="font-medium text-gray-900">{task.topic}</div>
                                    {task.error && (
                                        <div className="text-xs text-red-500 mt-1">
                                            错误: {task.error}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-6">
                                    <Badge variant="secondary" className="font-normal text-gray-400 bg-gray-50 hover:bg-gray-100 border border-gray-100">
                                        {task.strategy.name}
                                    </Badge>
                                </td>
                                <td className="px-6 py-6">
                                    {getStatusBadge(task.status)}
                                </td>
                                <td className="px-6 py-6 text-sm text-gray-500">
                                    <div className="truncate max-w-[200px]" title={task.keywords || ''}>
                                        {task.keywords || '-'}
                                    </div>
                                </td>
                                <td className="px-6 py-6 text-right text-sm font-medium">
                                    <div className="flex items-center justify-end gap-2">
                                        {task.status === 'COMPLETED' && task.article && (
                                            <Link
                                                href={`/admin/articles/${task.article.id}`}
                                                className="text-blue-600 hover:text-blue-900 p-1"
                                                title="查看文章"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </Link>
                                        )}
                                        {task.status === 'PENDING' && (
                                            <button
                                                onClick={() => handleProcess(task.id)}
                                                disabled={processing === task.id}
                                                className="text-green-600 hover:text-green-900 disabled:opacity-50 p-1"
                                                title="开始处理"
                                            >
                                                {processing === task.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Play className="h-4 w-4" />
                                                )}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setDeletingId(task.id)}
                                            className="text-red-600 hover:text-red-900 p-1"
                                            title="删除"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <ConfirmDialog
                isOpen={!!deletingId}
                onCancel={() => setDeletingId(null)}
                onConfirm={handleConfirmDelete}
                title="确认删除任务？"
                message="您确定要删除这个任务吗？此操作无法撤销。"
                confirmButtonClass="bg-red-600 hover:bg-red-700 text-white"
                isLoading={isDeleting}
            />
        </div>
    );
}
