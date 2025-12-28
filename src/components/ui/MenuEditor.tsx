'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, ExternalLink, Link as LinkIcon, ChevronDown } from 'lucide-react';

interface MenuItem {
    label: string;
    link: string;
}

interface MenuEditorProps {
    value?: MenuItem[];
    onChange: (items: MenuItem[]) => void;
}

export default function MenuEditor({ value = [], onChange }: MenuEditorProps) {
    const [items, setItems] = useState<MenuItem[]>(value || []);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [tempLabel, setTempLabel] = useState('');
    const [tempLink, setTempLink] = useState('');
    const [linkType, setLinkType] = useState<'internal' | 'external'>('internal');
    const [pages, setPages] = useState<any[]>([]);
    const [loadingPages, setLoadingPages] = useState(false);

    // 获取现有页面列表
    useEffect(() => {
        if (linkType === 'internal' && editingIndex !== null) {
            fetchPages();
        }
    }, [linkType, editingIndex]);

    const fetchPages = async () => {
        setLoadingPages(true);
        try {
            const res = await fetch('/api/admin/pages');
            if (res.ok) {
                const data = await res.json();
                const allPages = data.pages || [];
                const filteredPages = allPages.filter((p: any) => !p.slug?.startsWith('temp-edit-') && !p.slug?.startsWith('temp-template-'));

                // 如果没有页面，提供内置默认值
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

    const handleAdd = () => {
        setEditingIndex(items.length);
        setTempLabel('');
        setTempLink('');
        setLinkType('internal');
    };

    const handleSave = () => {
        if (!tempLabel.trim()) {
            alert('请输入菜单名称');
            return;
        }
        if (!tempLink.trim()) {
            alert('请输入链接');
            return;
        }

        const newItems = [...items];
        if (editingIndex !== null) {
            if (editingIndex < items.length) {
                newItems[editingIndex] = { label: tempLabel, link: tempLink };
            } else {
                newItems.push({ label: tempLabel, link: tempLink });
            }
        }

        setItems(newItems);
        onChange(newItems);
        setEditingIndex(null);
        setTempLabel('');
        setTempLink('');
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setTempLabel(items[index].label);
        setTempLink(items[index].link);
        setLinkType(items[index].link.startsWith('http') ? 'external' : 'internal');
    };

    const handleDelete = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
        onChange(newItems);
        if (editingIndex === index) {
            setEditingIndex(null);
        }
    };

    const handleCancel = () => {
        setEditingIndex(null);
        setTempLabel('');
        setTempLink('');
    };

    return (
        <div className="space-y-3">
            {/* 现有菜单项列表 */}
            {items.map((item, index) => (
                <div key={index}>
                    {/* 菜单项显示 */}
                    {editingIndex !== index && (
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-gray-100 transition-all">
                            <div className="flex-1">
                                <div className="font-medium text-sm">{item.label}</div>
                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                    {item.link.startsWith('http') ? (
                                        <ExternalLink className="w-3 h-3" />
                                    ) : (
                                        <LinkIcon className="w-3 h-3" />
                                    )}
                                    {item.link}
                                </div>
                            </div>
                            <button
                                onClick={() => handleEdit(index)}
                                className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition-colors"
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
                    )}

                    {/* 编辑表单 - 展开显示 */}
                    {editingIndex === index && (
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-300 shadow-md space-y-3 animate-in slide-in-from-top-2">
                            <div
                                className="flex items-center gap-2 mb-2 cursor-pointer hover:opacity-70 transition-opacity"
                                onClick={handleCancel}
                                title="点击收起"
                            >
                                <ChevronDown className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">编辑菜单项 #{index + 1}</span>
                                <span className="text-xs text-gray-500 ml-auto">(点击收起)</span>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                    菜单名称
                                </label>
                                <input
                                    type="text"
                                    value={tempLabel}
                                    onChange={(e) => setTempLabel(e.target.value)}
                                    placeholder="例如：首页、产品、关于我们"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    autoFocus
                                />
                            </div>

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
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </>
                                ) : (
                                    <input
                                        type="text"
                                        value={tempLink}
                                        onChange={(e) => setTempLink(e.target.value)}
                                        placeholder="例如：https://example.com"
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                )}

                                <p className="mt-1.5 text-xs text-gray-500">
                                    {linkType === 'internal'
                                        ? '可从下拉框选择页面，或手动输入相对路径'
                                        : '请输入完整的URL，包含 https://'}
                                </p>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={handleSave}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium shadow-sm transition-colors"
                                >
                                    保存
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium transition-colors"
                                >
                                    取消
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {/* 添加按钮 */}
            {editingIndex === null && (
                <button
                    onClick={handleAdd}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">添加菜单项</span>
                </button>
            )}

            {/* 新增菜单编辑表单 */}
            {editingIndex === items.length && (
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-300 shadow-md space-y-3 animate-in slide-in-from-top-2">
                    <div
                        className="flex items-center gap-2 mb-2 cursor-pointer hover:opacity-70 transition-opacity"
                        onClick={handleCancel}
                        title="点击收起"
                    >
                        <Plus className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-900">新增菜单项</span>
                        <span className="text-xs text-gray-500 ml-auto">(点击收起)</span>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                            菜单名称
                        </label>
                        <input
                            type="text"
                            value={tempLabel}
                            onChange={(e) => setTempLabel(e.target.value)}
                            placeholder="例如：首页、产品、关于我们"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                            链接类型
                        </label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setLinkType('internal')}
                                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${linkType === 'internal'
                                    ? 'bg-green-600 text-white shadow-md'
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <LinkIcon className="w-4 h-4 inline mr-1" />
                                内部链接
                            </button>
                            <button
                                onClick={() => setLinkType('external')}
                                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${linkType === 'external'
                                    ? 'bg-green-600 text-white shadow-md'
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
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm mb-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </>
                        ) : (
                            <input
                                type="text"
                                value={tempLink}
                                onChange={(e) => setTempLink(e.target.value)}
                                placeholder="例如：https://example.com"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        )}

                        <p className="mt-1.5 text-xs text-gray-500">
                            {linkType === 'internal'
                                ? '可从下拉框选择页面，或手动输入相对路径'
                                : '请输入完整的URL，包含 https://'}
                        </p>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button
                            onClick={handleSave}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium shadow-sm transition-colors"
                        >
                            保存
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium transition-colors"
                        >
                            取消
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
