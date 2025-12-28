'use client';

import { PageTemplate } from '@prisma/client';
import { Save, Loader2, Sparkles, Layout, Eye, Code, Plus, Monitor, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { TEMPLATE_COMPONENTS } from '@/lib/template-components';
import Editor, { OnMount } from '@monaco-editor/react';

interface TemplateFormProps {
    template?: PageTemplate;
    isEdit?: boolean;
}

export default function TemplateForm({ template, isEdit = false }: TemplateFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 编辑器状态
    const [content, setContent] = useState(template?.content || '');
    const [style, setStyle] = useState(template?.style || '');
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

    // AI 生成状态
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    // Monaco Editor 引用
    const editorRef = useRef<any>(null);
    const monacoRef = useRef<any>(null);

    // 实时预览内容构建
    const getPreviewHtml = () => {
        const css = style ? `<style>${style}</style>` : '';
        // 注入 Tailwind CDN 以支持预览
        const tailwind = '<script src="https://cdn.tailwindcss.com"></script>';
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                ${tailwind}
                ${css}
                <style>
                    body { background-color: transparent; }
                    /* 滚动条美化 */
                    ::-webkit-scrollbar { width: 6px; }
                    ::-webkit-scrollbar-track { background: transparent; }
                    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
                </style>
            </head>
            <body>
                ${content}
            </body>
            </html>
        `;
    };

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;
    };

    const handleAiGenerate = async () => {
        if (!aiPrompt.trim()) {
            alert('请输入描述信息');
            return;
        }

        setIsGenerating(true);
        try {
            const moduleType = (document.getElementById('moduleType') as HTMLSelectElement)?.value || 'HOME_PAGE';

            const res = await fetch('/api/admin/templates/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: aiPrompt,
                    moduleType,
                    style: '现代简约' // 可以后续添加选项
                }),
            });

            if (!res.ok) throw new Error('生成失败');

            const data = await res.json();
            if (data.html) {
                setContent(data.html);
                // 如果是 Monaco Editor，也可以直接 setValue，但 React state 绑定会自动更新
            }
        } catch (err) {
            console.error(err);
            alert('AI 生成失败，请重试');
        } finally {
            setIsGenerating(false);
        }
    };

    const insertComponent = (code: string) => {
        const editor = editorRef.current;
        const monaco = monacoRef.current;

        if (editor && monaco) {
            const position = editor.getPosition();
            const range = new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column);

            editor.executeEdits('insert-component', [{
                range: range,
                text: code,
                forceMoveMarkers: true
            }]);

            editor.focus();
        } else {
            // 降级处理：如果编辑器未加载，直接追加
            setContent(prev => prev + code);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            content: content, // 使用 state
            style: style,     // 使用 state
            moduleType: formData.get('moduleType') as string,
            type: formData.get('type') as string,
        };

        try {
            const url = isEdit
                ? `/api/templates/${template?.id}`
                : '/api/templates/create';

            const method = isEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.success) {
                router.push('/admin/templates');
                router.refresh();
            } else {
                setError(result.error || '操作失败');
            }
        } catch (err) {
            setError('网络错误，请重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
                {/* 左侧编辑器 (7列) */}
                <div className="lg:col-span-7 flex flex-col gap-4 min-h-0">
                    {/* 基本信息 */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
                                    模板名称 *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    defaultValue={template?.name}
                                    required
                                    className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm"
                                    placeholder="例如：经典导航栏"
                                />
                            </div>
                            <div>
                                <label htmlFor="moduleType" className="block text-xs font-medium text-gray-700 mb-1">
                                    模块类型 *
                                </label>
                                <select
                                    id="moduleType"
                                    name="moduleType"
                                    defaultValue={template?.moduleType || 'HOME_PAGE'}
                                    required
                                    className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm"
                                >
                                    <option value="HEADER">页眉</option>
                                    <option value="FOOTER">页脚</option>
                                    <option value="HOME_PAGE">首页页面</option>
                                    <option value="ARTICLE_PAGE">文章页面</option>
                                    <option value="ABOUT_PAGE">关于我们</option>
                                    <option value="CONTACT_PAGE">联系我们</option>
                                    <option value="PRODUCT_PAGE">产品页面</option>
                                    <option value="SERVICE_PAGE">服务页面</option>
                                    <option value="FAQ_PAGE">常见问题</option>
                                    <option value="CUSTOM_PAGE">自定义页面</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-3">
                            <label htmlFor="description" className="block text-xs font-medium text-gray-700 mb-1">
                                描述
                            </label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                defaultValue={template?.description || ''}
                                className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm"
                                placeholder="简短描述模板的特点"
                            />
                        </div>
                        {/* 隐藏字段 */}
                        <input type="hidden" name="type" value={template?.type || 'CUSTOM'} />
                    </div>

                    {/* AI 生成栏 */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <Sparkles className="absolute left-3 top-2.5 w-4 h-4 text-purple-500" />
                                <input
                                    type="text"
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    placeholder="描述您想要的模板，例如：一个带有渐变背景和居中标题的 Hero 区域..."
                                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-purple-200 bg-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAiGenerate())}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleAiGenerate}
                                disabled={isGenerating || !aiPrompt.trim()}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                            >
                                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                AI 生成
                            </button>
                        </div>
                    </div>

                    {/* 代码编辑器区域 */}
                    <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50">
                            <div className="flex items-center gap-2">
                                <Code className="w-4 h-4 text-gray-500" />
                                <span className="text-xs font-medium text-gray-700">HTML 代码</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* 组件插入下拉菜单 */}
                                <div className="relative group">
                                    <button type="button" className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium">
                                        <Plus className="w-3 h-3" /> 插入组件
                                    </button>
                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 hidden group-hover:block z-10">
                                        {TEMPLATE_COMPONENTS.map(comp => (
                                            <button
                                                key={comp.id}
                                                type="button"
                                                onClick={() => insertComponent(comp.code)}
                                                className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 text-gray-700"
                                                title={comp.description}
                                            >
                                                {comp.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <Editor
                                height="100%"
                                defaultLanguage="html"
                                value={content}
                                onChange={(value) => setContent(value || '')}
                                onMount={handleEditorDidMount}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    wordWrap: 'on',
                                    padding: { top: 16 },
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* 右侧预览 (5列) */}
                <div className="lg:col-span-5 flex flex-col gap-4 min-h-0">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50">
                            <div className="flex items-center gap-2">
                                <Eye className="w-4 h-4 text-gray-500" />
                                <span className="text-xs font-medium text-gray-700">实时预览</span>
                            </div>
                            <div className="flex items-center bg-gray-200 rounded-lg p-0.5">
                                <button
                                    type="button"
                                    onClick={() => setPreviewMode('desktop')}
                                    className={`p-1.5 rounded-md transition-colors ${previewMode === 'desktop' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                                    title="桌面视图"
                                >
                                    <Monitor className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPreviewMode('mobile')}
                                    className={`p-1.5 rounded-md transition-colors ${previewMode === 'mobile' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                                    title="移动视图"
                                >
                                    <Smartphone className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 bg-gray-100 p-4 flex items-center justify-center overflow-auto">
                            <div
                                className={`bg-white transition-all duration-300 shadow-lg overflow-hidden ${previewMode === 'mobile' ? 'w-[375px] h-[667px] rounded-3xl border-8 border-gray-800' : 'w-full h-full rounded-lg border border-gray-200'
                                    }`}
                            >
                                <iframe
                                    srcDoc={getPreviewHtml()}
                                    className="w-full h-full border-none"
                                    title="Preview"
                                    sandbox="allow-scripts"
                                />
                            </div>
                        </div>

                        {/* 底部操作栏 */}
                        <div className="p-4 border-t border-gray-100 bg-white">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                {loading ? '保存中...' : '保存模板'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
