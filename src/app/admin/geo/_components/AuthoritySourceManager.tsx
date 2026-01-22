'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus, Trash2, Globe, Shield, Star, ExternalLink, RefreshCw, Search, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface AuthoritySource {
    id: string;
    name: string;
    domain: string | null;
    category: string;
    trustLevel: number;
    isActive: boolean;
    description: string | null;
}

export default function AuthoritySourceManager() {
    const { showToast } = useToast();
    const [sources, setSources] = useState<AuthoritySource[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [isAdding, setIsAdding] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [newSource, setNewSource] = useState({
        name: '',
        domain: '',
        category: '科技/媒体',
        trustLevel: 4,
        description: '',
        isDomestic: true
    });

    useEffect(() => {
        fetchSources();
    }, []);

    const fetchSources = async () => {
        setRefreshing(true);
        try {
            const res = await fetch('/api/admin/geo/authority-sources');
            if (res.ok) {
                const data = await res.json();
                setSources(data.sources || []);
            }
        } catch (error) {
            console.error('Failed to fetch sources:', error);
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!newSource.name) return;
        try {
            const res = await fetch('/api/admin/geo/authority-sources', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSource),
            });
            if (res.ok) {
                showToast('信源已添加', 'success');
                setIsAdding(false);
                setNewSource({ name: '', domain: '', category: '科技/媒体', trustLevel: 4, description: '', isDomestic: true });
                fetchSources();
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
            const res = await fetch(`/api/admin/geo/authority-sources?id=${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                showToast('信源已删除', 'success');
                setConfirmDeleteId(null);
                fetchSources();
            }
        } catch (error) {
            showToast('删除失败', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredSources = sources.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.domain?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const renderStars = (level: number) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                        key={s}
                        className={`w-3 h-3 ${s <= level ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                    />
                ))}
            </div>
        );
    };

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
                title="确认删除信源"
                message="确定要删除该权威信源吗？此操作不可撤销。"
                confirmText="确认删除"
                confirmButtonClass="bg-red-600 hover:bg-red-700 shadow-lg shadow-red-100"
                onConfirm={() => confirmDeleteId && executeDelete(confirmDeleteId)}
                onCancel={() => setConfirmDeleteId(null)}
                isLoading={isDeleting}
            />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-gray-900 tracking-tight">国内权威信源库</h2>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">
                            管理国产 AI 模型优先引用的白名单信源及其权重
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setIsAdding(!isAdding)}
                        className="rounded-xl font-bold border-indigo-100 text-indigo-600 hover:bg-indigo-50"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        添加信源
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={fetchSources}
                        disabled={refreshing}
                        className="rounded-xl"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            {isAdding && (
                <Card className="border-indigo-100 bg-indigo-50/30 overflow-hidden shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
                    <CardHeader className="pb-3 px-6 pt-6">
                        <CardTitle className="text-sm font-bold text-indigo-900">新增权威信源</CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-indigo-700 uppercase ml-1">名称</label>
                                <input
                                    className="w-full rounded-xl border border-indigo-100 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="例如：36氪"
                                    value={newSource.name}
                                    onChange={e => setNewSource({ ...newSource, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-indigo-700 uppercase ml-1">域名 (可选)</label>
                                <input
                                    className="w-full rounded-xl border border-indigo-100 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="36kr.com"
                                    value={newSource.domain}
                                    onChange={e => setNewSource({ ...newSource, domain: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-indigo-700 uppercase ml-1">信任等级 (1-5)</label>
                                <select
                                    className="w-full rounded-xl border border-indigo-100 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={newSource.trustLevel}
                                    onChange={e => setNewSource({ ...newSource, trustLevel: parseInt(e.target.value) })}
                                >
                                    <option value={5}>L5 - 绝对权威 (政务/公报)</option>
                                    <option value={4}>L4 - 行业顶流 (知乎/36氪)</option>
                                    <option value={3}>L3 - 专业信源 (垂直媒体)</option>
                                    <option value={2}>L2 - 一般参考 (博客/资讯)</option>
                                    <option value={1}>L1 - 低权重</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>取消</Button>
                            <Button variant="default" size="sm" className="bg-indigo-600 hover:bg-indigo-700" onClick={handleAdd}>确认保存</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card className="border-gray-100 shadow-sm overflow-hidden">
                <CardHeader className="bg-gray-50/50 py-3 px-4 border-b border-gray-100 space-y-0 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-bold text-gray-700">现状列表 ({filteredSources.length})</CardTitle>
                    <div className="relative w-48 lg:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="搜索信源名称或域名..."
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
                                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 h-10 px-4 whitespace-nowrap">信源名称</TableHead>
                                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 h-10 px-4 whitespace-nowrap">分类</TableHead>
                                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 h-10 px-4 whitespace-nowrap">信任权重</TableHead>
                                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 h-10 px-4 whitespace-nowrap">域名</TableHead>
                                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 h-10 px-4 text-center sticky right-0 bg-gray-50/90 backdrop-blur-sm shadow-[-4px_0_12px_rgba(0,0,0,0.05)] w-[60px] z-10">操作</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSources.map((source) => (
                                <TableRow key={source.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <TableCell className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                                                <Globe className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900 whitespace-nowrap">{source.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold whitespace-nowrap">
                                            {source.category}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        {renderStars(source.trustLevel)}
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        {source.domain ? (
                                            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium whitespace-nowrap">
                                                {source.domain}
                                                <ExternalLink className="w-3 h-3" />
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-300 whitespace-nowrap">未设置</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-right sticky right-0 bg-white/90 backdrop-blur-sm shadow-[-4px_0_12px_rgba(0,0,0,0.05)] w-[60px] z-10 group-hover:bg-gray-50/90 transition-colors">
                                        <div className="flex justify-center">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 transition-all rounded-lg"
                                                onClick={() => handleDelete(source.id)}
                                                title="删除该信源"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {filteredSources.length === 0 && (
                        <div className="py-12 text-center">
                            <Shield className="w-12 h-12 text-gray-100 mx-auto mb-3" />
                            <p className="text-gray-400 text-sm">未找到相关权威信源</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
