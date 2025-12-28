import { db } from '@/lib/db';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Eye, FileText, Sparkles } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import DeleteArticleButton from './_components/DeleteArticleButton';
import ArticleListTable from './_components/ArticleListTable';
import AdminFilters from '../_components/AdminFilters';

export default async function ArticlesPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; q?: string; status?: string; categoryId?: string; lang?: string }>;
}) {
    const { page: pageParam, q, status: statusParam, categoryId, lang } = await searchParams;
    const page = Number(pageParam) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const query = q || '';
    const status = statusParam;

    const where = {
        AND: [
            query ? { title: { contains: query } } : {},
            status ? { status: status as any } : {},
            categoryId ? { categoryId } : {},
            lang ? { lang } : {},
        ],
    };

    const categories = await db.category.findMany({ select: { id: true, name: true } });

    const [articles, total] = await Promise.all([
        db.article.findMany({
            where,
            include: {
                author: { select: { name: true } },
                category: { select: { name: true } },
            },
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
            skip,
            take: limit,
        }),
        db.article.count({ where }),
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
                        <FileText className="w-8 h-8 text-blue-600" />
                        文章管理
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        管理系统中的所有文章内容
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/articles/copilot" className="inline-flex items-center justify-center rounded-lg bg-white border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
                        <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
                        AI 智能创作
                    </Link>
                    <Link href="/admin/articles/create" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors">
                        <Plus className="w-4 h-4 mr-2" />
                        新建文章
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
                                placeholder="搜索文章标题..."
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
                            defaultValue={categoryId || ''}
                            name="categoryId"
                            className="w-40 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                        >
                            <option value="">所有分类</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
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

                {/* Client Component for Table & Batch Actions */}
                <ArticleListTable
                    articles={articles}
                    total={total}
                    page={page}
                    limit={limit}
                />
            </div>
        </div>
    );
}
