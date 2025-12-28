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
    translationGroups?: { id: string; label: string }[];
}

export default function CreatePageClient({
    createPageAction,
    headerTemplates,
    footerTemplates,
    contentTemplates,
    existingPages,
    enableMultiLanguage = false,
    translationGroups = [],
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
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
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
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            选择模板创建
                        </h2>
                        <p className="text-gray-500">
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
                    />
                </div>
            )}

            {/* AI 生成弹窗 */}
            {showAIModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setShowAIModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                <Wand2 className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">AI 智能生成页面</h3>
                                <p className="text-sm text-gray-500">描述您想要的页面，AI 将为您自动生成</p>
                            </div>
                        </div>

                        <textarea
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="例如：创建一个现代化的关于我们页面，包含公司介绍、团队展示、企业文化和联系方式..."
                            className="w-full h-40 p-4 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none resize-none mb-6 text-sm"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowAIModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleAIGenerate}
                                disabled={!aiPrompt.trim() || isGenerating}
                                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm font-medium shadow-sm"
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
