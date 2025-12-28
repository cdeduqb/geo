'use client';

import { useState, useEffect } from 'react';
import { Globe, Filter, CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DomainsPage() {
    const router = useRouter();
    const [domains, setDomains] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');  // all, licensed, unlicensed

    useEffect(() => {
        fetchDomains();
    }, []);

    const fetchDomains = async () => {
        try {
            const res = await fetch('/api/license-admin/domains');
            if (res.ok) {
                const data = await res.json();
                setDomains(data.domains || []);
            }
        } catch (error) {
            console.error('获取域名失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredDomains = domains.filter(d => {
        if (filter === 'licensed') return d.isLicensed;
        if (filter === 'unlicensed') return !d.isLicensed;
        return true;
    });

    const stats = {
        total: domains.length,
        licensed: domains.filter(d => d.isLicensed).length,
        unlicensed: domains.filter(d => !d.isLicensed).length
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        返回
                    </button>

                    <h1 className="text-3xl font-bold text-gray-900">域名统计</h1>
                    <p className="text-gray-500 mt-2">查看所有安装GeoCMS的域名及授权状态</p>
                </div>

                {/* 统计卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">总域名数</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                            </div>
                            <Globe className="w-12 h-12 text-gray-300" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">已授权</p>
                                <p className="text-3xl font-bold text-green-600 mt-2">{stats.licensed}</p>
                            </div>
                            <CheckCircle className="w-12 h-12 text-green-300" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">未授权</p>
                                <p className="text-3xl font-bold text-red-600 mt-2">{stats.unlicensed}</p>
                            </div>
                            <XCircle className="w-12 h-12 text-red-300" />
                        </div>
                    </div>
                </div>

                {/* 筛选器 */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                    <div className="flex items-center gap-4">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <div className="flex gap-2">
                            {[
                                { value: 'all', label: '全部' },
                                { value: 'licensed', label: '已授权' },
                                { value: 'unlicensed', label: '未授权' }
                            ].map(f => (
                                <button
                                    key={f.value}
                                    onClick={() => setFilter(f.value)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f.value
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 域名列表 */}
                <div className="bg-white rounded-lg border border-gray-200">
                    {loading ? (
                        <div className="p-12 text-center text-gray-500">加载中...</div>
                    ) : filteredDomains.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p>暂无域名数据</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">域名</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">授权状态</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">授权码</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">套餐</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">激活时间</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">过期时间</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredDomains.map((domain, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Globe className="w-4 h-4 text-gray-400" />
                                                    <span className="font-medium text-gray-900">{domain.domain}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {domain.isLicensed ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                                                        <CheckCircle className="w-3 h-3" />
                                                        已授权
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                                                        <XCircle className="w-3 h-3" />
                                                        未授权
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {domain.licenseCode ? (
                                                    <span className="font-mono text-sm text-gray-600">{domain.licenseCode}</span>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {domain.plan ? (
                                                    <span className="text-sm text-gray-900">{domain.plan === 'ANNUAL' ? '1年授权' : '永久授权'}</span>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {domain.activatedAt ? (
                                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(domain.activatedAt).toLocaleDateString('zh-CN')}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {domain.expiresAt ? (
                                                    <span className={`text-sm ${new Date(domain.expiresAt) < new Date()
                                                            ? 'text-red-600 font-medium'
                                                            : 'text-gray-600'
                                                        }`}>
                                                        {new Date(domain.expiresAt).toLocaleDateString('zh-CN')}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
