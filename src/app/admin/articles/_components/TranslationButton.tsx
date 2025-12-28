'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Languages, Loader2 } from 'lucide-react';
import { createTranslation } from '../actions';

interface TranslationButtonProps {
    articleId: string;
    currentLang: string;
}

export default function TranslationButton({ articleId, currentLang }: TranslationButtonProps) {
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();

    const targetLang = currentLang === 'zh' ? 'en' : 'zh';
    const targetLangName = targetLang === 'zh' ? '中文' : 'English';

    const handleCreateTranslation = async () => {
        if (isCreating) return;

        setIsCreating(true);
        try {
            const result = await createTranslation(articleId, targetLang);

            if (result.success && result.articleId) {
                router.push(`/admin/articles/${result.articleId}`);
            } else if (result.error) {
                if (result.articleId) {
                    // 翻译已存在，跳转到该翻译
                    router.push(`/admin/articles/${result.articleId}`);
                } else {
                    alert(result.error);
                }
            }
        } catch (error) {
            console.error('创建翻译失败:', error);
            alert('创建翻译失败，请重试');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleCreateTranslation}
            disabled={isCreating}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
            {isCreating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Languages className="w-4 h-4" />
            )}
            创建{targetLangName}版本
        </button>
    );
}
