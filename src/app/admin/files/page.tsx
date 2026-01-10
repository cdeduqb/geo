'use client';

import { useState, useEffect, useCallback, useTransition, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Upload, Image, File, Video, Trash2, Search, Filter, Loader2, CheckSquare, Square, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Pagination } from '@/components/ui/Pagination';

interface FileItem {
    id: string;
    filename: string;
    url: string;
    size: number;
    mimeType: string;
    category: string;
    width?: number;
    height?: number;
    createdAt: string;
    uploadedBy: {
        name: string;
    };
}

// 🔧 全局缓存：存储已加载的文件数据
const filesCache = new Map<string, {
    files: FileItem[];
    pagination: {
        totalPages: number;
        total: number;
    };
    timestamp: number;
}>();

// 缓存有效期：5分钟
const CACHE_DURATION = 5 * 60 * 1000;

export default function FilesPage() {
    const searchParams = useSearchParams();
    const [files, setFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition(); // 🔧 非阻塞加载
    const [uploading, setUploading] = useState(false);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalFiles, setTotalFiles] = useState(0);

    // Sync currentPage with URL
    useEffect(() => {
        const page = parseInt(searchParams.get('page') || '1');
        setCurrentPage(page);
    }, [searchParams]);

    // Selection & Batch Action State
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isBatchDeleting, setIsBatchDeleting] = useState(false);
    const [isBatchConfirmOpen, setIsBatchConfirmOpen] = useState(false);

    const [deletingId, setDeletingId] = useState<string | null>(null);
    const { showToast } = useToast();

    // 🔧 生成缓存键
    const cacheKey = useMemo(() => {
        return `page=${currentPage}&search=${search}&category=${category}`;
    }, [currentPage, search, category]);

    // 🔧 检查缓存是否有效
    const getCachedData = (key: string) => {
        const cached = filesCache.get(key);
        if (!cached) return null;

        const now = Date.now();
        if (now - cached.timestamp > CACHE_DURATION) {
            // 缓存过期，删除
            filesCache.delete(key);
            return null;
        }

        return cached;
    };

    // 🔧 设置缓存
    const setCachedData = (key: string, data: any) => {
        filesCache.set(key, {
            ...data,
            timestamp: Date.now(),
        });
    };

    // ... existing code ...

    const handleDelete = async (id: string) => {
        setDeletingId(id);
    };

    const handleConfirmDelete = async () => {
        if (!deletingId) return;

        try {
            const res = await fetch(`/api/admin/files/${deletingId}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('删除失败');

            showToast('删除成功', 'success');
            // Remove from selectedIds if present
            setSelectedIds(prev => prev.filter(id => id !== deletingId));
            // 🔧 清除缓存并强制刷新
            filesCache.clear();
            fetchFiles(true);
        } catch (error) {
            showToast('删除失败', 'error');
        } finally {
            setDeletingId(null);
        }
    };

    const handleBatchDelete = async () => {
        setIsBatchDeleting(true);
        try {
            const res = await fetch(`/api/admin/files?ids=${selectedIds.join(',')}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('批量删除失败');

            showToast('批量删除成功', 'success');
            setSelectedIds([]);
            setIsBatchConfirmOpen(false);
            // 🔧 清除缓存并强制刷新
            filesCache.clear();
            fetchFiles(true);
        } catch (error) {
            showToast('批量删除失败', 'error');
        } finally {
            setIsBatchDeleting(false);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === files.length && files.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(files.map(f => f.id));
        }
    };

    const toggleSelect = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(prev => prev.filter(i => i !== id));
        } else {
            setSelectedIds(prev => [...prev, id]);
        }
    };

    const fetchFiles = useCallback(async (forceRefresh = false) => {
        // 🔧 先检查缓存
        if (!forceRefresh) {
            const cached = getCachedData(cacheKey);
            if (cached) {
                console.log('✅ 使用缓存数据');
                setFiles(cached.files);
                setTotalPages(cached.pagination.totalPages);
                setTotalFiles(cached.pagination.total);
                setLoading(false);
                return;
            }
        }

        try {
            // 🔧 使用 startTransition 实现非阻塞加载
            // 这样在加载过程中切换页面不会被阻塞
            startTransition(async () => {
                const params = new URLSearchParams();
                params.append('page', currentPage.toString());
                params.append('limit', '24'); // 6x4 grid
                if (search) params.append('search', search);
                if (category) params.append('category', category);

                const res = await fetch(`/api/admin/files?${params}`);
                if (!res.ok) throw new Error('获取文件失败');

                const data = await res.json();

                // 🔧 更新缓存
                setCachedData(cacheKey, {
                    files: data.files,
                    pagination: data.pagination || { totalPages: 1, total: 0 },
                });

                setFiles(data.files);

                if (data.pagination) {
                    setTotalPages(data.pagination.totalPages);
                    setTotalFiles(data.pagination.total);
                }
            });
        } catch (error) {
            showToast('获取文件失败', 'error');
        } finally {
            setLoading(false);
        }
    }, [currentPage, search, category, cacheKey, showToast, startTransition]);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/admin/files/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || '上传失败');
            }

            showToast('上传成功', 'success');
            // 🔧 清除缓存并强制刷新
            filesCache.clear();
            fetchFiles(true);
        } catch (error: any) {
            showToast(error.message || '上传失败', 'error');
        } finally {
            setUploading(false);
            e.target.value = ''; // 重置input
        }
    };




    const handleUpdateDescription = async (id: string, description: string) => {
        try {
            const res = await fetch(`/api/admin/files/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description }),
            });

            if (!res.ok) throw new Error('更新失败');

            showToast('描述更新成功', 'success');
            // update local state
            setFiles(prev => prev.map(f => f.id === id ? { ...f, description } : f));
        } catch (error) {
            showToast('更新失败', 'error');
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    const getFileIcon = (mimeType: string) => {
        if (mimeType.startsWith('image/')) return <Image className="w-5 h-5 text-blue-500" />;
        if (mimeType.startsWith('video/')) return <Video className="w-5 h-5 text-purple-500" />;
        return <File className="w-5 h-5 text-gray-500" />;
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                        <File className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">文件管理</h1>
                    </div>
                </div>
            </div>

            {/* Action & Filter Bar */}
            <div className="bg-white rounded-[24px] border border-gray-100 p-3 shadow-sm shadow-gray-100/50 flex flex-col lg:flex-row items-center gap-3">
                <div className="flex items-center gap-4 flex-1 w-full lg:w-auto px-2">
                    <button
                        onClick={toggleSelectAll}
                        className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-blue-600 transition-colors whitespace-nowrap"
                    >
                        {selectedIds.length === files.length && files.length > 0 ? (
                            <CheckSquare className="w-5 h-5 text-blue-600" />
                        ) : (
                            <Square className="w-5 h-5 text-gray-300" />
                        )}
                        全选当页
                    </button>
                    <div className="w-px h-6 bg-gray-100 hidden sm:block" />
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="搜索文件名..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-transparent focus:bg-white focus:border-blue-100 rounded-xl text-sm font-bold transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="px-4 py-2.5 bg-gray-50/50 border border-transparent focus:bg-white focus:border-blue-100 rounded-xl text-xs font-black transition-all outline-none min-w-[120px]"
                    >
                        <option value="">所有媒体类型</option>
                        <option value="image">视觉图片</option>
                        <option value="video">视频素材</option>
                        <option value="document">办公文档</option>
                        <option value="other">其它资源</option>
                    </select>

                    <div className="flex items-center gap-2">
                        {selectedIds.length > 0 && (
                            <button
                                onClick={() => setIsBatchConfirmOpen(true)}
                                className="inline-flex items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100 px-5 py-2.5 text-xs font-black hover:bg-red-100 transition-all active:scale-95"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                批量移除 ({selectedIds.length})
                            </button>
                        )}

                        <label className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-black text-white shadow-lg shadow-blue-100 hover:bg-blue-700 cursor-pointer transition-all active:scale-95 whitespace-nowrap">
                            <Upload className="w-4 h-4 mr-2" />
                            {uploading ? '正在传输...' : '上传新素材'}
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleUpload}
                                disabled={uploading}
                            />
                        </label>
                    </div>
                </div>
            </div>

            {/* Files Grid */}
            {loading && files.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-gray-100 shadow-sm">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-2xl animate-pulse" />
                        <Loader2 className="relative w-12 h-12 text-blue-600 animate-spin" />
                    </div>
                    <p className="mt-6 text-xs text-gray-400 font-black uppercase tracking-widest">正在加载素材库...</p>
                </div>
            ) : files.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[32px] border-2 border-dashed border-gray-100 flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-[28px] flex items-center justify-center mb-6 border border-gray-100">
                        <Upload className="h-10 w-10 text-gray-200" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">
                        {search || category ? '未找到相关素材' : '素材库空空如也'}
                    </h3>
                    <p className="text-sm text-gray-400 font-medium max-w-xs leading-relaxed">
                        {search || category ? '尝试更换搜索关键词或筛选类型' : '开始上传您的第一张图片或视频素材，丰富站点内容'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {files.map((file) => (
                        <div
                            key={file.id}
                            className={`group relative bg-white rounded-[28px] border-2 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-50/50 overflow-hidden ${selectedIds.includes(file.id) ? 'border-blue-600 scale-[0.98]' : 'border-gray-50'
                                }`}
                        >
                            {/* 选择状态遮罩 */}
                            {selectedIds.includes(file.id) && (
                                <div className="absolute inset-0 bg-blue-600/5 z-10 pointer-events-none" />
                            )}

                            {/* 预览区域 */}
                            <div className="aspect-square bg-gray-50 relative overflow-hidden">
                                {file.category === 'image' ? (
                                    <img
                                        src={file.url}
                                        alt={file.filename}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100">
                                        {getFileIcon(file.mimeType)}
                                        <span className="mt-3 text-[10px] font-black text-gray-400 text-center line-clamp-2 uppercase tracking-tighter">
                                            {file.filename.split('.').pop()} 素材
                                        </span>
                                    </div>
                                )}

                                {/* 悬浮快捷操作 - 仅在未选中时显示 */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 z-20">
                                    <button
                                        onClick={() => toggleSelect(file.id)}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedIds.includes(file.id) ? 'bg-blue-600 text-white' : 'bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-blue-600'
                                            }`}
                                    >
                                        <CheckSquare className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(file.id)}
                                        className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md text-white hover:bg-red-500 transition-all flex items-center justify-center"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* 信息区域 */}
                            <div className="p-4 space-y-2 relative z-20">
                                <div className="flex items-start justify-between gap-2">
                                    <p className="text-[11px] font-black text-gray-900 truncate flex-1" title={file.filename}>
                                        {file.filename}
                                    </p>
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                                        {formatFileSize(file.size)}
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    defaultValue={(file as any).description || ''}
                                    onBlur={(e) => {
                                        if (e.target.value !== (file as any).description) {
                                            handleUpdateDescription(file.id, e.target.value);
                                        }
                                    }}
                                    placeholder="添加备注..."
                                    className="w-full text-[10px] px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-300 focus:bg-white focus:border-blue-600 outline-none font-bold text-gray-500 placeholder:text-gray-300 transition-all"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl="/admin/files"
            />

            <ConfirmDialog
                isOpen={!!deletingId}
                onCancel={() => setDeletingId(null)}
                onConfirm={handleConfirmDelete}
                title="删除文件"
                message="确定要删除这个文件吗？此操作无法撤销。"
                confirmText="删除"
                confirmButtonClass="bg-red-600 hover:bg-red-700 text-white"
            />

            <ConfirmDialog
                isOpen={isBatchConfirmOpen}
                onCancel={() => setIsBatchConfirmOpen(false)}
                onConfirm={handleBatchDelete}
                title="批量删除文件"
                message={`确定要删除选中的 ${selectedIds.length} 个文件吗？此操作无法撤销。`}
                confirmText="批量删除"
                confirmButtonClass="bg-red-600 hover:bg-red-700 text-white"
                isLoading={isBatchDeleting}
            />
        </div>
    );
}
