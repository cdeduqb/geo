'use client';

import { useState } from 'react';
import { Page, PageTemplate } from '@prisma/client';
import { Save, Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

interface PageFormProps {
    page?: any;
    action: (formData: FormData) => void;
    headerTemplates?: any[];
    footerTemplates?: any[];
    contentTemplates?: any[];
    enableMultiLanguage?: boolean;
    translationGroups?: { id: string; label: string; lang: string }[];
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
    translationGroups = []
}: PageFormProps) {
    const [content, setContent] = useState(page?.content || '');
    const [selectedTemplateId, setSelectedTemplateId] = useState(page?.templateId || '');
    const [selectedGroupId, setSelectedGroupId] = useState(page?.translationGroupId || '');
    const [lang, setLang] = useState(page?.lang || 'zh');

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
        setSelectedTemplateId(templateId);

        if (!templateId) return;

        const template = contentTemplates.find(t => t.id === templateId);
        if (template && template.content) {
            const shouldConfirm = content && content.trim().length > 0 && !confirm('切换模板将覆盖当前内容，确定要继续吗？');
            if (shouldConfirm) {
                e.target.value = '';
                setSelectedTemplateId('');
                return;
            }
            setContent(template.content);
        }
    };

    const isCustomContent = !selectedTemplateId;

    return (
        <form action={action} className="space-y-6">
            {page && <input type="hidden" name="id" value={page.id} />}
            <input type="hidden" name="content" value={content} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* 左侧主要内容 */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold mb-6 text-gray-900">页面内容</h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="title" className="text-sm font-medium text-gray-700">
                                    页面标题
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    defaultValue={page?.title}
                                    required
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="输入页面标题"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="slug" className="text-sm font-medium text-gray-700">
                                    URL 路径 (Slug)
                                </label>
                                <input
                                    type="text"
                                    id="slug"
                                    name="slug"
                                    defaultValue={page?.slug}
                                    required
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="page-url-slug"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 布局设置 */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold mb-6 text-gray-900">布局设置</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="headerTemplateId" className="text-sm font-medium text-gray-700">
                                    页眉模板
                                </label>
                                <select
                                    id="headerTemplateId"
                                    name="headerTemplateId"
                                    defaultValue={page?.headerTemplateId || ''}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="">使用全局默认</option>
                                    {headerTemplates.map((template) => (
                                        <option key={template.id} value={template.id}>
                                            {template.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="templateId" className="text-sm font-medium text-gray-700">
                                    内容模板
                                </label>
                                <select
                                    id="templateId"
                                    name="templateId"
                                    value={selectedTemplateId}
                                    onChange={handleTemplateChange}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="">自定义内容</option>
                                    {contentTemplates.map((template) => (
                                        <option key={template.id} value={template.id}>
                                            {template.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500">选择模板将覆盖自定义内容</p>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="footerTemplateId" className="text-sm font-medium text-gray-700">
                                    页脚模板
                                </label>
                                <select
                                    id="footerTemplateId"
                                    name="footerTemplateId"
                                    defaultValue={page?.footerTemplateId || ''}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="">使用全局默认</option>
                                    {footerTemplates.map((template) => (
                                        <option key={template.id} value={template.id}>
                                            {template.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 自定义内容 - 仅在选择"自定义内容"时显示 */}
                    {isCustomContent && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold mb-6 text-gray-900">自定义内容</h2>
                            <div className="space-y-2">
                                <label htmlFor="content" className="text-sm font-medium text-gray-700">
                                    内容 (HTML)
                                </label>
                                <textarea
                                    id="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                    rows={15}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                                    placeholder="<p>页面内容...</p>"
                                />
                                <p className="text-xs text-gray-500">支持直接输入 HTML 代码</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* 右侧设置 */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
                        <h2 className="text-lg font-semibold mb-6 text-gray-900">发布设置</h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="status" className="text-sm font-medium text-gray-700">
                                    状态
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    defaultValue={page?.status || 'DRAFT'}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="DRAFT">草稿</option>
                                    <option value="PUBLISHED">发布</option>
                                    <option value="ARCHIVED">归档</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="type" className="text-sm font-medium text-gray-700">
                                    页面类型
                                </label>
                                <select
                                    id="type"
                                    name="type"
                                    defaultValue={page?.type || 'CUSTOM'}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="CUSTOM">自定义页面</option>
                                    <option value="HOME">首页</option>
                                    <option value="ARTICLE_LIST">文章列表</option>
                                    <option value="PRODUCT_LIST">产品列表</option>
                                    <option value="ABOUT">关于我们</option>
                                    <option value="CONTACT">联系我们</option>
                                </select>
                            </div>

                            {enableMultiLanguage ? (
                                <>
                                    <div className="space-y-2">
                                        <label htmlFor="lang" className="text-sm font-medium text-gray-700">
                                            语言
                                        </label>
                                        <select
                                            id="lang"
                                            name="lang"
                                            value={lang}
                                            onChange={(e) => setLang(e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                            <option value="zh">简体中文 (zh)</option>
                                            <option value="en">English (en)</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="translationGroupId" className="text-sm font-medium text-gray-700">
                                            翻译组
                                        </label>
                                        <input type="hidden" name="translationGroupId" value={selectedGroupId} />
                                        <select
                                            value={selectedGroupId}
                                            onChange={handleGroupIdChange}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                            <option value="">不关联翻译组</option>
                                            <option value="__new__">➕ 创建新翻译组</option>
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
                                        <p className="text-[10px] text-gray-400 font-normal">相同内容的多个语言版本请选择相同的翻译组</p>
                                    </div>
                                </>
                            ) : (
                                <input type="hidden" name="lang" value="zh" />
                            )}

                            <SubmitButton />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold mb-6 text-gray-900">页面SEO 设置</h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="seoTitle" className="text-sm font-medium text-gray-700">
                                    SEO 标题
                                </label>
                                <input
                                    type="text"
                                    id="seoTitle"
                                    name="seoTitle"
                                    defaultValue={page?.seo?.title}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="默认为页面标题"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="seoKeywords" className="text-sm font-medium text-gray-700">
                                    关键词
                                </label>
                                <input
                                    type="text"
                                    id="seoKeywords"
                                    name="seoKeywords"
                                    defaultValue={page?.seo?.keywords}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="关键词1, 关键词2"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="seoDescription" className="text-sm font-medium text-gray-700">
                                    描述
                                </label>
                                <textarea
                                    id="seoDescription"
                                    name="seoDescription"
                                    defaultValue={page?.seo?.description}
                                    rows={3}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                                    placeholder="SEO 描述..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
