'use client';

import { toggleTemplateStatus } from '../actions';
import { useTransition } from 'react';
import { Power, PowerOff } from 'lucide-react';

export default function TemplateStatusButton({
    templateId,
    moduleType,
    isActive
}: {
    templateId: string;
    moduleType: string;
    isActive: boolean;
}) {
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        startTransition(async () => {
            // 传入期望的新状态：如果当前是 active，则期望变为 false (禁用)；反之亦然
            await toggleTemplateStatus(templateId, moduleType, !isActive);
        });
    };

    if (isActive) {
        return (
            <button
                onClick={handleToggle}
                disabled={isPending}
                className="flex-1 px-3 py-2 text-sm border border-red-200 text-red-600 bg-white rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center justify-center"
                title="点击禁用"
            >
                <PowerOff className="w-3.5 h-3.5 mr-1.5" />
                {isPending ? '处理中...' : '禁用'}
            </button>
        );
    }

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            className="flex-1 px-3 py-2 text-sm bg-[#4f46e5] text-white rounded-lg hover:bg-[#4338ca] transition-colors disabled:opacity-50 flex items-center justify-center shadow-sm"
            title="点击启用"
        >
            <Power className="w-3.5 h-3.5 mr-1.5" />
            {isPending ? '处理中...' : '启用'}
        </button>
    );
}
