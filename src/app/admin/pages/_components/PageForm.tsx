'use client';

import { useState } from 'react';
import { Page, PageTemplate } from '@prisma/client';
import { Save, Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/components/ui/toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface PageFormProps {
    page?: any;
    action: (formData: FormData) => Promise<any>;
    headerTemplates?: any[];
    footerTemplates?: any[];
    contentTemplates?: any[];
    enableMultiLanguage?: boolean;
    translationGroups?: { id: string; label: string; lang: string }[];
    supportedLocales?: string[];
}

function SubmitButton({ className }: { className?: string }) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className={className || "inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-100 hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"}
        >
            {pending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {pending ? '保存中...' : '保存页面'}
        </button>
    );
}

export default function PageForm({
    page,
    action,
    headerTemplates = [],
    footerTemplates = [],
    contentTemplates = [],
    enableMultiLanguage = false,
    translationGroups = [],
    supportedLocales = ['zh', 'en']
}: PageFormProps) {
    const [content, setContent] = useState(page?.content || '');
    const [selectedTemplateId, setSelectedTemplateId] = useState(page?.templateId || '');
    const [selectedGroupId, setSelectedGroupId] = useState(page?.translationGroupId || '');
    const [lang, setLang] = useState(page?.lang || 'zh');
    const [pageType, setPageType] = useState(page?.type || 'CUSTOM');
    const [templateConfirmModal, setTemplateConfirmModal] = useState<{ open: boolean; templateId: string; templateContent: string; event: any }>({ open: false, templateId: '', templateContent: '', event: null });
    const { showToast } = useToast();

    // 统一的样式变量
    const inputClass = "w-full rounded-2xl border border-gray-300 bg-gray-50/50 px-6 py-4 text-sm font-bold text-gray-900 focus:border-blue-600 focus:bg-white transition-all outline-none placeholder:text-gray-300";
    const selectClass = "w-full rounded-2xl border border-gray-300 bg-gray-50/50 px-6 py-4 text-sm font-bold text-gray-900 focus:border-blue-600 focus:bg-white transition-all outline-none";
    const labelClass = "text-[13px] font-bold text-gray-700 ml-1 block";
    const smallSelectClass = "w-full rounded-xl border border-gray-300 bg-gray-50/50 px-4 py-3 text-sm font-bold text-gray-900 focus:border-blue-600 focus:bg-white transition-all outline-none";

    const handleGroupIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val === '__new__') {
            setSelectedGroupId(`group_${Date.now()}`);
        } else {
            setSelectedGroupId(val);
        }
    };

    const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const templateId = e.target.value;

        if (!templateId) {
            setSelectedTemplateId('');
            return;
        }

        const template = contentTemplates.find(t => t.id === templateId);
        if (template && template.content) {
            if (content && content.trim().length > 0) {
                setTemplateConfirmModal({ open: true, templateId, templateContent: template.content, event: e });
                return;
            }
            setSelectedTemplateId(templateId);
            setContent(template.content);
        } else {
            setSelectedTemplateId(templateId);
        }
    };

    const confirmTemplateSwitch = () => {
        setSelectedTemplateId(templateConfirmModal.templateId);
        setContent(templateConfirmModal.templateContent);
        setTemplateConfirmModal({ open: false, templateId: '', templateContent: '', event: null });
    };

    const cancelTemplateSwitch = () => {
        setTemplateConfirmModal({ open: false, templateId: '', templateContent: '', event: null });
    };

    const isCustomContent = !selectedTemplateId;

    const handleFormSubmit = async (formData: FormData) => {
        const result = await action(formData);
        if (result && result.error) {
            showToast(result.error, 'error');
        }
    };

    return (
        <>
            <form action={handleFormSubmit} className="space-y-6">
                {page && <input type="hidden" name="id" value={page.id} />}
                <input type="hidden" name="content" value={content} />

                {/* 顶部操作栏 - 保存按钮 */}
                <div className="flex justify-end">
                    <SubmitButton />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 左侧主要内容 - 合并页面基础信息和布局设置 */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* 页面基本信息卡片 */}
                        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm ring-1 ring-gray-100/50 p-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                                <h2 className="text-lg font-black text-gray-900 tracking-tight">基本信息</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="space-y-3">
                                    <label htmlFor="title" className={labelClass}>
                                        页面标题
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        defaultValue={page?.title}
                                        required
                                        className={inputClass}
                                        placeholder="输入页面标题"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label htmlFor="slug" className={labelClass}>
                                        URL 路径
                                    </label>
                                    <input
                                        type="text"
                                        id="slug"
                                        name="slug"
                                        defaultValue={page?.slug}
                                        required
                                        className={`${inputClass} font-mono`}
                                        placeholder="page-url-slug"
                                    />
                                </div>
                            </div>

                            {/* 布局模板选择 - 合并到基本信息卡片 */}
                            <div className="pt-8 border-t border-gray-100">
                                <h3 className="text-[13px] font-bold text-gray-700 ml-1 mb-5">布局模板</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-3">
                                        <label htmlFor="headerTemplateId" className="text-xs font-bold text-gray-500 ml-1">
                                            页眉
                                        </label>
                                        <select
                                            id="headerTemplateId"
                                            name="headerTemplateId"
                                            defaultValue={page?.headerTemplateId || ''}
                                            className={smallSelectClass}
                                        >
                                            <option value="">全局默认</option>
                                            {headerTemplates.map((template) => (
                                                <option key={template.id} value={template.id}>
                                                    {template.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-3">
                                        <label htmlFor="templateId" className="text-xs font-bold text-gray-500 ml-1">
                                            内容模板
                                        </label>
                                        <select
                                            id="templateId"
                                            name="templateId"
                                            value={selectedTemplateId}
                                            onChange={handleTemplateChange}
                                            className={smallSelectClass}
                                        >
                                            <option value="">自定义内容</option>
                                            {contentTemplates.map((template) => (
                                                <option key={template.id} value={template.id}>
                                                    {template.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-3">
                                        <label htmlFor="footerTemplateId" className="text-xs font-bold text-gray-500 ml-1">
                                            页脚
                                        </label>
                                        <select
                                            id="footerTemplateId"
                                            name="footerTemplateId"
                                            defaultValue={page?.footerTemplateId || ''}
                                            className={smallSelectClass}
                                        >
                                            <option value="">全局默认</option>
                                            {footerTemplates.map((template) => (
                                                <option key={template.id} value={template.id}>
                                                    {template.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 自定义内容 - 仅在选择"自定义内容"时显示 */}
                        {isCustomContent && (
                            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm ring-1 ring-gray-100/50 p-10">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-1.5 h-6 bg-green-600 rounded-full" />
                                    <h2 className="text-lg font-black text-gray-900 tracking-tight">自定义内容</h2>
                                </div>
                                <div className="space-y-3">
                                    <label htmlFor="content" className={labelClass}>
                                        内容 (HTML)
                                    </label>
                                    <textarea
                                        id="content"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        rows={15}
                                        className={`${inputClass} font-mono resize-none leading-relaxed`}
                                        placeholder="<p>页面内容...</p>"
                                    />
                                    <p className="text-xs text-gray-400 font-medium ml-1">支持直接输入 HTML 代码</p>
                                </div>
                            </div>
                        )}

                        {/* SEO 设置 - 移到左侧 */}
                        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm ring-1 ring-gray-100/50 p-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-6 bg-purple-600 rounded-full" />
                                <h2 className="text-lg font-black text-gray-900 tracking-tight">SEO 设置</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label htmlFor="seoTitle" className={labelClass}>
                                        SEO 标题
                                    </label>
                                    <input
                                        type="text"
                                        id="seoTitle"
                                        name="seoTitle"
                                        defaultValue={page?.seo?.title}
                                        className={inputClass}
                                        placeholder="默认为页面标题"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label htmlFor="seoKeywords" className={labelClass}>
                                        关键词
                                    </label>
                                    <input
                                        type="text"
                                        id="seoKeywords"
                                        name="seoKeywords"
                                        defaultValue={page?.seo?.keywords}
                                        className={inputClass}
                                        placeholder="关键词1, 关键词2"
                                    />
                                </div>

                                <div className="space-y-3 md:col-span-2">
                                    <label htmlFor="seoDescription" className={labelClass}>
                                        描述
                                    </label>
                                    <textarea
                                        id="seoDescription"
                                        name="seoDescription"
                                        defaultValue={page?.seo?.description}
                                        rows={4}
                                        className={`${inputClass} resize-none leading-relaxed`}
                                        placeholder="SEO 描述..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 右侧设置 - 发布设置 */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm ring-1 ring-gray-100/50 p-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
                                <h2 className="text-lg font-black text-gray-900 tracking-tight">发布设置</h2>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label htmlFor="status" className={labelClass}>
                                        状态
                                    </label>
                                    <select
                                        id="status"
                                        name="status"
                                        defaultValue={page?.status || 'DRAFT'}
                                        className={selectClass}
                                    >
                                        <option value="DRAFT">草稿</option>
                                        <option value="PUBLISHED">发布</option>
                                        <option value="ARCHIVED">归档</option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label htmlFor="type" className={labelClass}>
                                        页面类型
                                    </label>
                                    <select
                                        id="type"
                                        name="type"
                                        value={pageType}
                                        onChange={(e) => setPageType(e.target.value)}
                                        className={selectClass}
                                    >
                                        <option value="CUSTOM">自定义页面</option>
                                        <option value="HOME">首页</option>
                                        <option value="HEADER">页眉</option>
                                        <option value="FOOTER">页脚</option>
                                        <option value="ARTICLE_LIST">文章列表</option>
                                        <option value="PRODUCT_LIST">产品列表</option>
                                        <option value="ABOUT">关于我们</option>
                                        <option value="CONTACT">联系我们</option>
                                        <option value="GENERAL">通用页面</option>
                                    </select>
                                </div>

                                {pageType === 'HOME' && (
                                    <div className="flex items-center gap-3 py-4 bg-blue-50 px-5 rounded-2xl border border-blue-100">
                                        <input
                                            type="checkbox"
                                            id="isDefault"
                                            name="isDefault"
                                            value="true"
                                            defaultChecked={page?.isDefault}
                                            className="h-5 w-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="isDefault" className="text-sm font-bold text-blue-700 cursor-pointer">
                                            设为默认首页
                                        </label>
                                    </div>
                                )}

                                {enableMultiLanguage && (
                                    <>
                                        <div className="space-y-3">
                                            <label htmlFor="lang" className={labelClass}>
                                                语言
                                            </label>
                                            <select
                                                id="lang"
                                                name="lang"
                                                value={lang}
                                                onChange={(e) => setLang(e.target.value)}
                                                className={selectClass}
                                            >
                                                {supportedLocales.map(locale => (
                                                    <option key={locale} value={locale}>
                                                        {locale === 'zh' ? '简体中文' :
                                                            locale === 'en' ? 'English' :
                                                                locale === 'ja' ? '日语' :
                                                                    locale === 'ko' ? '韩语' :
                                                                        locale === 'fr' ? '法语' :
                                                                            locale === 'de' ? '德语' :
                                                                                locale === 'es' ? '西班牙语' :
                                                                                    locale === 'ru' ? '俄语' :
                                                                                        locale === 'pt' ? '葡萄牙语' :
                                                                                            locale === 'ar' ? '阿拉伯语' : locale}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-3">
                                            <label htmlFor="translationGroupId" className={labelClass}>
                                                翻译组
                                            </label>
                                            <input type="hidden" name="translationGroupId" value={selectedGroupId} />
                                            <select
                                                value={selectedGroupId}
                                                onChange={handleGroupIdChange}
                                                className={selectClass}
                                            >
                                                <option value="">不关联翻译组</option>
                                                <option value="__new__">➕ 新建翻译组</option>
                                                {translationGroups
                                                    .filter(group => group.lang !== lang)
                                                    .map(group => (
                                                        <option key={group.id} value={group.id}>
                                                            {group.label}
                                                        </option>
                                                    ))}
                                                {selectedGroupId && !translationGroups.find(g => g.id === selectedGroupId) && (
                                                    <option value={selectedGroupId}>
                                                        当前组: {selectedGroupId}
                                                    </option>
                                                )}
                                            </select>
                                        </div>
                                    </>
                                )}

                                {!enableMultiLanguage && (
                                    <input type="hidden" name="lang" value="zh" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            <ConfirmDialog
                isOpen={templateConfirmModal.open}
                onCancel={cancelTemplateSwitch}
                onConfirm={confirmTemplateSwitch}
                title="确认切换模板"
                message="切换模板将覆盖当前已编辑的内容，此操作无法撤销。确定要继续吗？"
                confirmText="确认切换"
                confirmButtonClass="bg-amber-600 hover:bg-amber-700 text-white"
            />
        </>
    );
}
