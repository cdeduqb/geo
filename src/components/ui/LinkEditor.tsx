'use client';

import { useState, useEffect } from 'react';
import { Link as LinkIcon, ExternalLink } from 'lucide-react';

interface LinkEditorProps {
    label?: string;
    link?: string;
    onSave: (link: string) => void;
}

export default function LinkEditor({ label = '', link = '', onSave }: LinkEditorProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempLink, setTempLink] = useState(link);
    const [linkType, setLinkType] = useState<'internal' | 'external'>(
        link.startsWith('http') ? 'external' : 'internal'
    );
    const [pages, setPages] = useState<any[]>([]);
    const [loadingPages, setLoadingPages] = useState(false);

    useEffect(() => {
        if (linkType === 'internal' && isEditing) {
            fetchPages();
        }
    }, [linkType, isEditing]);

    const fetchPages = async () => {
        setLoadingPages(true);
        try {
            const res = await fetch('/api/admin/pages');
            if (res.ok) {
                const data = await res.json();
                const allPages = data.pages || [];
                const filteredPages = allPages.filter((p: any) => !p.slug?.startsWith('temp-edit-') && !p.slug?.startsWith('temp-template-'));

                if (filteredPages.length === 0) {
                    setPages([
                        { id: 'h', title: '网站首页', slug: '' },
                        { id: 'a', title: '关于我们', slug: 'about' },
                        { id: 'c', title: '联系我们', slug: 'contact' },
                        { id: 'p', title: '产品中心', slug: 'products' },
                        { id: 'n', title: '新闻资讯', slug: 'news' },
                    ]);
                } else {
                    setPages(filteredPages);
                }
            } else {
                throw new Error('API failed');
            }
        } catch (error) {
            console.error('Failed to fetch pages, using defaults:', error);
            setPages([
                { id: 'h', title: '网站首页', slug: '' },
                { id: 'a', title: '关于我们', slug: 'about' },
                { id: 'c', title: '联系我们', slug: 'contact' },
                { id: 'p', title: '产品中心', slug: 'products' },
                { id: 'n', title: '新闻资讯', slug: 'news' },
            ]);
        } finally {
            setLoadingPages(false);
        }
    };

    const handleEdit = () => {
        setTempLink(link);
        setLinkType(link.startsWith('http') ? 'external' : 'internal');
        setIsEditing(true);
    };

    const handleSave = () => {
        if (!tempLink.trim()) {
            alert('请输入链接');
            return;
        }
        onSave(tempLink);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempLink(link);
        setIsEditing(false);
    };

    if (!isEditing) {
        return (
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md border border-gray-200">
                <div className="flex-1">
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                        {link.startsWith('http') ? (
                            <ExternalLink className="w-3 h-3" />
                        ) : (
                            <LinkIcon className="w-3 h-3" />
                        )}
                        {link || '未设置'}
                    </div>
                </div>
                <button
                    onClick={handleEdit}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded"
                >
                    编辑
                </button>
            </div>
        );
    }

    return (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    链接类型
                </label>
                <div className="flex gap-2">
                    <button
                        onClick={() => setLinkType('internal')}
                        className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${linkType === 'internal'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <LinkIcon className="w-4 h-4 inline mr-1" />
                        内部链接
                    </button>
                    <button
                        onClick={() => setLinkType('external')}
                        className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${linkType === 'external'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <ExternalLink className="w-4 h-4 inline mr-1" />
                        外部链接
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    {linkType === 'internal' ? '选择页面或输入路径' : '输入完整URL'}
                </label>

                {linkType === 'internal' ? (
                    <>
                        <select
                            value={tempLink}
                            onChange={(e) => setTempLink(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm mb-2"
                            disabled={loadingPages}
                        >
                            <option value="">-- 选择现有页面或手动输入 --</option>
                            {pages.map((page) => (
                                <option key={page.id} value={`/${page.slug}`}>
                                    {page.title} ({page.slug})
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            value={tempLink}
                            onChange={(e) => setTempLink(e.target.value)}
                            placeholder="或手动输入路径，如：/custom-page"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        />
                    </>
                ) : (
                    <input
                        type="text"
                        value={tempLink}
                        onChange={(e) => setTempLink(e.target.value)}
                        placeholder="例如：https://example.com"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                )}

                <p className="mt-1.5 text-xs text-gray-500">
                    {linkType === 'internal'
                        ? '可从下拉框选择页面，或手动输入相对路径'
                        : '请输入完整的URL，包含 https://'}
                </p>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={handleSave}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                >
                    保存
                </button>
                <button
                    onClick={handleCancel}
                    className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm font-medium"
                >
                    取消
                </button>
            </div>
        </div>
    );
}
