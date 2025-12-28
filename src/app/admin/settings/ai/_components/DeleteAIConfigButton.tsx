'use client';

import { useState, useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface DeleteAIConfigButtonProps {
    configId: string;
}

export default function DeleteAIConfigButton({ configId }: DeleteAIConfigButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = async () => {
        startTransition(async () => {
            try {
                const res = await fetch(`/api/admin/ai-configs?id=${configId}`, {
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
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="删除"
            >
                <Trash2 className="w-4 h-4" />
            </button>

            <ConfirmDialog
                isOpen={isOpen}
                onCancel={() => setIsOpen(false)}
                onConfirm={handleDelete}
                title="确认删除 AI 配置"
                message="您确定要删除这个 AI 配置吗？此操作无法撤销。"
                confirmText="确认删除"
                confirmButtonClass="bg-red-600 hover:bg-red-700 text-white"
                isLoading={isPending}
            />
        </>
    );
}
