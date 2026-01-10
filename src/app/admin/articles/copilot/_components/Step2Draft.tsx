'use client';

import { useState } from 'react';
import { Loader2, PenTool, ArrowLeft, RefreshCw } from 'lucide-react';
import { Outline, OutlineSection } from './CopilotWizard';
import { useToast } from '@/components/ui/toast';

interface Step2DraftProps {
    outline: Outline;
    topic: string;
    keywords: string;
    strategyId: string;
    onBack: () => void;
    onNext: (draft: string) => void;
}

export default function Step2Draft({ outline, topic, keywords, strategyId, onBack, onNext }: Step2DraftProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();
    const [editableOutline, setEditableOutline] = useState<Outline>(outline);

    const handleGenerateDraft = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/ai/draft', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic,
                    keywords,
                    outline: editableOutline,
                    strategyId
                }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
                const errorMessage = errorData.error || `HTTP ${res.status}: ${res.statusText}`;
                throw new Error(errorMessage);
            }

            const data = await res.json();
            onNext(data.content);
        } catch (error) {
            console.error('Draft generation error:', error);
            const errorMessage = error instanceof Error ? error.message : '生成初稿失败';
            showToast(`生成初稿失败: ${errorMessage}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSectionChange = (index: number, field: keyof OutlineSection, value: any) => {
        const newSections = [...editableOutline.sections];
        newSections[index] = { ...newSections[index], [field]: value };
        setEditableOutline({ ...editableOutline, sections: newSections });
    };

    const handleTitleChange = (value: string) => {
        setEditableOutline({ ...editableOutline, title: value });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">第二步：审阅大纲</h2>
                    <p className="mt-1 text-gray-500">
                        请检查并修改大纲，AI 将根据最终大纲撰写文章。
                    </p>
                </div>
                <button
                    onClick={onBack}
                    className="flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    返回修改主题
                </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">文章标题</label>
                    <input
                        type="text"
                        value={editableOutline.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-lg font-bold focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-700">章节安排</label>
                    {editableOutline.sections.map((section, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                            <div className="flex items-start gap-4">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold mt-1">
                                    {index + 1}
                                </span>
                                <div className="flex-1 space-y-3">
                                    <input
                                        type="text"
                                        value={section.title}
                                        onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                                        className="w-full rounded border border-gray-300 px-3 py-1.5 text-base font-semibold focus:border-blue-500 focus:outline-none"
                                        placeholder="章节标题"
                                    />

                                    <div className="pl-4 border-l-2 border-gray-100 space-y-2">
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 uppercase">子章节 (用逗号分隔)</label>
                                            <input
                                                type="text"
                                                value={section.subsections.join(', ')}
                                                onChange={(e) => handleSectionChange(index, 'subsections', e.target.value.split(/,\s*/))}
                                                className="w-full mt-1 rounded border border-gray-200 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                                                placeholder="子章节1, 子章节2..."
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 uppercase">关键点 (用逗号分隔)</label>
                                            <input
                                                type="text"
                                                value={section.points.join(', ')}
                                                onChange={(e) => handleSectionChange(index, 'points', e.target.value.split(/,\s*/))}
                                                className="w-full mt-1 rounded border border-gray-200 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                                                placeholder="要点1, 要点2..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleGenerateDraft}
                    disabled={isLoading}
                    className="flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            正在撰写初稿...
                        </>
                    ) : (
                        <>
                            <PenTool className="w-5 h-5 mr-2" />
                            开始撰写
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
