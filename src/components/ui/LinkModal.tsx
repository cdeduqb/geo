'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Search, FileText, Layout, Loader2 } from 'lucide-react';

interface LinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (url: string, text?: string) => void;
    initialUrl?: string;
    initialText?: string;
    isPopover?: boolean;
}

interface SearchResult {
    id: string;
    title: string;
    type: 'page' | 'article';
    url: string;
    status: string;
    displayType: string;
}

export default function LinkModal({
    isOpen,
    onClose,
    onSubmit,
    initialUrl = '',
    initialText = '',
    isPopover = false
}: LinkModalProps) {
    const [activeTab, setActiveTab] = useState<'external' | 'internal'>('external');
    const [url, setUrl] = useState(initialUrl);
    const [text, setText] = useState(initialText);
    const [error, setError] = useState('');
    const urlInputRef = useRef<HTMLInputElement>(null);

    // Internal Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout>(null);

    useEffect(() => {
        if (isOpen) {
            setUrl(initialUrl);
            setText(initialText);
            setError('');
            setActiveTab('external');
            setSearchQuery('');
            setSearchResults([]);
            setTimeout(() => urlInputRef.current?.focus(), 100);
        }
    }, [isOpen, initialUrl, initialText]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setIsSearching(true);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (!query.trim()) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        searchTimeoutRef.current = setTimeout(async () => {
            try {
                const res = await fetch(`/api/admin/content/search?q=${encodeURIComponent(query)}`);
                if (res.ok) {
                    const data = await res.json();
                    setSearchResults(data);
                }
            } catch (error) {
                console.error('Search failed', error);
            } finally {
                setIsSearching(false);
            }
        }, 300);
    };

    const selectInternalLink = (item: SearchResult) => {
        setUrl(item.url);
        if (!text) {
            setText(item.title);
        }
        setActiveTab('external');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!url.trim()) {
            setError('请输入链接 URL');
            return;
        }

        // Basic URL validation
        // Allow relative URLs for internal links (starting with /)
        if (!url.startsWith('/')) {
            try {
                new URL(url.startsWith('http') ? url : `https://${url}`);
            } catch {
                setError('请输入有效的 URL');
                return;
            }
        }

        let finalUrl = url;
        if (!url.startsWith('/') && !url.startsWith('http')) {
            finalUrl = `https://${url}`;
        }

        onSubmit(finalUrl, text.trim() || undefined);
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    const modalContent = (
        <div
            className={`${isPopover
                ? 'absolute top-20 left-1/2 -translate-x-1/2 w-[400px] z-[101] animate-in slide-in-from-top-2 duration-200'
                : 'w-full max-w-md max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200'
                } bg-white shadow-2xl border border-gray-200 rounded-xl overflow-hidden p-6`}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
        >
            <div className="flex items-center justify-between mb-4 shrink-0">
                <h3 className="text-lg font-semibold text-gray-900">
                    插入链接
                </h3>
                <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-4 shrink-0">
                <button
                    type="button"
                    onClick={() => setActiveTab('external')}
                    className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'external'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    URL 链接
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('internal')}
                    className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'internal'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    内部内容
                </button>
            </div>

            {activeTab === 'external' ? (
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                链接 URL *
                            </label>
                            <input
                                ref={urlInputRef}
                                type="text"
                                value={url}
                                onChange={(e) => {
                                    setUrl(e.target.value);
                                    setError('');
                                }}
                                data-testid="link-url-input"
                                placeholder="https://example.com 或 /about"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                链接文本 (可选)
                            </label>
                            <input
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="点击这里"
                                data-testid="link-text-input"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {error && (
                            <div className="text-sm text-red-600">
                                {error}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            插入
                        </button>
                    </div>
                </form>
            ) : (
                <div className="flex-1 flex flex-col min-h-[300px]">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="搜索文章或页面标题..."
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                        />
                        {isSearching && (
                            <Loader2 className="absolute right-3 top-2.5 w-4 h-4 text-blue-500 animate-spin" />
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto -mx-2 px-2">
                        {searchResults.length > 0 ? (
                            <div className="space-y-1">
                                {searchResults.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => selectInternalLink(item)}
                                        className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-100 transition-colors group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                            {item.type === 'page' ? (
                                                <Layout className="w-4 h-4 text-blue-600" />
                                            ) : (
                                                <FileText className="w-4 h-4 text-blue-600" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-900 truncate group-hover:text-blue-600">
                                                {item.title}
                                            </div>
                                            <div className="text-xs text-gray-500 flex items-center gap-2">
                                                <span className="bg-gray-100 px-1.5 py-0.5 rounded">
                                                    {item.displayType}
                                                </span>
                                                <span className="truncate">{item.url}</span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : searchQuery ? (
                            <div className="text-center py-8 text-gray-500">
                                {isSearching ? '搜索中...' : '未找到相关内容'}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                输入关键词搜索内部内容
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    if (isPopover) {
        return modalContent;
    }

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose}
        >
            {modalContent}
        </div>
    );
}
