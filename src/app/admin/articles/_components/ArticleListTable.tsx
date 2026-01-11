'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Eye, FileText } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import DeleteArticleButton from './DeleteArticleButton';

interface ArticleListTableProps {
    articles: any[];
    total: number;
    page: number;
    limit: number;
}

export default function ArticleListTable({ articles, total, page, limit }: ArticleListTableProps) {
    const router = useRouter();
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isDeleting, setIsDeleting] = useState(false);

    const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(new Set(articles.map(a => a.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const toggleSelect = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    const handleBatchDelete = async () => {
        if (selectedIds.size === 0) return;
        if (!confirm(`确定要删除选中的 ${selectedIds.size} 篇文章吗？此操作不可恢复。`)) return;

        setIsDeleting(true);
        try {
            const res = await fetch('/api/admin/articles/batch', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: Array.from(selectedIds) })
            });

            if (res.ok) {
                const data = await res.json();
                alert(`成功删除 ${data.count} 篇文章`);
                setSelectedIds(new Set());
                router.refresh();
            } else {
                alert('批量删除失败');
            }
        } catch (error) {
            console.error(error);
            alert('请求出错');
        } finally {
            setIsDeleting(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PUBLISHED':
                return (
                    <div className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-wider">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                        已发布
                    </div>
                );
            case 'DRAFT':
                return (
                    <div className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-wider">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2" />
                        草稿
                    </div>
                );
            case 'ARCHIVED':
                return (
                    <div className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black bg-slate-50 text-slate-500 border border-slate-200 uppercase tracking-wider">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-2" />
                        已归档
                    </div>
                );
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    return (
        <div className="bg-white rounded-[24px] border border-slate-200/60 shadow-sm overflow-hidden transition-all">
            {/* Batch Actions Bar - Studio Style */}
            {selectedIds.size > 0 && (
                <div className="px-8 py-4 bg-slate-900 flex items-center justify-between animate-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-black">
                            {selectedIds.size}
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm">已选择项目</p>
                            <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">已选记录</p>
                        </div>
                    </div>
                    <button
                        onClick={handleBatchDelete}
                        disabled={isDeleting}
                        className="flex items-center gap-2 px-6 py-2.5 bg-red-500 hover:bg-red-600 active:scale-95 text-white text-sm font-black rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-red-500/20"
                    >
                        {isDeleting ? '正在删除...' : (
                            <>
                                <Trash2 className="w-4 h-4" />
                                批量删除
                            </>
                        )}
                    </button>
                </div>
            )}

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-slate-100 bg-slate-50/50">
                            <TableHead className="w-[80px] py-5 px-8">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500/20 transition-all cursor-pointer"
                                    checked={selectedIds.size > 0 && selectedIds.size === articles.length}
                                    onChange={toggleSelectAll}
                                />
                            </TableHead>
                            <TableHead className="py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">文章详情 / Slug</TableHead>
                            <TableHead className="py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">属性</TableHead>
                            <TableHead className="py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">状态</TableHead>
                            <TableHead className="py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">分类</TableHead>
                            <TableHead className="py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">发布日期</TableHead>
                            <TableHead className="text-right py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">操作</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {articles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-4">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                            <FileText className="w-8 h-8 text-slate-200" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-slate-900">暂无文章内容</p>
                                            <p className="text-sm text-slate-400">点击页面右上角“新建文章”开始您的创作</p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            articles.map((article: any) => (
                                <TableRow
                                    key={article.id}
                                    className={`group hover:bg-slate-50/80 transition-all duration-300 border-b border-slate-50 last:border-0 ${selectedIds.has(article.id) ? 'bg-blue-50/30' : ''}`}
                                >
                                    <TableCell className="py-8 px-8">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500/20 transition-all cursor-pointer"
                                            checked={selectedIds.has(article.id)}
                                            onChange={() => toggleSelect(article.id)}
                                        />
                                    </TableCell>
                                    <TableCell className="py-8">
                                        <div className="flex flex-col gap-2">
                                            <Link
                                                href={`/admin/articles/${article.id}`}
                                                className="font-black text-[15px] text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors tracking-tight leading-tight"
                                            >
                                                {article.title}
                                            </Link>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded">路径别名</span>
                                                <span className="text-[11px] font-medium text-slate-400 font-mono truncate max-w-[200px]">/{article.slug}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-8">
                                        <div className="flex flex-col gap-2">
                                            <Badge
                                                variant="outline"
                                                className={`w-fit font-black text-[10px] px-2 py-0.5 border-0 rounded-md shadow-sm ${article.lang === 'en'
                                                    ? 'bg-purple-600 text-white'
                                                    : 'bg-blue-600 text-white'
                                                    }`}
                                            >
                                                {(article.lang || 'zh').toString().toUpperCase()}
                                            </Badge>
                                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                排序: {article.sortOrder}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-8">
                                        {getStatusBadge(article.status)}
                                    </TableCell>
                                    <TableCell className="py-8">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-400/30" />
                                            <span className="text-[13px] font-bold text-slate-700">{article.category?.name || <span className="text-slate-300 italic font-medium">未分类</span>}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-8 text-xs">
                                        <div className="flex flex-col">
                                            <span className="text-[13px] font-bold text-slate-900 tracking-tight">{formatDate(article.createdAt)}</span>
                                            <span className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">发布时间</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right px-8">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={`/articles/${article.slug}`}
                                                target="_blank"
                                                className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                                                title="预览"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <Link
                                                href={`/admin/articles/${article.id}`}
                                                className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                                                title="编辑"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <DeleteArticleButton
                                                articleId={article.id}
                                                articleTitle={article.title}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* Pagination - Studio Style */}
                {totalPages > 1 && (
                    <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
                        <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            当前第 <span className="text-slate-900">{page}</span> 页 / 共 {totalPages} 页 — 总计 <span className="text-slate-900">{total}</span> 篇文章
                        </div>
                        <div className="flex gap-2">
                            <Link
                                href={`?page=${page - 1}`}
                                className={`flex items-center px-4 py-2 text-[11px] font-black uppercase tracking-widest border border-slate-200 rounded-xl hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all active:scale-95 ${page <= 1 ? 'pointer-events-none opacity-50 bg-slate-50' : 'bg-white text-slate-600'}`}
                            >
                                上一页
                            </Link>
                            <Link
                                href={`?page=${page + 1}`}
                                className={`flex items-center px-4 py-2 text-[11px] font-black uppercase tracking-widest border border-slate-200 rounded-xl hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all active:scale-95 ${page >= totalPages ? 'pointer-events-none opacity-50 bg-slate-50' : 'bg-white text-slate-600'}`}
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
