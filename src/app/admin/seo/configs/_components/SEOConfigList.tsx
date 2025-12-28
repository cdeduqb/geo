'use client';

import { useState } from 'react';
import { Edit, Trash2, CheckCircle, XCircle, Plus, Globe, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SEOConfigForm from './SEOConfigForm';
import { Badge } from "@/components/ui/badge";
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface SEOConfigListProps {
    configs: any[];
}

export default function SEOConfigList({ configs }: SEOConfigListProps) {
    const router = useRouter();
    const [editingConfig, setEditingConfig] = useState<any>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirmDelete = async () => {
        if (!deletingId) return;
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/admin/seo/configs?id=${deletingId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                router.refresh();
            }
        } catch (error) {
            console.error('Delete failed', error);
        } finally {
            setIsDeleting(false);
            setDeletingId(null);
        }
    };

    if (editingConfig) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h3 className="font-semibold text-gray-900">编辑配置</h3>
                    <button
                        onClick={() => setEditingConfig(null)}
                        className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                    >
                        取消
                    </button>
                </div>
                <div className="p-6">
                    <SEOConfigForm
                        initialData={editingConfig}
                        onSuccess={() => setEditingConfig(null)}
                    />
                </div>
            </div>
        );
    }

    if (showCreateForm) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h3 className="font-semibold text-gray-900">新建配置</h3>
                    <button
                        onClick={() => setShowCreateForm(false)}
                        className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                    >
                        取消
                    </button>
                </div>
                <div className="p-6">
                    <SEOConfigForm onSuccess={() => setShowCreateForm(false)} />
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h3 className="font-semibold text-gray-900">配置列表</h3>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                        <Plus className="h-4 w-4 mr-1.5" />
                        新建配置
                    </button>
                </div>

                <div className="p-6">
                    {configs.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            <Globe className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                            <p>暂无 SEO 推送配置，点击右上角按钮创建</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {configs.map((config) => (
                                <div
                                    key={config.id}
                                    className="group relative flex flex-col bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all duration-200"
                                >
                                    <div className="p-5 flex-1">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                                                    <Globe className="w-5 h-5 text-gray-500" />
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-bold text-gray-900">
                                                        {config.platform === 'baidu' && '百度'}
                                                        {config.platform === '360' && '360 搜索'}
                                                        {config.platform === 'sogou' && '搜狗'}
                                                        {config.platform === 'toutiao' && '头条搜索'}
                                                    </h3>
                                                    <div className="mt-1">
                                                        {config.isActive ? (
                                                            <Badge variant="success" className="h-5 px-1.5 text-[10px]">
                                                                <CheckCircle className="w-3 h-3 mr-1" /> 已启用
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                                                                <XCircle className="w-3 h-3 mr-1" /> 已停用
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setEditingConfig(config)}
                                                    className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                                                    title="编辑"
                                                >
                                                    <Edit className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => setDeletingId(config.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                    title="删除"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 space-y-1.5">
                                                <div className="text-xs text-gray-500 flex items-center gap-2">
                                                    <span className="font-medium text-gray-700">API:</span>
                                                    <span className="truncate font-mono" title={config.apiUrl}>{config.apiUrl}</span>
                                                </div>
                                                {config.siteId && (
                                                    <div className="text-xs text-gray-500 flex items-center gap-2">
                                                        <span className="font-medium text-gray-700">Site ID:</span>
                                                        <span className="font-mono">{config.siteId}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-50">
                                                <div className="flex items-center gap-1">
                                                    <Activity className="w-3 h-3" />
                                                    <span>推送记录: {config._count?.pushLogs || 0}</span>
                                                </div>
                                                {config.lastPushAt && (
                                                    <span>{new Date(config.lastPushAt).toLocaleDateString('zh-CN')}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <ConfirmDialog
                isOpen={!!deletingId}
                onCancel={() => setDeletingId(null)}
                onConfirm={handleConfirmDelete}
                title="删除配置"
                message="确定要删除这个SEO配置吗？此操作不可恢复。"
                confirmText="删除"
                confirmButtonClass="bg-red-600 hover:bg-red-700"
            />
        </>
    );
}
