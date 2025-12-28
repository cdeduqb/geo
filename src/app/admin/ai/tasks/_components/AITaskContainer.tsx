'use client';

import { useState } from 'react';
import { Sparkles, Plus, Play, Loader2 } from 'lucide-react';
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Sparkles className="w-8 h-8 text-blue-600" />
                        批量 AI 创作任务
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        批量创建文章，自动生成内容
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={handleRunTasks}
                        disabled={isRunning || stats.pending === 0}
                        className="gap-2"
                    >
                        {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        立即运行
                    </Button>
                    <Button onClick={() => setOpen(true)} className="gap-2">
                        <Plus className="w-4 h-4" />
                        创建新任务
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="text-sm font-medium text-gray-500 mb-1">待处理</div>
                    <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="text-sm font-medium text-gray-500 mb-1">处理中</div>
                    <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="text-sm font-medium text-gray-500 mb-1">已完成</div>
                    <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="text-sm font-medium text-gray-500 mb-1">失败</div>
                    <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
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
