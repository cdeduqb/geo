'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface DeleteProductButtonProps {
    id: string;
    name: string;
}

export default function DeleteProductButton({ id, name }: DeleteProductButtonProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/admin/products/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('删除失败');

            showToast('产品删除成功', 'success');
            setShowConfirm(false);
            router.refresh();
        } catch (error) {
            console.error('Delete product error:', error);
            showToast('删除失败', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowConfirm(true);
                }}
                className="text-gray-400 hover:text-red-600 transition-colors"
                title="删除产品"
            >
                <Trash2 className="w-4 h-4" />
            </button>

            <ConfirmDialog
                isOpen={showConfirm}
                onCancel={() => setShowConfirm(false)}
                onConfirm={handleDelete}
                title="确认删除产品？"
                message={`您确定要删除产品 "${name}" 吗？此操作不可撤销。`}
                confirmText="删除"
                confirmButtonClass="bg-red-600 hover:bg-red-700 text-white"
                isLoading={isDeleting}
            />
        </>
    );
}
