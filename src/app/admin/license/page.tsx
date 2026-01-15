'use client';

import { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, Clock, AlertTriangle, Key, Globe, Sparkles, Loader2, X, Check, Building, Layout, Fingerprint, Zap, ShieldCheck, ArrowRight, RefreshCw, Star, ChevronRight } from 'lucide-react';
import Link from 'next/link';

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
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-400 font-bold text-xs tracking-widest uppercase">正在同步授权状态...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* 页面标题区 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">授权管理</h1>
                    </div>
                </div>
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
            case 'active': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            case 'expired': return 'text-red-600 bg-red-50 border-red-100';
            case 'suspended': return 'text-amber-600 bg-amber-50 border-amber-100';
            default: return 'text-gray-600 bg-gray-50 border-gray-100';
        }
    };

    return (
        <div className="space-y-6">
            {/* 核心状态卡片 */}
            <div className="bg-blue-600 rounded-[28px] p-8 overflow-hidden relative shadow-xl shadow-blue-100 group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl ring-1 ring-white/20 flex items-center justify-center text-white shadow-xl">
                        <CheckCircle className="w-8 h-8 text-emerald-300" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-black text-white tracking-tight mb-1">出海能力已全面解锁</h2>
                        <p className="text-blue-100/70 text-sm font-bold leading-relaxed">
                            当前版本：{license.plan === 'ANNUAL' ? '年度版' : license.plan === 'PERMANENT' ? '永久版' : license.plan === 'Professional' ? '专业版' : license.plan} · 享有全文翻译权益
                        </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/10 text-center min-w-[120px]">
                        <p className="text-[9px] text-white/50 font-black uppercase tracking-widest mb-0.5">当前版本</p>
                        <p className="text-lg font-black text-white uppercase tracking-tight">
                            {license.plan === 'Professional' ? '专业版' :
                                license.plan === 'ANNUAL' ? '年度版' :
                                    license.plan === 'PERMANENT' ? '永久版' :
                                        license.plan}
                        </p>
                    </div>
                </div>
            </div>

            {/* 详细信息网格 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-[28px] p-8 border border-gray-100 shadow-sm ring-1 ring-gray-100/50 space-y-8">
                    <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                        <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                            <Key className="w-5 h-5 text-blue-600" />
                            许可证详情
                        </h3>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(license.status)}`}>
                            {license.status === 'active' ? '● 运行中' : '未激活'}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <InfoItem label="授权代码" value={license.licenseCode} isMono={true} />
                        <InfoItem label="授权域名" value={license.domains.join(', ') || '云端绑定'} />
                        <InfoItem label="授权套餐" value={
                            license.plan === 'ANNUAL' ? '年度授权' :
                                license.plan === 'PERMANENT' ? '永久授权' :
                                    license.plan === 'Professional' ? '专业版' :
                                        license.plan
                        } />
                        <InfoItem
                            label="有效期至"
                            value={license.expiresAt === -1 || !license.expiresAt ? '永久有效' : new Date(license.expiresAt).toLocaleDateString('zh-CN')}
                            subValue={license.daysRemaining > 0 ? `剩余 ${license.daysRemaining} 天` : null}
                            isWarning={license.daysRemaining <= 30 && license.daysRemaining > 0}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-[28px] p-8 border border-gray-100 shadow-sm ring-1 ring-gray-100/50 flex flex-col">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 shadow-inner">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <h4 className="font-black text-gray-900 mb-4 tracking-tight">核心权益</h4>
                    <ul className="space-y-3 flex-1 text-sm">
                        <BenefitItem text="自定义全站底部版权文案" />
                        <BenefitItem text="多语言版本一键翻译复刻" />
                        <BenefitItem text="移除系统所有锁定/演示标识" />
                        <BenefitItem text="官方技术专家 24/7 支持" />
                    </ul>
                    <button
                        onClick={() => onRefresh()}
                        className="w-full mt-6 bg-gray-50 text-gray-900 font-bold py-3 rounded-xl border border-gray-100 hover:bg-white hover:shadow-lg transition-all text-xs"
                    >
                        同步最新授权状态
                    </button>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ label, value, isMono = false, subValue, isWarning = false }: any) {
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{label}</label>
            <p className={`text-sm font-black tracking-tight ${isMono ? 'font-mono text-blue-600' : 'text-gray-900'} ${isWarning ? 'text-amber-600' : ''}`}>
                {value}
            </p>
            {subValue && (
                <p className={`text-[10px] font-bold ${isWarning ? 'text-amber-500 animate-pulse' : 'text-gray-400'}`}>
                    {subValue}
                </p>
            )}
        </div>
    );
}

function BenefitItem({ text }: { text: string }) {
    return (
        <li className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-2.5 h-2.5 text-emerald-600" />
            </div>
            <span className="font-bold text-gray-600 text-[13px]">{text}</span>
        </li>
    );
}

function UnlicensedView({ onActivate }: { onActivate: () => void }) {
    return (
        <div className="bg-white rounded-[28px] border border-gray-100 shadow-xl p-12 text-center animate-in zoom-in-95 duration-700">
            <div className="w-16 h-16 bg-amber-50 rounded-[20px] flex items-center justify-center mx-auto mb-8 border border-amber-100">
                <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">授权待激活</h2>
            <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-md mx-auto mb-10">
                当前系统未激活授权。激活后可即刻解锁：<br />
                <span className="text-blue-600 font-bold">自定义全站版权、多语言一键复刻、移除锁定标识</span>
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
                <button
                    onClick={onActivate}
                    className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-black shadow-lg shadow-gray-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    <Key className="w-4 h-4" /> 激活系统授权
                </button>
                <a
                    href="https://sq.moli123.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-10 py-4 border border-gray-200 text-gray-900 rounded-2xl font-black text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                    <Sparkles className="w-4 h-4" /> 咨询购买
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
    const [success, setSuccess] = useState(false);

    const handleActivate = async () => {
        if (!licenseCode) {
            setError('请输入授权激活码');
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
                setSuccess(true);
                onSuccess();
                // 显示成功提示 2 秒后关闭
                setTimeout(onClose, 2000);
            } else {
                setError(data.error || data.message || '激活验证失败，请核对后重试');
            }
        } catch (err) {
            setError('网络请求失败，请检查网络连接');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
            {/* 背景遮罩 */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-500 relative">
                {!success && (
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors border border-gray-100"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}

                <div className="p-10">
                    {success ? (
                        /* 激活成功状态 */
                        <div className="text-center py-6 animate-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-emerald-600" />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">激活成功！</h2>
                            <p className="text-gray-500 text-sm font-medium">
                                授权已激活，正在刷新页面...
                            </p>
                        </div>
                    ) : (
                        /* 激活表单 */
                        <>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-white">
                                    <Key className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-black text-gray-900 tracking-tight">激活商业授权</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-600 ml-1">激活码</label>
                                    <input
                                        type="text"
                                        value={licenseCode}
                                        onChange={(e) => setLicenseCode(e.target.value)}
                                        className="w-full rounded-xl border border-gray-300 bg-gray-50/50 px-4 py-3 text-sm font-bold text-gray-900 focus:border-blue-600 outline-none placeholder:text-gray-300 font-mono"
                                        placeholder="LIC-XXXX-XXXX-XXXX"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-600 ml-1">绑定域名 (可选)</label>
                                    <input
                                        type="text"
                                        value={domain}
                                        onChange={(e) => setDomain(e.target.value)}
                                        className="w-full rounded-xl border border-gray-300 bg-gray-50/50 px-4 py-3 text-sm font-bold text-gray-900 focus:border-blue-600 outline-none"
                                        placeholder="example.com"
                                    />
                                </div>

                                {error && (
                                    <p className="text-xs font-bold text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">
                                        ❌ {error}
                                    </p>
                                )}

                                <button
                                    onClick={handleActivate}
                                    disabled={loading}
                                    className="w-full py-4 bg-gray-900 text-white rounded-xl font-black text-sm hover:bg-black shadow-xl shadow-gray-100 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>立即激活 <Sparkles className="w-4 h-4" /></>}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
