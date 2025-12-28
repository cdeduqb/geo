'use client';

import { useState, useEffect } from 'react';
import {
    Save, Loader2, Layout, Eye, Plus, Trash2, ChevronDown, ChevronRight,
    Image as ImageIcon, Palette, Phone, Mail, MapPin, Share2, X, Check, Globe, Building, FileText, Sparkles, Shield
} from 'lucide-react';
import { PageRenderer } from '@/components/PageRenderer';
import ImageUpload from '@/components/ui/ImageUpload';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

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
    });

    const [contactSettings, setContactSettings] = useState({
        contact_email: initialData.systemSettings.contact_email || initialData.siteSettings?.email || '',
        contact_phone: initialData.systemSettings.contact_phone || initialData.siteSettings?.phone || '',
        contact_address: initialData.systemSettings.contact_address || initialData.siteSettings?.address || '',
    });

    // 预览模式
    const [showPreview, setShowPreview] = useState(true);

    const [isLicensed, setIsLicensed] = useState<boolean | null>(null);

    useEffect(() => {
        const checkLicense = async () => {
            try {
                const res = await fetch('/api/license/info');
                const data = await res.json();
                setIsLicensed(data.licensed);
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
                    ...contactSettings,
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* 顶部标签栏 */}
            <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex gap-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm ${saveSuccess
                                ? 'bg-green-600 text-white'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                } disabled:opacity-50`}
                        >
                            {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : saveSuccess ? (
                                <Check className="w-4 h-4" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {saveSuccess ? '已保存' : '保存设置'}
                        </button>
                    </div>
                </div>
            </div>

            {/* 内容区域 */}
            <div className="p-6">
                {/* 页眉/页脚配置 */}
                {(activeTab === 'header' || activeTab === 'footer') && (
                    <div className="flex gap-6">
                        {/* 左侧预览 */}
                        <div className="flex-1">
                            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                                <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">
                                        当前{activeTab === 'header' ? '页眉' : '页脚'}预览
                                    </span>
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                        全站生效
                                    </span>
                                </div>
                                <div className="bg-white min-h-[200px]">
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
                                        <div className="h-48 flex flex-col items-center justify-center text-gray-400">
                                            <Layout className="w-12 h-12 mb-3 opacity-30" />
                                            <p className="text-sm">未配置全局{activeTab === 'header' ? '页眉' : '页脚'}</p>
                                            <p className="text-xs mt-1">请从右侧选择模板或组件</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 右侧选择器 */}
                        <div className="w-80 shrink-0">
                            {/* 选择列表 */}
                            <div className="bg-gray-50 rounded-xl border border-gray-200 max-h-[500px] overflow-y-auto">
                                <div className="p-3 border-b border-gray-100 bg-white sticky top-0">
                                    <h4 className="text-sm font-medium text-gray-900">
                                        可用模板
                                        <span className="ml-2 text-gray-400 font-normal">
                                            ({currentTemplates.length})
                                        </span>
                                    </h4>
                                </div>
                                <div className="p-3 space-y-2">
                                    {currentTemplates.length > 0 ? (
                                        currentTemplates.map(template => (
                                            <button
                                                key={template.id}
                                                onClick={() => applyTemplate(template, activeTab)}
                                                className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-sm transition-all group"
                                            >
                                                <div className="font-medium text-gray-900 group-hover:text-blue-600 text-sm">
                                                    {template.name}
                                                </div>
                                                {template.description && (
                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                        {template.description}
                                                    </p>
                                                )}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-400 text-sm">
                                            <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                            暂无{activeTab === 'header' ? '页眉' : '页脚'}模板
                                            <p className="text-xs mt-1">请先在模板管理中创建</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 品牌资产 */}
                {activeTab === 'brand' && (
                    <div className="max-w-4xl space-y-6">
                        {/* 网站基本信息 */}
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-blue-600" />
                                网站基本信息
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">网站名称</label>
                                    <input
                                        type="text"
                                        value={brandSettings.site_name}
                                        onChange={e => setBrandSettings(s => ({ ...s, site_name: e.target.value }))}
                                        placeholder="GeoCMS"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">网站域名</label>
                                    <input
                                        type="url"
                                        value={brandSettings.site_url}
                                        onChange={e => setBrandSettings(s => ({ ...s, site_url: e.target.value }))}
                                        placeholder="https://example.com"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">网站描述</label>
                                    <textarea
                                        value={brandSettings.site_description}
                                        onChange={e => setBrandSettings(s => ({ ...s, site_description: e.target.value }))}
                                        placeholder="企业级内容管理系统"
                                        rows={3}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Logo 和图标 */}
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-blue-600" />
                                Logo 与图标
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ImageUpload
                                    label="网站 Logo"
                                    value={brandSettings.site_logo}
                                    onChange={url => setBrandSettings(s => ({ ...s, site_logo: url }))}
                                />
                                <ImageUpload
                                    label="网站图标 (Favicon)"
                                    value={brandSettings.site_icon}
                                    onChange={url => setBrandSettings(s => ({ ...s, site_icon: url }))}
                                />
                            </div>
                        </div>

                        {/* 备案信息 */}
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Building className="w-5 h-5 text-blue-600" />
                                公司与备案信息
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">公司名称</label>
                                    <input
                                        type="text"
                                        value={brandSettings.company_name}
                                        onChange={e => setBrandSettings(s => ({ ...s, company_name: e.target.value }))}
                                        placeholder="XX 科技有限公司"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">ICP 备案号</label>
                                    <input
                                        type="text"
                                        value={brandSettings.icp_number}
                                        onChange={e => setBrandSettings(s => ({ ...s, icp_number: e.target.value }))}
                                        placeholder="京ICP备12345678号"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">自定义版权信息</label>
                                        {!isLicensed && isLicensed !== null && (
                                            <div className="flex gap-3 text-xs">
                                                <a href="https://moli123.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 font-medium bg-blue-50 px-2 py-0.5 rounded">
                                                    <Sparkles className="w-3 h-3" /> 购买授权
                                                </a>
                                                <Link href="/admin/license" className="text-green-600 hover:underline flex items-center gap-1 font-medium bg-green-50 px-2 py-0.5 rounded">
                                                    <Shield className="w-3 h-3" /> 激活版权
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        value={brandSettings.copyright}
                                        onChange={e => setBrandSettings(s => ({ ...s, copyright: e.target.value }))}
                                        placeholder={isLicensed ? "© 2024 Your Company. All rights reserved." : "需授权后方可配置自定义版权"}
                                        disabled={!isLicensed}
                                        className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${!isLicensed ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed' : 'border-gray-300'}`}
                                    />
                                    <p className="mt-1.5 text-xs text-gray-400 flex items-center gap-1">
                                        {!isLicensed && <Shield className="w-3 h-3 text-amber-500" />}
                                        {isLicensed
                                            ? "设置后将覆盖页脚组件中的默认版权文案。"
                                            : "当前系统未授权，默认显示“全域魔力AI管理系统”。请先激活授权以开启此功能。"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 联系信息 */}
                {activeTab === 'contact' && (
                    <div className="max-w-4xl">
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Phone className="w-5 h-5 text-blue-600" />
                                联系方式
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Phone className="w-4 h-4 inline mr-1.5" />
                                        联系电话
                                    </label>
                                    <input
                                        type="tel"
                                        value={contactSettings.contact_phone}
                                        onChange={e => setContactSettings(s => ({ ...s, contact_phone: e.target.value }))}
                                        placeholder="400-123-4567"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Mail className="w-4 h-4 inline mr-1.5" />
                                        联系邮箱
                                    </label>
                                    <input
                                        type="email"
                                        value={contactSettings.contact_email}
                                        onChange={e => setContactSettings(s => ({ ...s, contact_email: e.target.value }))}
                                        placeholder="contact@example.com"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <MapPin className="w-4 h-4 inline mr-1.5" />
                                        联系地址
                                    </label>
                                    <input
                                        type="text"
                                        value={contactSettings.contact_address}
                                        onChange={e => setContactSettings(s => ({ ...s, contact_address: e.target.value }))}
                                        placeholder="北京市朝阳区..."
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 语言设置 */}
                {activeTab === 'languages' && (
                    <div className="max-w-4xl space-y-6">
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-blue-600" />
                                多语言功能设置
                            </h3>
                            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">开启多语言支持</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        开启后，您可以为文章、页面和产品添加不同语言的版本（如英文）。
                                    </p>
                                </div>
                                <button
                                    onClick={() => setBrandSettings(s => ({ ...s, enable_multi_language: !s.enable_multi_language }))}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${brandSettings.enable_multi_language ? 'bg-blue-600' : 'bg-gray-200'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${brandSettings.enable_multi_language ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {brandSettings.enable_multi_language && (
                                <div className="mt-6 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100">
                                    <p className="font-bold mb-1">已检测到的语言：</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>中文 (简体) - 默认</li>
                                        <li>英文 (English)</li>
                                    </ul>
                                    <p className="mt-3 text-xs text-blue-600">
                                        提示：开启后，您可以在后台的侧边栏找到“语言中心”来管理自动翻译。
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
