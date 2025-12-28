'use client';

import { useState } from 'react';
import { Wand2, Loader2, Sparkles } from 'lucide-react';

interface AIContentFillButtonProps {
    fieldName: string;
    fieldLabel: string;
    currentValue: string;
    context?: {
        pageTitle?: string;
        sectionType?: string;
        otherFields?: Record<string, any>;
    };
    onFill: (newValue: string) => void;
}

export default function AIContentFillButton({
    fieldName,
    fieldLabel,
    currentValue,
    context,
    onFill,
}: AIContentFillButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const res = await fetch('/api/admin/ai/generate-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fieldName,
                    fieldLabel,
                    currentValue,
                    context,
                }),
            });

            if (!res.ok) throw new Error('生成失败');

            const { content } = await res.json();
            onFill(content);
        } catch (error) {
            console.error('AI 生成失败:', error);
            alert('生成失败，请重试');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="p-1.5 text-purple-500 hover:text-purple-700 hover:bg-purple-50 rounded-md transition-colors disabled:opacity-50"
            title="AI 智能填充"
        >
            {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Wand2 className="w-4 h-4" />
            )}
        </button>
    );
}
