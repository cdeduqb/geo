'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Category } from '@prisma/client';
import ArticleForm from '../../_components/ArticleForm';

interface CreateArticleClientProps {
    categories: Category[];
    action: (formData: FormData) => any;
    enableMultiLanguage?: boolean;
    translationGroups?: { id: string; label: string; lang: string }[];
    supportedLocales?: string[];
}

export default function CreateArticleClient({
    categories,
    action,
    enableMultiLanguage = false,
    translationGroups = [],
    supportedLocales = ['zh', 'en']
}: CreateArticleClientProps) {
    const searchParams = useSearchParams();
    const [initialArticle, setInitialArticle] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">加载中...</p>
                </div>
            </div>
        );
    }

    return (
        <ArticleForm
            categories={categories}
            article={initialArticle}
            action={action}
            enableMultiLanguage={enableMultiLanguage}
            translationGroups={translationGroups}
            supportedLocales={supportedLocales}
        />
    );
}
