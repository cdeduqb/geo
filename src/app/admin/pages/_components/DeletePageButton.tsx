'use client';

import { Trash2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { deletePage } from '../actions';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface DeletePageButtonProps {
    id: string;
    title: string;
}

export default function DeletePageButton({ id, title }: DeletePageButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = () => {
        startTransition(async () => {
            await deletePage(id);
            setShowConfirm(false);
        });
    };

    return (
        <>
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowConfirm(true);
                }}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="删除"
            >
                <Trash2 className="w-4 h-4" />
            </button>

            <ConfirmDialog
                isOpen={showConfirm}
                onCancel={() => setShowConfirm(false)}
                onConfirm={handleDelete}
                title="删除页面"
                message="确定要删除这个页面吗？此操作不可恢复。"
                confirmText="删除"
                confirmButtonClass="bg-red-600 hover:bg-red-700"
                isLoading={isPending}
            />
        </>
    );
}
