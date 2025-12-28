'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Upload, Image, File, Video, Trash2, Search, Filter, Loader2, CheckSquare, Square } from 'lucide-react';
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

export default function FilesPage() {
    const searchParams = useSearchParams();
    const [files, setFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(true);
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
            fetchFiles();
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
            fetchFiles();
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

    const fetchFiles = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            params.append('page', currentPage.toString());
            params.append('limit', '24'); // 6x4 grid
            if (search) params.append('search', search);
            if (category) params.append('category', category);

            const res = await fetch(`/api/admin/files?${params}`);
            if (!res.ok) throw new Error('获取文件失败');

            const data = await res.json();
            setFiles(data.files);

            if (data.pagination) {
                setTotalPages(data.pagination.totalPages);
                setTotalFiles(data.pagination.total);
            }
        } catch (error) {
            showToast('获取文件失败', 'error');
        } finally {
            setLoading(false);
        }
    }, [currentPage, search, category, showToast]);

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
            fetchFiles();
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
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Upload className="w-8 h-8 text-blue-600" />
                        文件管理
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        共 {totalFiles} 个文件
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {selectedIds.length > 0 && (
                        <button
                            onClick={() => setIsBatchConfirmOpen(true)}
                            className="inline-flex items-center justify-center rounded-lg bg-red-50 text-red-600 border border-red-200 px-4 py-2 text-sm font-medium hover:bg-red-100 transition-colors"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            批量删除 ({selectedIds.length})
                        </button>
                    )}

                    {/* Upload Button */}
                    <label className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 cursor-pointer transition-colors">
                        <Upload className="w-4 h-4 mr-2" />
                        {uploading ? '上传中...' : '上传文件'}
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleUpload}
                            disabled={uploading}
                        />
                    </label>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex gap-4 items-center">
                    <button
                        onClick={toggleSelectAll}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium px-2"
                    >
                        {selectedIds.length === files.length && files.length > 0 ? (
                            <CheckSquare className="w-5 h-5 text-blue-600" />
                        ) : (
                            <Square className="w-5 h-5 text-gray-400" />
                        )}
                        全选当页
                    </button>
                    <div className="h-6 w-px bg-gray-200"></div>
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="搜索文件名..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                        <option value="">所有类型</option>
                        <option value="image">图片</option>
                        <option value="video">视频</option>
                        <option value="document">文档</option>
                        <option value="other">其他</option>
                    </select>
                </div>
            </div>

            {/* Files Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                    <p className="mt-2 text-gray-500">加载中...</p>
                </div>
            ) : files.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                        {search || category ? '未找到文件' : '暂无文件'}
                    </h3>
                    <p className=" mt-1 text-sm text-gray-500">
                        {search || category ? '尝试更改搜索条件' : '点击上传按钮开始上传文件'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {files.map((file) => (
                        <div
                            key={file.id}
                            className={`group relative bg-white rounded-lg border overflow-hidden hover:shadow-md transition-all ${selectedIds.includes(file.id) ? 'ring-2 ring-blue-500 border-transparent' : 'border-gray-200'
                                }`}
                        >
                            {/* Checkbox Overlay */}
                            <div className="absolute top-2 left-2 z-10">
                                <button
                                    onClick={() => toggleSelect(file.id)}
                                    className="p-1 rounded-md bg-white/80 hover:bg-white text-gray-500 hover:text-blue-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity aria-selected:opacity-100 text-blue-600"
                                    aria-selected={selectedIds.includes(file.id)}
                                >
                                    {selectedIds.includes(file.id) ? (
                                        <CheckSquare className="w-4 h-4 text-blue-600" />
                                    ) : (
                                        <Square className="w-4 h-4" />
                                    )}
                                </button>
                            </div>

                            {/* Preview */}
                            <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                                {file.category === 'image' ? (
                                    <img
                                        src={file.url}
                                        alt={file.filename}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-4">
                                        {getFileIcon(file.mimeType)}
                                        <span className="mt-2 text-xs text-gray-500 text-center line-clamp-2">
                                            {file.filename}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="p-2">
                                <p className="text-xs text-gray-900 line-clamp-1" title={file.filename}>
                                    {file.filename}
                                </p>
                                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                <input
                                    type="text"
                                    defaultValue={(file as any).description || ''}
                                    onBlur={(e) => {
                                        if (e.target.value !== (file as any).description) {
                                            handleUpdateDescription(file.id, e.target.value);
                                        }
                                    }}
                                    placeholder="添加描述..."
                                    className="mt-2 w-full text-xs px-2 py-1 border border-gray-200 rounded bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            {/* Actions */}
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleDelete(file.id)}
                                    className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                    title="删除"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
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
