'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Users, Key, Activity, DollarSign, LogOut } from 'lucide-react';

export default function LicenseAdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('license-admin-token');
        if (!token) {
            router.push('/license-admin/login');
            return;
        }

        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/license-admin/stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error('获取统计失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('license-admin-token');
        router.push('/license-admin/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-500">加载中...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 顶部导航 */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <Shield className="w-8 h-8 text-blue-600" />
                            <h1 className="text-xl font-bold">授权系统管理</h1>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                            <LogOut className="w-4 h-4" />
                            退出登录
                        </button>
                    </div>
                </div>
            </header>

            {/* 主要内容 */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">仪表板</h2>
                    <p className="text-gray-500 mt-1">GeoCMS授权系统概览</p>
                </div>

                {/* 统计卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        title="总客户数"
                        value={stats?.customers || 0}
                        icon={Users}
                        color="blue"
                    />
                    <StatsCard
                        title="活跃授权"
                        value={stats?.activeLicenses || 0}
                        icon={Key}
                        color="green"
                    />
                    <StatsCard
                        title="在线实例"
                        value={stats?.onlineInstances || 0}
                        icon={Activity}
                        color="purple"
                    />
                    <StatsCard
                        title="本月收入"
                        value={`¥${stats?.monthlyRevenue || 0}`}
                        icon={DollarSign}
                        color="yellow"
                    />
                </div>

                {/* 快捷操作 */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4">快捷操作</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <QuickAction
                            title="客户管理"
                            description="创建和管理客户"
                            href="/license-admin/customers"
                            external={false}
                        />
                        <QuickAction
                            title="生成授权码"
                            description="创建新的授权许可"
                            href="/license-admin/generate"
                            external={false}
                        />
                        <QuickAction
                            title="域名统计"
                            description="查看所有域名及授权状态"
                            href="/license-admin/domains"
                            external={false}
                        />
                    </div>
                </div>

                {/* 提示信息 */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                        <Shield className="w-6 h-6 text-blue-600 mt-1" />
                        <div>
                            <h4 className="font-semibold text-blue-900 mb-2">推荐使用Prisma Studio</h4>
                            <p className="text-blue-700 text-sm mb-3">
                                完整的数据库管理功能，可以直接管理客户、授权、订单等所有数据。
                            </p>
                            <a
                                href="http://localhost:5556"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                            >
                                打开Prisma Studio
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatsCard({ title, value, icon: Icon, color }: any) {
    const colors = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        yellow: 'bg-yellow-50 text-yellow-600'
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">{title}</span>
                <div className={`p-2 rounded-lg ${colors[color as keyof typeof colors]}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
        </div>
    );
}

function QuickAction({ title, description, href, external }: any) {
    return (
        <a
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
        >
            <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
            <p className="text-sm text-gray-500">{description}</p>
        </a>
    );
}
