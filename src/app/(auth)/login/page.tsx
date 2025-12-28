'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, ArrowRight, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || '登录失败');
            }

            // 登录成功，跳转到管理后台
            window.location.href = '/admin/dashboard';
        } catch (err) {
            setError(err instanceof Error ? err.message : '登录失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50  relative overflow-hidden">
            {/* 背景装饰 */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[100px]" />
            </div>

            <div className="max-w-md w-full mx-4 z-10">
                <div className="bg-white  rounded-2xl shadow-xl border border-gray-100  overflow-hidden">
                    {/* 头部 */}
                    <div className="px-8 pt-8 pb-6 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-6 shadow-lg shadow-blue-500/30">
                            <LayoutDashboard className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900  mb-2">
                            欢迎回来
                        </h1>
                        <p className="text-gray-500  text-sm">
                            登录 GeoCMS 管理系统继续操作
                        </p>
                    </div>

                    {/* 表单 */}
                    <div className="px-8 pb-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="bg-red-50  text-red-600  p-3 rounded-lg text-sm flex items-center animate-in fade-in slide-in-from-top-2">
                                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700  mb-1.5">
                                        邮箱地址
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={loading}
                                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300  rounded-xl bg-white  text-gray-900  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors sm:text-sm"
                                            placeholder="admin@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700  mb-1.5">
                                        密码
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            disabled={loading}
                                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300  rounded-xl bg-white  text-gray-900  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors sm:text-sm"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                        登录中...
                                    </>
                                ) : (
                                    <>
                                        登录
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* 底部 */}
                    <div className="px-8 py-6 bg-gray-50  border-t border-gray-100  text-center">
                        <p className="text-sm text-gray-600 ">
                            还没有账户？{' '}
                            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500  transition-colors">
                                立即注册
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center text-xs text-gray-400 ">
                    &copy; {new Date().getFullYear()} GeoCMS. All rights reserved.
                </div>
            </div>
        </div>
    );
}
