'use client';

import { useState } from 'react';
import { Link as LinkIcon, Loader2, Copy, Check } from 'lucide-react';

interface InternalLink {
    id: string;
    title: string;
    slug: string;
    summary: string | null;
    score: number;
    matchedKeywords: string[];
}

interface InternalLinkSuggesterProps {
    articleId?: string;
    content: string;
}

export default function InternalLinkSuggester({ articleId, content }: InternalLinkSuggesterProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<InternalLink[]>([]);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const fetchSuggestions = async () => {
        if (!content || content.length < 50) {
            alert('内容太短，无法生成推荐');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/articles/internal-links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    articleId,
                    content,
                    limit: 8,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setSuggestions(data.recommendations);
            } else {
                alert('获取推荐失败：' + data.error);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            alert('获取推荐失败，请重试');
        } finally {
            setIsLoading(false);
        }
    };

    const copyLink = (link: InternalLink) => {
        const markdown = `[${link.title}](/articles/${link.slug})`;
        navigator.clipboard.writeText(markdown);
        setCopiedId(link.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900  flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-blue-600" />
                    智能内链推荐
                </h3>
                <button
                    onClick={fetchSuggestions}
                    disabled={isLoading || !content}
                    className="px-3 py-1.5 text-xs font-medium text-blue-600  hover:bg-blue-50 :bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            分析中...
                        </>
                    ) : (
                        <>
                            <LinkIcon className="w-3 h-3" />
                            获取推荐
                        </>
                    )}
                </button>
            </div>

            {suggestions.length > 0 && (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {suggestions.map((link) => (
                        <div
                            key={link.id}
                            className="p-3 bg-gray-50  rounded-lg hover:bg-gray-100 :bg-gray-700 transition-colors group"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-gray-900  truncate">
                                        {link.title}
                                    </h4>
                                    <p className="text-xs text-gray-500  mt-1 line-clamp-2">
                                        {link.summary || '无摘要'}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xs text-blue-600  font-mono">
                                            /{link.slug}
                                        </span>
                                        <span className="text-xs text-gray-400">•</span>
                                        <span className="text-xs text-gray-500 ">
                                            相关度: {Math.round(link.score)}
                                        </span>
                                    </div>
                                    {link.matchedKeywords.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {link.matchedKeywords.slice(0, 3).map((kw, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-1.5 py-0.5 text-xs bg-blue-100  text-blue-700  rounded"
                                                >
                                                    {kw}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => copyLink(link)}
                                    className="flex-shrink-0 p-2 hover:bg-white :bg-gray-600 rounded transition-colors opacity-0 group-hover:opacity-100"
                                    title="复制 Markdown 链接"
                                >
                                    {copiedId === link.id ? (
                                        <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <Copy className="w-4 h-4 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!isLoading && suggestions.length === 0 && (
                <div className="text-center py-6 text-sm text-gray-500 ">
                    点击"获取推荐"按钮分析内容并推荐相关文章
                </div>
            )}
        </div>
    );
}
