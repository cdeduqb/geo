'use client';

import { useState, useEffect } from 'react';
import { Wand2, Loader2, ArrowLeft, Save, Eye, Code } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Editor from '@monaco-editor/react';
import { useToast } from '@/components/ui/toast';

interface AITemplateGeneratorProps {
    onBack: () => void;
}

export default function AITemplateGenerator({ onBack }: AITemplateGeneratorProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const [step, setStep] = useState<'info' | 'prompt' | 'result'>('info');
    const [templateInfo, setTemplateInfo] = useState({
        name: '',
        description: '',
        moduleType: 'HEADER',
        type: 'CUSTOM'
    });
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedHTML, setGeneratedHTML] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [nameError, setNameError] = useState('');
    const [isCheckingName, setIsCheckingName] = useState(false);
    const [preferences, setPreferences] = useState({
        language: 'zh-CN',
        primaryColor: '#2563eb', // blue-600
        style: 'modern'
    });

    const styleOptions = [
        { value: 'modern', label: '现代简约', desc: '干净、清爽、大留白' },
        { value: 'corporate', label: '商务专业', desc: '稳重、大气、信任感' },
        { value: 'creative', label: '创意设计', desc: '独特、活泼、视觉冲击' },
        { value: 'minimalist', label: '极简主义', desc: '极致简单、突出内容' },
        { value: 'tech', label: '科技未来', desc: '深色、光效、科技感' },
    ];

    const colorPresets = [
        { value: '#2563eb', label: '科技蓝' },
        { value: '#dc2626', label: '活力红' },
        { value: '#16a34a', label: '自然绿' },
        { value: '#9333ea', label: '优雅紫' },
        { value: '#ea580c', label: '温暖橙' },
        { value: '#000000', label: '经典黑' },
    ];

    // Check template name uniqueness
    useEffect(() => {
        const checkName = async () => {
            if (!templateInfo.name.trim()) {
                setNameError('');
                return;
            }

            setIsCheckingName(true);
            try {
                const res = await fetch(`/api/admin/templates/check-name?name=${encodeURIComponent(templateInfo.name)}`);
                const data = await res.json();

                if (data.exists) {
                    setNameError('该模板名称已存在，请使用其他名称');
                } else {
                    setNameError('');
                }
            } catch (error) {
                console.error('Check name error:', error);
            } finally {
                setIsCheckingName(false);
            }
        };

        const timer = setTimeout(checkName, 500); // Debounce
        return () => clearTimeout(timer);
    }, [templateInfo.name]);

    const handleContinue = () => {
        if (!templateInfo.name.trim()) {
            showToast('请填写模板名称', 'warning');
            return;
        }

        if (nameError) {
            showToast(nameError, 'error');
            return;
        }

        setStep('prompt');
    };

    const handleGenerate = async () => {
        if (!aiPrompt.trim()) {
            showToast('请描述您想要创建的模板', 'warning');
            return;
        }

        setIsGenerating(true);
        try {
            const fullPrompt = `
设计要求：
- 语言：${preferences.language === 'zh-CN' ? '简体中文' : 'English'}
- 主色调：${preferences.primaryColor}
- 风格：${styleOptions.find(s => s.value === preferences.style)?.label} (${preferences.style})
- 详细需求：${aiPrompt}

请根据以上要求生成完整的HTML代码。
`;

            const res = await fetch('/api/admin/templates/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: fullPrompt,
                    moduleType: templateInfo.moduleType,
                }),
                credentials: 'include',
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to generate');
            }

            const { html } = await res.json();
            setGeneratedHTML(html);
            setStep('result');
        } catch (error) {
            console.error('Generation error:', error);
            showToast(`生成失败: ${(error as Error).message}`, 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        if (!generatedHTML) return;

        setIsSaving(true);
        try {
            console.log('Saving template:', templateInfo);

            const res = await fetch('/api/admin/templates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...templateInfo,
                    content: generatedHTML, // AI生成的模板使用content存储HTML
                    sections: null, // AI生成的模板不使用可视化编辑
                    style: '',
                    isAIGenerated: true, // 标记为AI生成
                }),
                credentials: 'include',
            });

            console.log('Save response status:', res.status);

            if (!res.ok) {
                const data = await res.json();
                console.error('Save error:', data);
                throw new Error(data.details || data.error || 'Failed to save template');
            }

            showToast('模板保存成功！', 'success');
            router.push('/admin/templates');
        } catch (error) {
            console.error('Save error:', error);
            showToast(`保存失败: ${(error as Error).message}`, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // Step 1: Template Info
    if (step === 'info') {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">AI 智能生成模板</h2>
                        <p className="text-sm text-gray-500">填写基本信息，然后描述您的需求</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            模板名称 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={templateInfo.name}
                            onChange={(e) => setTemplateInfo({ ...templateInfo, name: e.target.value })}
                            placeholder="例如：公司简介页面"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white text-gray-900 ${nameError ? 'border-red-500' : 'border-gray-200'
                                }`}
                        />
                        {isCheckingName && (
                            <p className="text-xs text-gray-500 mt-1">检查名称可用性...</p>
                        )}
                        {nameError && (
                            <p className="text-xs text-red-500 mt-1">{nameError}</p>
                        )}
                        {!nameError && templateInfo.name && !isCheckingName && (
                            <p className="text-xs text-green-600 mt-1">✓ 名称可用</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            模板类型
                        </label>
                        <select
                            value={templateInfo.moduleType}
                            onChange={(e) => setTemplateInfo({ ...templateInfo, moduleType: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white text-gray-900"
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            模板描述
                        </label>
                        <textarea
                            value={templateInfo.description}
                            onChange={(e) => setTemplateInfo({ ...templateInfo, description: e.target.value })}
                            placeholder="简要描述此模板的用途和特点..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none bg-white text-gray-900"
                        />
                    </div>

                    <button
                        onClick={handleContinue}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm font-medium"
                    >
                        继续 →
                    </button>
                </div>
            </div >
        );
    }

    // Step 2: AI Prompt
    if (step === 'prompt') {
        return (
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setStep('info')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{templateInfo.name}</h2>
                        <p className="text-sm text-gray-500">描述您想要的模板</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
                    {/* Preferences Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Language */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                网页语言
                            </label>
                            <select
                                value={preferences.language}
                                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white text-gray-900"
                            >
                                <option value="zh-CN">简体中文</option>
                                <option value="en-US">English</option>
                            </select>
                        </div>

                        {/* Style */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                网页风格
                            </label>
                            <select
                                value={preferences.style}
                                onChange={(e) => setPreferences({ ...preferences, style: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white text-gray-900"
                            >
                                {styleOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Color */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                主色调
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={preferences.primaryColor}
                                    onChange={(e) => setPreferences({ ...preferences, primaryColor: e.target.value })}
                                    className="h-10 w-14 p-1 rounded border border-gray-200 cursor-pointer"
                                />
                                <div className="flex-1 flex gap-1 overflow-x-auto pb-1">
                                    {colorPresets.map(color => (
                                        <button
                                            key={color.value}
                                            onClick={() => setPreferences({ ...preferences, primaryColor: color.value })}
                                            className={`w-6 h-6 rounded-full border border-gray-200 flex-shrink-0 ${preferences.primaryColor === color.value ? 'ring-2 ring-offset-1 ring-green-500' : ''
                                                }`}
                                            style={{ backgroundColor: color.value }}
                                            title={color.label}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            详细描述您想要的模板
                        </label>
                        <textarea
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="例如：创建一个现代化的关于我们页面，包含公司介绍、团队成员卡片（3列布局）、企业文化模块、联系方式等。使用蓝色主题，卡片式设计，添加悬停动画。"
                            rows={8}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none bg-white text-gray-900"
                        />
                        <p className="mt-2 text-xs text-gray-500">
                            提示：描述越详细，生成的结果越符合您的期望。可以包含布局、颜色、风格、具体内容等。
                        </p>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !aiPrompt.trim()}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm font-medium"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                AI 生成中...
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-5 h-5" />
                                开始生成
                            </>
                        )}
                    </button>
                </div>
            </div>
        );
    }

    // Step 3: Result
    return (
        <div className="h-screen flex flex-col">
            <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => setStep('prompt')} className="p-2 hover:bg-gray-100 rounded-lg">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h3 className="font-bold text-gray-900">{templateInfo.name}</h3>
                        <p className="text-xs text-gray-500">AI 生成结果</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {showPreview ? <Code className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {showPreview ? '查看代码' : '预览'}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        保存模板
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                {showPreview ? (
                    <div className="h-full overflow-auto p-8 bg-gray-50">
                        <div
                            className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg"
                            dangerouslySetInnerHTML={{ __html: generatedHTML }}
                        />
                    </div>
                ) : (
                    <Editor
                        height="100%"
                        defaultLanguage="html"
                        value={generatedHTML}
                        onChange={(value) => setGeneratedHTML(value || '')}
                        theme="vs-dark"
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            wordWrap: 'on',
                        }}
                    />
                )}
            </div>
        </div>
    );
}
