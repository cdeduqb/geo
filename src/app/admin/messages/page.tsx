'use client';

import { useState, useEffect } from 'react';
import { Search, Mail, MailOpen, Trash2, CheckCircle, RefreshCw, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/toast';

interface Message {
    id: string;
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    content: string;
    isRead: boolean;
    createdAt: string;
}

export default function MessagesPage() {
    const { showToast } = useToast();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [unreadCount, setUnreadCount] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [localSearch, setLocalSearch] = useState(''); // Separate state for input
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [viewingMessage, setViewingMessage] = useState<Message | null>(null);

    // Confirm Dialog States
    const [deleteId, setDeleteId] = useState<string | null>(null); // For single delete
    const [isBatchDeleting, setIsBatchDeleting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: page.toString(), limit: '20' });
            if (search) params.append('search', search);
            if (filter === 'unread') params.append('isRead', 'false');
            if (filter === 'read') params.append('isRead', 'true');

            const res = await fetch(`/api/admin/messages?${params}`);
            const data = await res.json();
            setMessages(data.messages || []);
            setTotal(data.total || 0);
            setUnreadCount(data.unreadCount || 0);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error('获取留言失败:', error);
            showToast('获取留言失败', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMessages(); }, [page, filter, search]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        setSearch(localSearch);
    };

    const handleBatchAction = async (action: 'markRead' | 'markUnread' | 'delete') => {
        if (selectedIds.length === 0) return;

        if (action === 'delete') {
            setIsBatchDeleting(true);
            return; // Wait for ConfirmDialog logic
        }

        await executeBatchAction(action);
    };

    const executeBatchAction = async (action: 'markRead' | 'markUnread' | 'delete') => {
        try {
            const res = await fetch('/api/admin/messages', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedIds, action }),
            });

            if (res.ok) {
                showToast('操作成功', 'success');
                setSelectedIds([]);
                fetchMessages();
            } else {
                showToast('操作失败', 'error');
            }
        } catch (error) {
            console.error('操作失败:', error);
            showToast('操作失败', 'error');
        }
    };

    const confirmBatchDelete = async () => {
        setIsDeleting(true);
        try {
            await executeBatchAction('delete');
        } finally {
            setIsDeleting(false);
            setIsBatchDeleting(false);
        }
    };

    const handleViewMessage = async (message: Message) => {
        setViewingMessage(message);
        if (!message.isRead) {
            await fetch(`/api/admin/messages/${message.id}`, { method: 'GET' });
            // Update local state to reflect read status immediately
            setMessages(prev => prev.map(m => m.id === message.id ? { ...m, isRead: true } : m));
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
    };

    const handleDeleteSingle = async (id: string, isViewing: boolean = false) => {
        setDeleteId(id);
    };

    const confirmSingleDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/admin/messages/${deleteId}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('删除成功', 'success');
                setMessages(prev => prev.filter(m => m.id !== deleteId));
                setTotal(prev => prev - 1);
                if (viewingMessage?.id === deleteId) {
                    setViewingMessage(null);
                }
            } else {
                showToast('删除失败', 'error');
            }
        } catch (error) {
            console.error('删除失败:', error);
            showToast('删除失败', 'error');
        } finally {
            setIsDeleting(false);
            setDeleteId(null);
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === messages.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(messages.map(m => m.id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-gray-900">留言管理</h1>
                <p className="text-sm text-gray-500">查看和管理用户留言 · 共 {total} 条，{unreadCount} 条未读</p>
            </div>

            {/* 工具栏 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="flex rounded-lg overflow-hidden bg-white">
                            <button
                                onClick={() => { setFilter('all'); setPage(1); }}
                                className={`px-4 py-2 text-sm transition-colors ${filter === 'all' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                全部
                            </button>
                            <button
                                onClick={() => { setFilter('unread'); setPage(1); }}
                                className={`px-4 py-2 text-sm flex items-center gap-2 transition-colors ${filter === 'unread' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                未读
                                {unreadCount > 0 && (
                                    <span className={`px-1.5 py-0.5 text-[10px] rounded-full ${filter === 'unread' ? 'bg-white text-blue-500' : 'bg-gray-100 text-gray-600'}`}>
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => { setFilter('read'); setPage(1); }}
                                className={`px-4 py-2 text-sm transition-colors ${filter === 'read' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                已读
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        {selectedIds.length > 0 && (
                            <div className="flex items-center gap-2 mr-2 animate-in fade-in slide-in-from-right-4 duration-200">
                                <span className="text-sm text-gray-500 whitespace-nowrap hidden sm:inline">已选 {selectedIds.length} 项</span>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                                    onClick={() => handleBatchAction('markRead')}
                                >
                                    <MailOpen className="w-4 h-4 mr-1.5" />
                                    标记已读
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                    onClick={() => handleBatchAction('delete')}
                                >
                                    <Trash2 className="w-4 h-4 mr-1.5" />
                                    删除
                                </Button>
                            </div>
                        )}
                        <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 md:flex-none">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    type="text"
                                    value={localSearch}
                                    onChange={e => setLocalSearch(e.target.value)}
                                    placeholder="搜索姓名、邮箱或内容..."
                                    className="pl-9"
                                />
                            </div>
                            <Button type="submit" size="icon" variant="secondary">
                                <Search className="w-4 h-4" />
                            </Button>
                            <Button type="button" variant="outline" size="icon" onClick={() => { fetchMessages(); }}>
                                <RefreshCw className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {/* 留言列表 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.length === messages.length && messages.length > 0}
                                    onChange={toggleSelectAll}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </TableHead>
                            <TableHead>姓名</TableHead>
                            <TableHead>邮箱</TableHead>
                            <TableHead>主题</TableHead>
                            <TableHead>内容预览</TableHead>
                            <TableHead>时间</TableHead>
                            <TableHead className="w-24 text-right">操作</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-48 text-center text-gray-500">
                                    <div className="flex items-center justify-center gap-2">
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        加载中...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : messages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-48 text-center text-gray-500">
                                    暂无留言
                                </TableCell>
                            </TableRow>
                        ) : (
                            messages.map(msg => (
                                <TableRow
                                    key={msg.id}
                                    className={`cursor-pointer transition-colors ${!msg.isRead ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-gray-50'}`}
                                    onClick={() => handleViewMessage(msg)}
                                >
                                    <TableCell onClick={e => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(msg.id)}
                                            onChange={() => toggleSelect(msg.id)}
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {!msg.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                                            <span className={`truncate ${!msg.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                                {msg.name}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-600">{msg.email}</TableCell>
                                    <TableCell className="text-gray-600 truncate max-w-[150px]">{msg.subject || '-'}</TableCell>
                                    <TableCell className="text-gray-500 truncate max-w-[200px]">{msg.content}</TableCell>
                                    <TableCell className="text-gray-500 text-xs">
                                        {new Date(msg.createdAt).toLocaleString('zh-CN', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </TableCell>
                                    <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => handleDeleteSingle(msg.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* 分页 */}
                {!loading && messages.length > 0 && (
                    <div className="p-4 flex items-center justify-between border-t border-gray-100">
                        <span className="text-sm text-gray-500">第 {page} / {totalPages} 页</span>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* 留言详情弹窗 */}
            {viewingMessage && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200" onClick={() => setViewingMessage(null)}>
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">留言详情</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    提交于 {new Date(viewingMessage.createdAt).toLocaleString('zh-CN')}
                                </p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setViewingMessage(null)} className="rounded-full">
                                <span className="sr-only">关闭</span>
                                <span aria-hidden="true" className="text-2xl font-light">&times;</span>
                            </Button>
                        </div>
                        <div className="p-8 space-y-6 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-1">
                                    <span className="text-xs font-medium uppercase tracking-wider text-gray-500">姓名</span>
                                    <p className="font-medium text-gray-900 text-lg">{viewingMessage.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-medium uppercase tracking-wider text-gray-500">邮箱</span>
                                    <p className="font-medium text-gray-900 flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        {viewingMessage.email}
                                    </p>
                                </div>
                                {viewingMessage.phone && (
                                    <div className="space-y-1">
                                        <span className="text-xs font-medium uppercase tracking-wider text-gray-500">手机</span>
                                        <p className="font-medium text-gray-900">{viewingMessage.phone}</p>
                                    </div>
                                )}
                            </div>

                            {viewingMessage.subject && (
                                <div className="space-y-2 pt-2">
                                    <span className="text-xs font-medium uppercase tracking-wider text-gray-500">主题</span>
                                    <p className="font-medium text-gray-900 text-lg">{viewingMessage.subject}</p>
                                </div>
                            )}

                            <div className="space-y-2 pt-2">
                                <span className="text-xs font-medium uppercase tracking-wider text-gray-500">留言内容</span>
                                <div className="p-6 bg-gray-50 rounded-xl text-gray-700 whitespace-pre-wrap leading-relaxed border border-gray-100 shadow-inner">
                                    {viewingMessage.content}
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                            <Button
                                variant="destructive"
                                className="gap-2"
                                onClick={() => handleDeleteSingle(viewingMessage.id, true)}
                            >
                                <Trash2 className="w-4 h-4" />
                                删除留言
                            </Button>
                            <Button variant="outline" onClick={() => setViewingMessage(null)}>
                                关闭
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmDialog
                isOpen={!!deleteId}
                onCancel={() => setDeleteId(null)}
                onConfirm={confirmSingleDelete}
                title="删除留言"
                message="确定要删除这条留言吗？此操作无法撤销。"
                isLoading={isDeleting}
            />

            <ConfirmDialog
                isOpen={isBatchDeleting}
                onCancel={() => setIsBatchDeleting(false)}
                onConfirm={confirmBatchDelete}
                title="批量删除"
                message={`确定要删除选中的 ${selectedIds.length} 条留言吗？此操作无法撤销。`}
                isLoading={isDeleting}
            />
        </div>
    );
}
