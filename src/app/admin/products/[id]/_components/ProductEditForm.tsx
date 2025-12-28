'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, X, Loader2, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
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
}

export default function ProductEditForm({
    product,
    categories,
    enableMultiLanguage = false,
    translationGroups = [],
}: ProductEditFormProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [seoExpanded, setSeoExpanded] = useState(false);
    const [advancedExpanded, setAdvancedExpanded] = useState(false);

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

    // Images state logic simplified
    // handleImageUpload and handleAddImage are removed in favor of direct ImageUpload usage or simple wrappers

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

        // SEO字段验证
        if (formData.metaTitle && formData.metaTitle.length > 60) {
            showToast('SEO标题不能超过60个字符', 'error');
            return;
        }

        if (formData.metaDescription && formData.metaDescription.length > 160) {
            showToast('SEO描述不能超过160个字符', 'error');
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
        } catch (error: any) {
            showToast(error.message || '更新失败', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('确定要删除这个产品吗？此操作不可撤销。')) return;

        try {
            setDeleting(true);
            const res = await fetch(`/api/admin/products/${product.id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('删除失败');

            showToast('产品删除成功', 'success');
            router.push('/admin/products');
        } catch (error) {
            showToast('删除失败', 'error');
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/products"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">编辑产品</h1>
                        <p className="text-sm text-gray-500">修改产品信息</p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                    {deleting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            删除中...
                        </>
                    ) : (
                        <>
                            <Trash2 className="w-4 h-4" />
                            删除产品
                        </>
                    )}
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900">基本信息</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    产品名称 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    URL 别名 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    简短描述
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                                />
                            </div>



                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">
                                    详细介绍
                                </label>
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <RichTextEditor
                                        value={formData.content}
                                        onChange={(value) => setFormData({ ...formData, content: value })}
                                        placeholder="输入产品详细介绍..."
                                    />
                                </div>
                            </div>

                        </div>

                        {/* Pricing & Inventory */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900">价格与库存</h2>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        售价 (¥) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        划线价 (¥)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.comparePrice}
                                        onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        成本价 (¥)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.costPrice}
                                        onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        placeholder="可选"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        库存数量
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        SKU
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.sku}
                                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        placeholder="可选"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Product Images */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900">产品图片 ({images.length}/10)</h2>

                            <div className="grid grid-cols-4 gap-4">
                                {images.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square">
                                        <ImageUpload
                                            value={img}
                                            onChange={(url) => handleGalleryChange(idx, url)}
                                            className="h-full"
                                        />
                                    </div>
                                ))}

                                {images.length < 10 && (
                                    <div className="aspect-square">
                                        <ImageUpload
                                            key={images.length} // Force reset on new add
                                            value=""
                                            onChange={(url) => {
                                                if (url) setImages([...images, url]);
                                            }}
                                            label="添加图片"
                                            className="h-full"
                                        />
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-gray-500">* 每张图片最大5MB</p>
                        </div>

                        {/* Product Attributes */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">产品属性</h2>
                                <button
                                    type="button"
                                    onClick={addAttribute}
                                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                                >
                                    <Plus className="w-4 h-4" />
                                    添加属性
                                </button>
                            </div>

                            {Object.entries(attributes).length === 0 ? (
                                <p className="text-sm text-gray-500">暂无属性，点击"添加属性"开始</p>
                            ) : (
                                <div className="space-y-2">
                                    {Object.entries(attributes).map(([key, value]) => (
                                        <div key={key} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={key}
                                                onChange={(e) => updateAttribute(key, e.target.value, value)}
                                                placeholder="属性名 (如: 颜色)"
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                            />
                                            <input
                                                type="text"
                                                value={value}
                                                onChange={(e) => updateAttribute(key, key, e.target.value)}
                                                placeholder="属性值 (如: 红色)"
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeAttribute(key)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Specifications */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">产品规格</h2>
                                <button
                                    type="button"
                                    onClick={addSpecification}
                                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                                >
                                    <Plus className="w-4 h-4" />
                                    添加规格
                                </button>
                            </div>

                            {Object.entries(specifications).length === 0 ? (
                                <p className="text-sm text-gray-500">暂无规格，点击"添加规格"开始</p>
                            ) : (
                                <div className="space-y-2">
                                    {Object.entries(specifications).map(([key, value]) => (
                                        <div key={key} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={key}
                                                onChange={(e) => updateSpecification(key, e.target.value, value)}
                                                placeholder="规格名 (如: 重量)"
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                            />
                                            <input
                                                type="text"
                                                value={value}
                                                onChange={(e) => updateSpecification(key, key, e.target.value)}
                                                placeholder="规格值 (如: 500g)"
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeSpecification(key)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Cover Image */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900">封面图片</h2>

                            <h2 className="text-lg font-semibold text-gray-900">封面图片</h2>

                            <ImageUpload
                                value={formData.coverImage}
                                onChange={(url) => setFormData({ ...formData, coverImage: url })}
                                label="上传封面图片"
                                showDescription={true}
                            />
                        </div>

                        {/* Category */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900">分类与排序</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    分类
                                </label>
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                >
                                    <option value="">选择分类</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    排序权重
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={formData.sortOrder}
                                        onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        placeholder="0"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">数字越小越靠前</p>
                            </div>
                        </div>

                        {/* SEO Settings */}
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setSeoExpanded(!seoExpanded)}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <h2 className="text-lg font-semibold text-gray-900">SEO 设置</h2>
                                {seoExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>

                            {seoExpanded && (
                                <div className="px-6 pb-6 space-y-4 border-t border-gray-200">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                SEO 标题
                                            </label>
                                            <span className="text-xs text-gray-500">
                                                {formData.metaTitle.length}/60
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.metaTitle}
                                            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                            maxLength={60}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                            placeholder="搜索引擎显示的标题"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                SEO 描述
                                            </label>
                                            <span className="text-xs text-gray-500">
                                                {formData.metaDescription.length}/160
                                            </span>
                                        </div>
                                        <textarea
                                            value={formData.metaDescription}
                                            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                            maxLength={160}
                                            rows={3}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-sm"
                                            placeholder="搜索引擎显示的描述"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            SEO 关键词
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.metaKeywords}
                                            onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                            placeholder="关键词1, 关键词2, 关键词3"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">用逗号分隔多个关键词</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Publish */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900">发布设置</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    状态
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                >
                                    <option value="DRAFT">草稿</option>
                                    <option value="PUBLISHED">已发布</option>
                                    <option value="ARCHIVED">已归档</option>
                                </select>
                            </div>

                            {enableMultiLanguage && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            语言
                                        </label>
                                        <select
                                            value={formData.lang}
                                            onChange={(e) => setFormData({ ...formData, lang: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        >
                                            <option value="zh">简体中文 (zh)</option>
                                            <option value="en">English (en)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            翻译组
                                        </label>
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
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
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
                                        <p className="mt-1 text-[10px] text-gray-400">相同内容的不同语言版本请选择相同的翻译组</p>
                                    </div>
                                </>
                            )}

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isFeatured"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="isFeatured" className="ml-2 text-sm text-gray-700">
                                    设为精选产品
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        保存中...
                                    </>
                                ) : (
                                    '保存更改'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form >
        </div >
    );
}
