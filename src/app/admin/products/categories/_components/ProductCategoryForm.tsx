'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import { Loader2, Save, ListTree, ChevronRight, Info, Layers, Globe, Package, Box } from 'lucide-react';
import Link from 'next/link';

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
    supportedLocales?: string[];
}

export default function ProductCategoryForm({
    category,
    categories,
    enableMultiLanguage = false,
    translationGroups = [],
    supportedLocales = ['zh', 'en'],
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

            showToast(isEditing ? '产品分类更新成功' : '产品分类创建成功', 'success');
            router.push('/admin/products/categories');
            router.refresh();
        } catch (error) {
            console.error('Submit error:', error);
            showToast(error instanceof Error ? error.message : '操作失败', 'error');
        } finally {
            setLoading(false);
        }
    };

    // 样式常量
    const inputClass = "w-full rounded-2xl border border-gray-300 bg-gray-50/50 px-6 py-4 text-sm font-bold text-gray-900 focus:border-blue-600 focus:bg-white transition-all outline-none placeholder:text-gray-300";
    const labelClass = "text-[13px] font-bold text-gray-700 ml-1 block mb-2";
    const cardClass = "bg-white rounded-[32px] border border-gray-100 shadow-sm ring-1 ring-gray-100/50 p-10";

    // Filter out self and children from parent selection to avoid cycles (simple check)
    const availableParents = categories.filter(c => c.id !== category?.id);

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-100">
                        <Box className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">{isEditing ? '编辑产品分类' : '新建产品分类'}</h1>
                        <p className="text-[11px] text-gray-500 font-medium">定制分类层级与目录索引</p>
                    </div>
                </div>

                <div className="flex items-center gap-5">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center rounded-2xl bg-orange-500 px-8 py-3 text-sm font-black text-white shadow-lg shadow-orange-100 hover:bg-orange-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                        {loading ? <Loader2 className="w-4.5 h-4.5 mr-2 animate-spin" /> : <Save className="w-4.5 h-4.5 mr-2" />}
                        {isEditing ? '保存修改' : '创建分类'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className={cardClass}>
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
                            <h2 className="text-lg font-black text-gray-900 tracking-tight">分类核心定义</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className={labelClass}>
                                    展现名称 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={handleNameChange}
                                    className={inputClass}
                                    placeholder="输入分类名称"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <label className={labelClass}>
                                    URL 别名 (Slug) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className={`${inputClass} font-mono text-orange-600`}
                                    placeholder="category-url-slug"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <label className={labelClass}>层级归属 (父级)</label>
                                <select
                                    value={formData.parentId}
                                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                                    className={inputClass}
                                >
                                    <option value="">顶级类目 (Root)</option>
                                    {availableParents.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className={labelClass}>展示权重 (排序)</label>
                                <input
                                    type="number"
                                    value={formData.sortOrder}
                                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                                    className={inputClass}
                                    placeholder="0"
                                />
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1">数值越小排位越靠前</p>
                            </div>

                            <div className="md:col-span-2 space-y-3">
                                <label className={labelClass}>说明性描述</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className={`${inputClass} resize-none leading-relaxed h-32`}
                                    placeholder="描述该分类的特点或适用场景..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {enableMultiLanguage && (
                        <div className={cardClass}>
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-1.5 h-6 bg-purple-600 rounded-full" />
                                <h2 className="text-lg font-black text-gray-900 tracking-tight">国际化资产</h2>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className={labelClass}>目标语种</label>
                                    <select
                                        value={formData.lang}
                                        onChange={(e) => setFormData({ ...formData, lang: e.target.value })}
                                        className={inputClass}
                                    >
                                        {supportedLocales.map(locale => (
                                            <option key={locale} value={locale}>
                                                {locale === 'zh' ? '简体中文 (CN)' :
                                                    locale === 'en' ? 'English (US)' :
                                                        locale === 'ja' ? '日语 (JP)' :
                                                            locale === 'ko' ? '韩语 (KR)' :
                                                                locale === 'fr' ? '法语 (FR)' :
                                                                    locale === 'de' ? '德语 (DE)' :
                                                                        locale === 'es' ? '西班牙语 (ES)' :
                                                                            locale === 'ru' ? '俄语 (RU)' :
                                                                                locale === 'pt' ? '葡萄牙语 (PT)' :
                                                                                    locale === 'ar' ? '阿拉伯语 (AR)' : locale}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className={labelClass}>翻译资产关联组</label>
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
                                        className={inputClass}
                                    >
                                        <option value="">独立类目 (不关联)</option>
                                        <option value="__new__">➕ 开启并分配新组</option>
                                        {translationGroups
                                            .filter(group => group.lang !== formData.lang)
                                            .map(group => (
                                                <option key={group.id} value={group.id}>
                                                    {group.label}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-gray-900 rounded-[32px] p-10 text-white shadow-2xl shadow-orange-100 overflow-hidden relative group">
                        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <Info className="w-6 h-6 text-orange-400" />
                                <h3 className="font-black text-lg">目录结构说明</h3>
                            </div>
                            <ul className="space-y-5">
                                <li className="flex gap-4">
                                    <div className="w-6 h-6 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                                        <Layers className="w-3.5 h-3.5 text-orange-400" />
                                    </div>
                                    <p className="text-xs text-gray-300 font-medium leading-relaxed">
                                        产品分类通常对应网站的前台菜单，建议保持 <span className="text-orange-400 font-bold">简洁直观</span>。
                                    </p>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-6 h-6 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                                        <Globe className="w-3.5 h-3.5 text-orange-400" />
                                    </div>
                                    <p className="text-xs text-gray-300 font-medium leading-relaxed">
                                        更改别名 (Slug) 会导致旧的分类链接 <span className="text-orange-400 font-bold">失效</span>，请谨慎操作已发布的类目。
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </form >
    );
}
