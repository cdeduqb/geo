'use client';

import { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

interface LicenseInfo {
    licensed: boolean;
    license?: {
        licenseId: string;
        licenseCode: string;
        plan: string;
        status: string;
        domains: string[];
        features: string[];
        expiresAt: number;
        daysRemaining: number;
    };
}

export default function LicensePage() {
    const [licenseInfo, setLicenseInfo] = useState<LicenseInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [showActivation, setShowActivation] = useState(false);

    useEffect(() => {
        fetchLicenseInfo();
    }, []);

    const fetchLicenseInfo = async () => {
        try {
            const res = await fetch('/api/license/info');
            const data = await res.json();
            setLicenseInfo(data);
        } catch (error) {
            console.error('获取授权信息失败:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-6">加载中...</div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Shield className="w-8 h-8 text-blue-600" />
                    <h1 className="text-2xl font-bold">授权管理</h1>
                </div>

                {!licenseInfo?.licensed && (
                    <button
                        onClick={() => setShowActivation(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        激活授权
                    </button>
                )}
            </div>

            {licenseInfo?.licensed ? (
                <LicenseDetails license={licenseInfo.license!} onRefresh={fetchLicenseInfo} />
            ) : (
                <UnlicensedView onActivate={() => setShowActivation(true)} />
            )}

            {showActivation && (
                <ActivationModal
                    onClose={() => setShowActivation(false)}
                    onSuccess={fetchLicenseInfo}
                />
            )}
        </div>
    );
}

function LicenseDetails({ license, onRefresh }: any) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'text-green-600 bg-green-50';
            case 'expired': return 'text-red-600 bg-red-50';
            case 'suspended': return 'text-yellow-600 bg-yellow-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getPlanBadge = (plan: string) => {
        const colors = {
            TRIAL: 'bg-gray-100 text-gray-700',
            BASIC: 'bg-blue-100 text-blue-700',
            PRO: 'bg-purple-100 text-purple-700',
            ENTERPRISE: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
        };
        return colors[plan as keyof typeof colors] || colors.BASIC;
    };

    return (
        <div className="space-y-6">
            {/* 授权成功提示 */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div>
                        <h2 className="text-xl font-bold text-green-900">授权已激活</h2>
                        <p className="text-sm text-green-700 mt-1">您的GeoCMS系统已成功授权，所有功能均可正常使用</p>
                    </div>
                </div>
            </div>

            {/* 授权信息卡片 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold mb-4 text-lg">授权信息</h3>

                <div className="space-y-4">
                    {/* 套餐和状态 */}
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 w-24">套餐类型</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPlanBadge(license.plan)}`}>
                            {license.plan === 'ANNUAL' ? '1年授权' : license.plan === 'PERMANENT' ? '永久授权' : license.plan}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(license.status)}`}>
                            {license.status === 'active' ? '激活中' : '未激活'}
                        </span>
                    </div>

                    {/* 授权码 */}
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 w-24">授权码</span>
                        <span className="font-mono text-sm text-gray-700">{license.licenseCode}</span>
                    </div>

                    {/* 授权域名 */}
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 w-24">授权域名</span>
                        <span className="text-sm text-gray-700">{license.domains.join(', ') || '无限制'}</span>
                    </div>

                    {/* 有效期 */}
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 w-24">有效期至</span>
                        <span className="text-sm text-gray-700">{new Date(license.expiresAt).toLocaleDateString('zh-CN')}</span>
                        {license.daysRemaining <= 30 && (
                            <span className="flex items-center gap-1 text-yellow-600 text-sm">
                                <AlertTriangle className="w-4 h-4" />
                                剩余 {license.daysRemaining} 天
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* 说明 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                    <strong>温馨提示：</strong> 授权激活后，所有功能均可正常使用，无任何限制。
                </p>
            </div>
        </div>
    );
}

function UnlicensedView({ onActivate }: { onActivate: () => void }) {
    return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">未激活授权</h2>
            <p className="text-gray-600 mb-6">
                系统当前未激活授权，部分功能可能受限。请购买并激活授权以使用完整功能。
            </p>
            <div className="flex justify-center gap-4">
                <button
                    onClick={onActivate}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    立即激活
                </button>
                <a
                    href="https://moli123.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                    购买授权
                </a>
            </div>
        </div>
    );
}

function ActivationModal({ onClose, onSuccess }: any) {
    const [licenseCode, setLicenseCode] = useState('');
    const [domain, setDomain] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleActivate = async () => {
        if (!licenseCode) {
            setError('请输入授权码');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/license/activate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ licenseCode, domain })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                onSuccess();
                onClose();
            } else {
                setError(data.error || '激活失败');
            }
        } catch (err) {
            setError('激活请求失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h2 className="text-xl font-bold mb-4">激活授权</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">授权码</label>
                        <input
                            type="text"
                            value={licenseCode}
                            onChange={(e) => setLicenseCode(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="LIC-XXXX-XXXX-XXXX"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">域名（可选）</label>
                        <input
                            type="text"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="example.com"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={handleActivate}
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? '激活中...' : '激活'}
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            取消
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
