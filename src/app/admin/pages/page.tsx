import { db } from '@/lib/db';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Eye, File, Layout } from 'lucide-react';
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <File className="w-8 h-8 text-blue-600" />
                        页面管理
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        管理系统中的所有页面内容
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <CleanupPagesButton />
                    <Link href="/admin/pages/create" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors">
                        <Plus className="w-4 h-4 mr-2" />
                        新建页面
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* 筛选栏 */}
                <div className="p-6 border-b border-gray-100 bg-gray-50/30">
                    <AdminFilters>
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                name="q"
                                placeholder="搜索页面标题..."
                                defaultValue={query}
                                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-white"
                            />
                        </div>
                        <select
                            defaultValue={status || ''}
                            name="status"
                            className="w-40 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                        >
                            <option value="">所有状态</option>
                            <option value="PUBLISHED">已发布</option>
                            <option value="DRAFT">草稿</option>
                            <option value="ARCHIVED">已归档</option>
                        </select>
                        <select
                            defaultValue={lang || ''}
                            name="lang"
                            className="w-32 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                        >
                            <option value="">所有语言</option>
                            <option value="zh">中文</option>
                            <option value="en">English</option>
                        </select>
                    </AdminFilters>
                </div>

                {/* 页面列表 */}
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-gray-200">
                                <TableHead className="w-[300px] py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">标题</TableHead>
                                <TableHead className="py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">语言</TableHead>
                                <TableHead className="py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">状态</TableHead>
                                <TableHead className="py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">类型</TableHead>
                                <TableHead className="py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">URL 路径</TableHead>
                                <TableHead className="py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">更新时间</TableHead>
                                <TableHead className="text-right py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">操作</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pages.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-40 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <File className="w-12 h-12 text-gray-300 mb-3" />
                                            <p className="text-sm text-gray-500">暂无页面</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pages.map((page: any) => (
                                    <TableRow
                                        key={page.id}
                                        className="group hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                                    >
                                        <TableCell className="py-4">
                                            <span className="font-medium text-sm text-gray-900 group-hover:text-blue-600 transition-colors">{page.title}</span>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <Badge
                                                variant="outline"
                                                className={`font-mono text-[10px] px-1.5 py-0 border-0 ${page.lang === 'en'
                                                    ? 'bg-purple-50 text-purple-700'
                                                    : page.lang === 'zh'
                                                        ? 'bg-blue-50 text-blue-700'
                                                        : 'bg-gray-50 text-gray-700'
                                                    }`}
                                            >
                                                {(page.lang || 'zh').toString().toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            {getStatusBadge(page.status)}
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <Badge variant="outline" className="font-normal text-xs text-gray-700 border-gray-300">{page.type}</Badge>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <span className="text-xs text-gray-500 font-mono">/{page.slug}</span>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <span className="text-xs text-gray-500 font-mono">
                                                {formatDate(page.updatedAt)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/${page.slug}`}
                                                    target="_blank"
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="预览"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/pages/builder/${page.id}`}
                                                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                    title="可视化编辑"
                                                >
                                                    <Layout className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/pages/${page.id}`}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="编辑"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <DeletePageButton id={page.id} title={page.title} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* 分页 */}
                    {totalPages > 1 && (
                        <div className="p-4 border-t border-gray-200 bg-gray-50/30 flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                显示 {skip + 1} 到 {Math.min(skip + limit, total)} 条，共 {total} 条
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href={`?page=${page - 1}`}
                                    className={`px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-white hover:border-gray-300 transition-colors ${page <= 1 ? 'pointer-events-none opacity-50' : 'bg-white'}`}
                                >
                                    上一页
                                </Link>
                                <Link
                                    href={`?page=${page + 1}`}
                                    className={`px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-white hover:border-gray-300 transition-colors ${page >= totalPages ? 'pointer-events-none opacity-50' : 'bg-white'}`}
                                >
                                    下一页
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
