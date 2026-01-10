'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Loader2, Sparkles, Zap, Shield, BarChart3 } from 'lucide-react';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [copyright, setCopyright] = useState('');

    // 获取版权信息
    useEffect(() => {
        fetch('/api/public/copyright')
            .then(res => res.json())
            .then(data => {
                if (data.copyright) {
                    setCopyright(data.copyright);
                }
            })
            .catch(() => {
                setCopyright(`© ${new Date().getFullYear()} 企业官网. All rights reserved.`);
            });
    }, []);

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
        <div className="min-h-screen flex">
            {/* 左侧 - 品牌视觉展示区 */}
            <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800">
                {/* 背景装饰 */}
                <div className="absolute inset-0">
                    {/* 网格背景 */}
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
                            backgroundSize: '50px 50px'
                        }}
                    />
                    {/* 光晕效果 */}
                    <div className="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-400/20 rounded-full blur-[80px]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-[120px]" />

                    {/* 浮动装饰元素 */}
                    <div className="absolute top-[15%] left-[10%] w-20 h-20 border border-white/20 rounded-2xl rotate-12 animate-pulse" />
                    <div className="absolute top-[25%] right-[15%] w-16 h-16 border border-white/15 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute bottom-[20%] left-[20%] w-24 h-24 border border-white/10 rounded-3xl -rotate-12 animate-pulse" style={{ animationDelay: '2s' }} />
                    <div className="absolute bottom-[35%] right-[10%] w-12 h-12 bg-white/5 rounded-xl rotate-45" />
                </div>

                {/* 主内容 */}
                <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 w-full">
                    {/* Logo */}
                    <div className="mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
                            智能管理<br />从这里开始
                        </h1>
                        <p className="text-lg text-white/70 max-w-md leading-relaxed">
                            强大的AI驱动管理系统，助您高效管理内容、优化流程、提升效率
                        </p>
                    </div>

                    {/* 特性列表 */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                <Zap className="w-6 h-6 text-yellow-300" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">AI 智能创作</h3>
                                <p className="text-white/60 text-sm">一键生成高质量内容，效率提升10倍</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                <BarChart3 className="w-6 h-6 text-green-300" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">SEO 智能优化</h3>
                                <p className="text-white/60 text-sm">全自动推送，让搜索引擎更快收录</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                <Shield className="w-6 h-6 text-blue-300" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">GEO 智能优化</h3>
                                <p className="text-white/60 text-sm">全域AI搜索引擎优化，提升品牌曝光</p>
                            </div>
                        </div>
                    </div>

                    {/* 底部版权 */}
                    <div className="mt-16 pt-8 border-t border-white/10">
                        <p className="text-white/40 text-sm">
                            {copyright}
                        </p>
                    </div>
                </div>
            </div>

            {/* 右侧 - 登录表单区 */}
            <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-indigo-50/30">
                {/* 背景光晕 */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-400/15 rounded-full blur-[100px]" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-[100px]" />
                </div>

                {/* 微妙网格 */}
                <div
                    className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage: `linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* 表单容器 */}
                <div className="relative z-10 w-full max-w-lg mx-6 sm:mx-8 lg:mx-16">
                    {/* 移动端Logo（仅在小屏幕显示） */}
                    <div className="lg:hidden text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-lg shadow-indigo-500/25">
                            <Sparkles className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">智能管理系统</h1>
                    </div>

                    {/* 表单标题 */}
                    <div className="mb-10">
                        <h2 className="text-3xl xl:text-4xl font-bold text-gray-900 mb-3">
                            登录您的账户
                        </h2>
                        <p className="text-gray-500 text-lg">
                            欢迎回来，请输入您的登录信息
                        </p>
                    </div>

                    {/* 登录表单 */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 px-5 py-4 rounded-xl text-base flex items-center">
                                <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <div className="space-y-5">
                            {/* 账号 */}
                            <div>
                                <label htmlFor="identifier" className="block text-base font-medium text-gray-700 mb-2.5">
                                    账号 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="identifier"
                                    name="identifier"
                                    type="text"
                                    required
                                    value={formData.identifier}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="block w-full px-1 py-4 border-0 border-b-2 border-gray-200 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600 transition-all duration-300 text-base"
                                    placeholder="请输入用户名"
                                />
                            </div>

                            {/* 密码 */}
                            <div>
                                <label htmlFor="password" className="block text-base font-medium text-gray-700 mb-2.5">
                                    密码 <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="block w-full px-1 py-4 pr-12 border-0 border-b-2 border-gray-200 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600 transition-all duration-300 text-base"
                                        placeholder="请输入密码"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors p-1"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 登录按钮 - 纯色不使用渐变 */}
                        <div className="pt-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center py-4 px-6 rounded-xl text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-600/30"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                        登录中...
                                    </>
                                ) : (
                                    '立即登录'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* 底部版权（仅移动端显示） */}
                    <div className="lg:hidden mt-12 text-center text-sm text-gray-400">
                        {copyright}
                    </div>
                </div>
            </div>
        </div>
    );
}
