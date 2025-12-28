'use client';

import { useState, useEffect } from 'react';
import { Shield, Copy, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GenerateLicensePage() {
    const router = useRouter();
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [generatedLicense, setGeneratedLicense] = useState<any>(null);

    const [formData, setFormData] = useState({
        customerId: '',
        plan: 'ANNUAL',  // ANNUAL 或 PERMANENT
        domain: '',  // 单个域名
        validityDays: 365  // 365 或 36500(永久)
    });

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await fetch('/api/license-admin/customers');
            if (res.ok) {
                const data = await res.json();
                setCustomers(data.customers || []);
            }
        } catch (error) {
            console.error('获取客户失败:', error);
        }
    };

    const handlePlanChange = (plan: string) => {
        setFormData(prev => ({
            ...prev,
            plan,
            validityDays: plan === 'ANNUAL' ? 365 : 36500
        }));
    };

    const handleGenerate = async () => {
        if (!formData.customerId) {
            alert('请选择客户');
            return;
        }

        if (!formData.domain || !formData.domain.trim()) {
            alert('请输入授权域名');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/license-admin/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId: formData.customerId,
                    plan: formData.plan,
                    domains: formData.domain.trim(),  // 单个域名
                    maxActivations: 1,  // 固定为1
                    validityDays: formData.validityDays,
                    features: {}  // 不使用功能权限
                })
            });

            if (res.ok) {
                const data = await res.json();
                setGeneratedLicense(data.license);
            } else {
                const error = await res.json();
                alert(error.error || '生成失败');
            }
        } catch (error) {
            alert('生成失败');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="text-blue-600 hover:text-blue-700 mb-4"
                    >
                        ← 返回
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">生成授权码</h1>
                    <p className="text-gray-500 mt-2">创建新的授权许可证（一码一域名）</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 左侧：表单 */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold mb-6">授权信息</h2>

                        <div className="space-y-6">
                            {/* 客户选择 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    选择客户 *
                                </label>
                                <select
                                    value={formData.customerId}
                                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">请选择客户</option>
                                    {customers.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {c.companyName || c.email} {c.contactPerson && `- ${c.contactPerson}`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* 套餐类型 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    授权套餐 *
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handlePlanChange('ANNUAL')}
                                        className={`px-6 py-4 rounded-lg border-2 font-medium transition-all ${formData.plan === 'ANNUAL'
                                                ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="text-lg font-bold">1年授权</div>
                                        <div className="text-xs text-gray-500 mt-1">365天有效期</div>
                                    </button>
                                    <button
                                        onClick={() => handlePlanChange('PERMANENT')}
                                        className={`px-6 py-4 rounded-lg border-2 font-medium transition-all ${formData.plan === 'PERMANENT'
                                                ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="text-lg font-bold">永久授权</div>
                                        <div className="text-xs text-gray-500 mt-1">100年有效期</div>
                                    </button>
                                </div>
                            </div>

                            {/* 授权域名 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    授权域名 *
                                </label>
                                <input
                                    type="text"
                                    value={formData.domain}
                                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                                    placeholder="example.com"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    每个授权码只能绑定一个域名，且只能使用一次
                                </p>
                            </div>

                            {/* 有效期显示 */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">授权有效期</span>
                                    <span className="text-lg font-semibold text-gray-900">
                                        {formData.plan === 'ANNUAL' ? '1年' : '永久'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-sm text-gray-600">使用次数</span>
                                    <span className="text-lg font-semibold text-gray-900">仅可激活1次</span>
                                </div>
                            </div>

                            {/* 生成按钮 */}
                            <button
                                onClick={handleGenerate}
                                disabled={loading || !formData.customerId || !formData.domain}
                                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? '生成中...' : '生成授权码'}
                            </button>
                        </div>
                    </div>

                    {/* 右侧：生成结果 */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold mb-6">生成结果</h2>

                        {generatedLicense ? (
                            <div className="space-y-4">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-green-700">
                                        <Check className="w-5 h-5" />
                                        <span className="font-medium">授权码生成成功！</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        授权码
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={generatedLicense.licenseCode}
                                            readOnly
                                            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm"
                                        />
                                        <button
                                            onClick={() => copyToClipboard(generatedLicense.licenseCode)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                        >
                                            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                    <div>
                                        <span className="text-sm text-gray-500">套餐</span>
                                        <p className="font-medium mt-1">
                                            {generatedLicense.plan === 'ANNUAL' ? '1年授权' : '永久授权'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">有效期</span>
                                        <p className="font-medium mt-1">
                                            {generatedLicense.plan === 'ANNUAL' ? '1年' : '永久'}
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-sm text-gray-500">授权域名</span>
                                        <p className="font-medium mt-1 text-blue-600">
                                            {generatedLicense.domains?.[0] || '未设置'}
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-sm text-gray-500">状态</span>
                                        <p className="font-medium mt-1 text-green-600">未激活</p>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800">
                                    ⚠️ 此授权码只能使用一次，激活后不可重复使用
                                </div>

                                <button
                                    onClick={() => {
                                        setGeneratedLicense(null);
                                        setFormData({ ...formData, domain: '' });
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    生成下一个
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-400">
                                <Shield className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p>填写左侧信息并点击"生成授权码"</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
