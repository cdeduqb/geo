'use client';

import { useState, useEffect } from 'react';
import { Plus, Loader2, Sparkles, Target, Calendar, CheckCircle2, PlayCircle, PauseCircle, Clock, Trash2, ArrowRight, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function AutomationProjectsListPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/admin/articles/automation');
            const data = await res.json();
            if (Array.isArray(data)) {
                setProjects(data);
            } else {
                console.error('Expected array but got:', data);
                setProjects([]);
                if (data.error) {
                    alert(`加载失败: ${data.error}`);
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
                alert(`流水线执行成功！已处理 ${data.processed} 篇内容。`);
                fetchProjects();
            } else {
                alert('暂无待处理的计划任务（或已全部处理完成）。');
            }
        } catch (error) {
            console.error('Pipeline error', error);
            alert('流水线执行异常，请检查 API 日志。');
        } finally {
            setIsBatchProcessing(false);
        }
    };

    const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('确定要删除此自动化项目及所有关联任务吗？此操作不可撤销。')) return;

        try {
            const res = await fetch(`/api/admin/articles/automation/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setProjects(prev => prev.filter(p => p.id !== id));
            } else {
                alert('删除失败');
            }
        } catch (error) {
            console.error('Failed to delete project', error);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                        <div className="p-2.5 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 text-white">
                            <Target className="w-7 h-7" />
                        </div>
                        AI 创作工厂
                    </h1>
                    <p className="text-gray-500 text-sm">全流程自动化文章生产线，智能调度与多维度增强。</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRunPipeline}
                        disabled={isBatchProcessing || isLoading}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-50 px-6 py-3.5 text-sm font-bold text-blue-700 hover:bg-blue-100 transition-all disabled:opacity-50"
                    >
                        {isBatchProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                        立即运行流水线
                    </button>
                    <Link
                        href="/admin/articles/automation/new"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-900 px-6 py-3.5 text-sm font-bold text-white shadow-xl hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all group"
                    >
                        <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                        新建自动创作项目
                    </Link>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                    <p className="text-gray-400 font-medium">全力加载生产线数据...</p>
                </div>
            ) : projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <Sparkles className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">尚未建立任何生产线</h3>
                    <p className="text-gray-500 max-w-sm text-center mb-8">
                        自动化工厂可以为您持续稳定地输出高质量文章，只需一次配置，多月无忧。
                    </p>
                    <Link
                        href="/admin/articles/automation/new"
                        className="text-blue-600 font-bold hover:underline flex items-center gap-1"
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
                                className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-100 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                            >
                                {/* Card Header */}
                                <div className="p-6 pb-4 flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            {getStatusIcon(project.status)}
                                            {getStatusLabel(project.status)}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
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
                                    <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
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
                                <div className="px-6 py-4 flex flex-wrap gap-1.5">
                                    {project.enableGeo && <span className="bg-purple-50 text-purple-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-purple-100">GEO</span>}
                                    {project.enableIllustrate && <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-blue-100">AI配图</span>}
                                    {project.enableCover && <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-indigo-100">封面</span>}
                                    {project.enableAutoLink && <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-green-100">内链</span>}
                                </div>

                                {/* Footer */}
                                <div className="mt-auto p-4 border-t border-gray-50 flex items-center justify-between bg-gray-50/20 group-hover:bg-blue-600 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                                            {project.strategy?.name.slice(0, 1) || 'A'}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-gray-400 group-hover:text-blue-100">AI 策略</span>
                                            <span className="text-xs font-bold text-gray-600 group-hover:text-white truncate max-w-[120px]">
                                                {project.strategy?.name || '默认策略'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => handleDeleteProject(project.id, e)}
                                            className="p-2.5 bg-red-100 text-red-600 rounded-2xl shadow-sm hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100"
                                            title="删除项目"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                        <Link
                                            href={`/admin/articles/automation/${project.id}`}
                                            className="p-2.5 bg-white text-gray-900 rounded-2xl shadow-sm hover:scale-110 active:scale-95 transition-all"
                                        >
                                            <ArrowRight className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
