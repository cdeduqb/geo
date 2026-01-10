import { db } from '@/lib/db';
import Link from 'next/link';
import { Plus, Pencil, FolderTree, ChevronRight, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import DeleteCategoryButton from './_components/DeleteCategoryButton';
import AdminFilters from '../../_components/AdminFilters';
import CopyableId from './_components/CopyableId';

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
            {/* Page Header & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-100/50">
                        <FolderTree className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">产品分类</h1>
                    </div>
                </div>

                <Link
                    href="/admin/products/categories/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg shadow-blue-100 hover:shadow-blue-200 active:scale-95 flex items-center justify-center gap-2.5"
                >
                    <Plus className="w-5 h-5" />
                    <span>新建分类</span>
                </Link>
            </div>

            {/* Main Content Card: Combined Filters & Table */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm shadow-gray-100/50 overflow-hidden">
                {/* Integrated Filters */}
                <div className="p-8 border-b border-gray-50 bg-gray-50/20">
                    <AdminFilters>
                        <div className="relative group min-w-[180px]">
                            <select
                                defaultValue={lang || ''}
                                name="lang"
                                className="w-full px-6 pr-12 py-3.5 border border-gray-300 bg-white rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-sm text-gray-600 appearance-none shadow-sm"
                            >
                                <option value="">所有语言</option>
                                <option value="zh">简体中文 (ZH)</option>
                                <option value="en">English (EN)</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-focus-within:text-blue-600 transition-colors" />
                        </div>
                    </AdminFilters>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-10 py-5 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest w-24">排序</th>
                                <th className="px-6 py-5 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">分类基本信息</th>
                                <th className="px-6 py-5 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest w-48">唯一标识 ID</th>
                                <th className="px-6 py-5 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">数量统计</th>
                                <th className="px-6 py-5 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">父级结构</th>
                                <th className="px-10 py-5 text-right text-[11px] font-black text-gray-400 uppercase tracking-widest">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-10 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-20 h-20 rounded-[28px] bg-gray-50 flex items-center justify-center text-gray-200">
                                                <FolderTree className="w-10 h-10" />
                                            </div>
                                            <p className="text-gray-400 font-bold">暂无分类数据</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category: any) => (
                                    <tr key={category.id} className="group hover:bg-blue-50/30 transition-all duration-300">
                                        <td className="px-10 py-6">
                                            <span className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center font-mono text-xs font-black text-gray-400 border border-gray-100 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 group-hover:shadow-lg group-hover:shadow-blue-100 transition-all">
                                                {category.sortOrder}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-black text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight">{category.name}</span>
                                                    <span className={`px-2 py-0.5 rounded-lg font-mono text-[10px] font-black uppercase tracking-widest ${category.lang === 'en' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                                        {(category.lang || 'zh').toString().toUpperCase()}
                                                    </span>
                                                </div>
                                                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter opacity-70">Slug: /{category.slug}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <CopyableId id={category.id} />
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2 bg-gray-50 w-fit px-3 py-1 rounded-xl ring-1 ring-gray-100">
                                                <span className="text-sm font-black text-gray-900 font-mono">{category._count.products}</span>
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">产品</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            {category.parent ? (
                                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-blue-50 text-blue-600 text-[11px] font-black uppercase tracking-widest ring-1 ring-blue-100">
                                                    <FolderTree className="w-3 h-3" />
                                                    {category.parent.name}
                                                </span>
                                            ) : (
                                                <span className="text-gray-300 text-xs font-black">顶级</span>
                                            )}
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                                <Link
                                                    href={`/admin/products/categories/${category.id}`}
                                                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100 shadow-sm hover:shadow-lg"
                                                    title="编辑"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                <DeleteCategoryButton
                                                    categoryId={category.id}
                                                    hasProducts={category._count.products > 0}
                                                    hasChildren={category._count.children > 0}
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
