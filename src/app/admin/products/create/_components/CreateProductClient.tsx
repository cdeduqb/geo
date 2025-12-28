'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, X, Loader2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
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
}

export default function CreateProductClient({
    categories,
    enableMultiLanguage = false,
    translationGroups = [],
}: CreateProductClientProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [seoExpanded, setSeoExpanded] = useState(false);

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

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">新建产品</h1>
                    <p className="text-sm text-gray-500">填写产品信息并发布</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900">基本信息</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">产品名称 <span className="text-red-500">*</span></label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} onBlur={handleSlugGenerate} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">URL 别名 <span className="text-red-500">*</span></label>
                                <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">简短描述</label>
                                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none resize-none" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">详细介绍</label>
                                <RichTextEditor value={formData.content} onChange={(value) => setFormData({ ...formData, content: value })} placeholder="输入产品详细介绍..." />
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900">价格与库存</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-gray-700 mb-2">售价 (¥) *</label><input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" required /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-2">划线价 (¥)</label><input type="number" step="0.01" value={formData.comparePrice} onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-2">成本价 (¥)</label><input type="number" step="0.01" value={formData.costPrice} onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-2">库存数量</label><input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" /></div>
                                <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">SKU</label><input type="text" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" /></div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900">产品图片 ({images.length}/10)</h2>
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

                    <div className="space-y-6">
                        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900">封面图片</h2>
                            <ImageUpload value={formData.coverImage} onChange={(url) => setFormData({ ...formData, coverImage: url })} label="上传封面图片" showDescription={true} />
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900">分类与发布</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
                                <select value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none">
                                    <option value="">选择分类</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">状态</label>
                                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none">
                                    <option value="DRAFT">草稿</option>
                                    <option value="PUBLISHED">已发布</option>
                                    <option value="ARCHIVED">已归档</option>
                                </select>
                            </div>

                            {enableMultiLanguage && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">语言</label>
                                        <select value={formData.lang} onChange={(e) => setFormData({ ...formData, lang: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none">
                                            <option value="zh">简体中文 (zh)</option>
                                            <option value="en">English (en)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">翻译组</label>
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
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none text-sm"
                                        >
                                            <option value="">不关联翻译组</option>
                                            <option value="__new__">➕ 创建新翻译组</option>
                                            {translationGroups
                                                .filter(group => group.lang !== formData.lang)
                                                .map(group => (
                                                    <option key={group.id} value={group.id}>{group.label}</option>
                                                ))}
                                            {formData.translationGroupId && !translationGroups.find(g => g.id === formData.translationGroupId) && (
                                                <option value={formData.translationGroupId}>当前组: {formData.translationGroupId}</option>
                                            )}
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="isFeatured" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} className="w-4 h-4 text-blue-600 rounded" />
                                <label htmlFor="isFeatured" className="text-sm text-gray-700">设为精选产品</label>
                            </div>
                            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '创建产品'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
