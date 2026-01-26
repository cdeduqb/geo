'use client';

import React, { useState, useEffect } from 'react';
import {
    ChevronLeft, Loader2, PlayCircle, PauseCircle, Clock, CheckCircle2,
    XCircle, Calendar, Sparkles, Target, ExternalLink, Trash2, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function AutomationProjectDetailPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
    const router = useRouter();
    const [projectId, setProjectId] = useState<string | null>(null);
    const [project, setProject] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{ open: boolean; taskId: string | null }>({ open: false, taskId: null });
    const [deleteProjectModal, setDeleteProjectModal] = useState(false);
    const { showToast } = useToast();

    // 处理 params 可能是 Promise 的情况
    useEffect(() => {
        const resolveParams = async () => {
            if (params instanceof Promise) {
                const resolved = await params;
                setProjectId(resolved.id);
            } else {
                setProjectId(params.id);
            }
        };
        resolveParams();
    }, [params]);

    const fetchProject = async () => {
        if (!projectId) return;
        try {
            const res = await fetch(`/api/admin/articles/automation/${projectId}`);
            if (!res.ok) throw new Error('项目不存在');
            const data = await res.json();
            setProject(data);
        } catch (error) {
            console.error('Failed to fetch project', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (projectId) {
            fetchProject();
        }
    }, [projectId]);

    const handleStatusToggle = async () => {
        if (!project || !projectId) return;
        setIsActionLoading(true);
        const newStatus = project.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        try {
            const res = await fetch(`/api/admin/articles/automation/${projectId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                setProject({ ...project, status: newStatus });
            }
        } catch (error) {
            console.error('Failed to toggle status', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    // 打开删除项目确认弹窗
    const openDeleteProjectModal = () => {
        setDeleteProjectModal(true);
    };

    // 关闭删除项目确认弹窗  
    const closeDeleteProjectModal = () => {
        setDeleteProjectModal(false);
    };

    // 确认删除项目
    const handleDelete = async () => {
        if (!projectId) return;
        closeDeleteProjectModal();
        setIsActionLoading(true);
        try {
            const res = await fetch(`/api/admin/articles/automation/${projectId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                showToast('项目已删除', 'success');
                router.push('/admin/articles/automation');
            } else {
                showToast('删除失败', 'error');
            }
        } catch (error) {
            console.error('Failed to delete project', error);
            showToast('删除失败，请重试', 'error');
        } finally {
            setIsActionLoading(false);
        }
    };

    // 打开确认弹窗
    const openForceRunConfirm = (taskId: string) => {
        setConfirmModal({ open: true, taskId });
    };

    // 关闭确认弹窗
    const closeForceRunConfirm = () => {
        setConfirmModal({ open: false, taskId: null });
    };

    // 确认执行任务
    const handleForceRunTask = async () => {
        const taskId = confirmModal.taskId;
        if (!taskId) return;

        closeForceRunConfirm();

        try {
            // 1. Update schedule
            await fetch(`/api/admin/articles/automation/tasks/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'run_now' })
            });

            // 2. Trigger pipeline
            setIsActionLoading(true);
            const res = await fetch('/api/admin/articles/automation/process', { method: 'POST' });
            const data = await res.json();

            if (data.processed > 0) {
                showToast('已成功触发并开始处理任务！', 'success');
            } else {
                showToast('任务已加入队列，请稍候刷新查看状态。', 'info');
            }

            fetchProject(); // Refresh UI
        } catch (e) {
            console.error(e);
            showToast('操作失败，请重试', 'error');
        } finally {
            setIsActionLoading(false);
        }
    };

    if (isLoading || !projectId) {
        return (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-400 font-medium">全力加载生产线明细...</p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100">
                <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900">项目未找到</h3>
                <Link href="/admin/articles/automation" className="mt-4 text-blue-600 font-bold hover:underline">
                    返回工厂列表
                </Link>
            </div>
        );
    }

    const completedTasks = project.tasks.filter((t: any) => t.status === 'COMPLETED').length;
    const progress = (completedTasks / project.totalCount) * 100;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <Link href="/admin/articles/automation" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors mb-2">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        返回工厂列表
                    </Link>
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            {project.name}
                        </h1>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ring-1 ${project.status === 'ACTIVE' ? 'text-green-600 bg-green-50 ring-green-100' :
                            project.status === 'PAUSED' ? 'text-amber-600 bg-amber-50 ring-amber-100' :
                                'text-blue-600 bg-blue-50 ring-blue-100'
                            }`}>
                            {project.status === 'ACTIVE' ? '运行中' : project.status === 'PAUSED' ? '已暂停' : '已完成'}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleStatusToggle}
                        disabled={isActionLoading || project.status === 'COMPLETED'}
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all ${project.status === 'ACTIVE'
                            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                            : 'bg-green-50 text-green-700 hover:bg-green-100'
                            } disabled:opacity-50`}
                    >
                        {project.status === 'ACTIVE' ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                        {project.status === 'ACTIVE' ? '暂停项目' : '恢复项目'}
                    </button>
                    <button
                        onClick={openDeleteProjectModal}
                        disabled={isActionLoading}
                        className="p-3.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-2xl transition-all"
                        title="删除项目"
                    >
                        {isActionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <Target className="w-5 h-5 text-blue-500" />
                            生产进度
                        </h3>
                        <span className="text-sm font-bold text-gray-500">
                            {completedTasks} / {project.totalCount} 篇已完成
                        </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2">
                        <div className="space-y-1">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">每日产量</div>
                            <div className="text-xl font-black text-gray-900 font-mono italic">{project.dailyLimit} 篇/日</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">所属分类</div>
                            <div className="text-gray-900 font-bold truncate">{project.category?.name || '默认分类'}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">核心主题</div>
                            <div className="text-gray-900 font-bold truncate max-w-[150px]">{project.topic}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">创建时间</div>
                            <div className="text-gray-900 font-bold">{new Date(project.createdAt).toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 text-white shadow-xl shadow-gray-200 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-gray-300 text-sm font-bold">
                            <Sparkles className="w-4 h-4 text-blue-400" />
                            强化功能开关
                        </div>
                        <div className="space-y-2">
                            {[
                                { on: project.enableGeo, label: 'GEO 优化' },
                                { on: project.enableIllustrate, label: 'AI 配图' },
                                { on: project.enableAutoLink, label: '自动内链' },
                                { on: project.enableCover, label: '封面生成' },
                                { on: project.enableSEO, label: 'SEO 设置' },
                                { on: project.optimizeTitle, label: '优化标题' },
                            ].map((feat, i) => (
                                <div key={i} className="flex items-center justify-between text-xs">
                                    <span className="text-gray-400 font-medium">{feat.label}</span>
                                    <span className={`font-bold ${feat.on ? 'text-blue-400' : 'text-gray-600'}`}>
                                        {feat.on ? 'ON' : 'OFF'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Task List */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">任务列表排产</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/50 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                            <tr>
                                <th className="px-6 py-4">发布主题</th>
                                <th className="px-6 py-4">计划执行时间</th>
                                <th className="px-6 py-4">状态</th>
                                <th className="px-6 py-4 text-right">生成结果</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {project.tasks.map((task: any) => (
                                <tr key={task.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-800">
                                        {task.topic}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 tabular-nums">
                                        {new Date(task.scheduledAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {task.status === 'PENDING' && <Clock className="w-4 h-4 text-gray-400" />}
                                            {task.status === 'PROCESSING' && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
                                            {task.status === 'COMPLETED' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                            {task.status === 'FAILED' && <XCircle className="w-4 h-4 text-red-500" />}
                                            <span className={`font-bold ${task.status === 'PENDING' ? 'text-gray-400' :
                                                task.status === 'PROCESSING' ? 'text-blue-600' :
                                                    task.status === 'COMPLETED' ? 'text-green-600' :
                                                        'text-red-600'
                                                }`}>
                                                {task.status === 'PENDING' ? '等待中' :
                                                    task.status === 'PROCESSING' ? '处理中' :
                                                        task.status === 'COMPLETED' ? '已完成' :
                                                            '失败'}
                                            </span>

                                            {(task.status === 'PENDING' || task.status === 'FAILED') && (
                                                <button
                                                    onClick={() => openForceRunConfirm(task.id)}
                                                    disabled={isActionLoading}
                                                    title="立即强制执行"
                                                    className="ml-2 p-1 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                >
                                                    <PlayCircle className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {task.article ? (
                                            <Link
                                                href={`/admin/articles`}
                                                className="inline-flex items-center gap-1.5 text-blue-600 font-bold hover:underline"
                                            >
                                                查看文章
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </Link>
                                        ) : (
                                            <span className="text-gray-300 font-medium">尚未生成</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmDialog
                isOpen={confirmModal.open}
                onCancel={closeForceRunConfirm}
                onConfirm={handleForceRunTask}
                title="确认立即执行"
                message="确认立即执行此任务吗？这会将任务排期调整为现在，并尝试触发流水线。"
                confirmText="确认执行"
                confirmButtonClass="bg-blue-600 hover:bg-blue-700 text-white"
                isLoading={isActionLoading}
            />

            <ConfirmDialog
                isOpen={deleteProjectModal}
                onCancel={closeDeleteProjectModal}
                onConfirm={handleDelete}
                title="确认删除项目"
                message={`确定要删除项目 "${project?.name}" 吗？\n\n删除后，该项目及其所有关联任务将被永久移除，无法恢复。`}
                confirmText="确认删除"
                confirmButtonClass="bg-red-600 hover:bg-red-700 text-white"
                isLoading={isActionLoading}
            />
        </div>
    );
}
