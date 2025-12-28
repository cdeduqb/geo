'use client';

import { useToast } from "@/components/ui/toast";

interface CategoryUuidProps {
    uuid: string;
}

export default function CategoryUuid({ uuid }: CategoryUuidProps) {
    const { showToast } = useToast();

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(uuid);
            showToast('UUID 已复制到剪贴板', 'success');
        } catch (err) {
            showToast('复制失败', 'error');
        }
    };

    return (
        <div
            className="flex items-center gap-2 group/uuid cursor-pointer"
            title="点击复制 UUID"
            onClick={handleCopy}
        >
            <code className="text-xs bg-slate-50 text-slate-500 px-2 py-1 rounded border border-slate-100 font-mono select-all">
                {uuid.slice(0, 8)}...{uuid.slice(-4)}
            </code>
            <span className="text-[10px] text-slate-400 opacity-0 group-hover/uuid:opacity-100 transition-opacity">
                {uuid}
            </span>
        </div>
    );
}
