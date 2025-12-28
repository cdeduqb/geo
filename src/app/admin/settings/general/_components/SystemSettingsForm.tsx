'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, Globe } from 'lucide-react';
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

    const settingFields = [
        {
            section: '网站基本信息',
            fields: [
                { key: 'site_name', label: '网站名称', placeholder: 'GeoCMS', type: 'text' },
                { key: 'site_url', label: '网站域名 (URL)', placeholder: 'https://example.com', type: 'url' },
                { key: 'site_description', label: '网站描述', placeholder: '企业级内容管理系统', type: 'textarea' },
                { key: 'site_logo', label: 'Logo', placeholder: '', type: 'image' },
                { key: 'site_icon', label: '图标', placeholder: '', type: 'image' },
            ],
        },
        {
            section: '联系方式',
            fields: [
                { key: 'contact_email', label: '联系邮箱', placeholder: 'contact@example.com', type: 'email' },
                { key: 'contact_phone', label: '联系电话', placeholder: '400-123-4567', type: 'tel' },
                { key: 'contact_address', label: '联系地址', placeholder: '北京市朝阳区...', type: 'text' },
            ],
        },
        {
            section: '备案信息',
            fields: [
                { key: 'company_name', label: '公司名称', placeholder: 'XX 科技有限公司', type: 'text' },
                { key: 'icp_number', label: 'ICP 备案号', placeholder: '京ICP备12345678号', type: 'text' },
            ],
        },
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {success && (
                <div className="rounded-lg bg-green-50 p-4 text-sm text-green-600 border border-green-200">
                    设置已成功保存！
                </div>
            )}

            {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {settingFields.map((section, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold mb-4 text-gray-900">{section.section}</h2>
                        <div className="space-y-4">
                            {section.fields.map(field => (
                                <div key={field.key} className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        {field.label}
                                    </label>
                                    {field.type === 'image' ? (
                                        <ImageUpload
                                            value={settings[field.key] || ''}
                                            onChange={(url) => handleChange(field.key, url)}
                                            label={`上传${field.label}`}
                                        />
                                    ) : field.type === 'textarea' ? (
                                        <textarea
                                            value={settings[field.key] || ''}
                                            onChange={e => handleChange(field.key, e.target.value)}
                                            placeholder={field.placeholder}
                                            rows={3}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    ) : (
                                        <input
                                            type={field.type}
                                            value={settings[field.key] || ''}
                                            onChange={e => handleChange(field.key, e.target.value)}
                                            placeholder={field.placeholder}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* 多语言设置 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-blue-600" />
                        多语言设置
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="text-sm font-medium text-gray-700">启用多语言</label>
                                <p className="text-xs text-gray-500 mt-1">
                                    开启后将显示语言切换器、翻译按钮等多语言相关功能
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleI18nChange('enableMultiLanguage', !i18nSettings.enableMultiLanguage)}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${i18nSettings.enableMultiLanguage ? 'bg-blue-600' : 'bg-gray-200'
                                    }`}
                            >
                                <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${i18nSettings.enableMultiLanguage ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                />
                            </button>
                        </div>

                        {i18nSettings.enableMultiLanguage && (
                            <div className="pt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-500">
                                    当前支持语言：简体中文 (zh)、English (en)
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-center mt-8 pt-6 border-t border-gray-100">
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            保存中...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4 mr-2" />
                            保存设置
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
