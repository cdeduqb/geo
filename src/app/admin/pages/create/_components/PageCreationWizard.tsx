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
                <h2 className="text-xl font-black text-gray-900 mb-2 tracking-tight">
                    选择创建方式
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-sm font-medium">
                    请选择您喜欢的页面创建方式。不同方式适合不同场景，您可以根据需要灵活选择。
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {modes.map(mode => (
                    <button
                        key={mode.id}
                        onClick={() => handleModeClick(mode.id)}
                        disabled={isLoading}
                        className={`group relative flex flex-col items-center p-8 bg-white rounded-[32px] border border-gray-100 shadow-sm shadow-gray-100/50 ${mode.hoverBorder} hover:shadow-xl hover:-translate-y-1 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        <div className={`w-16 h-16 ${mode.bgColor} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                            <mode.icon className={`w-8 h-8 ${mode.iconColor}`} />
                        </div>
                        <h3 className="text-lg font-black text-gray-900 mb-2 text-center tracking-tight">
                            {mode.title}
                        </h3>
                        <p className="text-sm text-gray-400 text-center mb-4 leading-relaxed font-medium">
                            {mode.description}
                        </p>
                        <div className={`mt-auto flex items-center ${mode.arrowColor} font-bold opacity-0 group-hover:opacity-100 transition-opacity`}>
                            开始 <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                    </button>
                ))}
            </div>

            {/* Clone Selector Modal */}
            {showCloneSelector && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-[32px] shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                                    <Copy className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-gray-900 tracking-tight">选择要克隆的页面</h3>
                                    <p className="text-sm text-gray-400 font-medium">基于已有页面创建新页面</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowCloneSelector(false)}
                                className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            {existingPages.length === 0 ? (
                                <div className="text-center py-12">
                                    <Copy className="w-14 h-14 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 font-bold">暂无可克隆的页面</p>
                                    <p className="text-sm text-gray-400 mt-1 font-medium">请先创建一个页面</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {existingPages.map(page => (
                                        <button
                                            key={page.id}
                                            onClick={() => handleClonePage(page.id)}
                                            disabled={isLoading}
                                            className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-orange-50 rounded-2xl border border-gray-100 hover:border-orange-200 transition-all disabled:opacity-50"
                                        >
                                            <div className="text-left">
                                                <p className="font-bold text-gray-900">{page.title}</p>
                                                <p className="text-sm text-gray-400 font-medium">/{page.slug}</p>
                                            </div>
                                            {isLoading ? (
                                                <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
                                            ) : (
                                                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                                                    <Copy className="w-5 h-5 text-orange-600" />
                                                </div>
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
