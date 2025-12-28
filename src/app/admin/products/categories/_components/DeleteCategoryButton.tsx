'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface DeleteCategoryButtonProps {
    categoryId: string;
    hasProducts: boolean;
    hasChildren: boolean;
}

export default function DeleteCategoryButton({ categoryId, hasProducts, hasChildren }: DeleteCategoryButtonProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/products/categories/${categoryId}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || '删除失败');
            }

            showToast('分类已删除', 'success');
            setIsDeleteDialogOpen(false);
            router.refresh();
        } catch (error) {
            console.error('Delete error:', error);
            showToast(error instanceof Error ? error.message : '操作失败', 'error');
        } finally {
            setLoading(false);
        }
    };

    const isDisabled = hasProducts || hasChildren || loading;
    const title = hasProducts
        ? '无法删除：该分类下还有产品'
        : hasChildren
            ? '无法删除：该分类下还有子分类'
            : '删除分类';

    return (
        <>
            <button
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isDisabled}
                className={`p-2 rounded-lg transition-colors ${isDisabled
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                    }`}
                title={title}
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onCancel={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="删除分类"
                message="确定要删除这个分类吗？此操作无法撤销。"
                confirmText="删除"
                confirmButtonClass="bg-red-600 hover:bg-red-700 text-white"
                isLoading={loading}
            />
        </>
    );
}
