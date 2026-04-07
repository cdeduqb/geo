"use client";

import { useState } from "react";
import { createRedirect, deleteRedirect, toggleRedirectStatus } from "../actions";

export function RedirectList({ initialData }: { initialData: any[] }) {
    const [redirects, setRedirects] = useState(initialData);
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ oldPath: '/', newPath: '/', type: '301' });

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createRedirect(formData);
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert('添加失败，请检查是否已存在该旧路径的重定向！');
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (id: string, currentStatus: boolean) => {
        try {
            const res = await toggleRedirectStatus(id, !currentStatus);
            if (res.success) {
                setRedirects(redirects.map(r => r.id === id ? { ...r, isActive: !currentStatus } : r));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('确定要永久删除该重定向规则吗？')) return;
        try {
            await deleteRedirect(id);
            setRedirects(redirects.filter(r => r.id !== id));
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 border-l-4 border-blue-600 pl-3">现有规则池</h3>
                <button 
                    onClick={() => setIsAdding(!isAdding)}
                    className="px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                >
                    {isAdding ? '取消添加' : '+ 新增重定向拦截'}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleCreate} className="bg-gray-50 border border-gray-100 p-4 rounded-xl grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-4">
                        <label className="block text-xs font-medium text-gray-500 mb-1">拦截的失效链接 (需带 /)</label>
                        <input required type="text" value={formData.oldPath} onChange={e => setFormData({...formData, oldPath: e.target.value})} className="w-full px-3 py-2 text-sm border-gray-200 rounded-lg focus:ring-blue-500" placeholder="/article/old-slug" />
                    </div>
                    <div className="col-span-4">
                        <label className="block text-xs font-medium text-gray-500 mb-1">转移至新链接 (或外部http)</label>
                        <input required type="text" value={formData.newPath} onChange={e => setFormData({...formData, newPath: e.target.value})} className="w-full px-3 py-2 text-sm border-gray-200 rounded-lg focus:ring-blue-500" placeholder="/article/new-slug" />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">蜘蛛响应状态码</label>
                        <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 text-sm border-gray-200 rounded-lg focus:ring-blue-500">
                            <option value="301">301 (永久转移)</option>
                            <option value="302">302 (临时中转)</option>
                        </select>
                    </div>
                    <div className="col-span-2">
                        <button disabled={loading} type="submit" className="w-full h-[38px] bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">
                            保存并触发生效
                        </button>
                    </div>
                </form>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y border-b border-gray-200 divide-gray-200 text-sm">
                    <thead>
                        <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <th className="px-4 py-3">原始失效链接 (Old Path)</th>
                            <th className="px-4 py-3">去往何处 (New Path)</th>
                            <th className="px-4 py-3 text-center">301/302</th>
                            <th className="px-4 py-3 text-center">生效状态</th>
                            <th className="px-4 py-3 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-50">
                        {redirects.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-gray-400">目前暂无重定向拦截记录。</td>
                            </tr>
                        ) : redirects.map((route) => (
                            <tr key={route.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-4 py-3 font-medium text-gray-900 border-l-2 border-transparent hover:border-red-400">
                                    <span className="bg-red-50 text-red-600 px-2 py-1 rounded-md text-xs">{route.oldPath}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-gray-400 mx-2">→</span>
                                    <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs">{route.newPath}</span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${route.type === 301 ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {route.type}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span 
                                        onClick={() => handleToggle(route.id, route.isActive)}
                                        className={`cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${route.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${route.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                                        {route.isActive ? '拦截中' : '已暂停'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right space-x-3">
                                    <button onClick={() => handleDelete(route.id)} className="text-red-600 hover:text-red-900 font-medium">删除指令</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
