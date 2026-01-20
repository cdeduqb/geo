'use client';

import { useState, useEffect } from 'react';
import { Plus, Loader2, Sparkles, Target, Calendar, CheckCircle2, PlayCircle, PauseCircle, Clock, Trash2, ArrowRight, RefreshCw, X } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/toast';

export default function AutomationProjectsListPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; projectId: string | null; projectName: string }>({ open: false, projectId: null, projectName: '' });
    const { showToast } = useToast();

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/admin/articles/automation');
            const data = await res.json();
            if (Array.isArray(data)) {
                setProjects(data);
            } else {
                // 401 未授权时静默处理，其他错误才输出日志
                if (!data.error || !data.error.includes('nauthorized')) {
                    console.error('Expected array but got:', data);
                }
                setProjects([]);
                if (data.error && !data.error.includes('nauthorized')) {
                    showToast(`加载失败: ${data.error}`, 'error');
                }
            }
        } catch (error) {
            console.error('Failed to fetch projects', error);
            setProjects([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'ACTIVE': return <PlayCircle className="w-5 h-5 text-green-500" />;
            case 'PAUSED': return <PauseCircle className="w-5 h-5 text-amber-500" />;
            case 'COMPLETED': return <CheckCircle2 className="w-5 h-5 text-blue-500" />;
            default: return <Clock className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'ACTIVE': return <span className="text-green-600 bg-green-50 px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-green-100 italic">运行中</span>;
            case 'PAUSED': return <span className="text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-amber-100 italic">已暂停</span>;
            case 'COMPLETED': return <span className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-blue-100 italic">已完成</span>;
            default: return <span className="text-gray-600 bg-gray-50 px-2.5 py-1 rounded-full text-xs font-bold">未知</span>;
        }
    };

    const [isBatchProcessing, setIsBatchProcessing] = useState(false);

    const handleRunPipeline = async () => {
        setIsBatchProcessing(true);
        try {
            const res = await fetch('/api/admin/articles/automation/process', { method: 'POST' });
            const data = await res.json();
            if (data.processed > 0) {
                showToast(`流水线执行成功！已处理 ${data.processed} 篇内容。`, 'success');
                fetchProjects();
            } else {
                showToast('暂无待处理的计划任务（或已全部处理完成）。', 'info');
            }
        } catch (error) {
            console.error('Pipeline error', error);
            showToast('流水线执行异常，请检查 API 日志。', 'error');
        } finally {
            setIsBatchProcessing(false);
        }
    };

    // 打开删除确认弹窗
    const openDeleteConfirm = (id: string, name: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDeleteModal({ open: true, projectId: id, projectName: name });
    };

    // 关闭删除确认弹窗
    const closeDeleteConfirm = () => {
        setDeleteModal({ open: false, projectId: null, projectName: '' });
    };

    // 确认删除项目
    const handleDeleteProject = async () => {
        const id = deleteModal.projectId;
        if (!id) return;

        closeDeleteConfirm();

        try {
            const res = await fetch(`/api/admin/articles/automation/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setProjects(prev => prev.filter(p => p.id !== id));
                showToast('项目已删除', 'success');
            } else {
                showToast('删除失败', 'error');
            }
        } catch (error) {
            console.error('Failed to delete project', error);
            showToast('删除失败，请重试', 'error');
        }
    };

    return (
        <div className="space-y-6">
            {/* 页面头部 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                        <Target className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">AI 创作工厂</h1>
                        <p className="text-[13px] text-gray-500 font-medium">
                            全流程自动化文章生产线，智能调度与多维度增强
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRunPipeline}
                        disabled={isBatchProcessing || isLoading}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50"
                    >
                        {isBatchProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                        运行流水线
                    </button>
                    <Link
                        href="/admin/articles/automation/new"
                        className="flex items-center gap-2.5 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100 hover:shadow-blue-200 active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        新建项目
                    </Link>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[32px] border border-gray-100 shadow-sm shadow-gray-100/50">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                    <p className="text-gray-400 font-bold">正在加载生产线数据...</p>
                </div>
            ) : projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[32px] border border-gray-100 shadow-sm shadow-gray-100/50">
                    <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                        <Sparkles className="w-10 h-10 text-blue-300" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">尚未建立任何生产线</h3>
                    <p className="text-gray-400 max-w-sm text-center mb-8 font-medium">
                        自动化工厂可以为您持续稳定地输出高质量文章，只需一次配置，多月无忧。
                    </p>
                    <Link
                        href="/admin/articles/automation/new"
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
                    >
                        立刻创建第一个项目 <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => {
                        const completedTasks = project.tasks?.filter((t: any) => t.status === 'COMPLETED').length || 0;
                        const progress = (completedTasks / project.totalCount) * 100;

                        return (
                            <div
                                key={project.id}
                                className="group bg-white rounded-[32px] border border-gray-100 shadow-sm shadow-gray-100/50 hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">

                                {/* Card Header */}
                                <div className="p-6 pb-4 flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            {getStatusIcon(project.status)}
                                            {getStatusLabel(project.status)}
                                            {project.mode === 'titles' ? (
                                                <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md text-[10px] font-black border border-indigo-100 uppercase tracking-tighter">
                                                    标题列表
                                                </span>
                                            ) : (
                                                <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md text-[10px] font-black border border-blue-100 uppercase tracking-tighter">
                                                    主题批量
                                                </span>
                                            )}
                                            {/* @ts-ignore */}
                                            {project.preferredLength && (
                                                <span className="text-gray-600 bg-gray-50 px-2 py-0.5 rounded-md text-[10px] font-black border border-gray-100 uppercase tracking-tighter">
                                                    {project.preferredLength === 'short' ? '简约' : project.preferredLength === 'long' ? '深度' : '高级'}
                                                </span>
                                            )}


                                        </div>
                                        <h3 className="text-lg font-black text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors tracking-tight">
                                            {project.name}
                                        </h3>
                                        <p className="text-xs text-gray-400 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            创建于 {new Date(project.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                </div>

                                {/* Progress Bar Mini */}
                                <div className="px-6 space-y-1.5">
                                    <div className="flex justify-between text-[10px] font-bold text-gray-400">
                                        <span>生产进度 {completedTasks}/{project.totalCount}</span>
                                        <span>{Math.round(progress)}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-600 transition-all duration-1000"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="px-6 py-4 grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">每日产出</div>
                                        <div className="text-xl font-black text-gray-800 font-mono italic">
                                            {project.dailyLimit} <span className="text-[10px] font-bold text-gray-400 not-italic">篇/日</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">所属分类</div>
                                        <div className="text-sm font-bold text-gray-600 truncate">
                                            {project.category?.name || '默认分类'}
                                        </div>
                                    </div>
                                </div>

                                {/* Features Tags */}
                                <div className="px-6 py-4 flex flex-wrap gap-2">
                                    {project.enableGeo && <span className="bg-purple-50 text-purple-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-purple-100">GEO</span>}
                                    {project.enableIllustrate && <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-blue-100">AI配图</span>}
                                    {project.enableCover && <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-indigo-100">封面</span>}
                                    {project.enableAutoLink && <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-green-100">内链</span>}
                                </div>

                                {/* Footer */}
                                <div className="mt-auto px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-xs font-black text-blue-600">
                                            {project.strategy?.name.slice(0, 1) || 'A'}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">AI 策略</span>
                                            <span className="text-xs font-bold text-gray-700 truncate max-w-[120px]">
                                                {project.strategy?.name || '默认策略'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => openDeleteConfirm(project.id, project.name, e)}
                                            className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 active:scale-95 transition-all opacity-0 group-hover:opacity-100"
                                            title="删除项目"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <Link
                                            href={`/admin/articles/automation/${project.id}`}
                                            className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all"
                                        >
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* 删除确认弹窗 */}
            {deleteModal.open && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-[32px] shadow-xl max-w-md w-full p-8 animate-in zoom-in-95 duration-200">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                                    <Trash2 className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-gray-900 tracking-tight">确认删除项目</h3>
                                    <p className="text-sm text-gray-400 font-medium">此操作不可撤销</p>
                                </div>
                            </div>
                            <button
                                onClick={closeDeleteConfirm}
                                className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">
                            确定要删除项目 <span className="font-bold text-gray-900">"{deleteModal.projectName}"</span> 吗？
                        </p>
                        <p className="text-sm text-red-600 font-medium bg-red-50 px-4 py-2.5 rounded-xl mb-6">
                            删除后，该项目及其所有关联任务将被永久移除，无法恢复。
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={closeDeleteConfirm}
                                className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-2xl transition-colors"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleDeleteProject}
                                className="px-6 py-2.5 bg-red-600 text-white text-sm font-bold rounded-2xl hover:bg-red-700 shadow-lg shadow-red-100 transition-all active:scale-95 flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                确认删除
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
