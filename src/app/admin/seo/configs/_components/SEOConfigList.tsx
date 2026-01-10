'use client';

import { useState } from 'react';
import { Edit, Trash2, CheckCircle, XCircle, Plus, Globe, Activity, TestTube, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
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
    const [verifyingId, setVerifyingId] = useState<string | null>(null);
    const { showToast } = useToast();

    const handleVerify = async (config: any) => {
        setVerifyingId(config.id);
        try {
            const res = await fetch('/api/admin/seo/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    platform: config.platform,
                    apiUrl: config.apiUrl,
                    token: config.token,
                    siteId: config.siteId,
                }),
            });

            const result = await res.json();
            if (result.success) {
                showToast(`${config.platform} 验证成功: ${result.message}`, 'success');
            } else {
                showToast(`${config.platform} 验证失败: ${result.message}`, 'error');
            }
        } catch (error: any) {
            showToast('验证请求失败: ' + error.message, 'error');
        } finally {
            setVerifyingId(null);
        }
    };

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
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm shadow-gray-100/50 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
                        <h3 className="text-lg font-black text-gray-900 tracking-tight">编辑配置</h3>
                    </div>
                    <button
                        onClick={() => setEditingConfig(null)}
                        className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-bold hover:bg-gray-100 rounded-xl transition-all"
                    >
                        取消
                    </button>
                </div>
                <div className="p-8">
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
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm shadow-gray-100/50 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-green-500 rounded-full" />
                        <h3 className="text-lg font-black text-gray-900 tracking-tight">新建配置</h3>
                    </div>
                    <button
                        onClick={() => setShowCreateForm(false)}
                        className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-bold hover:bg-gray-100 rounded-xl transition-all"
                    >
                        取消
                    </button>
                </div>
                <div className="p-8">
                    <SEOConfigForm onSuccess={() => setShowCreateForm(false)} />
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm shadow-gray-100/50 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                        <h3 className="text-lg font-black text-gray-900 tracking-tight">配置列表</h3>
                    </div>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg shadow-blue-100 hover:shadow-blue-200 active:scale-95 flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        新建配置
                    </button>
                </div>

                <div className="p-8">
                    {configs.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                                <Globe className="w-10 h-10 text-gray-300" />
                            </div>
                            <h4 className="text-gray-900 font-bold mb-2">暂无推送配置</h4>
                            <p className="text-gray-400 text-sm">点击右上角按钮创建新的 SEO 推送配置</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2">
                            {configs.map((config) => (
                                <div
                                    key={config.id}
                                    className="group relative flex flex-col bg-white rounded-[24px] border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300 overflow-hidden"
                                >
                                    <div className="p-6 flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-5 gap-3">
                                            <div className="flex items-center gap-4 min-w-0 flex-1">
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center border border-blue-100 flex-shrink-0 group-hover:from-blue-100 group-hover:to-indigo-200 transition-all">
                                                    <Globe className="w-7 h-7 text-blue-600" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="text-base font-bold text-gray-900">
                                                        {config.platform === 'baidu' && '百度'}
                                                        {config.platform === 'toutiao' && '头条搜索'}
                                                        {config.platform === 'indexnow' && 'IndexNow (Bing/Yandex)'}
                                                        {config.platform === 'google' && 'Google Indexing'}
                                                        {!['baidu', 'toutiao', 'indexnow', 'google'].includes(config.platform) && config.platform}
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
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                                <button
                                                    onClick={() => handleVerify(config)}
                                                    disabled={verifyingId === config.id}
                                                    className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors disabled:opacity-50"
                                                    title="快速验证"
                                                >
                                                    {verifyingId === config.id ? (
                                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                    ) : (
                                                        <TestTube className="h-3.5 w-3.5" />
                                                    )}
                                                </button>
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
                                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 space-y-1.5 overflow-hidden">
                                                <div className="text-xs text-gray-500 flex items-center gap-2 min-w-0">
                                                    <span className="font-medium text-gray-700 flex-shrink-0">API:</span>
                                                    <span className="truncate font-mono text-[11px] block max-w-full" title={config.apiUrl}>{config.apiUrl}</span>
                                                </div>
                                                {config.siteId && (
                                                    <div className="text-xs text-gray-500 flex items-center gap-2 min-w-0">
                                                        <span className="font-medium text-gray-700 flex-shrink-0">Site ID:</span>
                                                        <span className="font-mono text-[11px] truncate block max-w-full" title={config.siteId}>{config.siteId}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-50">
                                                <div className="flex items-center gap-1">
                                                    <Activity className="w-3 h-3 flex-shrink-0" />
                                                    <span>推送: {config._count?.pushLogs || 0}</span>
                                                </div>
                                                {config.lastPushAt && (
                                                    <span className="truncate">{new Date(config.lastPushAt).toLocaleDateString('zh-CN')}</span>
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
