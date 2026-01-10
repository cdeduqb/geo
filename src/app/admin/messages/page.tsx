'use client';

import { useState, useEffect } from 'react';
import { Search, Mail, MailOpen, Trash2, CheckCircle, RefreshCw, ChevronLeft, ChevronRight, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
        <div className="space-y-6 pb-12">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                        <Mail className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">留言管理</h1>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white rounded-[24px] border border-gray-100 p-3 shadow-sm shadow-gray-100/50 flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth px-1">
                    <button
                        onClick={() => { setFilter('all'); setPage(1); }}
                        className={`flex items-center gap-2.5 px-6 py-2.5 rounded-2xl text-xs font-black transition-all duration-300 whitespace-nowrap ${filter === 'all'
                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-100'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-white'
                            }`}
                    >
                        <Mail className={`w-4 h-4 transition-transform ${filter === 'all' ? 'scale-110' : ''}`} />
                        全部留言
                    </button>
                    <button
                        onClick={() => { setFilter('unread'); setPage(1); }}
                        className={`flex items-center gap-2.5 px-6 py-2.5 rounded-2xl text-xs font-black transition-all duration-300 whitespace-nowrap ${filter === 'unread'
                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-100'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-white'
                            }`}
                    >
                        <MailOpen className={`w-4 h-4 transition-transform ${filter === 'unread' ? 'scale-110' : ''}`} />
                        未读消息
                        {unreadCount > 0 && (
                            <span className={`px-2 py-0.5 text-[10px] rounded-full transition-colors ${filter === 'unread' ? 'bg-white text-blue-600' : 'bg-blue-50 text-blue-600'}`}>
                                {unreadCount}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => { setFilter('read'); setPage(1); }}
                        className={`flex items-center gap-2.5 px-6 py-2.5 rounded-2xl text-xs font-black transition-all duration-300 whitespace-nowrap ${filter === 'read'
                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-100'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-white'
                            }`}
                    >
                        <CheckCircle className={`w-4 h-4 transition-transform ${filter === 'read' ? 'scale-110' : ''}`} />
                        已读存档
                    </button>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto">
                    {selectedIds.length > 0 && (
                        <div className="flex items-center gap-2 animate-in slide-in-from-right-2 duration-300">
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-10 rounded-xl text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-100 font-bold px-4"
                                onClick={() => handleBatchAction('markRead')}
                            >
                                <MailOpen className="w-4 h-4 mr-2" />
                                标记已读
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-10 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100 font-bold px-4"
                                onClick={() => handleBatchAction('delete')}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                批量删除
                            </Button>
                        </div>
                    )}

                    <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 lg:flex-none">
                        <div className="relative flex-1 lg:w-64 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                            <Input
                                type="text"
                                value={localSearch}
                                onChange={e => setLocalSearch(e.target.value)}
                                placeholder="搜索姓名、邮箱或内容..."
                                className="pl-10 h-11 border-none bg-gray-50/50 focus:bg-white rounded-xl text-xs font-bold transition-all"
                            />
                        </div>
                        <Button type="submit" size="icon" className="h-11 w-11 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100">
                            <Search className="w-4 h-4" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" className="h-11 w-11 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50" onClick={() => { fetchMessages(); }}>
                            <RefreshCw className="w-4 h-4" />
                        </Button>
                    </form>
                </div>
            </div>

            {/* Message List */}
            {loading && messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-gray-100 shadow-sm">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-2xl animate-pulse" />
                        <Loader2 className="relative w-12 h-12 text-blue-600 animate-spin" />
                    </div>
                    <p className="mt-6 text-xs text-gray-400 font-black uppercase tracking-widest">正在检索咨询记录...</p>
                </div>
            ) : messages.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[32px] border-2 border-dashed border-gray-100 flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
                        <Mail className="h-10 w-10 text-gray-200" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">暂无咨询留言</h3>
                    <p className="text-sm text-gray-400 font-medium max-w-xs leading-relaxed">
                        目前还没有客户提交咨询。一旦有新动态，我们会立即在此处通知您。
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            onClick={() => handleViewMessage(message)}
                            className={`group relative bg-white rounded-[24px] border transition-all duration-300 cursor-pointer overflow-hidden p-6 flex flex-col md:flex-row md:items-center gap-6 ${message.isRead ? 'border-gray-50' : 'border-blue-100 bg-blue-50/10 shadow-lg shadow-blue-50/50'
                                } hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/20`}
                        >
                            {/* 未读状态指示器 */}
                            {!message.isRead && (
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600" />
                            )}

                            {/* 勾选框 */}
                            <div className="flex-shrink-0" onClick={e => e.stopPropagation()}>
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(message.id)}
                                    onChange={() => toggleSelect(message.id)}
                                    className="w-5 h-5 rounded-lg border-2 border-gray-200 text-blue-600 focus:ring-blue-600 transition-all cursor-pointer"
                                />
                            </div>

                            {/* 发送者信息 */}
                            <div className="flex-shrink-0 flex items-center gap-4 min-w-[200px]">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black ${!message.isRead ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    {message.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <h4 className="font-black text-gray-900 leading-tight truncate">{message.name}</h4>
                                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter mt-0.5 truncate">{message.email}</p>
                                </div>
                            </div>

                            {/* 预览内容 */}
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm line-clamp-1 ${!message.isRead ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>
                                    {message.subject ? `【${message.subject}】` : ''}{message.content}
                                </p>
                                <div className="flex items-center gap-3 mt-1.5">
                                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg uppercase tracking-widest border border-blue-100/50">
                                        咨询消息
                                    </span>
                                    {message.phone && (
                                        <span className="text-[10px] font-bold text-gray-400">{message.phone}</span>
                                    )}
                                </div>
                            </div>

                            {/* 时间与操作 */}
                            <div className="flex-shrink-0 flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 font-bold">
                                        {new Date(message.createdAt).toLocaleDateString('zh-CN')}
                                    </p>
                                    <p className="text-[10px] text-gray-300 font-medium">
                                        {new Date(message.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteSingle(message.id); }}
                                        className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        title="删除"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!loading && total > 0 && (
                <div className="flex justify-center pt-8">
                    <div className="bg-white rounded-2xl border border-gray-100 p-2 flex items-center gap-1 shadow-sm">
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="rounded-xl h-10 w-10 p-0"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <div className="px-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                            {page} / {totalPages}
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="rounded-xl h-10 w-10 p-0"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Detail View Placeholder or Modal */}
            {viewingMessage && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-xl z-[100] flex items-center justify-center p-4 animate-in fade-in duration-500" onClick={() => setViewingMessage(null)}>
                    <div className="bg-white max-w-2xl w-full rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500" onClick={e => e.stopPropagation()}>
                        <div className="bg-gray-900 p-10 text-white relative h-64 flex items-end">
                            {/* Decorative background */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/30 rounded-full blur-[80px] -mr-40 -mt-40 transition-transform duration-1000 group-hover:scale-110" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[60px] -ml-32 -mb-32" />

                            <div className="relative z-10 flex items-center gap-8 w-full">
                                <div className="w-24 h-24 rounded-[32px] bg-blue-600 flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-blue-500/50 flex-shrink-0">
                                    {viewingMessage.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-widest ring-1 ring-blue-500/30">
                                            咨询留言详情
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-black tracking-tight">{viewingMessage.name}</h2>
                                    <p className="text-blue-100/60 text-sm font-bold uppercase tracking-widest mt-1">{viewingMessage.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 space-y-10 overflow-y-auto max-h-[50vh]">
                            <div className="grid grid-cols-2 gap-10">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                        联系人信息
                                    </p>
                                    <p className="text-sm font-black text-gray-900">{viewingMessage.phone || '未提供联系电话'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        提交时间
                                    </p>
                                    <p className="text-sm font-black text-gray-900">{new Date(viewingMessage.createdAt).toLocaleString('zh-CN')}</p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                    留言内容详情
                                </p>
                                <div className="bg-gray-50 rounded-[32px] p-8 text-sm text-gray-700 leading-relaxed font-bold border border-gray-100/50 shadow-inner">
                                    {viewingMessage.subject && (
                                        <p className="mb-4 text-gray-900 text-lg font-black">【{viewingMessage.subject}】</p>
                                    )}
                                    {viewingMessage.content}
                                </div>
                            </div>
                        </div>

                        <div className="p-10 bg-gray-50/50 border-t border-gray-50 flex justify-between items-center">
                            <button
                                onClick={() => handleDeleteSingle(viewingMessage.id)}
                                className="px-6 py-4 rounded-2xl bg-red-50 text-red-600 text-xs font-black hover:bg-red-100 transition-all flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                删除此留言
                            </button>
                            <Button
                                className="bg-gray-900 hover:bg-black text-white px-10 py-5 rounded-[24px] font-black uppercase text-xs tracking-widest h-auto shadow-2xl shadow-gray-200 active:scale-95 transition-all"
                                onClick={() => setViewingMessage(null)}
                            >
                                标记为已完成
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
