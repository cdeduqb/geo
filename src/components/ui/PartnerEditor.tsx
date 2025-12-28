'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, ExternalLink, Link as LinkIcon, ChevronDown, ImageIcon } from 'lucide-react';
import ImageUploader from './ImageUploader';

interface PartnerItem {
    name: string;
    url: string; // The logo image URL
    link?: string; // The click-through URL
}

interface PartnerEditorProps {
    value?: PartnerItem[];
    onChange: (items: PartnerItem[]) => void;
}

export default function PartnerEditor({ value = [], onChange }: PartnerEditorProps) {
    const [items, setItems] = useState<PartnerItem[]>(value || []);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [tempName, setTempName] = useState('');
    const [tempUrl, setTempUrl] = useState('');
    const [tempLink, setTempLink] = useState('');

    // For link editor logic (simplified from MenuEditor)
    const [linkType, setLinkType] = useState<'internal' | 'external'>('external');
    const [pages, setPages] = useState<any[]>([]);

    useEffect(() => {
        // Sync items if value changes externally
        setItems(value || []);
    }, [value]);

    // Fetch pages for internal linking
    useEffect(() => {
        // Only fetch if we need internal linking
        const fetchPages = async () => {
            try {
                const res = await fetch('/api/admin/pages');
                if (res.ok) {
                    const data = await res.json();
                    setPages(data.pages || []);
                }
            } catch (error) {
                console.error('Failed to fetch pages:', error);
            }
        };
        fetchPages();
    }, []);


    const handleAdd = () => {
        setEditingIndex(items.length); // Use length as "new" index
        setTempName('');
        setTempUrl('');
        setTempLink('');
        setLinkType('external');
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        const item = items[index];
        setTempName(item.name || '');
        setTempUrl(item.url || '');
        setTempLink(item.link || '');
        setLinkType(item.link && !item.link.startsWith('http') ? 'internal' : 'external');
    };

    const handleSave = () => {
        // Validation: Name is optional? No, name is good for ALT text. Image is required.
        if (!tempUrl) {
            alert('请上传合作伙伴 Logo');
            return;
        }

        const newItem: PartnerItem = {
            name: tempName || 'Partner',
            url: tempUrl,
            link: tempLink
        };

        const newItems = [...items];
        if (editingIndex !== null) {
            if (editingIndex < items.length) {
                newItems[editingIndex] = newItem;
            } else {
                newItems.push(newItem);
            }
        }

        setItems(newItems);
        onChange(newItems);
        setEditingIndex(null);
        setTempName('');
        setTempUrl('');
        setTempLink('');
    };

    const handleDelete = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
        onChange(newItems);
        if (editingIndex === index) setEditingIndex(null);
    };

    const handleCancel = () => {
        setEditingIndex(null);
    };

    return (
        <div className="space-y-3">
            {/* List Items */}
            {items.map((item, index) => (
                <div key={index}>
                    {editingIndex !== index && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-gray-100 transition-all">
                            {/* Thumbnail */}
                            <div className="w-12 h-12 bg-white rounded border border-gray-100 p-1 flex-shrink-0 flex items-center justify-center">
                                {item.url ? (
                                    <img src={item.url} alt={item.name} className="max-w-full max-h-full object-contain" />
                                ) : (
                                    <ImageIcon className="w-6 h-6 text-gray-300" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">{item.name || 'Partner'}</div>
                                {item.link && (
                                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 truncate">
                                        <LinkIcon className="w-3 h-3 flex-shrink-0" />
                                        {item.link}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-1">
                                <button
                                    onClick={() => handleEdit(index)}
                                    className="px-2 py-1.5 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition-colors"
                                >
                                    编辑
                                </button>
                                <button
                                    onClick={() => handleDelete(index)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Edit Form */}
                    {editingIndex === index && (
                        <div className="p-4 bg-white rounded-lg border-2 border-blue-500 shadow-lg space-y-4 animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-2 border-b border-gray-100 pb-2">
                                <span className="font-bold text-sm text-gray-700">编辑合作伙伴 #{index + 1}</span>
                                <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Logo 图片 (必填)</label>
                                <ImageUploader value={tempUrl} onChange={setTempUrl} />
                            </div>

                            {/* Name Input */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">名称 (Alt 文本)</label>
                                <input
                                    type="text"
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                    placeholder="Partner Name"
                                />
                            </div>

                            {/* Link Input */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">跳转链接 (可选)</label>
                                <div className="flex gap-2 mb-2">
                                    <button
                                        onClick={() => setLinkType('external')}
                                        className={`flex-1 py-1.5 text-xs rounded border ${linkType === 'external' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200'}`}
                                    >
                                        外部链接 (https://...)
                                    </button>
                                    <button
                                        onClick={() => setLinkType('internal')}
                                        className={`flex-1 py-1.5 text-xs rounded border ${linkType === 'internal' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200'}`}
                                    >
                                        内部页面
                                    </button>
                                </div>
                                {linkType === 'internal' ? (
                                    <select
                                        value={tempLink}
                                        onChange={(e) => setTempLink(e.target.value)}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                    >
                                        <option value="">-- 选择页面 --</option>
                                        {pages.map(p => (
                                            <option key={p.id} value={`/pages/${p.slug}`}>{p.title}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        value={tempLink}
                                        onChange={(e) => setTempLink(e.target.value)}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                        placeholder="https://example.com"
                                    />
                                )}
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button onClick={handleSave} className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 text-sm font-medium">保存</button>
                                <button onClick={handleCancel} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 text-sm font-medium">取消</button>
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {/* Add Button */}
            {editingIndex === null && (
                <button
                    onClick={handleAdd}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">添加合作伙伴</span>
                </button>
            )}

            {/* New Item Form */}
            {editingIndex === items.length && (
                <div className="p-4 bg-white rounded-lg border-2 border-green-500 shadow-lg space-y-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-2 border-b border-gray-100 pb-2">
                        <span className="font-bold text-sm text-green-700">新合作伙伴</span>
                        <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>
                    {/* Same Fields as Edit Form - Code Duplication suitable for simple component */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Logo 图片 (必填)</label>
                        <ImageUploader value={tempUrl} onChange={setTempUrl} />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">名称 (Alt 文本)</label>
                        <input
                            type="text"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                            placeholder="Partner Name"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">跳转链接 (可选)</label>
                        <div className="flex gap-2 mb-2">
                            <button
                                onClick={() => setLinkType('external')}
                                className={`flex-1 py-1.5 text-xs rounded border ${linkType === 'external' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-gray-200'}`}
                            >
                                外部链接
                            </button>
                            <button
                                onClick={() => setLinkType('internal')}
                                className={`flex-1 py-1.5 text-xs rounded border ${linkType === 'internal' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-gray-200'}`}
                            >
                                内部页面
                            </button>
                        </div>
                        {linkType === 'internal' ? (
                            <select
                                value={tempLink}
                                onChange={(e) => setTempLink(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                            >
                                <option value="">-- 选择页面 --</option>
                                {pages.map(p => (
                                    <option key={p.id} value={`/pages/${p.slug}`}>{p.title}</option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type="text"
                                value={tempLink}
                                onChange={(e) => setTempLink(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                placeholder="https://example.com"
                            />
                        )}
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button onClick={handleSave} className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 text-sm font-medium">添加</button>
                        <button onClick={handleCancel} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 text-sm font-medium">取消</button>
                    </div>
                </div>
            )}
        </div>
    );
}
