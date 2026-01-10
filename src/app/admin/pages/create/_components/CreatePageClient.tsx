'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Wand2, X } from 'lucide-react';
import Link from 'next/link';
import PageCreationWizard from './PageCreationWizard';
import PageForm from '../../_components/PageForm';

interface CreatePageClientProps {
    createPageAction: (formData: FormData) => void;
    headerTemplates: any[];
    footerTemplates: any[];
    contentTemplates: any[];
    existingPages: { id: string; title: string; slug: string }[];
    enableMultiLanguage?: boolean;
    translationGroups?: { id: string; label: string; lang: string }[];
    supportedLocales?: string[];
}

export default function CreatePageClient({
    createPageAction,
    headerTemplates,
    footerTemplates,
    contentTemplates,
    existingPages,
    enableMultiLanguage = false,
    translationGroups = [],
    supportedLocales = ['zh', 'en'],
}: CreatePageClientProps) {
    const router = useRouter();
    const [mode, setMode] = useState<'wizard' | 'blank' | 'template' | 'ai'>('wizard');
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [showAIModal, setShowAIModal] = useState(false);

    // 处理创建模式选择
    const handleModeSelect = (selectedMode: 'blank' | 'template' | 'ai' | 'clone') => {
        if (selectedMode === 'ai') {
            setShowAIModal(true);
        } else if (selectedMode === 'blank') {
            // 直接跳转到可视化构建器创建空白页面
            handleCreateBlankPage();
        } else if (selectedMode === 'template') {
            setMode('template');
        }
        // clone 模式已在 PageCreationWizard 中处理
    };

    // 创建空白页面并跳转到构建器
    const handleCreateBlankPage = async () => {
        try {
            const res = await fetch('/api/admin/pages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: '新页面',
                    slug: `page-${Date.now()}`,
                    content: '',
                    status: 'DRAFT',
                    type: 'CUSTOM',
                    editorMode: 'VISUAL',
                }),
            });

            if (!res.ok) throw new Error('创建页面失败');

            const { page } = await res.json();
            router.push(`/admin/pages/builder/${page.id}`);
        } catch (error) {
            alert('创建页面失败，请重试');
        }
    };

    // AI 生成页面 (使用可视化组件)
    const handleAIGenerate = async () => {
        if (!aiPrompt.trim()) return;

        setIsGenerating(true);
        try {
            // 1. 调用 AI 生成组件结构
            const genRes = await fetch('/api/admin/pages/generate-sections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: aiPrompt,
                    pageType: '企业官网页面',
                }),
            });

            if (!genRes.ok) {
                const errorData = await genRes.json();
                throw new Error(errorData.error || 'AI生成失败');
            }

            const { sections } = await genRes.json();

            // 2. 创建新页面并保存生成的组件
            const createRes = await fetch('/api/admin/pages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: '新页面 (AI生成)',
                    slug: `ai-page-${Date.now()}`,
                    content: '',
                    status: 'DRAFT',
                    type: 'CUSTOM',
                    editorMode: 'VISUAL',
                    sections: sections, // 保存生成的组件结构
                }),
            });

            if (!createRes.ok) throw new Error('创建页面失败');
            const { page } = await createRes.json();

            // 跳转到可视化构建器
            router.push(`/admin/pages/builder/${page.id}`);
        } catch (error) {
            alert(`生成失败: ${(error as Error).message}`);
        } finally {
            setIsGenerating(false);
            setShowAIModal(false);
        }
    };

    return (
        <div className="min-h-[60vh]">
            {/* 返回按钮 */}
            {mode !== 'wizard' && (
                <div className="mb-6">
                    <button
                        onClick={() => setMode('wizard')}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-colors px-4 py-2 rounded-xl hover:bg-gray-100"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        返回选择
                    </button>
                </div>
            )}

            {/* 向导模式 */}
            {mode === 'wizard' && (
                <PageCreationWizard
                    onModeSelect={handleModeSelect}
                    existingPages={existingPages}
                />
            )}

            {/* 模板选择模式 - 使用原有的 PageForm */}
            {mode === 'template' && (
                <div className="space-y-6">
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-black text-gray-900 mb-2 tracking-tight">
                            选择模板创建
                        </h2>
                        <p className="text-gray-400 text-sm font-medium">
                            从已有的模板中选择一个开始创建页面
                        </p>
                    </div>
                    <PageForm
                        action={createPageAction}
                        headerTemplates={headerTemplates}
                        footerTemplates={footerTemplates}
                        contentTemplates={contentTemplates}
                        enableMultiLanguage={enableMultiLanguage}
                        translationGroups={translationGroups}
                        supportedLocales={supportedLocales}
                    />
                </div>
            )}

            {/* AI 生成弹窗 */}
            {showAIModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-[32px] shadow-xl max-w-lg w-full p-8 relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setShowAIModal(false)}
                            className="absolute top-6 right-6 p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                                <Wand2 className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-gray-900 tracking-tight">AI 智能生成页面</h3>
                                <p className="text-sm text-gray-400 font-medium">描述您想要的页面，AI 将为您自动生成</p>
                            </div>
                        </div>

                        <textarea
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="例如：创建一个现代化的关于我们页面，包含公司介绍、团队展示、企业文化和联系方式..."
                            className="w-full h-40 p-5 rounded-2xl border border-gray-300 bg-gray-50 focus:border-green-600 outline-none resize-none mb-6 text-sm font-medium placeholder-gray-300 transition-all"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowAIModal(false)}
                                className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-2xl transition-colors"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleAIGenerate}
                                disabled={!aiPrompt.trim() || isGenerating}
                                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-2xl hover:bg-green-700 disabled:opacity-50 transition-all text-sm font-bold shadow-lg shadow-green-100 active:scale-95"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        生成中...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="w-4 h-4" />
                                        开始生成
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
