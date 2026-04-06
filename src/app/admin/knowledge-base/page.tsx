'use client';
import { useState, useEffect } from 'react';
import { Sparkles, Plus, Save, Trash, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function KnowledgeBaseManagement() {
    const [kbs, setKbs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState<string | null>(null);

    const [form, setForm] = useState({
        name: '',
        productServices: '',
        productFeatures: '',
        brandStory: '',
        userPainPoints: '',
        trustEndorsement: '',
        customerCases: '',
        otherInfo: '',
        lang: 'zh',
        isActive: true
    });

    const fetchKbs = async () => {
        try {
            const res = await fetch('/api/admin/knowledge-base');
            if (res.ok) {
                const data = await res.json();
                setKbs(data);
            }
        } catch (e) { }
    };

    useEffect(() => {
        fetchKbs();
    }, []);

    const resetForm = () => {
        setIsEditing(null);
        setForm({
            name: '', productServices: '', productFeatures: '', brandStory: '', userPainPoints: '',
            trustEndorsement: '', customerCases: '', otherInfo: '', lang: 'zh', isActive: true
        });
    }

    const handleEdit = (kb: any) => {
        setIsEditing(kb.id);
        setForm({
            name: kb.name || '',
            productServices: kb.productServices || '',
            productFeatures: kb.productFeatures || '',
            brandStory: kb.brandStory || '',
            userPainPoints: kb.userPainPoints || '',
            trustEndorsement: kb.trustEndorsement || '',
            customerCases: kb.customerCases || '',
            otherInfo: kb.otherInfo || '',
            lang: kb.lang || 'zh',
            isActive: kb.isActive
        })
    }

    const handleDelete = async (id: string) => {
        if (!confirm('确认删除此知识库包？')) return;
        try {
            await fetch(`/api/admin/knowledge-base/${id}`, { method: 'DELETE' });
            fetchKbs();
        } catch (e) { }
    }

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const url = isEditing ? `/api/admin/knowledge-base/${isEditing}` : '/api/admin/knowledge-base';
            const method = isEditing ? 'PUT' : 'POST';

            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            fetchKbs();
            resetForm();
        } catch (e) {
            alert('保存失败');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex justify-center items-center text-white"><Sparkles className="w-6 h-6" /></div>
                        RAG 企业知识库
                    </h1>
                    <p className="text-gray-500 mt-2">创建标准化结构知识包，为 AI 自动化生成提供事实根据和内部 SEO 内链树。</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 列表 */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold">可选知识包 ({kbs.length})</h3>
                        <button onClick={resetForm} className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-indigo-100">
                            <Plus className="w-4 h-4" /> 新增
                        </button>
                    </div>
                    {kbs.map(kb => (
                        <div key={kb.id} className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${isEditing === kb.id ? 'border-indigo-500 bg-indigo-50/30' : 'border-gray-100 bg-white hover:border-gray-200'}`} onClick={() => handleEdit(kb)}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-bold flex items-center gap-2">
                                        {kb.name}
                                        {!kb.isActive && <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded">停用</span>}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">{kb.lang === 'zh' ? '中文' : 'English'}</div>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); handleDelete(kb.id); }} className="text-red-400 hover:text-red-600"><Trash className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                    {kbs.length === 0 && <div className="text-sm text-gray-400 text-center py-10 border border-dashed rounded-xl">暂无知识库，请在右侧新增。</div>}
                </div>

                {/* 表单 */}
                <div className="lg:col-span-2 bg-white border rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                        {isEditing ? `编辑知识库: ${form.name}` : '新建知识库包裹'}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2">
                            <label className="text-xs font-bold text-gray-600">知识包名称</label>
                            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500" placeholder="如: 核心产品组知识" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-600">产品与服务</label>
                            <textarea value={form.productServices} onChange={e => setForm({ ...form, productServices: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm h-24 outline-none focus:border-indigo-500" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-600">产品特点/优势</label>
                            <textarea value={form.productFeatures} onChange={e => setForm({ ...form, productFeatures: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm h-24 outline-none focus:border-indigo-500" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-600">品牌故事</label>
                            <textarea value={form.brandStory} onChange={e => setForm({ ...form, brandStory: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm h-24 outline-none focus:border-indigo-500" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-600">目标用户痛点</label>
                            <textarea value={form.userPainPoints} onChange={e => setForm({ ...form, userPainPoints: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm h-24 outline-none focus:border-indigo-500" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-600">信任背书 (荣誉/资质)</label>
                            <textarea value={form.trustEndorsement} onChange={e => setForm({ ...form, trustEndorsement: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm h-24 outline-none focus:border-indigo-500" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-600">其他补充信息</label>
                            <textarea value={form.otherInfo} onChange={e => setForm({ ...form, otherInfo: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm h-24 outline-none focus:border-indigo-500" placeholder="行业背景、竞争优势等"></textarea>
                        </div>

                        <div className="col-span-2 flex items-center justify-between mt-4">
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                                    启用此知识包
                                </label>
                                <select value={form.lang} onChange={e => setForm({ ...form, lang: e.target.value })} className="text-sm border rounded px-2">
                                    <option value="zh">中文</option>
                                    <option value="en">English</option>
                                </select>
                            </div>

                            <button onClick={handleSave} disabled={!form.name || isLoading} className="bg-indigo-600 text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50">
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 保存知识包
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
