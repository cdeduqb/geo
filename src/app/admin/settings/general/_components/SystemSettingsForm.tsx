'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, Globe, Shield, Phone, Mail, MapPin } from 'lucide-react';
import ImageUpload from '@/components/ui/ImageUpload';

interface SystemSettingsFormProps {
    initialSettings: Record<string, string>;
}

export default function SystemSettingsForm({ initialSettings }: SystemSettingsFormProps) {
    const router = useRouter();
    const [settings, setSettings] = useState(initialSettings);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    // 样式常量
    const inputClass = "w-full rounded-2xl border border-gray-300 bg-gray-50/50 px-6 py-4 text-sm font-bold text-gray-900 focus:border-blue-600 focus:bg-white transition-all outline-none placeholder:text-gray-300";
    const labelClass = "text-[13px] font-bold text-gray-700 ml-1 block";
    const cardClass = "bg-white rounded-[32px] border border-gray-100 shadow-sm ring-1 ring-gray-100/50 p-10";

    // 解析 i18n_settings
    const i18nSettings = (() => {
        try {
            return settings.i18n_settings ? JSON.parse(settings.i18n_settings) : { enableMultiLanguage: false };
        } catch {
            return { enableMultiLanguage: false };
        }
    })();

    const handleChange = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleI18nChange = (key: string, value: any) => {
        const newI18n = { ...i18nSettings, [key]: value };
        setSettings(prev => ({ ...prev, i18n_settings: JSON.stringify(newI18n) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (!res.ok) {
                throw new Error('保存失败');
            }

            setSuccess(true);
            router.refresh();
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const settingSections = [
        {
            title: '网站基本信息',
            icon: Globe,
            color: 'bg-blue-50 text-blue-600',
            indicator: 'bg-blue-600',
            fields: [
                { key: 'site_name', label: '网站名称', placeholder: '全域魔力企业官网', type: 'text' },
                { key: 'site_url', label: '网站域名 (URL)', placeholder: 'https://example.com', type: 'url' },
                { key: 'site_description', label: '网站描述', placeholder: '企业级内容管理系统，助力全域流量增长', type: 'textarea' },
                { key: 'site_logo', label: 'Logo', placeholder: '', type: 'image' },
                { key: 'site_icon', label: '图标', placeholder: '', type: 'image' },
            ],
        },
        {
            title: '联系方式',
            icon: Phone,
            color: 'bg-green-50 text-green-600',
            indicator: 'bg-green-600',
            fields: [
                { key: 'contact_email', label: '联系邮箱', placeholder: 'contact@example.com', type: 'email', subIcon: Mail },
                { key: 'contact_phone', label: '联系电话', placeholder: '400-123-4567', type: 'tel', subIcon: Phone },
                { key: 'contact_address', label: '联系地址', placeholder: '北京市朝阳区...', type: 'text', subIcon: MapPin },
            ],
        },
        {
            title: '备案信息',
            icon: Shield,
            color: 'bg-orange-50 text-orange-600',
            indicator: 'bg-orange-600',
            fields: [
                { key: 'company_name', label: '公司名称', placeholder: '全域魔力科技有限公司', type: 'text' },
                { key: 'icp_number', label: 'ICP 备案号', placeholder: '京ICP备12345678号', type: 'text' },
            ],
        },
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {success && (
                <div className="rounded-2xl bg-green-50 p-5 text-sm font-bold text-green-700 border border-green-100 flex items-center gap-3 shadow-sm shadow-green-100/50">
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-green-600 shadow-sm">
                        <Save className="w-4 h-4" />
                    </div>
                    设置已成功保存！
                </div>
            )}

            {error && (
                <div className="rounded-2xl bg-red-50 p-5 text-sm font-bold text-red-700 border border-red-100 flex items-center gap-3 shadow-sm shadow-red-100/50">
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-red-600 shadow-sm">
                        <Shield className="w-4 h-4" />
                    </div>
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {settingSections.map((section, idx) => (
                    <div key={idx} className={cardClass}>
                        <div className="flex items-center gap-4 mb-10">
                            <div className={`w-14 h-14 rounded-2xl ${section.color} flex items-center justify-center shadow-inner`}>
                                <section.icon className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 tracking-tight">{section.title}</h3>
                                <p className="text-[13px] text-gray-500 mt-1 font-medium">配置网站核心参数与标识信息</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {section.fields.map(field => (
                                <div key={field.key} className="space-y-3">
                                    <label className={labelClass}>
                                        {field.label}
                                    </label>
                                    {field.type === 'image' ? (
                                        <ImageUpload
                                            value={settings[field.key] || ''}
                                            onChange={(url) => handleChange(field.key, url)}
                                            label={`上传${field.label}`}
                                            showDescription={idx === 0}
                                        />
                                    ) : field.type === 'textarea' ? (
                                        <textarea
                                            value={settings[field.key] || ''}
                                            onChange={e => handleChange(field.key, e.target.value)}
                                            placeholder={field.placeholder}
                                            rows={4}
                                            className={`${inputClass} resize-none leading-relaxed`}
                                        />
                                    ) : (
                                        <div className="relative group">
                                            {field.subIcon && (
                                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-blue-500 transition-colors">
                                                    <field.subIcon className="w-4.5 h-4.5" />
                                                </div>
                                            )}
                                            <input
                                                type={field.type}
                                                value={settings[field.key] || ''}
                                                onChange={e => handleChange(field.key, e.target.value)}
                                                placeholder={field.placeholder}
                                                className={`${inputClass} ${field.subIcon ? 'pl-12' : ''}`}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* 多语言设置 */}
                <div className={cardClass}>
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-inner">
                            <Globe className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">多语言设置</h3>
                            <p className="text-[13px] text-gray-500 mt-1 font-medium">扩展网站的国际化能力与全球触达</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-center justify-between p-6 bg-gray-50/50 rounded-[28px] border border-gray-100">
                            <div className="space-y-1">
                                <label className="text-[15px] font-black text-gray-900">启用多语言架构</label>
                                <p className="text-xs text-gray-500 font-medium">
                                    开启后将激活翻译工作流与语言切换系统
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleI18nChange('enableMultiLanguage', !i18nSettings.enableMultiLanguage)}
                                className={`relative inline-flex h-7 w-13 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none ring-offset-2 ${i18nSettings.enableMultiLanguage ? 'bg-blue-600 shadow-lg shadow-blue-200' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${i18nSettings.enableMultiLanguage ? 'translate-x-6' : 'translate-x-0'
                                        }`}
                                />
                            </button>
                        </div>

                        {i18nSettings.enableMultiLanguage && (
                            <div className="pt-6 border-t border-gray-50">
                                <p className="text-[13px] font-bold text-gray-700 bg-blue-50 px-4 py-3 rounded-xl border border-blue-100/50 inline-block">
                                    <Sparkles className="w-4 h-4 inline mr-2 text-blue-600" />
                                    当前支持语言：简体中文 (zh) & English (en)
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-8">
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-2xl bg-gray-900 px-10 py-4 text-sm font-black text-white shadow-2xl shadow-gray-200 hover:bg-blue-600 hover:shadow-blue-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin mr-3" />
                            正在同步系统配置...
                        </>
                    ) : (
                        <>
                            <Save className="h-5 w-5 mr-3" />
                            保存全局设置
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
