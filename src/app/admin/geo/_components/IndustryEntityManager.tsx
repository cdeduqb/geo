'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus, Trash2, Cpu, Link as LinkIcon, Hash, RefreshCw, Search, Tag, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface IndustryEntity {
    id: string;
    name: string;
    keywords: string;
    industry: string;
    relatedUrls: string | null;
}

export default function IndustryEntityManager() {
    const { showToast } = useToast();
    const [entities, setEntities] = useState<IndustryEntity[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [isAdding, setIsAdding] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [newEntity, setNewEntity] = useState({
        name: '',
        keywords: '',
        industry: '通用/技术',
        relatedUrls: ''
    });

    useEffect(() => {
        fetchEntities();
    }, []);

    const fetchEntities = async () => {
        setRefreshing(true);
        try {
            const res = await fetch('/api/admin/geo/industry-entities');
            if (res.ok) {
                const data = await res.json();
                setEntities(data.entities || []);
            }
        } catch (error) {
            console.error('Failed to fetch entities:', error);
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!newEntity.name) return;
        try {
            const res = await fetch('/api/admin/geo/industry-entities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEntity),
            });
            if (res.ok) {
                showToast('行业实体已添加', 'success');
                setIsAdding(false);
                setNewEntity({ name: '', keywords: '', industry: '通用/技术', relatedUrls: '' });
                fetchEntities();
            }
        } catch (error) {
            showToast('添加失败', 'error');
        }
    };

    const handleDelete = (id: string) => {
        setConfirmDeleteId(id);
    };

    const executeDelete = async (id: string) => {
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/admin/geo/industry-entities?id=${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                showToast('行业实体已删除', 'success');
                setConfirmDeleteId(null);
                fetchEntities();
            }
        } catch (error) {
            showToast('删除失败', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredEntities = entities.filter(e =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.keywords.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <ConfirmDialog
                isOpen={!!confirmDeleteId}
                title="确认删除行业实体"
                message="确定要删除该行业实体吗？此操作不可撤销，会影响 AI 对相关知识点的关联性。"
                confirmText="确认删除"
                confirmButtonClass="bg-red-600 hover:bg-red-700 shadow-lg shadow-red-100"
                onConfirm={() => confirmDeleteId && executeDelete(confirmDeleteId)}
                onCancel={() => setConfirmDeleteId(null)}
                isLoading={isDeleting}
            />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-100">
                        <Cpu className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-gray-900 tracking-tight">行业知识实体库</h2>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">
                            定义行业核心概念及高权重引用链接，强化 AI 语义关联
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setIsAdding(!isAdding)}
                        className="rounded-xl font-bold border-amber-100 text-amber-600 hover:bg-amber-50"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        添加实体
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={fetchEntities}
                        disabled={refreshing}
                        className="rounded-xl"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            {isAdding && (
                <Card className="border-amber-100 bg-amber-50/30 overflow-hidden shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
                    <CardHeader className="pb-3 px-6 pt-6">
                        <CardTitle className="text-sm font-bold text-amber-900">新增行业实体</CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-amber-700 uppercase ml-1">实体名称</label>
                                <input
                                    className="w-full rounded-xl border border-amber-100 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                                    placeholder="例如：DeepSeek-V3"
                                    value={newEntity.name}
                                    onChange={e => setNewEntity({ ...newEntity, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-amber-700 uppercase ml-1">所属行业</label>
                                <input
                                    className="w-full rounded-xl border border-amber-100 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                                    placeholder="例如：人工智能"
                                    value={newEntity.industry}
                                    onChange={e => setNewEntity({ ...newEntity, industry: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 mt-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-amber-700 uppercase ml-1">关联词库 (英文逗号分隔)</label>
                                <textarea
                                    className="w-full rounded-xl border border-amber-100 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none min-h-[80px]"
                                    placeholder="深度求索,大模型,开源模型..."
                                    value={newEntity.keywords}
                                    onChange={e => setNewEntity({ ...newEntity, keywords: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-amber-700 uppercase ml-1">权威链接 (URL)</label>
                                <input
                                    className="w-full rounded-xl border border-amber-100 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                                    placeholder="https://example.com/wiki/..."
                                    value={newEntity.relatedUrls}
                                    onChange={e => setNewEntity({ ...newEntity, relatedUrls: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>取消</Button>
                            <Button variant="default" size="sm" className="bg-amber-600 hover:bg-amber-700" onClick={handleAdd}>确认保存</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card className="border-gray-100 shadow-sm overflow-hidden">
                <CardHeader className="bg-gray-50/50 py-3 px-4 border-b border-gray-100 space-y-0 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-bold text-gray-700">现状列表 ({filteredEntities.length})</CardTitle>
                    <div className="relative w-48 lg:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="搜索实体、行业或标签..."
                            className="w-full pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <div className="overflow-x-auto overflow-y-visible relative">
                    <Table className="min-w-[600px]">
                        <TableHeader>
                            <TableRow className="bg-gray-50/30">
                                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 h-10 px-4 whitespace-nowrap">实体名称</TableHead>
                                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 h-10 px-4 whitespace-nowrap">行业分类</TableHead>
                                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 h-10 px-4">关联词组</TableHead>
                                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 h-10 px-4">权威链接</TableHead>
                                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 h-10 px-4 text-center sticky right-0 bg-gray-50/90 backdrop-blur-sm shadow-[-4px_0_12px_rgba(0,0,0,0.05)] w-[60px] z-10">操作</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEntities.map((entity) => (
                                <TableRow key={entity.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <TableCell className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                                                <Cpu className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900 whitespace-nowrap">{entity.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold whitespace-nowrap">
                                            {entity.industry}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                                            {entity.keywords.split(',').slice(0, 2).map((kw, idx) => (
                                                <span key={idx} className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] whitespace-nowrap">
                                                    <Hash className="w-2.5 h-2.5" />
                                                    {kw.trim()}
                                                </span>
                                            ))}
                                            {entity.keywords.split(',').length > 2 && (
                                                <span className="text-[10px] text-gray-300 font-medium">+{entity.keywords.split(',').length - 2}</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        {entity.relatedUrls ? (
                                            <div className="flex items-center gap-1.5 text-xs text-blue-500 font-medium hover:underline cursor-pointer truncate max-w-[100px]">
                                                <LinkIcon className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate">{entity.relatedUrls}</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-300 whitespace-nowrap">无链接</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-right sticky right-0 bg-white/90 backdrop-blur-sm shadow-[-4px_0_12px_rgba(0,0,0,0.05)] w-[60px] z-10 group-hover:bg-gray-50/90 transition-colors">
                                        <div className="flex justify-center">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 transition-all rounded-lg"
                                                onClick={() => handleDelete(entity.id)}
                                                title="删除该实体"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {filteredEntities.length === 0 && (
                        <div className="py-12 text-center">
                            <Tag className="w-12 h-12 text-gray-100 mx-auto mb-3" />
                            <p className="text-gray-400 text-sm">尚未建立行业实体知识库</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
