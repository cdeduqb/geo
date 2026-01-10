'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, X, Loader2, Trash2, Plus, ChevronDown, ChevronUp, ChevronRight, Save, Package, Box, DollarSign, Image as ImageIcon, Search, Layout } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import Link from 'next/link';
import RichTextEditor from '@/components/ui/RichTextEditor';
import ImageUpload from '@/components/ui/ImageUpload';

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    content: string | null;
    price: any;
    comparePrice: any;
    costPrice: any;
    stock: number;
    sku: string | null;
    coverImage: string | null;
    images: any;
    categoryId: string | null;
    status: string;
    isFeatured: boolean;
    metaTitle: string | null;
    metaDescription: string | null;
    metaKeywords: string | null;
    attributes: any;
    specifications: any;
    sortOrder: number;
    lang: string;
    translationGroupId: string | null;
}

interface ProductEditFormProps {
    product: Product;
    categories: Category[];
    enableMultiLanguage?: boolean;
    translationGroups?: { id: string; label: string; lang: string }[];
    supportedLocales?: string[];
}

export default function ProductEditForm({
    product,
    categories,
    enableMultiLanguage = false,
    translationGroups = [],
    supportedLocales = ['zh', 'en'],
}: ProductEditFormProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [seoExpanded, setSeoExpanded] = useState(false);

    // 样式常量
    const inputClass = "w-full rounded-2xl border border-gray-300 bg-gray-50/50 px-6 py-4 text-sm font-bold text-gray-900 focus:border-blue-600 focus:bg-white transition-all outline-none placeholder:text-gray-300";
    const labelClass = "text-[13px] font-bold text-gray-700 ml-1 block";
    const selectClass = "w-full rounded-2xl border border-gray-300 bg-gray-50/50 px-6 py-4 text-sm font-bold text-gray-900 focus:border-blue-600 focus:bg-white transition-all outline-none";
    const cardClass = "bg-white rounded-[32px] border border-gray-100 shadow-sm ring-1 ring-gray-100/50 p-10";

    // 解析图片数组
    const parseImages = (images: any): string[] => {
        if (!images) return [];
        if (Array.isArray(images)) {
            return images.filter((img): img is string => typeof img === 'string');
        }
        return [];
    };

    // 解析JSON对象
    const parseJsonObject = (data: any): Record<string, string> => {
        if (!data) return {};
        if (typeof data === 'object' && !Array.isArray(data)) return data;
        try {
            return JSON.parse(data as string);
        } catch {
            return {};
        }
    };

    const [formData, setFormData] = useState({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        content: product.content || '',
        price: product.price.toString(),
        comparePrice: product.comparePrice?.toString() || '',
        costPrice: product.costPrice?.toString() || '',
        stock: product.stock.toString(),
        sku: product.sku || '',
        coverImage: product.coverImage || '',
        categoryId: product.categoryId || '',
        status: product.status,
        isFeatured: product.isFeatured,
        metaTitle: product.metaTitle || '',
        metaDescription: product.metaDescription || '',
        metaKeywords: product.metaKeywords || '',
        sortOrder: product.sortOrder || 0,
        lang: product.lang || 'zh',
        translationGroupId: product.translationGroupId || '',
    });

    const [images, setImages] = useState<string[]>(parseImages(product.images));
    const [attributes, setAttributes] = useState<Record<string, string>>(parseJsonObject(product.attributes));
    const [specifications, setSpecifications] = useState<Record<string, string>>(parseJsonObject(product.specifications));

    const handleGalleryChange = (index: number, newUrl: string) => {
        if (!newUrl) {
            setImages(images.filter((_, i) => i !== index));
        } else {
            const newImages = [...images];
            newImages[index] = newUrl;
            setImages(newImages);
        }
    };

    const addAttribute = () => {
        const key = `属性${Object.keys(attributes).length + 1}`;
        setAttributes({ ...attributes, [key]: '' });
    };

    const updateAttribute = (oldKey: string, newKey: string, value: string) => {
        const newAttrs = { ...attributes };
        if (oldKey !== newKey) {
            delete newAttrs[oldKey];
        }
        newAttrs[newKey] = value;
        setAttributes(newAttrs);
    };

    const removeAttribute = (key: string) => {
        const newAttrs = { ...attributes };
        delete newAttrs[key];
        setAttributes(newAttrs);
    };

    const addSpecification = () => {
        const key = `规格${Object.keys(specifications).length + 1}`;
        setSpecifications({ ...specifications, [key]: '' });
    };

    const updateSpecification = (oldKey: string, newKey: string, value: string) => {
        const newSpecs = { ...specifications };
        if (oldKey !== newKey) {
            delete newSpecs[oldKey];
        }
        newSpecs[newKey] = value;
        setSpecifications(newSpecs);
    };

    const removeSpecification = (key: string) => {
        const newSpecs = { ...specifications };
        delete newSpecs[key];
        setSpecifications(newSpecs);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.slug || !formData.price) {
            showToast('请填写必填字段', 'error');
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`/api/admin/products/${product.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
                    costPrice: formData.costPrice ? parseFloat(formData.costPrice) : null,
                    stock: parseInt(formData.stock),
                    images: images.length > 0 ? images : null,
                    attributes: Object.keys(attributes).length > 0 ? attributes : null,
                    specifications: Object.keys(specifications).length > 0 ? specifications : null,
                    metaTitle: formData.metaTitle || null,
                    metaDescription: formData.metaDescription || null,
                    metaKeywords: formData.metaKeywords || null,
                    sortOrder: formData.sortOrder,
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || '更新失败');
            }

            showToast('产品更新成功', 'success');
            router.push('/admin/products');
            router.refresh();
        } catch (error: any) {
            showToast(error.message || '更新失败', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/products"
                        className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Link>
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">编辑产品</h1>
                        <p className="text-[13px] text-gray-500 font-medium">修改核心产品参数与视觉资产</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-100 hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-95"
                    >
                        {loading ? <Loader2 className="w-4.5 h-4.5 mr-2 animate-spin" /> : <Save className="w-4.5 h-4.5 mr-2" />}
                        保存所有更改
                    </button>
                    <div className="hidden sm:flex items-center gap-2 text-xs">
                        <span className="text-gray-400 font-medium">产品管理</span>
                        <ChevronRight className="w-3 h-3 text-gray-300" />
                        <span className="text-blue-600 font-bold bg-blue-50 px-2.5 py-1 rounded-md">编辑模式</span>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Basic Info */}
                        <div className={cardClass}>
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                                <h2 className="text-lg font-black text-gray-900 tracking-tight">基本信息</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className={labelClass}>
                                        产品名称 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={inputClass}
                                        placeholder="输入产品名称"
                                        required
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className={labelClass}>
                                        URL 别名 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className={`${inputClass} font-mono text-blue-600`}
                                        placeholder="product-url-slug"
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-3">
                                    <label className={labelClass}>
                                        简短描述
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className={`${inputClass} resize-none leading-relaxed`}
                                        placeholder="输入针对列表页或SEO的简短描述..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Rich Content */}
                        <div className={cardClass}>
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-1.5 h-6 bg-purple-600 rounded-full" />
                                <h2 className="text-lg font-black text-gray-900 tracking-tight">详细介绍</h2>
                            </div>
                            <div className="rounded-[28px] border border-gray-100 overflow-hidden ring-1 ring-gray-100/50">
                                <RichTextEditor
                                    value={formData.content}
                                    onChange={(value) => setFormData({ ...formData, content: value })}
                                    placeholder="输入产品的详细功能、优势及技术指标..."
                                />
                            </div>
                        </div>

                        {/* Pricing & Inventory */}
                        <div className={cardClass}>
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
                                <h2 className="text-lg font-black text-gray-900 tracking-tight">价格与库存</h2>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                <div className="space-y-3">
                                    <label className={labelClass}>
                                        售价 (¥) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600 font-bold group-focus-within:text-emerald-500 transition-colors">¥</div>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className={`${inputClass} pl-10`}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className={labelClass}>
                                        划线价 (¥)
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold group-focus-within:text-gray-500 transition-colors">¥</div>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.comparePrice}
                                            onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                                            className={`${inputClass} pl-10 text-gray-400`}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className={labelClass}>
                                        成本价 (¥)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.costPrice}
                                        onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                                        className={inputClass}
                                        placeholder="内部参考"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className={labelClass}>
                                        当前库存
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-3">
                                    <label className={labelClass}>
                                        SKU 物料编码
                                    </label>
                                    <div className="relative group">
                                        <Box className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            type="text"
                                            value={formData.sku}
                                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                            className={`${inputClass} pl-12 font-mono uppercase tracking-widest`}
                                            placeholder="SKU-888-999"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Gallery */}
                        <div className={cardClass}>
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-1.5 h-6 bg-pink-500 rounded-full" />
                                <h2 className="text-lg font-black text-gray-900 tracking-tight">产品图集 ({images.length}/10)</h2>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                {images.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square group">
                                        <ImageUpload
                                            value={img}
                                            onChange={(url) => handleGalleryChange(idx, url)}
                                            className="h-full rounded-2xl overflow-hidden"
                                        />
                                    </div>
                                ))}

                                {images.length < 10 && (
                                    <div className="aspect-square">
                                        <ImageUpload
                                            key={images.length}
                                            value=""
                                            onChange={(url) => {
                                                if (url) setImages([...images, url]);
                                            }}
                                            label="添加图片"
                                            className="h-full rounded-2xl"
                                        />
                                    </div>
                                )}
                            </div>
                            <p className="mt-6 text-[11px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50/50 px-4 py-2 rounded-lg inline-block">建议使用 800x800 正方形清晰图片</p>
                        </div>

                        {/* Attributes & Specifications */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className={cardClass}>
                                <div className="flex items-center justify-between mb-10">
                                    <h2 className="text-lg font-black text-gray-900 tracking-tight">产品属性</h2>
                                    <button
                                        type="button"
                                        onClick={addAttribute}
                                        className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {Object.entries(attributes).length === 0 ? (
                                        <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-[28px] text-gray-300">
                                            <Box className="w-8 h-8 mb-2 opacity-50" />
                                            <p className="text-xs font-bold">暂无自定义属性</p>
                                        </div>
                                    ) : (
                                        Object.entries(attributes).map(([key, value]) => (
                                            <div key={key} className="flex gap-2 animate-in slide-in-from-right-2 duration-300">
                                                <input
                                                    type="text"
                                                    value={key}
                                                    onChange={(e) => updateAttribute(key, e.target.value, value)}
                                                    className="flex-1 rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-xs font-bold outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
                                                    placeholder="属性名"
                                                />
                                                <input
                                                    type="text"
                                                    value={value}
                                                    onChange={(e) => updateAttribute(key, key, e.target.value)}
                                                    className="flex-1 rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-xs font-bold outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 text-blue-600"
                                                    placeholder="属性值"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeAttribute(key)}
                                                    className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <X className="w-4.5 h-4.5" />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className={cardClass}>
                                <div className="flex items-center justify-between mb-10">
                                    <h2 className="text-lg font-black text-gray-900 tracking-tight">技术参数</h2>
                                    <button
                                        type="button"
                                        onClick={addSpecification}
                                        className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {Object.entries(specifications).length === 0 ? (
                                        <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-[28px] text-gray-300">
                                            <Layout className="w-8 h-8 mb-2 opacity-50" />
                                            <p className="text-xs font-bold">暂无技术指标</p>
                                        </div>
                                    ) : (
                                        Object.entries(specifications).map(([key, value]) => (
                                            <div key={key} className="flex gap-2 animate-in slide-in-from-right-2 duration-300">
                                                <input
                                                    type="text"
                                                    value={key}
                                                    onChange={(e) => updateSpecification(key, e.target.value, value)}
                                                    className="flex-1 rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-xs font-bold outline-none focus:bg-white focus:ring-1 focus:ring-purple-500"
                                                    placeholder="指标名"
                                                />
                                                <input
                                                    type="text"
                                                    value={value}
                                                    onChange={(e) => updateSpecification(key, key, e.target.value)}
                                                    className="flex-1 rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-xs font-bold outline-none focus:bg-white focus:ring-1 focus:ring-purple-500 text-purple-600"
                                                    placeholder="指标值"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeSpecification(key)}
                                                    className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <X className="w-4.5 h-4.5" />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Cover Image */}
                        <div className={cardClass}>
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                                <h2 className="text-lg font-black text-gray-900 tracking-tight">产品主图</h2>
                            </div>
                            <ImageUpload
                                value={formData.coverImage}
                                onChange={(url) => setFormData({ ...formData, coverImage: url })}
                                label="上传高清封面"
                                showDescription={true}
                                className="rounded-2xl"
                            />
                        </div>

                        {/* Status & Categorization */}
                        <div className={cardClass}>
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
                                <h2 className="text-lg font-black text-gray-900 tracking-tight">发布控制</h2>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className={labelClass}>发布状态</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className={selectClass}
                                    >
                                        <option value="DRAFT">草稿模式</option>
                                        <option value="PUBLISHED">立即发布</option>
                                        <option value="ARCHIVED">内部归档</option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className={labelClass}>所属分类</label>
                                    <select
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                        className={selectClass}
                                    >
                                        <option value="">未分类</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className={labelClass}>展示顺序</label>
                                    <input
                                        type="number"
                                        value={formData.sortOrder}
                                        onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                                        className={inputClass}
                                        placeholder="0"
                                    />
                                    <p className="px-1 text-[10px] text-gray-400 font-bold uppercase tracking-widest">数值越小排位越靠前</p>
                                </div>

                                {enableMultiLanguage && (
                                    <div className="pt-8 border-t border-gray-50 space-y-8">
                                        <div className="space-y-3">
                                            <label className={labelClass}>数据语种</label>
                                            <select
                                                value={formData.lang}
                                                onChange={(e) => setFormData({ ...formData, lang: e.target.value })}
                                                className={selectClass}
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
                                            <label className={labelClass}>内容关联组 (I18n)</label>
                                            <select
                                                value={formData.translationGroupId}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val === '__new__') {
                                                        setFormData({ ...formData, translationGroupId: `group_${Date.now()}` });
                                                    } else {
                                                        setFormData({ ...formData, translationGroupId: val });
                                                    }
                                                }}
                                                className={selectClass}
                                            >
                                                <option value="">独立内容 (不关联)</option>
                                                <option value="__new__">➕ 创建并关联新组</option>
                                                {translationGroups
                                                    .filter(group => group.lang !== formData.lang)
                                                    .map(group => (
                                                        <option key={group.id} value={group.id}>{group.label}</option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-4 p-6 bg-blue-50/50 rounded-[28px] border border-blue-100 shadow-inner group cursor-pointer" onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}>
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${formData.isFeatured ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110' : 'bg-white text-gray-300 border border-gray-100'}`}>
                                        <Package className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-black text-blue-900 select-none">设为官方竞选</p>
                                        <p className="text-[10px] text-blue-600 font-bold opacity-60 uppercase tracking-tighter select-none">Set as Featured</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={formData.isFeatured}
                                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SEO Tools */}
                        <div className={`${cardClass} transition-all duration-500 overflow-hidden ${seoExpanded ? '' : 'p-0 h-[88px]'}`}>
                            <button
                                type="button"
                                onClick={() => setSeoExpanded(!seoExpanded)}
                                className="w-full h-[88px] px-10 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                                        <Search className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <h2 className="text-base font-black text-gray-900 tracking-tight">产品搜索优化 (SEO)</h2>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Meta Tags & Search Ranking</p>
                                    </div>
                                </div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-500 ${seoExpanded ? 'rotate-180 bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    <ChevronDown className="w-5 h-5" />
                                </div>
                            </button>

                            <div className="p-10 pt-4 space-y-8 border-t border-gray-50">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between ml-1">
                                        <label className={labelClass}>SEO 标题</label>
                                        <span className={`text-[10px] font-black uppercase tracking-tighter ${formData.metaTitle.length > 50 ? 'text-orange-500' : 'text-gray-400'}`}>
                                            {formData.metaTitle.length} / 60
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.metaTitle}
                                        onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                        maxLength={60}
                                        className={inputClass}
                                        placeholder="搜索引擎显示的标题"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between ml-1">
                                        <label className={labelClass}>SEO 描述</label>
                                        <span className={`text-[10px] font-black uppercase tracking-tighter ${formData.metaDescription.length > 140 ? 'text-orange-500' : 'text-gray-400'}`}>
                                            {formData.metaDescription.length} / 160
                                        </span>
                                    </div>
                                    <textarea
                                        value={formData.metaDescription}
                                        onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                        maxLength={160}
                                        rows={4}
                                        className={`${inputClass} resize-none leading-relaxed`}
                                        placeholder="用于提高搜索点击率的网页摘要..."
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className={labelClass}>SEO 关键词</label>
                                    <input
                                        type="text"
                                        value={formData.metaKeywords}
                                        onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                                        className={inputClass}
                                        placeholder="产品, 核心词1, 关键词2"
                                    />
                                    <p className="px-1 text-[10px] text-gray-400 font-bold uppercase tracking-widest">使用半角逗号分隔多个词汇</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
