'use client';

import { useState } from 'react';
import { ArrowLeft, Wand2, FileText, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Step1Outline from './Step1Outline';
import Step2Draft from './Step2Draft';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';

export type OutlineSection = {
    title: string;
    subsections: string[];
    points: string[];
};

export type Outline = {
    title: string;
    sections: OutlineSection[];
};

export default function CopilotWizard() {
    const router = useRouter();
    const { showToast } = useToast();
    const [step, setStep] = useState(1);
    const [topic, setTopic] = useState('');
    const [keywords, setKeywords] = useState('');
    const [strategyId, setStrategyId] = useState('');
    const [outline, setOutline] = useState<Outline | null>(null);
    const [draft, setDraft] = useState('');

    const handleOutlineGenerated = (generatedOutline: Outline) => {
        setOutline(generatedOutline);
        setStep(2);
    };

    const handleDraftGenerated = (generatedDraft: string) => {
        setDraft(generatedDraft);
        // Redirect to article edit page with draft content
        // For now, we can just show a success message or preview
        // Ideally, we should create a draft article and redirect to edit it
        createDraftArticle(generatedDraft);
    };

    const createDraftArticle = async (content: string) => {
        try {
            const res = await fetch('/api/admin/articles/create-draft', { // We need this API or use server action
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: outline?.title || topic,
                    content,
                    status: 'DRAFT',
                    strategyId // 传递策略ID以便记录
                })
            });

            if (res.ok) {
                const data = await res.json();
                showToast('草稿已存，正在跳转编辑器...', 'success');
                router.push(`/admin/articles/${data.id}`);
            } else {
                const errorData = await res.json();
                showToast(`保存草稿失败: ${errorData.message || res.statusText}`, 'error');
            }
        } catch (error) {
            console.error('Failed to create article:', error);
            showToast('保存草稿失败', 'error');
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>

                    <div className={`flex flex-col items-center gap-2 bg-white px-4 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-white'}`}>
                            <Wand2 className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium">1. 生成大纲</span>
                    </div>

                    <div className={`flex flex-col items-center gap-2 bg-white px-4 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-white'}`}>
                            <FileText className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium">2. 审阅与生成</span>
                    </div>

                    <div className={`flex flex-col items-center gap-2 bg-white px-4 ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-white'}`}>
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium">3. 完成</span>
                    </div>
                </div>
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[500px]">
                {step === 1 && (
                    <Step1Outline
                        topic={topic}
                        setTopic={setTopic}
                        keywords={keywords}
                        setKeywords={setKeywords}
                        strategyId={strategyId}
                        setStrategyId={setStrategyId}
                        onNext={handleOutlineGenerated}
                    />
                )}
                {step === 2 && outline && (
                    <Step2Draft
                        outline={outline}
                        topic={topic}
                        keywords={keywords}
                        strategyId={strategyId}
                        onBack={() => setStep(1)}
                        onNext={handleDraftGenerated}
                    />
                )}
            </div>
        </div>
    );
}
