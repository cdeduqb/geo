'use client';

import { useState } from 'react';
import { Layout, Wand2, ArrowRight } from 'lucide-react';

interface TemplateCreationModeSelectorProps {
    onSelect: (mode: 'VISUAL' | 'AI') => void;
}

export default function TemplateCreationModeSelector({ onSelect }: TemplateCreationModeSelectorProps) {
    const [isSelecting, setIsSelecting] = useState(false);

    const handleSelect = (mode: 'VISUAL' | 'AI') => {
        setIsSelecting(true);
        onSelect(mode);
    };

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <div className="max-w-4xl w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        选择模板创建方式
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        选择您喜欢的创建方式。可视化搭建适合快速组合，AI生成适合创意启发。
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                    {/* Visual Builder */}
                    <button
                        onClick={() => handleSelect('VISUAL')}
                        disabled={isSelecting}
                        className="group relative flex flex-col items-center p-10 bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-500 transition-all hover:shadow-xl text-left disabled:opacity-50"
                    >
                        <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Layout className="w-10 h-10 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            可视化搭建
                        </h3>
                        <p className="text-sm text-gray-500 text-center mb-8 leading-relaxed">
                            通过拖拽组件快速搭建模板，组件化设计，便于后续编辑和维护。
                        </p>
                        <div className="mt-auto flex items-center text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            开始搭建 <ArrowRight className="w-5 h-5 ml-2" />
                        </div>
                    </button>

                    {/* AI Generator */}
                    <button
                        onClick={() => handleSelect('AI')}
                        disabled={isSelecting}
                        className="group relative flex flex-col items-center p-10 bg-white rounded-2xl border-2 border-gray-200 hover:border-green-500 transition-all hover:shadow-xl text-left disabled:opacity-50"
                    >
                        <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Wand2 className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            AI 智能生成
                        </h3>
                        <p className="text-sm text-gray-500 text-center mb-8 leading-relaxed">
                            描述您的需求，AI 为您自动生成模板代码，快速启动创意项目。
                        </p>
                        <div className="mt-auto flex items-center text-green-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            AI 生成 <ArrowRight className="w-5 h-5 ml-2" />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
