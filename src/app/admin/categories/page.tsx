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
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="pl-10 py-4 font-semibold text-gray-700 w-24">排序</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">名称/路径</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 w-48">UUID</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">统计</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">父级</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-right pr-6">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center justify-center">
                                            <FolderTree className="w-12 h-12 text-gray-200 mb-3" />
                                            <p>暂无分类</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category) => (
                                    <tr key={category.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="pl-10 py-5">
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 text-gray-400 font-mono text-xs border border-gray-100 group-hover:bg-blue-50 group-hover:text-blue-500 group-hover:border-blue-100 transition-colors">
                                                {category.sortOrder}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{category.name}</span>
                                                <span className="text-[10px] text-gray-400 font-mono italic">/{category.slug}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <CategoryUuid uuid={category.id} />
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-sm font-semibold text-gray-700">{category._count.articles}</span>
                                                <span className="text-xs text-gray-400">文章</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            {category.parent ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-50 text-gray-500 text-xs border border-gray-100">
                                                    {category.parent.name}
                                                </span>
                                            ) : (
                                                <span className="text-gray-300 text-xs">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-right pr-6">
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
