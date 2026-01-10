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
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm shadow-gray-100/50 overflow-hidden">
            {selectedIds.length > 0 && (
                <div className="bg-blue-50 px-8 py-3 flex items-center justify-between border-b border-blue-100">
                    <span className="text-sm font-bold text-blue-700">
                        已选择 {selectedIds.length} 个任务
                    </span>
                    <button
                        onClick={() => setIsBatchConfirmOpen(true)}
                        disabled={isBatchDeleting}
                        className="text-sm text-red-600 hover:text-red-700 font-bold flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
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
                <div className="py-20 text-center">
                    <ListTodo className="mx-auto h-14 w-14 text-gray-300" />
                    <h3 className="mt-4 text-lg font-black text-gray-900 tracking-tight">暂无任务</h3>
                    <p className="mt-1 text-sm text-gray-400 font-medium">
                        请创建批量任务以开始
                    </p>
                </div>
            ) : (
                <table className="w-full text-left">
                    <thead className="border-b border-gray-100">
                        <tr>
                            <th className="pl-10 py-4 w-[50px]">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500"
                                    checked={tasks.length > 0 && selectedIds.length === tasks.length}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th className="px-8 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest w-[450px]">任务信息</th>
                            <th className="px-8 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">执行策略</th>
                            <th className="px-8 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">状态</th>
                            <th className="px-8 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right pr-10">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {tasks.map((task) => (
                            <tr
                                key={task.id}
                                className={`group transition-colors ${selectedIds.includes(task.id) ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}
                            >
                                <td className="pl-10 py-5">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        checked={selectedIds.includes(task.id)}
                                        onChange={() => toggleSelect(task.id)}
                                    />
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col gap-1.5">
                                        <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                            {task.topic}
                                        </span>
                                        <div className="flex flex-wrap gap-2 items-center">
                                            {task.keywords ? (
                                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                                                    <span>关键词:</span>
                                                    <span className="truncate max-w-[200px]" title={task.keywords}>
                                                        {task.keywords}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-gray-300 italic">无关键词</span>
                                            )}
                                        </div>
                                        {task.error && (
                                            <div className="text-[10px] text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100 mt-1 inline-block w-fit">
                                                错误: {task.error}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col gap-1">
                                        <Badge
                                            variant="outline"
                                            className="font-mono text-[10px] px-1.5 py-0 border-0 bg-blue-50 text-blue-700 w-fit"
                                        >
                                            {task.strategy.name}
                                        </Badge>
                                        <span className="text-[10px] text-gray-400 font-mono">ID: {task.id.substring(0, 8)}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    {getStatusBadge(task.status)}
                                </td>
                                <td className="px-6 py-5 text-right pr-10">
                                    <div className="flex items-center justify-end gap-2">
                                        {task.status === 'COMPLETED' && task.article && (
                                            <Link
                                                href={`/admin/articles/${task.article.id}`}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="查看文章"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </Link>
                                        )}
                                        {task.status === 'PENDING' && (
                                            <button
                                                onClick={() => handleProcess(task.id)}
                                                disabled={processing === task.id}
                                                className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
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
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
