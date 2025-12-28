'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Power, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface StorageConfig {
    id: string;
    name: string;
    provider: string;
    isActive: boolean;
}

interface StorageConfigActionsProps {
    config: StorageConfig;
}

export default function StorageConfigActions({ config }: StorageConfigActionsProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Convert to useTransition for smoother async handling if preferred, 
    // but sticking to local loading state as per original is fine too.
    // However, explicit loading state is used here.

    const handleActivate = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/admin/storage/configs/${config.id}/activate`, {
                method: 'POST',
            });

            if (!res.ok) throw new Error('激活失败');

            showToast('存储配置已激活', 'success');
            router.refresh();
        } catch (error) {
            showToast('激活失败', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/admin/storage/configs/${config.id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || '删除失败');
            }

            showToast('删除成功', 'success');
            setIsDeleteDialogOpen(false);
            router.refresh();
        } catch (error: any) {
            showToast(error.message || '删除失败', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            {!config.isActive && (
                <button
                    onClick={handleActivate}
                    disabled={loading}
                    className="text-blue-600 hover:text-blue-700 disabled:opacity-50"
                    title="激活"
                >
                    <Power className="w-4 h-4" />
                </button>
            )}
            <button
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={loading || config.isActive}
                className="text-red-600 hover:text-red-700 disabled:opacity-50"
                title={config.isActive ? '无法删除激活的配置' : '删除'}
            >
                <Trash2 className="w-4 h-4" />
            </button>

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onCancel={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="确认删除存储配置？"
                message={`您确定要删除配置"${config.name}"吗？此操作无法撤销。`}
                confirmText="删除"
                confirmButtonClass="bg-red-600 hover:bg-red-700 text-white"
                isLoading={loading}
            />
        </div>
    );
}
