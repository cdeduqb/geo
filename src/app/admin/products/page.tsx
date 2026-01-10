import { db } from '@/lib/db';
import Link from 'next/link';
import { Plus, Package, Search, ChevronRight, Pencil, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AdminFilters from '../_components/AdminFilters';
import DeleteProductButton from './_components/DeleteProductButton';

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string; status?: string; lang?: string }>;
}) {
    const { page: pageParam, search, status, lang } = await searchParams;
    const page = Number(pageParam) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const i18nSettingsStr = await db.systemSetting.findUnique({ where: { key: 'i18n_settings' } });
    let supportedLocales = ['zh', 'en'];
    if (i18nSettingsStr?.value) {
        try {
            const config = JSON.parse(i18nSettingsStr.value);
            if (Array.isArray(config.supportedLocales)) {
                supportedLocales = config.supportedLocales;
            }
        } catch { }
    }

    const where: any = {};

    if (status) {
        where.status = status;
    }

    if (lang) {
        where.lang = lang;
    }

    if (search) {
        where.OR = [
            { name: { contains: search } },
            { description: { contains: search } },
            { sku: { contains: search } },
        ];
    }

    const [products, total] = await Promise.all([
        db.product.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            include: {
                category: {
                    select: {
                        name: true,
                    },
                },
            },
        }),
        db.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PUBLISHED':
                return <Badge variant="success">已发布</Badge>;
            case 'DRAFT':
                return <Badge variant="warning">草稿</Badge>;
            case 'ARCHIVED':
                return <Badge variant="secondary">已归档</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const formatPrice = (price: any) => {
        return `¥${parseFloat(price).toFixed(2)}`;
    };

    return (
        <div className="space-y-6">
            {/* Page Header & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-100/50">
                        <Package className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">产品管理</h1>
                    </div>
                </div>

                <Link
                    href="/admin/products/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg shadow-blue-100 hover:shadow-blue-200 active:scale-95 flex items-center justify-center gap-2.5"
                >
                    <Plus className="w-5 h-5" />
                    <span>新建产品</span>
                </Link>
            </div>

            {/* Main Content Card: Combined Filters & Table */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm shadow-gray-100/50 overflow-hidden">
                {/* Integrated Filters */}
                <div className="p-8 border-b border-gray-50 bg-gray-50/20">
                    <AdminFilters>
                        <div className="flex-1 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                            <input
                                type="text"
                                name="search"
                                placeholder="搜索产品名称、描述或 SKU..."
                                defaultValue={search}
                                className="w-full pl-11 pr-5 py-3.5 border border-gray-300 bg-white rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-sm placeholder:text-gray-300 shadow-sm"
                            />
                        </div>
                        <div className="relative group min-w-[140px]">
                            <select
                                defaultValue={status || ''}
                                name="status"
                                className="w-full px-6 pr-12 py-3.5 border border-gray-300 bg-white rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-sm text-gray-600 appearance-none shadow-sm"
                            >
                                <option value="">所有状态</option>
                                <option value="PUBLISHED">已发布</option>
                                <option value="DRAFT">草稿</option>
                                <option value="ARCHIVED">已归档</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-focus-within:text-blue-600 transition-colors" />
                        </div>
                        <div className="relative group min-w-[140px]">
                            <select
                                defaultValue={lang || ''}
                                name="lang"
                                className="w-full px-6 pr-12 py-3.5 border border-gray-300 bg-white rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-sm text-gray-600 appearance-none shadow-sm"
                            >
                                <option value="">所有语言</option>
                                {supportedLocales.map(locale => (
                                    <option key={locale} value={locale}>
                                        {locale === 'zh' ? '简体中文 (ZH)' :
                                            locale === 'en' ? 'English (EN)' :
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
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-focus-within:text-blue-600 transition-colors" />
                        </div>
                    </AdminFilters>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-5 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">产品信息</th>
                                <th className="px-6 py-5 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">分类详情</th>
                                <th className="px-6 py-5 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">语言</th>
                                <th className="px-6 py-5 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">排序</th>
                                <th className="px-6 py-5 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">价格体系</th>
                                <th className="px-6 py-5 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">库存</th>
                                <th className="px-6 py-5 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">当前状态</th>
                                <th className="px-8 py-5 text-right text-[11px] font-black text-gray-400 uppercase tracking-widest">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-20 h-20 rounded-[28px] bg-gray-50 flex items-center justify-center text-gray-200">
                                                <Package className="w-10 h-10" />
                                            </div>
                                            <p className="text-gray-400 font-bold">暂无产品数据</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="group hover:bg-blue-50/30 transition-all duration-300">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="relative">
                                                    {product.coverImage ? (
                                                        <img
                                                            src={product.coverImage}
                                                            alt={product.name}
                                                            className="w-16 h-16 rounded-2xl object-cover shadow-sm bg-gray-100 ring-2 ring-white"
                                                        />
                                                    ) : (
                                                        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 ring-2 ring-white">
                                                            <Package className="w-8 h-8" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="font-black text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight">{product.name}</div>
                                                    {product.sku && (
                                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md inline-block">SKU: {product.sku}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            {product.category ? (
                                                <span className="text-sm font-bold text-gray-600 bg-gray-50 px-3 py-1 rounded-xl">
                                                    {product.category.name}
                                                </span>
                                            ) : (
                                                <span className="text-gray-300 text-xs">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-6 font-mono text-xs font-black">
                                            <span className={`px-2 py-1 rounded-lg ${product.lang === 'en' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                                {((product as any).lang || 'zh').toString().toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className="text-sm font-black text-gray-400 font-mono">#{product.sortOrder}</span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="space-y-0.5">
                                                <div className="text-sm font-black text-gray-900">
                                                    {formatPrice(product.price)}
                                                </div>
                                                {product.comparePrice && (
                                                    <div className="text-[10px] text-gray-400 font-bold line-through">
                                                        {formatPrice(product.comparePrice)}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={`text-sm font-black ${product.stock <= 10 ? 'text-red-500' : 'text-gray-600'}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6">
                                            {getStatusBadge(product.status)}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 transition-all">
                                                <Link
                                                    href={`/admin/products/${product.id}`}
                                                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100 shadow-sm hover:shadow-lg"
                                                    title="编辑"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                <DeleteProductButton id={product.id} name={product.name} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                            显示 {skip + 1}-{Math.min(skip + limit, total)} 共 {total} 条
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                href={`?page=${page - 1}`}
                                className={`h-11 px-6 flex items-center justify-center text-xs font-black uppercase tracking-widest rounded-xl transition-all ${page <= 1
                                    ? 'bg-gray-100 text-gray-300 pointer-events-none'
                                    : 'bg-white text-gray-600 border border-gray-100 hover:border-blue-600 hover:text-blue-600 shadow-sm hover:shadow-md'
                                    }`}
                            >
                                上一页
                            </Link>
                            <div className="w-11 h-11 flex items-center justify-center bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-100">
                                {page}
                            </div>
                            <Link
                                href={`?page=${page + 1}`}
                                className={`h-11 px-6 flex items-center justify-center text-xs font-black uppercase tracking-widest rounded-xl transition-all ${page >= totalPages
                                    ? 'bg-gray-100 text-gray-300 pointer-events-none'
                                    : 'bg-white text-gray-600 border border-gray-100 hover:border-blue-600 hover:text-blue-600 shadow-sm hover:shadow-md'
                                    }`}
                            >
                                下一页
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
