'use client';

import { Trash2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { deleteTemplate } from '../actions';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface DeleteTemplateButtonProps {
    id: string;
    name: string;
}

export default function DeleteTemplateButton({ id, name }: DeleteTemplateButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = () => {
        startTransition(async () => {
            await deleteTemplate(id);
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
                title="删除模板"
                message={`确定要删除模板 "${name}" 吗？此操作不可恢复。`}
                confirmText="删除"
                confirmButtonClass="bg-red-600 hover:bg-red-700"
                isLoading={isPending}
            />
        </>
    );
}
