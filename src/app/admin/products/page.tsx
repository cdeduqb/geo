import { db } from '@/lib/db';
import Link from 'next/link';
import { Plus, Package, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AdminFilters from '../_components/AdminFilters';

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string; status?: string; lang?: string }>;
}) {
    const { page: pageParam, search, status, lang } = await searchParams;
    const page = Number(pageParam) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

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
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Package className="w-8 h-8 text-blue-600" />
                        产品管理
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        管理系统中的所有产品信息
                    </p>
                </div>
                <Link
                    href="/admin/products/create"
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    新建产品
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <AdminFilters>
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            name="search"
                            placeholder="搜索产品名称、描述或SKU..."
                            defaultValue={search}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>
                    <select
                        defaultValue={status || ''}
                        name="status"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                        <option value="">所有状态</option>
                        <option value="PUBLISHED">已发布</option>
                        <option value="DRAFT">草稿</option>
                        <option value="ARCHIVED">已归档</option>
                    </select>
                    <select
                        defaultValue={lang || ''}
                        name="lang"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                        <option value="">所有语言</option>
                        <option value="zh">中文</option>
                        <option value="en">English</option>
                    </select>
                </AdminFilters>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                产品
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                分类
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                语言
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                排序
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                价格
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                库存
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                状态
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                操作
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                    暂无产品
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            {product.coverImage && (
                                                <img
                                                    src={product.coverImage}
                                                    alt={product.name}
                                                    className="w-12 h-12 rounded object-cover mr-3"
                                                />
                                            )}
                                            <div>
                                                <div className="font-medium text-gray-900">{product.name}</div>
                                                {product.sku && (
                                                    <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {product.category?.name || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge
                                            variant="outline"
                                            className={`font-mono text-[10px] px-1.5 py-0 border-0 ${(product as any).lang === 'en'
                                                ? 'bg-purple-50 text-purple-700'
                                                : (product as any).lang === 'zh'
                                                    ? 'bg-blue-50 text-blue-700'
                                                    : 'bg-gray-50 text-gray-700'
                                                }`}
                                        >
                                            {((product as any).lang || 'zh').toString().toUpperCase()}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {product.sortOrder}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {formatPrice(product.price)}
                                        </div>
                                        {product.comparePrice && (
                                            <div className="text-xs text-gray-400 line-through">
                                                {formatPrice(product.comparePrice)}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {product.stock}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(product.status)}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <Link
                                            href={`/admin/products/${product.id}`}
                                            className="text-blue-600 hover:text-blue-700 mr-4"
                                        >
                                            编辑
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            显示 {skip + 1} 到 {Math.min(skip + limit, total)} 条，共 {total} 条
                        </div>
                        <div className="flex gap-2">
                            <Link
                                href={`?page=${page - 1}`}
                                className={`px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${page <= 1 ? 'pointer-events-none opacity-50' : ''
                                    }`}
                            >
                                上一页
                            </Link>
                            <Link
                                href={`?page=${page + 1}`}
                                className={`px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${page >= totalPages ? 'pointer-events-none opacity-50' : ''
                                    }`}
                            >
                                下一页
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
