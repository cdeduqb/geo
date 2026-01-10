'use client';

import { useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteArticle } from '../actions';
import { useState } from 'react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface DeleteArticleButtonProps {
    articleId: string;
    articleTitle: string;
}

export default function DeleteArticleButton({ articleId, articleTitle }: DeleteArticleButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDelete = () => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append('id', articleId);
            await deleteArticle(formData);
            setIsDialogOpen(false);
        });
    };

    return (
        <>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDialogOpen(true);
                }}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="删除"
            >
                <Trash2 className="w-4 h-4" />
            </button>

            <ConfirmDialog
                isOpen={isDialogOpen}
                onCancel={() => setIsDialogOpen(false)}
                onConfirm={handleDelete}
                title="确认删除文章？"
                message={`您确定要删除文章"${articleTitle}"吗？此操作无法撤销。`}
                confirmText="删除"
                confirmButtonClass="bg-red-600 hover:bg-red-700 text-white"
                isLoading={isPending}
            />
        </>
    );
}
