'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout, FileText, Wand2, Copy, ArrowRight, ArrowLeft, Loader2, X } from 'lucide-react';

interface PageCreationWizardProps {
    onModeSelect: (mode: 'blank' | 'template' | 'ai' | 'clone') => void;
    existingPages?: { id: string; title: string; slug: string }[];
}

export default function PageCreationWizard({ onModeSelect, existingPages = [] }: PageCreationWizardProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showCloneSelector, setShowCloneSelector] = useState(false);

    const modes = [
        {
            id: 'blank' as const,
            title: '空白页面',
            description: '从零开始，自由组合组件搭建页面',
            icon: Layout,
            color: 'blue',
            bgColor: 'bg-blue-100',
            hoverBorder: 'hover:border-blue-500',
            iconColor: 'text-blue-600',
            arrowColor: 'text-blue-600',
        },
        {
            id: 'template' as const,
            title: '选择模板',
            description: '从预设模板快速开始，一键套用',
            icon: FileText,
            color: 'purple',
            bgColor: 'bg-purple-100',
            hoverBorder: 'hover:border-purple-500',
            iconColor: 'text-purple-600',
            arrowColor: 'text-purple-600',
        },
        {
            id: 'ai' as const,
            title: 'AI 智能生成',
            description: '描述您的需求，AI 自动搭建页面结构',
            icon: Wand2,
            color: 'green',
            bgColor: 'bg-green-100',
            hoverBorder: 'hover:border-green-500',
            iconColor: 'text-green-600',
            arrowColor: 'text-green-600',
        },
        {
            id: 'clone' as const,
            title: '克隆现有页面',
            description: '基于已有页面快速复制和修改',
            icon: Copy,
            color: 'orange',
            bgColor: 'bg-orange-100',
            hoverBorder: 'hover:border-orange-500',
            iconColor: 'text-orange-600',
            arrowColor: 'text-orange-600',
        },
    ];

    const handleModeClick = (mode: 'blank' | 'template' | 'ai' | 'clone') => {
        if (mode === 'clone') {
            setShowCloneSelector(true);
        } else {
            onModeSelect(mode);
        }
    };

    const handleClonePage = async (pageId: string) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/pages/${pageId}/clone`, {
                method: 'POST',
            });

            if (!res.ok) throw new Error('克隆失败');

            const data = await res.json();
            router.push(`/admin/pages/builder/${data.id}`);
        } catch (error) {
            alert('克隆页面失败，请重试');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    选择创建方式
                </h2>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    请选择您喜欢的页面创建方式。不同方式适合不同场景，您可以根据需要灵活选择。
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {modes.map(mode => (
                    <button
                        key={mode.id}
                        onClick={() => handleModeClick(mode.id)}
                        disabled={isLoading}
                        className={`group relative flex flex-col items-center p-6 bg-white rounded-2xl border-2 border-gray-200 ${mode.hoverBorder} transition-all hover:shadow-xl text-left disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        <div className={`w-16 h-16 ${mode.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <mode.icon className={`w-8 h-8 ${mode.iconColor}`} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
                            {mode.title}
                        </h3>
                        <p className="text-sm text-gray-500 text-center mb-4 leading-relaxed">
                            {mode.description}
                        </p>
                        <div className={`mt-auto flex items-center ${mode.arrowColor} font-medium opacity-0 group-hover:opacity-100 transition-opacity`}>
                            开始 <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                    </button>
                ))}
            </div>

            {/* Clone Selector Modal */}
            {showCloneSelector && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">选择要克隆的页面</h3>
                            <button
                                onClick={() => setShowCloneSelector(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            {existingPages.length === 0 ? (
                                <div className="text-center py-8">
                                    <Copy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">暂无可克隆的页面</p>
                                    <p className="text-sm text-gray-400 mt-1">请先创建一个页面</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {existingPages.map(page => (
                                        <button
                                            key={page.id}
                                            onClick={() => handleClonePage(page.id)}
                                            disabled={isLoading}
                                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-orange-50 rounded-xl border border-gray-200 hover:border-orange-300 transition-all disabled:opacity-50"
                                        >
                                            <div className="text-left">
                                                <p className="font-medium text-gray-900">{page.title}</p>
                                                <p className="text-sm text-gray-500">/{page.slug}</p>
                                            </div>
                                            {isLoading ? (
                                                <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
                                            ) : (
                                                <Copy className="w-5 h-5 text-gray-400" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
