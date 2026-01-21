'use client';

import { useState } from 'react';
import { Sparkles, Plus, Play, Loader2, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Pagination } from '@/components/ui/Pagination';
import { useToast } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';
import TaskList from './TaskList';
import CreateTaskForm from './CreateTaskForm';

interface AITaskContainerProps {
    tasks: any[];
    strategies: any[];
    stats: {
        pending: number;
        processing: number;
        completed: number;
        failed: number;
    };
    pagination: {
        page: number;
        totalPages: number;
        totalCount: number;
    };
}

export default function AITaskContainer({ tasks, strategies, stats, pagination }: AITaskContainerProps) {
    const [open, setOpen] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const { showToast } = useToast();
    const router = useRouter();

    const handleSuccess = () => {
        setOpen(false);
        router.refresh();
    };

    const handleRunTasks = async () => {
        if (stats.pending === 0) {
            showToast('当前没有待处理的任务', 'info');
            return;
        }

        setIsRunning(true);
        try {
            const res = await fetch('/api/admin/cron/trigger', {
                method: 'POST',
            });

            if (!res.ok) throw new Error('触发失败');

            const data = await res.json();
            showToast(data.message || '任务已开始在后台处理', 'success');

            // Wait for a moment to let the processing start, then refresh
            setTimeout(() => {
                router.refresh();
                setIsRunning(false);
            }, 2000);
        } catch (error) {
            console.error('Run tasks error:', error);
            showToast('启动任务失败，请重试', 'error');
            setIsRunning(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* 页面头部 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">批量 AI 创作任务</h1>
                        <p className="text-[13px] text-gray-500 font-medium">
                            批量创建文章，自动生成优质内容
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRunTasks}
                        disabled={isRunning || stats.pending === 0}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50"
                    >
                        {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        立即运行
                    </button>
                </div>

            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {/* Pending */}
                <div className="bg-white rounded-[20px] border-2 border-gray-300 p-4 flex items-center gap-4 transition-all duration-300 shadow-sm shadow-gray-100/50 cursor-default group">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 group-hover:scale-110 transition-transform duration-300 shrink-0">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-gray-400 mb-0.5 truncate">待处理任务</div>
                        <div className="text-2xl font-black text-gray-900 leading-none tracking-tight">{stats.pending}</div>
                    </div>
                    <div className="shrink-0">
                        <span className="px-2 py-1 rounded-lg bg-gray-50 text-gray-500 text-[10px] font-bold block text-center">待机中</span>
                    </div>
                </div>

                {/* Processing */}
                <div className="bg-white rounded-[20px] border-2 border-blue-300 p-4 flex items-center gap-4 transition-all duration-300 shadow-sm shadow-blue-50 cursor-default group">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300 shrink-0">
                        <Loader2 className={`w-5 h-5 ${stats.processing > 0 || isRunning ? 'animate-spin' : ''}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-gray-400 mb-0.5 truncate">执行中任务</div>
                        <div className="text-2xl font-black text-gray-900 leading-none tracking-tight">{stats.processing}</div>
                    </div>
                    <div className="shrink-0">
                        <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-bold block text-center">运行中</span>
                    </div>
                </div>

                {/* Completed */}
                <div className="bg-white rounded-[20px] border-2 border-emerald-300 p-4 flex items-center gap-4 transition-all duration-300 shadow-sm shadow-emerald-50 cursor-default group">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform duration-300 shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-gray-400 mb-0.5 truncate">已完成任务</div>
                        <div className="text-2xl font-black text-gray-900 leading-none tracking-tight">{stats.completed}</div>
                    </div>
                    <div className="shrink-0">
                        <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold block text-center">已完成</span>
                    </div>
                </div>

                {/* Failed */}
                <div className="bg-white rounded-[20px] border-2 border-red-300 p-4 flex items-center gap-4 transition-all duration-300 shadow-sm shadow-red-50 cursor-default group">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform duration-300 shrink-0">
                        <XCircle className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-gray-400 mb-0.5 truncate">失败任务</div>
                        <div className="text-2xl font-black text-gray-900 leading-none tracking-tight">{stats.failed}</div>
                    </div>
                    <div className="shrink-0">
                        <span className="px-2 py-1 rounded-lg bg-red-50 text-red-500 text-[10px] font-bold block text-center">已失败</span>
                    </div>
                </div>
            </div>

            {/* Task List */}
            <TaskList tasks={tasks} />

            {/* Pagination */}
            <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                baseUrl="/admin/ai/tasks"
            />

            {/* Create Task Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>创建新任务</DialogTitle>
                    </DialogHeader>
                    <CreateTaskForm strategies={strategies} onSuccess={handleSuccess} />
                </DialogContent>
            </Dialog>
        </div>
    );
}
