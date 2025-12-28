import { db } from '@/lib/db';
import Link from 'next/link';
import { Plus, Pencil, FolderTree } from 'lucide-react';
import DeleteCategoryButton from './_components/DeleteCategoryButton';
import CategoryUuid from './_components/CategoryUuid';

export default async function CategoriesPage() {
    const categories = await db.category.findMany({
        include: {
            parent: true,
            _count: {
                select: { articles: true }
            }
        },
        orderBy: { sortOrder: 'asc' }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">分类管理</h1>
                    <p className="text-sm text-gray-500 mt-1">管理文章分类及其层级结构</p>
                </div>
                <Link
                    href="/admin/categories/create"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    新建分类
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-medium w-20">排序</th>
                                <th className="px-6 py-4 font-medium">UUID</th>
                                <th className="px-6 py-4 font-medium">名称</th>
                                <th className="px-6 py-4 font-medium">Slug</th>
                                <th className="px-6 py-4 font-medium">父级分类</th>
                                <th className="px-6 py-4 font-medium">文章数量</th>
                                <th className="px-6 py-4 font-medium text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <FolderTree className="w-12 h-12 text-gray-300 mb-3" />
                                            <p>暂无分类</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category) => (
                                    <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded bg-gray-100 text-gray-500 text-xs font-mono">
                                                {category.sortOrder}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <CategoryUuid uuid={category.id} />
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {category.name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                                            {category.slug}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {category.parent ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs">
                                                    {category.parent.name}
                                                </span>
                                            ) : (
                                                <span className="text-gray-300">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                {category._count.articles}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/categories/${category.id}`}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="编辑"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                <DeleteCategoryButton
                                                    categoryId={category.id}
                                                    hasArticles={category._count.articles > 0}
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
