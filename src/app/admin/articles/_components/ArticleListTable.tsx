'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Eye } from 'lucide-react';
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
                return <Badge variant="success">已发布</Badge>;
            case 'DRAFT':
                return <Badge variant="warning">草稿</Badge>;
            case 'ARCHIVED':
                return <Badge variant="secondary">已归档</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Batch Actions Bar */}
            {selectedIds.size > 0 && (
                <div className="px-6 py-3 bg-blue-50 border-b border-blue-100 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                    <span className="text-sm font-bold text-blue-700">
                        已选择 {selectedIds.size} 项
                    </span>
                    <button
                        onClick={handleBatchDelete}
                        disabled={isDeleting}
                        className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isDeleting ? '删除中...' : (
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
                        <TableRow className="border-b border-gray-200">
                            <TableHead className="w-[50px] py-3.5">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    checked={selectedIds.size > 0 && selectedIds.size === articles.length}
                                    onChange={toggleSelectAll}
                                />
                            </TableHead>
                            <TableHead className="w-[400px] py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">标题</TableHead>
                            <TableHead className="py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">排序</TableHead>
                            <TableHead className="py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">语言</TableHead>
                            <TableHead className="py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">状态</TableHead>
                            <TableHead className="py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">分类</TableHead>
                            <TableHead className="py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">作者</TableHead>
                            <TableHead className="py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">发布时间</TableHead>
                            <TableHead className="text-right py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">操作</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {articles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-40 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <p className="text-sm text-gray-500">暂无文章</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            articles.map((article: any) => (
                                <TableRow
                                    key={article.id}
                                    className={`group hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${selectedIds.has(article.id) ? 'bg-blue-50/30' : ''}`}
                                >
                                    <TableCell className="py-6">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            checked={selectedIds.has(article.id)}
                                            onChange={() => toggleSelect(article.id)}
                                        />
                                    </TableCell>
                                    <TableCell className="py-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-medium text-sm text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">{article.title}</span>
                                            <span className="text-xs text-gray-500 font-mono">/{article.slug}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-6">
                                        <span className="text-xs font-mono bg-gray-50 px-2 py-1 rounded text-gray-600">{article.sortOrder}</span>
                                    </TableCell>
                                    <TableCell className="py-6">
                                        <Badge
                                            variant="outline"
                                            className={`font-mono text-[10px] px-1.5 py-0 border-0 ${article.lang === 'en'
                                                ? 'bg-purple-50 text-purple-700'
                                                : article.lang === 'zh'
                                                    ? 'bg-blue-50 text-blue-700'
                                                    : 'bg-gray-50 text-gray-700'
                                                }`}
                                        >
                                            {(article.lang || 'zh').toString().toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-6">
                                        {getStatusBadge(article.status)}
                                    </TableCell>
                                    <TableCell className="py-6">
                                        <span className="text-sm text-gray-700">{article.category?.name || <span className="text-gray-400">未分类</span>}</span>
                                    </TableCell>
                                    <TableCell className="py-6">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-xs font-medium text-white shadow-sm">
                                                {article.author.name[0]}
                                            </div>
                                            <span className="text-sm text-gray-700 font-medium">{article.author.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-6">
                                        <span className="text-xs text-gray-500 font-mono">
                                            {formatDate(article.createdAt)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/articles/${article.slug}`}
                                                target="_blank"
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="预览"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <Link
                                                href={`/admin/articles/${article.id}`}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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
    );
}
