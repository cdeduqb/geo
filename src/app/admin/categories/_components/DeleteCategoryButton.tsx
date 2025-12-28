'use client';

import { Trash2 } from 'lucide-react';
import { deleteCategory } from '../actions';
import { useState, useTransition } from 'react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface DeleteCategoryButtonProps {
    categoryId: string;
    hasArticles: boolean;
}

export default function DeleteCategoryButton({ categoryId, hasArticles }: DeleteCategoryButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = () => {
        const formData = new FormData();
        formData.append('id', categoryId);

        startTransition(async () => {
            await deleteCategory(formData);
            setShowConfirm(false);
        });
    };

    return (
        <>
            <button
                type="button"
                onClick={() => {
                    if (hasArticles) {
                        alert('请先删除该分类下的文章');
                        return;
                    }
                    setShowConfirm(true);
                }}
                disabled={hasArticles}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={hasArticles ? "请先删除该分类下的文章" : "删除"}
            >
                <Trash2 className="w-4 h-4" />
            </button>

            <ConfirmDialog
                isOpen={showConfirm}
                onCancel={() => setShowConfirm(false)}
                onConfirm={handleDelete}
                title="删除分类"
                message="确定要删除这个分类吗？如果分类下有商品，删除将会失败。"
                confirmText="删除"
                confirmButtonClass="bg-red-600 hover:bg-red-700 text-white"
                isLoading={isPending}
            />
        </>
    );
}
