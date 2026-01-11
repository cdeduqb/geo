'use client';

import { useState, useEffect } from 'react';
import {
    Save, Loader2, Layout, Eye, Plus, Trash2, ChevronDown, ChevronRight,
    Image as ImageIcon, Palette, Phone, Mail, MapPin, Share2, X, Check, Globe, Building, FileText, Sparkles, Shield, ShieldCheck, Upload
} from 'lucide-react';
import { PageRenderer } from '@/components/PageRenderer';
import ImageUpload from '@/components/ui/ImageUpload';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getI18nSettings } from '@/lib/system-settings';

interface Template {
    id: string;
    name: string;
    description: string;
    preview?: string;
    sections: any;
    content?: string; // AI 生成的模板使用 content 字段
}

interface SectionConfig {
    id: string;
    type: string;
    data: Record<string, any>;
    style?: Record<string, any>;
}

interface SiteSettingsClientProps {
    initialData: {
        systemSettings: Record<string, string>;
        siteSettings: any;
        headerTemplates: Template[];
        footerTemplates: Template[];
    };
}

export default function SiteSettingsClient({ initialData }: SiteSettingsClientProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'header' | 'footer' | 'brand' | 'contact' | 'languages'>('header');

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && ['header', 'footer', 'brand', 'contact', 'languages'].includes(tab)) {
            setActiveTab(tab as any);
        }
    }, [searchParams]);

    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // 页眉/页脚组件状态
    const [headerSections, setHeaderSections] = useState<SectionConfig[]>(
        initialData.siteSettings?.headerSections || []
    );
    const [footerSections, setFooterSections] = useState<SectionConfig[]>(
        initialData.siteSettings?.footerSections || []
    );

    // 品牌和联系信息 - 合并 SystemSettings 和 SiteSettings
    const [brandSettings, setBrandSettings] = useState({
        site_name: initialData.systemSettings.site_name || initialData.siteSettings?.siteName || '',
        site_url: initialData.systemSettings.site_url || '',
        site_description: initialData.systemSettings.site_description || '',
        site_logo: initialData.systemSettings.site_logo || initialData.siteSettings?.logo || '',
        site_icon: initialData.systemSettings.site_icon || initialData.siteSettings?.favicon || '',
        company_name: initialData.systemSettings.company_name || '',
        icp_number: initialData.systemSettings.icp_number || '',
        primaryColor: initialData.siteSettings?.primaryColor || '#2563eb',
        enable_multi_language: initialData.systemSettings.enable_multi_language === 'true',
        copyright: initialData.systemSettings.copyright || initialData.siteSettings?.copyright || '',
        show_author_card: initialData.systemSettings.show_author_card === 'true',
        show_citations: initialData.systemSettings.show_citations !== 'false', // 默认显示
        show_entities: initialData.systemSettings.show_entities !== 'false', // 默认显示
    });

    const [contactSettings, setContactSettings] = useState({
        contact_email: initialData.systemSettings.contact_email || initialData.siteSettings?.email || '',
        contact_phone: initialData.systemSettings.contact_phone || initialData.siteSettings?.phone || '',
        contact_address: initialData.systemSettings.contact_address || initialData.siteSettings?.address || '',
    });

    const [verificationFiles, setVerificationFiles] = useState<any[]>(() => {
        try {
            return initialData.systemSettings.site_verification_files
                ? JSON.parse(initialData.systemSettings.site_verification_files)
                : [];
        } catch {
            return [];
        }
    });

    // 语言设置状态
    const [supportedLocales, setSupportedLocales] = useState<string[]>(() => {
        try {
            const settings = initialData.systemSettings.i18n_settings
                ? JSON.parse(initialData.systemSettings.i18n_settings)
                : {};
            return Array.isArray(settings.supportedLocales) ? settings.supportedLocales : ['zh', 'en'];
        } catch {
            return ['zh', 'en'];
        }
    });
    const [isAddingLang, setIsAddingLang] = useState(false);

    const AVAILABLE_LOCALES = [
        { code: 'en', name: '英语 (English)' },
        { code: 'ja', name: '日语 (日本語)' },
        { code: 'ko', name: '韩语 (한국어)' },
        { code: 'fr', name: '法语 (Français)' },
        { code: 'de', name: '德语 (Deutsch)' },
        { code: 'es', name: '西班牙语 (Español)' },
        { code: 'ru', name: '俄语 (Русский)' },
        { code: 'pt', name: '葡萄牙语 (Português)' },
        { code: 'ar', name: '阿拉伯语 (العربية)' },
    ];

    // 预览模式
    const [showPreview, setShowPreview] = useState(true);

    const [isLicensed, setIsLicensed] = useState<boolean | null>(null);
    const [licenseInfo, setLicenseInfo] = useState<{
        plan?: string;
        status?: string;
        daysRemaining?: number;
        expiresAt?: number;
    } | null>(null);

    useEffect(() => {
        const checkLicense = async () => {
            try {
                const res = await fetch('/api/license/info');
                const data = await res.json();
                setIsLicensed(data.licensed);
                if (data.license) {
                    setLicenseInfo(data.license);
                }
            } catch (error) {
                console.error('Failed to fetch license info:', error);
                setIsLicensed(false);
            }
        };
        checkLicense();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        setSaveSuccess(false);
        try {
            // 1. 保存 SystemSettings (基础设置)

            await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...brandSettings,
                    enable_multi_language: brandSettings.enable_multi_language ? 'true' : 'false',
                    show_author_card: brandSettings.show_author_card ? 'true' : 'false',
                    show_citations: brandSettings.show_citations ? 'true' : 'false',
                    show_entities: brandSettings.show_entities ? 'true' : 'false',
                    i18n_settings: JSON.stringify({
                        enableMultiLanguage: brandSettings.enable_multi_language,
                        defaultLocale: 'zh',
                        supportedLocales: supportedLocales
                    }),
                    ...contactSettings,
                    site_verification_files: JSON.stringify(verificationFiles),
                }),
            });

            // 2. 保存 SiteSettings (页眉页脚配置)
            await fetch('/api/admin/site-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: initialData.siteSettings?.id,
                    headerSections,
                    footerSections,
                    siteName: brandSettings.site_name,
                    logo: brandSettings.site_logo,
                    favicon: brandSettings.site_icon,
                    primaryColor: brandSettings.primaryColor,
                    phone: contactSettings.contact_phone,
                    email: contactSettings.contact_email,
                    address: contactSettings.contact_address,
                    copyright: brandSettings.copyright,
                }),
            });

            setSaveSuccess(true);
            router.refresh(); // Refresh client cache
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error('保存失败:', error);
            alert('保存失败，请重试');
        } finally {
            setIsSaving(false);
        }
    };


    // 应用模板
    const applyTemplate = (template: Template, type: 'header' | 'footer') => {
        let sections = template.sections;

        // 如果模板有 sections，使用 sections
        if (sections) {
            if (typeof sections === 'string') {
                try { sections = JSON.parse(sections); } catch { sections = []; }
            }
            if (!Array.isArray(sections)) {
                sections = sections ? [sections] : [];
            }
        }
        // 如果没有 sections 但有 content（AI 生成的模板），转换为 rich-text section
        else if (template.content && template.content.trim().length > 0) {
            sections = [{
                id: `section-${Date.now()}`,
                type: 'rich-text',
                data: { content: template.content },
                style: {}
            }];
        }
        // 否则为空数组
        else {
            sections = [];
        }

        if (type === 'header') {
            setHeaderSections(sections);
        } else {
            setFooterSections(sections);
        }
    };

    const tabs = [
        { id: 'header', label: '全局页眉', icon: Layout },
        { id: 'footer', label: '全局页脚', icon: Layout },
        { id: 'brand', label: '品牌资产', icon: Globe },
        { id: 'contact', label: '联系信息', icon: Phone },
        { id: 'languages', label: '语言设置', icon: Globe },
    ];

    const currentSections = activeTab === 'header' ? headerSections : footerSections;
    const currentTemplates = activeTab === 'header' ? initialData.headerTemplates : initialData.footerTemplates;

    return (
        <div className="space-y-6">
            {/* 页面标题区 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                        <Globe className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">站点设置</h1>
                        <p className="text-[13px] text-gray-500 font-medium">
                            配置全站通用的页眉、页脚、品牌和联系信息
                        </p>
                    </div>
                </div>

            </div>

            {/* 主操作栏：标签页 + 保存按钮 */}
            <div className="bg-white rounded-[24px] border border-gray-100 flex items-center justify-between gap-4 shadow-sm shadow-gray-100/50">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth px-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-blue-600 text-white shadow-xl shadow-blue-100'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-white'
                                }`}
                        >
                            <tab.icon className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="flex-shrink-0">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`flex items-center gap-2.5 px-8 py-3 rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg ${saveSuccess
                            ? 'bg-green-600 text-white shadow-green-100'
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100 hover:shadow-blue-200'
                            } disabled:opacity-50 active:scale-95 whitespace-nowrap`}
                    >
                        {isSaving ? (
                            <Loader2 className="w-4.5 h-4.5 animate-spin" />
                        ) : saveSuccess ? (
                            <Check className="w-4.5 h-4.5" />
                        ) : (
                            <Save className="w-4.5 h-4.5" />
                        )}
                        <span>{saveSuccess ? '已保存成功' : '立即保存更改'}</span>
                    </button>
                </div>
            </div>

            {/* 内容区域 */}
            <div className="min-h-[600px] transition-all duration-500">
                {/* 页眉/页脚配置 */}
                {(activeTab === 'header' || activeTab === 'footer') && (
                    <div className="grid grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* 左侧预览 */}
                        <div className="col-span-12 lg:col-span-8">
                            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm ring-1 ring-gray-100/50 overflow-hidden min-h-[500px] flex flex-col">
                                <div className="px-8 py-5 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-1">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-400/20 border border-red-400/30" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/20 border border-amber-400/30" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-400/20 border border-green-400/30" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-700 ml-2">
                                            {activeTab === 'header' ? '全局页眉' : '全局页脚'} · 实时预览
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                        <span className="text-[11px] font-bold text-green-600 uppercase tracking-wider">实时生效</span>
                                    </div>
                                </div>
                                <div className="flex-1 p-10 bg-[#fbfcfd] relative overflow-hidden">
                                    {/* 背景装饰 */}
                                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                                    <div className="relative z-10 bg-white rounded-3xl shadow-2xl shadow-indigo-100/50 border border-gray-100 overflow-hidden ring-1 ring-black/5">
                                        {currentSections.length > 0 ? (
                                            <PageRenderer
                                                sections={currentSections}
                                                systemSettings={{
                                                    siteName: brandSettings.site_name,
                                                    phone: contactSettings.contact_phone,
                                                    email: contactSettings.contact_email,
                                                    address: contactSettings.contact_address,
                                                }}
                                            />
                                        ) : (
                                            <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50/30">
                                                <div className="w-20 h-20 bg-white rounded-[24px] shadow-sm flex items-center justify-center mb-5 border border-gray-100">
                                                    <Layout className="w-10 h-10 text-indigo-400/40" />
                                                </div>
                                                <p className="text-base font-bold text-gray-900">未配置全局{activeTab === 'header' ? '页眉' : '页脚'}</p>
                                                <p className="text-sm text-gray-500 mt-2">请从右侧侧选择模板或组件进行配置</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 右侧选择器 */}
                        <div className="col-span-12 lg:col-span-4">
                            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm ring-1 ring-gray-100/50 flex flex-col h-[650px]">
                                <div className="p-6 border-b border-gray-50 sticky top-0 bg-white/90 backdrop-blur-md rounded-t-[32px] z-10">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                            可用模板库
                                        </h4>
                                        <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100/50 uppercase tracking-wider">
                                            {currentTemplates.length} 个可用模板
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                                    {currentTemplates.length > 0 ? (
                                        currentTemplates.map(template => (
                                            <button
                                                key={template.id}
                                                onClick={() => applyTemplate(template, activeTab)}
                                                className="w-full group relative bg-white rounded-3xl border border-gray-100 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 overflow-hidden p-0"
                                            >

                                                <div className="p-5 text-left bg-white">
                                                    <div className="font-bold text-[15px] text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                        {template.name}
                                                    </div>
                                                    {template.description && (
                                                        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed font-medium">
                                                            {template.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="absolute top-3 right-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                                                    <div className="bg-indigo-600 text-white p-2.5 rounded-2xl shadow-xl shadow-indigo-200">
                                                        <Plus className="w-4.5 h-4.5" />
                                                    </div>
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="text-center py-24 px-6">
                                            <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center mx-auto mb-5 border border-dashed border-gray-200">
                                                <FileText className="w-10 h-10 text-gray-200" />
                                            </div>
                                            <p className="font-bold text-gray-900">暂无可用模板</p>
                                            <p className="text-xs text-gray-500 mt-2 font-medium">请先在模板库中添加对应区域的模板</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 品牌资产 */}
                {activeTab === 'brand' && (
                    <div className="grid grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* 左侧信息列 */}
                        <div className="col-span-12 lg:col-span-8 space-y-8">
                            {/* 网站基本信息 */}
                            <div className="bg-white rounded-[32px] p-10 border border-gray-100 shadow-sm ring-1 ring-gray-100/50">
                                <div className="flex items-start gap-5 mb-10">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                                        <Globe className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 tracking-tight">网站基本信息</h3>
                                        <p className="text-sm text-gray-500 mt-1 font-medium">配置网站在全互联网中的身份特征</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[13px] font-bold text-gray-700 ml-1 block">网站名称</label>
                                        <input
                                            type="text"
                                            value={brandSettings.site_name}
                                            onChange={e => setBrandSettings(s => ({ ...s, site_name: e.target.value }))}
                                            placeholder="moli企业官网"
                                            className="w-full rounded-2xl border border-gray-300 bg-gray-50/50 px-6 py-4 text-sm font-bold text-gray-900 focus:border-blue-600 focus:bg-white transition-all outline-none placeholder:text-gray-300"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[13px] font-bold text-gray-700 ml-1 block">官方域名</label>
                                        <input
                                            type="url"
                                            value={brandSettings.site_url}
                                            onChange={e => setBrandSettings(s => ({ ...s, site_url: e.target.value }))}
                                            placeholder="https://example.com"
                                            className="w-full rounded-2xl border border-gray-300 bg-gray-50/50 px-6 py-4 text-sm font-bold text-blue-600 focus:border-blue-600 focus:bg-white transition-all outline-none placeholder:text-gray-300"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-[13px] font-bold text-gray-700 ml-1 block">搜索引擎描述 (SEO Description)</label>
                                        <textarea
                                            value={brandSettings.site_description}
                                            onChange={e => setBrandSettings(s => ({ ...s, site_description: e.target.value }))}
                                            placeholder="企业级内容管理系统..."
                                            rows={4}
                                            className="w-full rounded-2xl border border-gray-300 bg-gray-50/50 px-6 py-4 text-sm font-bold text-gray-900 focus:border-blue-600 focus:bg-white transition-all outline-none resize-none placeholder:text-gray-300 leading-relaxed"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 合规与备案 */}
                            <div className="bg-white rounded-[32px] p-10 border border-gray-100 shadow-sm ring-1 ring-gray-100/50">
                                <div className="flex items-start gap-5 mb-10">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                                        <Building className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 tracking-tight">合规与备案</h3>
                                        <p className="text-sm text-gray-500 mt-1 font-medium">管理企业主体信息及法律合规要求</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[13px] font-bold text-gray-700 ml-1 block">公司全称</label>
                                        <input
                                            type="text"
                                            value={brandSettings.company_name}
                                            onChange={e => setBrandSettings(s => ({ ...s, company_name: e.target.value }))}
                                            placeholder="XX 科技有限公司"
                                            className="w-full rounded-2xl border border-gray-300 bg-gray-50/50 px-6 py-4 text-sm font-bold text-gray-900 focus:border-blue-600 focus:bg-white transition-all outline-none placeholder:text-gray-300"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[13px] font-bold text-gray-700 ml-1 block">ICP 备案号</label>
                                        <input
                                            type="text"
                                            value={brandSettings.icp_number}
                                            onChange={e => setBrandSettings(s => ({ ...s, icp_number: e.target.value }))}
                                            placeholder="京ICP备12345678号"
                                            className="w-full rounded-2xl border border-gray-300 bg-gray-50/50 px-6 py-4 text-sm font-bold text-gray-900 focus:border-blue-600 focus:bg-white transition-all outline-none placeholder:text-gray-300"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-4">
                                        <div className="flex items-center justify-between ml-1">
                                            <label className="text-[13px] font-bold text-gray-700 flex items-center gap-2">
                                                版权信息
                                            </label>
                                            {isLicensed !== null && (
                                                <div className="flex gap-2">
                                                    {isLicensed ? (
                                                        <Link href="/admin/license" className="text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg border border-green-200/50 flex items-center gap-1 uppercase tracking-wider">
                                                            <Check className="w-3 h-3" /> 已授权
                                                        </Link>
                                                    ) : (
                                                        <Link href="/admin/license" className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200/50 flex items-center gap-1 uppercase tracking-wider">
                                                            <Sparkles className="w-3 h-3 animate-pulse" /> 激活授权
                                                        </Link>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            value={brandSettings.copyright}
                                            onChange={e => setBrandSettings(s => ({ ...s, copyright: e.target.value }))}
                                            placeholder={isLicensed ? "© 2024 您的公司名称. 保留所有权利。" : "需授权后方可配置自定义版权"}
                                            disabled={!isLicensed}
                                            className={`w-full rounded-2xl border border-gray-300 bg-gray-50/50 px-6 py-4 text-sm font-bold transition-all outline-none ${!isLicensed ? 'opacity-50 cursor-not-allowed grayscale bg-gray-100' : 'text-gray-900 focus:border-blue-600 focus:bg-white'}`}
                                        />
                                        <div className="flex items-center gap-2 bg-blue-50/30 p-4 rounded-2xl border border-blue-100/50">
                                            <Shield className={`w-4 h-4 ${isLicensed ? 'text-green-500' : 'text-blue-400 opacity-60'}`} />
                                            <p className="text-[11px] text-gray-500 font-bold leading-none">
                                                {isLicensed
                                                    ? "自定义版权文案将自动注入页脚组件底部。"
                                                    : "未获商业许可：默认显示【全域魔力官方标识】且无法修改。"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 站点验证文件 */}
                            <div className="bg-white rounded-[32px] p-10 border border-gray-100 shadow-sm ring-1 ring-gray-100/50">
                                <div className="flex items-start gap-5 mb-10">
                                    <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 shadow-inner">
                                        <ShieldCheck className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 tracking-tight">站点所有权验证</h3>
                                        <p className="text-sm text-gray-500 mt-1 font-medium">配置百度、谷歌等搜索引擎验证文件 (.html)</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {verificationFiles.map((file, index) => (
                                        <div key={index} className="p-5 bg-gray-50/50 rounded-2xl border border-gray-200/50 space-y-3 group hover:bg-white hover:shadow-lg transition-all duration-300">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[11px] font-bold text-gray-500 uppercase">验证文件名 (带后缀)</label>
                                                    <input
                                                        type="text"
                                                        value={file.filename}
                                                        onChange={(e) => {
                                                            const newFiles = [...verificationFiles];
                                                            newFiles[index].filename = e.target.value;
                                                            setVerificationFiles(newFiles);
                                                        }}
                                                        placeholder="baidu_verify_code.html"
                                                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-900 focus:border-blue-500 outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between items-center">
                                                        <label className="text-[11px] font-bold text-gray-500 uppercase">文件内容 (HTML/Text)</label>
                                                        <div className="relative group cursor-pointer">
                                                            <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded hover:bg-blue-100 transition-colors">
                                                                <Upload className="w-3 h-3" /> 导入文件
                                                            </div>
                                                            <input
                                                                type="file"
                                                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                                                onChange={(e) => {
                                                                    const uploadedFile = e.target.files?.[0];
                                                                    if (uploadedFile) {
                                                                        const reader = new FileReader();
                                                                        reader.onload = (ev) => {
                                                                            const content = ev.target?.result as string;
                                                                            const newFiles = [...verificationFiles];
                                                                            // 如果文件名为空，自动填充文件名
                                                                            if (!newFiles[index].filename || newFiles[index].filename.trim() === '') {
                                                                                newFiles[index].filename = uploadedFile.name;
                                                                            }
                                                                            newFiles[index].content = content;
                                                                            setVerificationFiles(newFiles);
                                                                        };
                                                                        reader.readAsText(uploadedFile);
                                                                        e.target.value = ''; // 重置以允许重复上传
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={file.content}
                                                        onChange={(e) => {
                                                            const newFiles = [...verificationFiles];
                                                            newFiles[index].content = e.target.value;
                                                            setVerificationFiles(newFiles);
                                                        }}
                                                        placeholder="直接粘贴验证代码内容"
                                                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-900 focus:border-blue-500 outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end pt-2">
                                                <button
                                                    onClick={() => {
                                                        const newFiles = verificationFiles.filter((_, i) => i !== index);
                                                        setVerificationFiles(newFiles);
                                                    }}
                                                    className="text-xs text-red-500 hover:text-red-600 font-bold flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" /> 移除此验证
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        onClick={() => setVerificationFiles([...verificationFiles, { filename: '', content: '' }])}
                                        className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 font-bold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-5 h-5" />
                                        添加新验证文件
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 右侧视觉资产 */}
                        <div className="col-span-12 lg:col-span-4 space-y-8">
                            <div className="bg-white rounded-[32px] p-10 border border-gray-100 shadow-sm ring-1 ring-gray-100/50">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-inner">
                                        <ImageIcon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-black text-gray-900 tracking-tight">品牌视觉</h3>
                                        <p className="text-[11px] text-gray-500 mt-0.5 font-bold uppercase tracking-wider opacity-60">LOGO 资产管理</p>
                                    </div>
                                </div>

                                <div className="space-y-10 mt-12">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between ml-1">
                                            <span className="text-[13px] font-bold text-gray-700">主 Logo (180×48)</span>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">支持 PNG / SVG</span>
                                        </div>
                                        <ImageUpload
                                            value={brandSettings.site_logo}
                                            onChange={url => setBrandSettings(s => ({ ...s, site_logo: url }))}
                                            className="site-settings-upload-wrapper"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between ml-1">
                                            <span className="text-[13px] font-bold text-gray-700">网站图标 (Favicon)</span>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">支持 ICO / PNG</span>
                                        </div>
                                        <ImageUpload
                                            value={brandSettings.site_icon}
                                            onChange={url => setBrandSettings(s => ({ ...s, site_icon: url }))}
                                            className="site-settings-upload-wrapper"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-[32px] p-10 border border-gray-100 shadow-sm ring-1 ring-gray-100/50">
                                <div className="flex items-start gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-black text-gray-900 tracking-tight">内容展示</h3>
                                        <p className="text-[11px] text-gray-500 mt-0.5 font-bold uppercase tracking-wider opacity-60">文章详情页配置</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-200/50 hover:bg-white hover:border-gray-200 transition-all duration-300">
                                        <div>
                                            <span className="text-sm font-bold text-gray-900 block">显示作者卡片</span>
                                            <span className="text-xs text-gray-500 font-medium">在文章底部展示作者简介与头像</span>
                                        </div>
                                        <button
                                            onClick={() => setBrandSettings(s => ({ ...s, show_author_card: !s.show_author_card }))}
                                            className={`w-12 h-7 rounded-full transition-all duration-300 flex items-center p-1 cursor-pointer ${brandSettings.show_author_card ? 'bg-blue-600' : 'bg-gray-200'}`}
                                        >
                                            <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${brandSettings.show_author_card ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-200/50 hover:bg-white hover:border-gray-200 transition-all duration-300">
                                        <div>
                                            <span className="text-sm font-bold text-gray-900 block">显示参考资料</span>
                                            <span className="text-xs text-gray-500 font-medium">在文章底部展示引用来源与参考文献</span>
                                        </div>
                                        <button
                                            onClick={() => setBrandSettings(s => ({ ...s, show_citations: !s.show_citations }))}
                                            className={`w-12 h-7 rounded-full transition-all duration-300 flex items-center p-1 cursor-pointer ${brandSettings.show_citations ? 'bg-blue-600' : 'bg-gray-200'}`}
                                        >
                                            <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${brandSettings.show_citations ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-200/50 hover:bg-white hover:border-gray-200 transition-all duration-300">
                                        <div>
                                            <span className="text-sm font-bold text-gray-900 block">显示关键实体</span>
                                            <span className="text-xs text-gray-500 font-medium">在文章底部展示人物、地点、品牌等实体标签</span>
                                        </div>
                                        <button
                                            onClick={() => setBrandSettings(s => ({ ...s, show_entities: !s.show_entities }))}
                                            className={`w-12 h-7 rounded-full transition-all duration-300 flex items-center p-1 cursor-pointer ${brandSettings.show_entities ? 'bg-blue-600' : 'bg-gray-200'}`}
                                        >
                                            <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${brandSettings.show_entities ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                )}

                {/* 联系信息 */}
                {activeTab === 'contact' && (
                    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white rounded-[32px] p-12 border border-gray-100 shadow-sm ring-1 ring-gray-100/50">
                            <div className="flex items-start gap-6 mb-12">
                                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                                    <Phone className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">官方联系渠道</h3>
                                    <p className="text-gray-500 mt-2 text-base font-medium">这些信息将展示在网站页脚、联系页面及 AI 生成的回复中</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-[13px] font-black text-gray-700 ml-1 flex items-center gap-2 uppercase tracking-wider">
                                        <Phone className="w-4 h-4 text-blue-500" />
                                        客户服务热线
                                    </label>
                                    <input
                                        type="tel"
                                        value={contactSettings.contact_phone}
                                        onChange={e => setContactSettings(s => ({ ...s, contact_phone: e.target.value }))}
                                        placeholder="400-123-4567"
                                        className="w-full rounded-2xl border border-gray-300 bg-gray-50/50 px-6 py-5 text-base font-bold text-gray-900 focus:border-blue-600 focus:bg-white transition-all outline-none placeholder:text-gray-300"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[13px] font-black text-gray-700 ml-1 flex items-center gap-2 uppercase tracking-wider">
                                        <Mail className="w-4 h-4 text-blue-500" />
                                        官方公关邮箱
                                    </label>
                                    <input
                                        type="email"
                                        value={contactSettings.contact_email}
                                        onChange={e => setContactSettings(s => ({ ...s, contact_email: e.target.value }))}
                                        placeholder="contact@company.com"
                                        className="w-full rounded-2xl border border-gray-300 bg-gray-50/50 px-6 py-5 text-base font-bold text-gray-900 focus:border-blue-600 focus:bg-white transition-all outline-none placeholder:text-gray-300"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-[13px] font-black text-gray-700 ml-1 flex items-center gap-2 uppercase tracking-wider">
                                        <MapPin className="w-4 h-4 text-blue-500" />
                                        企业办公总部地址
                                    </label>
                                    <input
                                        type="text"
                                        value={contactSettings.contact_address}
                                        onChange={e => setContactSettings(s => ({ ...s, contact_address: e.target.value }))}
                                        placeholder="北京市朝阳区科技园 A 座 12 层"
                                        className="w-full rounded-2xl border border-gray-300 bg-gray-50/50 px-6 py-5 text-base font-bold text-gray-900 focus:border-blue-600 focus:bg-white transition-all outline-none placeholder:text-gray-300"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 语言设置 */}
                {activeTab === 'languages' && (
                    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* 授权墙 */}
                        {!isLicensed && isLicensed !== null && (
                            <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 rounded-[32px] p-12 overflow-hidden relative shadow-2xl shadow-blue-200">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] -mr-48 -mt-48" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -ml-32 -mb-32" />

                                <div className="flex flex-col md:flex-row items-start gap-10 relative z-10 text-white">
                                    <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl ring-1 ring-white/20 shadow-2xl flex items-center justify-center flex-shrink-0">
                                        <Shield className="w-12 h-12 text-blue-100" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-black mb-3 tracking-tight">多语言出海能力</h3>
                                        <p className="text-blue-100/70 text-[15px] mb-10 leading-relaxed font-bold">
                                            多语言模块是专为全球化出海企业设计的核心功能。激活授权后，您可即刻解锁<span className="text-white">“移除版权锁定、自定义全站版权”</span>以及<span className="text-white">“文章内容一键复刻翻译”</span>等核心出海能力，支持 50+ 语种极速分发。
                                        </p>
                                        <div className="flex flex-wrap gap-4">
                                            <Link
                                                href="/admin/license"
                                                className="flex items-center gap-2.5 px-8 py-4 bg-white text-blue-900 text-sm font-black rounded-2xl hover:bg-white/90 transition-all shadow-xl shadow-black/20 active:scale-95 group"
                                            >
                                                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" /> 立即激活授权
                                            </Link>
                                            <Link
                                                href="/admin/license"
                                                className="flex items-center gap-2.5 px-8 py-4 bg-white/10 text-white text-sm font-black rounded-2xl hover:bg-white/20 transition-all border border-white/20 backdrop-blur-md"
                                            >
                                                <Shield className="w-5 h-5" /> 输入激活码
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 语言设置 */}
                {activeTab === 'languages' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className={`bg-white rounded-[32px] p-10 border border-gray-100 shadow-sm ring-1 ring-gray-100/50 ${!isLicensed ? 'opacity-40 grayscale pointer-events-none blur-[2px]' : ''}`}>
                            <div className="flex items-center justify-between mb-12">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                                        <Globe className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 tracking-tight">核心出海设置</h3>
                                        <p className="text-sm text-gray-500 mt-1 font-medium">管理站点语言体系与多国翻译逻辑</p>
                                    </div>
                                </div>
                                {!isLicensed && (
                                    <div className="bg-blue-600 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.1em] shadow-lg shadow-blue-100 ring-4 ring-blue-50">
                                        专业版专属功能
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div className="group flex items-center justify-between p-8 bg-gray-50/50 hover:bg-white rounded-[28px] border border-transparent hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500">
                                    <div className="flex gap-5">
                                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                            <Globe className="w-7 h-7 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 text-lg tracking-tight">开启多语言支持</p>
                                            <p className="text-sm text-gray-400 mt-1.5 max-w-md font-bold leading-relaxed">
                                                激活后，写作中心将出现语言版本切换器。您可以为每个页面、产品及博客文章单独维护不同语言的版本。
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => isLicensed && setBrandSettings(s => ({ ...s, enable_multi_language: !s.enable_multi_language }))}
                                        disabled={!isLicensed}
                                        className={`relative inline-flex h-9 w-16 items-center rounded-full transition-all duration-500 focus:outline-none ring-offset-2 focus:ring-4 focus:ring-blue-600/10 ${brandSettings.enable_multi_language ? 'bg-blue-600 shadow-xl shadow-blue-200' : 'bg-gray-300'
                                            } ${!isLicensed ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        <span
                                            className={`inline-block h-7 w-7 transform rounded-full bg-white shadow-2xl transition-all duration-500 ${brandSettings.enable_multi_language ? 'translate-x-8' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>

                                {brandSettings.enable_multi_language && isLicensed && (
                                    <div className="p-8 bg-blue-50/30 rounded-[28px] border border-blue-100/50 animate-in zoom-in-95 duration-500">
                                        <h4 className="font-black text-blue-900 mb-6 flex items-center gap-2.5 text-base">
                                            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                                                <Check className="w-3.5 h-3.5 text-white" />
                                            </div>
                                            已激活的语言体系
                                        </h4>
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-blue-100 flex items-center justify-between group/lang hover:shadow-lg transition-all">
                                                <span className="font-black text-gray-900">中文 (简体)</span>
                                                <span className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded-md uppercase font-black tracking-wider">主语言</span>
                                            </div>

                                            {supportedLocales.filter(code => code !== 'zh').map(code => {
                                                const localeInfo = AVAILABLE_LOCALES.find(l => l.code === code);
                                                return (
                                                    <div key={code} className="bg-white/60 p-5 rounded-2xl border border-gray-100 flex items-center justify-between group/lang hover:bg-white hover:shadow-lg transition-all animate-in fade-in zoom-in duration-300">
                                                        <span className="font-bold text-gray-700 text-sm">{localeInfo?.name || code}</span>
                                                        <Trash2
                                                            className="w-4 h-4 text-gray-300 hover:text-red-500 cursor-pointer transition-colors"
                                                            onClick={() => setSupportedLocales(prev => prev.filter(c => c !== code))}
                                                        />
                                                    </div>
                                                );
                                            })}

                                            {isAddingLang ? (
                                                <div className="col-span-2 bg-white p-4 rounded-2xl border border-blue-100 shadow-lg animate-in fade-in slide-in-from-top-2 z-10">
                                                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-50">
                                                        <span className="text-xs font-black text-gray-400 uppercase tracking-wider">选择语种</span>
                                                        <X
                                                            className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                                                            onClick={() => setIsAddingLang(false)}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                                                        {AVAILABLE_LOCALES.filter(l => !supportedLocales.includes(l.code)).map(locale => (
                                                            <button
                                                                key={locale.code}
                                                                onClick={() => {
                                                                    setSupportedLocales(prev => [...prev, locale.code]);
                                                                    setIsAddingLang(false);
                                                                }}
                                                                className="text-left px-3 py-2 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                                                            >
                                                                {locale.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setIsAddingLang(true)}
                                                    className="p-5 rounded-2xl border-2 border-dashed border-blue-200 text-blue-600 hover:bg-white hover:border-blue-400 transition-all font-black text-sm flex items-center justify-center gap-2 group/add"
                                                >
                                                    <Plus className="w-5 h-5 group-hover/add:rotate-90 transition-transform" /> 添加语种
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 授权状态卡片 (当已授权时显示) */}
                        {isLicensed && licenseInfo && (
                            <div className="bg-blue-600 rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-blue-200 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-1000" />
                                <div className="flex items-center gap-6 relative z-10">
                                    <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white ring-1 ring-white/20">
                                        <Shield className="w-8 h-8" />
                                    </div>
                                    <div className="text-white">
                                        <p className="font-black text-xl tracking-tight">出海能力已全面解锁</p>
                                        <p className="text-blue-100 text-sm font-bold mt-1 opacity-80">当前版本：{licenseInfo.plan === 'ANNUAL' ? '年度版' : licenseInfo.plan === 'PERMANENT' ? '永久版' : licenseInfo.plan === 'Professional' ? '专业版' : licenseInfo.plan} · 享有全文翻译权益</p>
                                    </div>
                                </div>
                                <Link href="/admin/license" className="relative z-10 bg-white text-blue-600 px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all active:scale-95 shadow-xl shadow-black/10">
                                    管理授权详情
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
