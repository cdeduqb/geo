import { db } from '@/lib/db';
import Link from 'next/link';
import { Plus, Pencil, FolderTree } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import DeleteCategoryButton from './_components/DeleteCategoryButton';
import AdminFilters from '../../_components/AdminFilters';

export default async function ProductCategoriesPage({
    searchParams,
}: {
    searchParams: Promise<{ lang?: string }>;
}) {
    const { lang } = await searchParams;
    const where = lang ? { lang } : {};

    const categories = await (db.productCategory as any).findMany({
        where,
        include: {
            parent: true,
            _count: {
                select: {
                    products: true,
                    children: true
                }
            }
        },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">产品分类</h1>
                    <p className="text-sm text-gray-500 mt-1">管理产品分类及其层级结构</p>
                </div>
                <Link
                    href="/admin/products/categories/create"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    新建分类
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <AdminFilters>
                    <select
                        defaultValue={lang || ''}
                        name="lang"
                        className="w-40 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-gray-50"
                    >
                        <option value="">所有语言</option>
                        <option value="zh">简体中文 (zh)</option>
                        <option value="en">English (en)</option>
                    </select>
                </AdminFilters>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-medium">名称</th>
                                <th className="px-6 py-4 font-medium">Slug</th>
                                <th className="px-6 py-4 font-medium">父级分类</th>
                                <th className="px-6 py-4 font-medium">语言</th>
                                <th className="px-6 py-4 font-medium">排序</th>
                                <th className="px-6 py-4 font-medium">产品数量</th>
                                <th className="px-6 py-4 font-medium text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <FolderTree className="w-12 h-12 text-gray-300 mb-3" />
                                            <p>暂无分类</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category: any) => (
                                    <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {category.name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                                            {category.slug}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {(category as any).parent ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs">
                                                    {(category as any).parent.name}
                                                </span>
                                            ) : (
                                                <span className="text-gray-300">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {category.sortOrder}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                variant="outline"
                                                className={`font-mono text-[10px] px-1.5 py-0 border-0 ${(category as any).lang === 'en'
                                                    ? 'bg-purple-50 text-purple-700'
                                                    : (category as any).lang === 'zh'
                                                        ? 'bg-blue-50 text-blue-700'
                                                        : 'bg-gray-50 text-gray-700'
                                                    }`}
                                            >
                                                {((category as any).lang || 'zh').toString().toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                {(category as any)._count.products}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/products/categories/${category.id}`}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="编辑"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                <DeleteCategoryButton
                                                    categoryId={category.id}
                                                    hasProducts={(category as any)._count.products > 0}
                                                    hasChildren={(category as any)._count.children > 0}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
