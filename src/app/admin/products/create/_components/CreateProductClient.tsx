'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Save, Package } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import Link from 'next/link';

import RichTextEditor from '@/components/ui/RichTextEditor';
import ImageUpload from '@/components/ui/ImageUpload';

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface CreateProductClientProps {
    categories: Category[];
    enableMultiLanguage?: boolean;
    translationGroups?: { id: string; label: string; lang: string }[];
    supportedLocales?: string[];
}

export default function CreateProductClient({
    categories,
    enableMultiLanguage = false,
    translationGroups = [],
    supportedLocales = ['zh', 'en'],
}: CreateProductClientProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        content: '',
        price: '',
        comparePrice: '',
        costPrice: '',
        stock: '0',
        sku: '',
        coverImage: '',
        categoryId: '',
        status: 'DRAFT',
        isFeatured: false,
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
        sortOrder: 0,
        lang: 'zh',
        translationGroupId: '',
    });

    const [images, setImages] = useState<string[]>([]);
    const [attributes, setAttributes] = useState<Record<string, string>>({});
    const [specifications, setSpecifications] = useState<Record<string, string>>({});

    const handleSlugGenerate = () => {
        if (formData.name && !formData.slug) {
            const slug = formData.name
                .toLowerCase()
                .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
                .replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleGalleryChange = (index: number, newUrl: string) => {
        if (!newUrl) {
            setImages(images.filter((_, i) => i !== index));
        } else {
            const newImages = [...images];
            newImages[index] = newUrl;
            setImages(newImages);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.slug || !formData.price) {
            showToast('请填写必填字段', 'error');
            return;
        }

        try {
            setLoading(true);
            const res = await fetch('/api/admin/products', {
                method: 'POST',
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
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || '创建失败');
            }

            showToast('产品创建成功', 'success');
            router.push('/admin/products');
        } catch (error: any) {
            showToast(error.message || '创建失败', 'error');
        } finally {
            setLoading(false);
        }
    };

    // 统一的输入框样式
    const inputClass = "w-full rounded-2xl border border-gray-300 bg-gray-50/50 px-6 py-4 text-sm font-bold text-gray-900 focus:border-blue-600 focus:bg-white transition-all outline-none placeholder:text-gray-300";
    const labelClass = "text-[13px] font-bold text-gray-700 ml-1 block";

    return (
        <div className="space-y-6">
            {/* 页面头部 */}
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
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">新建产品</h1>
                        <p className="text-[13px] text-gray-500 font-medium">
                            填写产品信息并发布
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        form="product-form"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-100 hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        创建产品
                    </button>
                </div>
            </div>

            <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* 基本信息 */}
                        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm ring-1 ring-gray-100/50 p-10">
                            <div className="flex items-center gap-3 mb-8">
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
                                        onBlur={handleSlugGenerate}
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
                                        className={`${inputClass} font-mono`}
                                        placeholder="product-url-slug"
                                        required
                                    />
                                </div>
                                <div className="space-y-3 md:col-span-2">
                                    <label className={labelClass}>
                                        简短描述
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={2}
                                        className={`${inputClass} resize-none`}
                                        placeholder="简短描述产品..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 详细介绍 */}
                        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm ring-1 ring-gray-100/50 p-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-6 bg-purple-600 rounded-full" />
                                <h2 className="text-lg font-black text-gray-900 tracking-tight">详细介绍</h2>
                            </div>
                            <RichTextEditor
                                value={formData.content}
                                onChange={(value) => setFormData({ ...formData, content: value })}
                                placeholder="输入产品详细介绍..."
                            />
                        </div>

                        {/* 价格与库存 */}
                        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm ring-1 ring-gray-100/50 p-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-6 bg-green-600 rounded-full" />
                                <h2 className="text-lg font-black text-gray-900 tracking-tight">价格与库存</h2>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="space-y-3">
                                    <label className={labelClass}>
                                        售价 (¥) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className={inputClass}
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className={labelClass}>
                                        划线价 (¥)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.comparePrice}
                                        onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                                        className={inputClass}
                                    />
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
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className={labelClass}>
                                        库存数量
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                                <div className="space-y-3 md:col-span-2">
                                    <label className={labelClass}>
                                        SKU 编码
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.sku}
                                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                        className={`${inputClass} font-mono`}
                                        placeholder="SKU-001"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 产品图片 */}
                        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm ring-1 ring-gray-100/50 p-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-6 bg-pink-500 rounded-full" />
                                <h2 className="text-lg font-black text-gray-900 tracking-tight">产品图片 ({images.length}/10)</h2>
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                {images.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square">
                                        <ImageUpload value={img} onChange={(url) => handleGalleryChange(idx, url)} className="h-full" />
                                    </div>
                                ))}
                                {images.length < 10 && (
                                    <div className="aspect-square">
                                        <ImageUpload key={images.length} value="" onChange={(url) => { if (url) setImages([...images, url]); }} label="添加图片" className="h-full" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 右侧边栏 */}
                    <div className="space-y-6">
                        {/* 封面图片 */}
                        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm ring-1 ring-gray-100/50 p-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                                <h2 className="text-lg font-black text-gray-900 tracking-tight">封面图片</h2>
                            </div>
                            <ImageUpload
                                value={formData.coverImage}
                                onChange={(url) => setFormData({ ...formData, coverImage: url })}
                                label="上传封面图片"
                                showDescription={true}
                            />
                        </div>

                        {/* 分类与发布 */}
                        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm ring-1 ring-gray-100/50 p-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
                                <h2 className="text-lg font-black text-gray-900 tracking-tight">发布设置</h2>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className={labelClass}>
                                        分类
                                    </label>
                                    <select
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                        className={inputClass}
                                    >
                                        <option value="">选择分类</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className={labelClass}>
                                        状态
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className={inputClass}
                                    >
                                        <option value="DRAFT">草稿</option>
                                        <option value="PUBLISHED">已发布</option>
                                        <option value="ARCHIVED">已归档</option>
                                    </select>
                                </div>

                                {enableMultiLanguage && (
                                    <>
                                        <div className="space-y-3">
                                            <label className={labelClass}>
                                                语言
                                            </label>
                                            <select
                                                value={formData.lang}
                                                onChange={(e) => setFormData({ ...formData, lang: e.target.value })}
                                                className={inputClass}
                                            >
                                                {supportedLocales.map(locale => (
                                                    <option key={locale} value={locale}>
                                                        {locale === 'zh' ? '简体中文' :
                                                            locale === 'en' ? 'English' :
                                                                locale === 'ja' ? '日语' :
                                                                    locale === 'ko' ? '韩语' :
                                                                        locale === 'fr' ? '法语' :
                                                                            locale === 'de' ? '德语' :
                                                                                locale === 'es' ? '西班牙语' :
                                                                                    locale === 'ru' ? '俄语' :
                                                                                        locale === 'pt' ? '葡萄牙语' :
                                                                                            locale === 'ar' ? '阿拉伯语' : locale}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className={labelClass}>
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
                                                className={inputClass}
                                            >
                                                <option value="">不关联翻译组</option>
                                                <option value="__new__">➕ 新建翻译组</option>
                                                {translationGroups
                                                    .filter(group => group.lang !== formData.lang)
                                                    .map(group => (
                                                        <option key={group.id} value={group.id}>{group.label}</option>
                                                    ))}
                                            </select>
                                        </div>
                                    </>
                                )}

                                <div className="flex items-center gap-3 py-4 bg-blue-50 px-5 rounded-2xl border border-blue-100">
                                    <input
                                        type="checkbox"
                                        id="isFeatured"
                                        checked={formData.isFeatured}
                                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                        className="h-5 w-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="isFeatured" className="text-sm font-bold text-blue-700 cursor-pointer">
                                        设为精选产品
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
