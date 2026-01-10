'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

interface CopyableIdProps {
    id: string;
}

export default function CopyableId({ id }: CopyableIdProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(id);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    return (
        <div
            className="group/id cursor-pointer flex flex-col gap-1"
            onClick={handleCopy}
            title="点击复制完整 ID"
        >
            <div className="flex items-center gap-1.5">
                <code className="text-[10px] bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded border border-gray-100 font-mono group-hover/id:bg-blue-50 group-hover/id:text-blue-600 group-hover/id:border-blue-100 transition-colors">
                    {id.substring(0, 8)}...
                </code>
                {copied ? (
                    <Check className="w-3 h-3 text-green-500" />
                ) : (
                    <Copy className="w-3 h-3 text-gray-300 opacity-0 group-hover/id:opacity-100 transition-all" />
                )}
            </div>
            <span className="text-[9px] text-gray-300 opacity-0 group-hover/id:opacity-100 transition-opacity whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                {id}
            </span>
        </div>
    );
}
