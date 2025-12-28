/**
 * 引用管理组件
 * 用于在文章编辑器中管理引用源
 */

'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Link as LinkIcon, Sparkles, Loader2 } from 'lucide-react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export interface Citation {
    id: string;
    title: string;
    url?: string;
    author?: string;
    publishDate?: string;
    description?: string;
}

interface CitationManagerProps {
    citations: Citation[];
    onChange: (citations: Citation[]) => void;
    onInsert?: (citation: Citation, index: number) => void;
    content?: string; // 文章内容，用于自动提取
    lang?: string; // 文章语言
}

export default function CitationManager({ citations, onChange, onInsert, content, lang = 'zh' }: CitationManagerProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Citation>>({});
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isExtracting, setIsExtracting] = useState(false);

    const handleAdd = () => {
        setIsEditing(true);
        setEditingId(null);
        setFormData({});
    };

    const handleEdit = (citation: Citation) => {
        setIsEditing(true);
        setEditingId(citation.id);
        setFormData(citation);
    };

    const handleSave = () => {
        if (!formData.title) {
            alert('请输入引用标题');
            return;
        }

        if (editingId) {
            // 编辑现有引用
            onChange(citations.map(c =>
                c.id === editingId ? { ...c, ...formData } as Citation : c
            ));
        } else {
            // 添加新引用
            const newCitation: Citation = {
                id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString() + Math.random().toString(36).substring(2),
                title: formData.title!,
                url: formData.url,
                author: formData.author,
                publishDate: formData.publishDate,
                description: formData.description,
            };
            onChange([...citations, newCitation]);
        }

        setIsEditing(false);
        setEditingId(null);
        setFormData({});
    };

    const handleDelete = (id: string) => {
        setDeletingId(id);
    };

    const handleConfirmDelete = () => {
        if (!deletingId) return;
        onChange(citations.filter(c => c.id !== deletingId));
        setDeletingId(null);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditingId(null);
        setFormData({});
    };

    const handleAutoExtract = async () => {
        if (!content) {
            alert('请先填写文章内容');
            return;
        }

        setIsExtracting(true);
        try {
            const res = await fetch('/api/admin/articles/extract-citations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, lang }),
            });

            if (!res.ok) throw new Error('提取失败');

            const data = await res.json();
            const extractedCitations = data.citations || [];

            // 合并已有引用和提取的引用（去重）
            const merged = [...citations];
            extractedCitations.forEach((newCitation: Citation) => {
                const exists = merged.some(
                    c => c.title.toLowerCase() === newCitation.title.toLowerCase()
                );
                if (!exists) {
                    merged.push({
                        ...newCitation,
                        id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
                    });
                }
            });

            onChange(merged);
            alert(`成功提取 ${extractedCitations.length} 个引用`);
        } catch (error) {
            console.error(error);
            alert('自动提取引用失败');
        } finally {
            setIsExtracting(false);
        }
    };

    const handleInsert = (citation: Citation, index: number) => {
        if (onInsert) {
            onInsert(citation, index);
        }
    };

    const generateReferences = () => {
        if (citations.length === 0) {
            alert('没有引用数据');
            return '';
        }

        let html = '<h3>参考资料</h3>\n<ol>\n';
        citations.forEach(citation => {
            html += '  <li>';
            html += citation.title;
            if (citation.author) {
                html += ` - ${citation.author}`;
            }
            if (citation.publishDate) {
                html += ` (${citation.publishDate})`;
            }
            if (citation.url) {
                html += ` <a href="${citation.url}" target="_blank" rel="noopener noreferrer">[链接]</a>`;
            }
            html += '</li>\n';
        });
        html += '</ol>';

        navigator.clipboard.writeText(html);
        alert('参考资料 HTML 已复制到剪贴板');
    };

    return (
        <div className="border border-gray-200  rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 ">
                    引用管理 ({citations.length})
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={handleAutoExtract}
                        disabled={isExtracting || !content}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-purple-600 hover:text-purple-700  disabled:opacity-50 disabled:cursor-not-allowed"
                        type="button"
                    >
                        {isExtracting ? (
                            <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                提取中...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-3 h-3" />
                                自动提取引用
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleAdd}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 "
                        type="button"
                    >
                        <Plus className="w-3 h-3" />
                        添加引用
                    </button>
                </div>
            </div>

            {/* 引用列表 */}
            {citations.length > 0 && (
                <div className="space-y-3 mb-4">
                    {citations.map((citation, index) => (
                        <div
                            key={citation.id || `citation-${index}`}
                            className="p-3 bg-gray-50  rounded border border-gray-200 "
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-medium text-gray-500 ">
                                            [{index + 1}]
                                        </span>
                                        <p className="text-sm font-medium text-gray-900  truncate">
                                            {citation.title}
                                        </p>
                                    </div>
                                    {citation.author && (
                                        <p className="text-xs text-gray-600 ">
                                            作者：{citation.author}
                                        </p>
                                    )}
                                    {citation.url && (
                                        <p className="text-xs text-blue-600  truncate">
                                            {citation.url}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handleInsert(citation, index + 1)}
                                        className="p-1 text-green-600 hover:text-green-700 "
                                        title="插入引用"
                                    >
                                        <LinkIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleEdit(citation)}
                                        className="p-1 text-gray-600 hover:text-gray-700 "
                                        title="编辑"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(citation.id)}
                                        className="p-1 text-red-600 hover:text-red-700 "
                                        title="删除"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 编辑表单 */}
            {isEditing && (
                <div className="border-t border-gray-200  pt-4 space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-700  mb-1">
                            标题 *
                        </label>
                        <input
                            type="text"
                            value={formData.title || ''}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-2 py-1 text-sm border border-gray-300  rounded
                                bg-white  text-gray-900 "
                            placeholder="引用标题"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700  mb-1">
                            作者
                        </label>
                        <input
                            type="text"
                            value={formData.author || ''}
                            onChange={e => setFormData({ ...formData, author: e.target.value })}
                            className="w-full px-2 py-1 text-sm border border-gray-300  rounded
                                bg-white  text-gray-900 "
                            placeholder="作者姓名"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700  mb-1">
                            链接 URL
                        </label>
                        <input
                            type="url"
                            value={formData.url || ''}
                            onChange={e => setFormData({ ...formData, url: e.target.value })}
                            className="w-full px-2 py-1 text-sm border border-gray-300  rounded
                                bg-white  text-gray-900 "
                            placeholder="https://example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700  mb-1">
                            发布日期
                        </label>
                        <input
                            type="text"
                            value={formData.publishDate || ''}
                            onChange={e => setFormData({ ...formData, publishDate: e.target.value })}
                            className="w-full px-2 py-1 text-sm border border-gray-300  rounded
                                bg-white  text-gray-900 "
                            placeholder="2024-01-01"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            className="flex-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded"
                        >
                            保存
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex-1 px-3 py-1.5 text-sm font-medium text-gray-700  bg-gray-100  hover:bg-gray-200 :bg-gray-600 rounded"
                        >
                            取消
                        </button>
                    </div>
                </div>
            )}

            {/* 生成参考资料按钮 */}
            {citations.length > 0 && !isEditing && (
                <button
                    onClick={generateReferences}
                    className="w-full mt-4 px-3 py-2 text-sm font-medium text-blue-600  border border-blue-600  hover:bg-blue-50 :bg-blue-900/20 rounded"
                >
                    生成参考资料 HTML
                </button>
            )}

            <ConfirmDialog
                isOpen={deletingId !== null}
                onCancel={() => setDeletingId(null)}
                onConfirm={handleConfirmDelete}
                title="删除引用"
                message="确定要删除这个引用来源吗？此操作不可恢复。"
                confirmText="删除"
            />
        </div>
    );
}
