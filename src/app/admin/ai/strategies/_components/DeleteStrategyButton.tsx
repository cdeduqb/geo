'use client';

import { useState, useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface DeleteStrategyButtonProps {
    strategyId: string;
}

export default function DeleteStrategyButton({ strategyId }: DeleteStrategyButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = async () => {
        startTransition(async () => {
            try {
                const res = await fetch(`/api/admin/ai-strategies?id=${strategyId}`, {
                    method: 'DELETE',
                });

                if (res.ok) {
                    setIsOpen(false);
                    router.refresh();
                } else {
                    alert('删除失败');
                }
            } catch (error) {
                console.error('Delete failed', error);
                alert('删除失败');
            }
        });
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="删除"
            >
                <Trash2 className="h-3.5 w-3.5" />
            </button>

            <ConfirmDialog
                isOpen={isOpen}
                onCancel={() => setIsOpen(false)}
                onConfirm={handleDelete}
                title="确认删除策略"
                message="确定要删除这个策略吗？相关的创作任务将无法使用此策略。此操作无法撤销。"
                confirmText="确认删除"
                confirmButtonClass="bg-red-600 hover:bg-red-700 text-white"
                isLoading={isPending}
            />
        </>
    );
}
