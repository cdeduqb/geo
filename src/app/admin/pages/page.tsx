import { db } from '@/lib/db';
import Link from 'next/link';
import { Plus, Search, Trash2, Eye, File, ChevronRight, Pencil, ChevronDown } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import DeletePageButton from './_components/DeletePageButton';
import CleanupPagesButton from './_components/CleanupPagesButton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import AdminFilters from '../_components/AdminFilters';

export default async function PagesPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; q?: string; status?: string; lang?: string }>;
}) {
    const { page: pageParam, q, status: statusParam, lang } = await searchParams;
    const page = Number(pageParam) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const query = q || '';
    const status = statusParam;

    const where = {
        AND: [
            query ? { title: { contains: query } } : {},
            status ? { status: status as any } : {},
            lang ? { lang } : {},
            // 排除系统生成的临时页面
            {
                slug: {
                    not: {
                        startsWith: 'temp-'
                    }
                }
            }
        ],
    };

    const [pages, total] = await Promise.all([
        db.page.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        }),
        db.page.count({ where }),
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

    return (
        <div className="space-y-6">
            {/* Page Header & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-100/50">
                        <File className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">页面管理</h1>
                    </div>
                </div>

                <Link
                    href="/admin/pages/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg shadow-blue-100 hover:shadow-blue-200 active:scale-95 flex items-center justify-center gap-2.5"
                >
                    <Plus className="w-5 h-5" />
                    <span>新建页面</span>
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
                                name="q"
                                placeholder="搜索页面标题名称或标识 slug..."
                                defaultValue={query}
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
                                <option value="zh">简体中文 (ZH)</option>
                                <option value="en">English (EN)</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-focus-within:text-blue-600 transition-colors" />
                        </div>
                    </AdminFilters>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50 border-b border-gray-100 hover:bg-transparent">
                                <TableHead className="px-10 py-5 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">页面基础信息</TableHead>
                                <TableHead className="px-6 py-5 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">语言/模板类型</TableHead>
                                <TableHead className="px-6 py-5 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">发布状态</TableHead>
                                <TableHead className="px-6 py-5 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">更新时间</TableHead>
                                <TableHead className="px-10 py-5 text-right text-[11px] font-black text-gray-400 uppercase tracking-widest">操作</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100">
                            {pages.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="px-10 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-20 h-20 rounded-[28px] bg-gray-50 flex items-center justify-center text-gray-200">
                                                <File className="w-10 h-10" />
                                            </div>
                                            <p className="text-gray-400 font-bold">暂无页面数据</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pages.map((page: any) => (
                                    <TableRow
                                        key={page.id}
                                        className="group hover:bg-blue-50/30 transition-all duration-300 border-none"
                                    >
                                        <TableCell className="px-10 py-6">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="font-black text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight text-base">{page.title}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100 font-mono italic opacity-70 group-hover:bg-blue-100/50 group-hover:text-blue-600 group-hover:border-blue-200 transition-all opacity-80 group-hover:opacity-100">
                                                        Slug: /{page.slug}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-6">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-2 py-0.5 rounded-lg font-mono text-[10px] font-black uppercase tracking-widest ${page.lang === 'en' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                                        {(page.lang || 'zh').toString().toUpperCase()}
                                                    </span>
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-lg ring-1 ring-gray-100 group-hover:bg-white group-hover:ring-blue-100 transition-all">
                                                        {page.type}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-6">
                                            {getStatusBadge(page.status)}
                                        </TableCell>
                                        <TableCell className="px-6 py-6 font-mono text-xs font-black text-gray-400">
                                            {formatDate(page.updatedAt)}
                                        </TableCell>
                                        <TableCell className="px-10 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 transition-all">
                                                <Link
                                                    href={`/${page.slug}`}
                                                    target="_blank"
                                                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100 shadow-sm hover:shadow-lg"
                                                    title="预览"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>

                                                <Link
                                                    href={`/admin/pages/${page.id}`}
                                                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100 shadow-sm hover:shadow-lg"
                                                    title="编辑"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                <DeletePageButton id={page.id} title={page.title} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-10 py-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
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
