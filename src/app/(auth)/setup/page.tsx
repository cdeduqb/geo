'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Loader2, ShieldCheck, User, Mail, Lock, Globe } from 'lucide-react';

export default function SetupPage() {
    const [formData, setFormData] = useState({
        email: 'admin@example.com',
        username: 'admin',
        password: '',
        siteName: '我的智能企业官网',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // 检查是否允许初始化
    useEffect(() => {
        fetch('/api/auth/setup/status')
            .then(res => res.json())
            .then(data => {
                if (!data.setupRequired) {
                    window.location.href = '/login';
                }
            })
            .catch(err => console.error('Check setup status failed', err));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/setup/init', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setSuccess(true);
            // 3秒后跳转到登录
            setTimeout(() => {
                window.location.href = '/login';
            }, 3000);
        } catch (err: any) {
            setError(err.message || '初始化失败');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md w-full border border-green-100">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">系统初始化成功！</h1>
                    <p className="text-gray-600 mb-4">管理员账户和系统基础配置已准备就绪。</p>
                    <p className="text-sm text-green-600 font-medium">正在为您跳转到登录页面...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
            <div className="max-w-xl w-full">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-200 mb-6">
                        <Sparkles className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">欢迎使用智能管理系统</h1>
                    <p className="text-gray-500 mt-2 text-lg">检测到系统尚未初始化，请设置您的首个管理员账户</p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-100/50 border border-indigo-50 overflow-hidden">
                    <div className="p-8 sm:p-12">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                        <Globe className="w-4 h-4 mr-2 text-indigo-500" />
                                        网站名称
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="例如：公司门户、内部管理系统"
                                        value={formData.siteName}
                                        onChange={e => setFormData({ ...formData, siteName: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                            <Mail className="w-4 h-4 mr-2 text-indigo-500" />
                                            管理员邮箱
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                            <User className="w-4 h-4 mr-2 text-indigo-500" />
                                            登录用户名
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                            value={formData.username}
                                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                        <Lock className="w-4 h-4 mr-2 text-indigo-500" />
                                        管理员密码
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="请设置强密码（至少6位）"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <p className="mt-2 text-xs text-gray-400">请务必牢记此密码，这是您首次登录系统的凭证。</p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        正在初始化系统...
                                    </>
                                ) : (
                                    '立即创建并进入系统'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
