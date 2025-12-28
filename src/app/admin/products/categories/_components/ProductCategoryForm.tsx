'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import { Loader2 } from 'lucide-react';

interface ProductCategory {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    parentId: string | null;
    sortOrder: number;
    lang?: string;
    translationGroupId?: string | null;
}

interface ProductCategoryFormProps {
    category?: ProductCategory;
    categories: ProductCategory[]; // For parent selection
    enableMultiLanguage?: boolean;
    translationGroups?: { id: string; label: string; lang: string }[];
}

export default function ProductCategoryForm({
    category,
    categories,
    enableMultiLanguage = false,
    translationGroups = [],
}: ProductCategoryFormProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: category?.name || '',
        slug: category?.slug || '',
        description: category?.description || '',
        parentId: category?.parentId || '',
        sortOrder: category?.sortOrder || 0,
        lang: category?.lang || 'zh',
        translationGroupId: category?.translationGroupId || '',
    });

    const isEditing = !!category;

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setFormData(prev => {
            const newData = { ...prev, name };
            if (!isEditing && !prev.slug) {
                newData.slug = generateSlug(name);
            }
            return newData;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEditing
                ? `/api/admin/products/categories/${category.id}`
                : '/api/admin/products/categories';

            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    parentId: formData.parentId || null,
                    translationGroupId: formData.translationGroupId || null,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || '提交失败');
            }

            showToast(isEditing ? '分类更新成功' : '分类创建成功', 'success');
            router.push('/admin/products/categories');
            router.refresh();
        } catch (error) {
            console.error('Submit error:', error);
            showToast(error instanceof Error ? error.message : '操作失败', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Filter out self and children from parent selection to avoid cycles (simple check)
    const availableParents = categories.filter(c => c.id !== category?.id);

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        分类名称 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={handleNameChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="输入分类名称"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        URL 别名 (Slug) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono text-sm"
                        placeholder="fen-lei-ming-cheng"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        父级分类
                    </label>
                    <select
                        value={formData.parentId}
                        onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    >
                        <option value="">无 (顶级分类)</option>
                        {availableParents.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        排序权重
                    </label>
                    <input
                        type="number"
                        value={formData.sortOrder}
                        onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-normal text-sm"
                        placeholder="0"
                    />
                    <p className="text-xs text-gray-500">数字越小越靠前</p>
                </div>

                {enableMultiLanguage && (
                    <>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                语言
                            </label>
                            <select
                                value={formData.lang}
                                onChange={(e) => setFormData({ ...formData, lang: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                            >
                                <option value="zh">简体中文 (zh)</option>
                                <option value="en">English (en)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                翻译组
                            </label>
                            <div className="flex gap-2">
                                <select
                                    value={formData.translationGroupId}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === '__new__') {
                                            const newId = `group_${Date.now()}`;
                                            setFormData({ ...formData, translationGroupId: newId });
                                        } else {
                                            setFormData({ ...formData, translationGroupId: val });
                                        }
                                    }}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                >
                                    <option value="">不关联翻译组</option>
                                    <option value="__new__">➕ 创建新翻译组</option>
                                    {translationGroups
                                        .filter(group => group.lang !== formData.lang)
                                        .map(group => (
                                            <option key={group.id} value={group.id}>
                                                {group.label}
                                            </option>
                                        ))}
                                    {formData.translationGroupId && !translationGroups.find(g => g.id === formData.translationGroupId) && (
                                        <option value={formData.translationGroupId}>
                                            当前组: {formData.translationGroupId}
                                        </option>
                                    )}
                                </select>
                            </div>
                            <p className="text-[10px] text-gray-400">相同内容的不同语言版本请选择相同的翻译组</p>
                        </div>
                    </>
                )}

                {!enableMultiLanguage && (
                    <input type="hidden" name="lang" value="zh" />
                )}

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                        描述
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all h-24 resize-none"
                        placeholder="输入分类描述..."
                    />
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    取消
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {isEditing ? '保存更改' : '创建分类'}
                </button>
            </div>
        </form>
    );
}
