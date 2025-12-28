'use client';

import { useState } from 'react';
import { Layout, Code, Wand2, ArrowRight, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EditorModeSelectorProps {
    pageId: string;
    onSelect: (mode: 'VISUAL' | 'CODE') => void;
}

export default function EditorModeSelector({ pageId, onSelect }: EditorModeSelectorProps) {
    const router = useRouter();
    const [isSelecting, setIsSelecting] = useState(false);
    const [showAIPrompt, setShowAIPrompt] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleSelect = async (mode: 'VISUAL' | 'CODE') => {
        setIsSelecting(true);
        try {
            // Update page editor mode
            const res = await fetch(`/api/admin/pages/${pageId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ editorMode: mode }),
                credentials: 'include', // Ensure cookies are sent
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.details || data.error || 'Failed to update editor mode');
            }

            onSelect(mode);
        } catch (error) {
            console.error('Error selecting mode:', error);
            alert(`Failed to select mode: ${(error as Error).message}`);
            setIsSelecting(false);
        }
    };

    const handleGenerateTemplate = async () => {
        if (!aiPrompt.trim()) return;

        setIsGenerating(true);
        try {
            // 1. Generate HTML from AI
            const genRes = await fetch('/api/admin/templates/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: aiPrompt, moduleType: '完整页面' }),
                credentials: 'include',
            });

            if (!genRes.ok) {
                const data = await genRes.json();
                throw new Error(data.error || 'Failed to generate template');
            }

            const { html } = await genRes.json();

            // 2. Save generated content and set mode to CODE
            const updateRes = await fetch(`/api/admin/pages/${pageId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    editorMode: 'CODE',
                    content: html
                }),
                credentials: 'include',
            });

            if (!updateRes.ok) {
                const data = await updateRes.json();
                throw new Error(data.details || data.error || 'Failed to save generated content');
            }

            onSelect('CODE');
        } catch (error) {
            console.error('Error generating template:', error);
            alert(`生成失败: ${(error as Error).message}`);
        } finally {
            setIsGenerating(false);
            setShowAIPrompt(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-4xl w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        选择编辑模式
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        请选择您喜欢的页面编辑方式。您可以随时在设置中切换模式。
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Visual Builder */}
                    <button
                        onClick={() => handleSelect('VISUAL')}
                        disabled={isSelecting || showAIPrompt}
                        className="group relative flex flex-col items-center p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-500 transition-all hover:shadow-lg text-left"
                    >
                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Layout className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            可视化装修
                        </h3>
                        <p className="text-sm text-gray-500 text-center mb-6">
                            通过拖拽组件快速搭建页面，所见即所得，适合大多数营销页面。
                        </p>
                        <div className="mt-auto flex items-center text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            开始装修 <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                    </button>

                    {/* Code Editor */}
                    <button
                        onClick={() => handleSelect('CODE')}
                        disabled={isSelecting || showAIPrompt}
                        className="group relative flex flex-col items-center p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-purple-500 transition-all hover:shadow-lg text-left"
                    >
                        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Code className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            HTML 代码编辑
                        </h3>
                        <p className="text-sm text-gray-500 text-center mb-6">
                            直接编辑 HTML 源码，完全控制页面结构，适合专业开发者。
                        </p>
                        <div className="mt-auto flex items-center text-purple-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            编写代码 <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                    </button>

                    {/* AI Template */}
                    <button
                        onClick={() => setShowAIPrompt(true)}
                        disabled={isSelecting || showAIPrompt}
                        className="group relative flex flex-col items-center p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-green-500 transition-all hover:shadow-lg text-left"
                    >
                        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Wand2 className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            AI 生成模板
                        </h3>
                        <p className="text-sm text-gray-500 text-center mb-6">
                            描述您的需求，AI 为您自动生成页面布局和内容，快速启动。
                        </p>
                        <div className="mt-auto flex items-center text-green-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            AI 生成 <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                    </button>
                </div>
            </div>

            {/* AI Prompt Modal */}
            {showAIPrompt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setShowAIPrompt(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                <Wand2 className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">AI 智能生成</h3>
                                <p className="text-sm text-gray-500">描述您想要的页面，AI 将为您生成代码</p>
                            </div>
                        </div>

                        <textarea
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="例如：创建一个现代化的产品落地页，包含 Hero 区域、特性列表、价格表和联系表单..."
                            className="w-full h-32 p-4 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none resize-none mb-6 text-sm"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowAIPrompt(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleGenerateTemplate}
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
