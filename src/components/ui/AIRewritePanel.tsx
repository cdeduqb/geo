'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, Sparkles, Eye, Code } from 'lucide-react';

interface AIRewritePanelProps {
    originalText: string;
    onAccept: (newText: string) => void;
    onCancel: () => void;
}

export default function AIRewritePanel({ originalText, onAccept, onCancel }: AIRewritePanelProps) {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
        // 禁止背景滚动
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const initialTextRef = useRef(originalText);
    const safeOriginalText = initialTextRef.current;
    const hasHtml = /<[a-z][\s\S]*>/i.test(safeOriginalText);

    const [promptInstruction, setPromptInstruction] = useState('');
    const [formatMode, setFormatMode] = useState<'preserve' | 'rewrite' | 'text'>(hasHtml ? 'preserve' : 'text');
    const [isLoading, setIsLoading] = useState(false);
    const [rewrittenText, setRewrittenText] = useState('');
    const [error, setError] = useState('');

    const [showOriginalPreview, setShowOriginalPreview] = useState(hasHtml);
    const [showResultPreview, setShowResultPreview] = useState(true);

    const PRESETS = [
        { id: 'pro', label: '专业权威', icon: '👔', prompt: '将以下内容重写为专业、正式、权威的语气，保持客观。' },
        { id: 'concise', label: '精简提炼', icon: '✂️', prompt: '在保留核心信息的前提下，大幅精简内容，去除重复表达。' },
        { id: 'expand', label: '深挖细节', icon: '🔍', prompt: '扩展以下内容，增加相关的细节、论据、实例，使其更丰满。' },
        { id: 'table', label: '逻辑表格', icon: '📊', prompt: '分析以下内容并将核心数据或对比点重构为一个 HTML 表格 (<table>)。' },
        { id: 'list', label: '清晰列表', icon: '📝', prompt: '将以下文字提取要点，重构为 HTML 无序列表 (<ul>)。' },
        { id: 'friendly', label: '口语化', icon: '💬', prompt: '将内容改为亲切、通俗易懂的口语化风格。' },
    ];

    const handleRewrite = async () => {
        if (!safeOriginalText?.trim()) {
            setError('原文内容为空');
            return;
        }
        if (!promptInstruction.trim()) {
            setError('请输入重写要求');
            return;
        }

        setIsLoading(true);
        setError('');
        try {
            const response = await fetch('/api/ai/rewrite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    originalText: safeOriginalText,
                    rewriteType: 'custom',
                    customInstruction: promptInstruction.trim(),
                    mode: formatMode,
                }),
                credentials: 'include',
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'AI 重写失败');
            setRewrittenText(data.rewrittenText);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'AI 重写失败');
        } finally {
            setIsLoading(false);
        }
    };

    const renderTextContent = (text: string, isPreview: boolean, label: string) => {
        const isHtml = /<[a-z][\s\S]*>/i.test(text);
        const isActivePreview = label === '原文' ? showOriginalPreview : showResultPreview;

        return (
            <div className="flex flex-col h-full min-h-[400px]">
                <div className="flex items-center justify-between mb-2 bg-gray-50  px-3 py-2 rounded-t-lg border border-gray-200 ">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</span>
                    {isHtml && (
                        <button
                            type="button"
                            onClick={() => label === '原文' ? setShowOriginalPreview(!showOriginalPreview) : setShowResultPreview(!showResultPreview)}
                            className="text-[10px] font-medium bg-white  border border-gray-200  px-2 py-0.5 rounded shadow-sm hover:bg-gray-50 transition-colors"
                        >
                            {isActivePreview ? (
                                <span className="flex items-center gap-1"><Code className="w-3 h-3" /> 源码</span>
                            ) : (
                                <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> 预览</span>
                            )}
                        </button>
                    )}
                </div>
                <div className="flex-1 p-4 border border-t-0 border-gray-200  rounded-b-lg bg-white  overflow-y-auto">
                    {isActivePreview && isHtml ? (
                        <div className="prose prose-sm  max-w-none" dangerouslySetInnerHTML={{ __html: text }} />
                    ) : (
                        <div className="whitespace-pre-wrap font-mono text-xs text-gray-600 ">{text}</div>
                    )}
                </div>
            </div>
        );
    };

    if (!isMounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white  rounded-2xl shadow-2xl w-full max-w-7xl max-h-[92vh] overflow-hidden flex flex-col border border-gray-200 ">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200  bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-blue-200 shadow-lg">
                            <Sparkles className="w-6 h-6 animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 ">
                                AI 智能润色
                            </h3>
                            <p className="text-xs text-gray-500 font-medium tracking-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-[400px]">正在处理：{safeOriginalText.slice(0, 50)}...</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:bg-gray-200  rounded-full transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto flex flex-col">
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
                        {/* Configuration Sidebar */}
                        <div className="lg:col-span-4 space-y-6 lg:border-r border-gray-100 lg:pr-8">
                            <div>
                                <h4 className="flex items-center gap-2 text-sm font-bold text-gray-800  mb-4">
                                    <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
                                    优化指令
                                </h4>

                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    {PRESETS.map((preset) => (
                                        <button
                                            key={preset.id}
                                            type="button"
                                            onClick={() => setPromptInstruction(preset.prompt)}
                                            className={`p-3 text-left rounded-xl border transition-all hover:shadow-md group ${promptInstruction === preset.prompt
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-blue-100 shadow-lg'
                                                : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
                                                }`}
                                        >
                                            <div className="text-xl mb-1 group-hover:scale-110 transition-transform">{preset.icon}</div>
                                            <div className="text-xs font-bold leading-tight">{preset.label}</div>
                                        </button>
                                    ))}
                                </div>

                                <textarea
                                    value={promptInstruction}
                                    onChange={(e) => setPromptInstruction(e.target.value)}
                                    placeholder="输入您的具体要求，例如：使语气更强硬、精简到100字以内..."
                                    className="w-full px-4 py-3 border border-gray-200  rounded-xl bg-gray-50  text-gray-900  text-sm focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all resize-none outline-none"
                                    rows={5}
                                />
                            </div>

                            {hasHtml && (
                                <div className="p-4 bg-blue-50/50  rounded-2xl border border-blue-100 ">
                                    <label className="block text-xs font-bold text-blue-800  mb-3 uppercase tracking-wider">
                                        格式保持选项
                                    </label>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'preserve' as const, label: '保留排版', desc: '不改动 HTML 结构' },
                                            { value: 'rewrite' as const, label: '重构结构', desc: 'AI 可重新设计 HTML' },
                                            { value: 'text' as const, label: '纯文本', desc: '移除所有 HTML 标签' },
                                        ].map((option) => (
                                            <div
                                                key={option.value}
                                                onClick={() => setFormatMode(option.value)}
                                                className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${formatMode === option.value ? 'bg-white shadow-sm ring-1 ring-blue-200' : 'hover:bg-blue-100/30'}`}
                                            >
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formatMode === option.value ? 'border-blue-600' : 'border-gray-300'}`}>
                                                    {formatMode === option.value && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-gray-800 ">{option.label}</div>
                                                    <div className="text-[10px] text-gray-500 ">{option.desc}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={handleRewrite}
                                disabled={isLoading || !promptInstruction.trim()}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3 text-sm font-bold disabled:opacity-50 disabled:shadow-none translate-y-0 active:translate-y-1"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>AI 正在全力改写...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        <span>立即智能重写</span>
                                    </>
                                )}
                            </button>
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 animate-bounce">
                                    ⚠️ {error}
                                </div>
                            )}
                        </div>

                        {/* Content Comparison View */}
                        <div className="lg:col-span-8 space-y-4">
                            <div className={`grid grid-cols-1 h-full gap-4 ${rewrittenText ? 'md:grid-cols-2' : ''}`}>
                                {renderTextContent(safeOriginalText, showOriginalPreview, '原文')}
                                {rewrittenText ? renderTextContent(rewrittenText, showResultPreview, '改写效果') : (
                                    <div className="hidden md:flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/30 p-8 text-center">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                            <Eye className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <h5 className="text-sm font-bold text-gray-400">待生成预览</h5>
                                        <p className="text-xs text-gray-300 mt-2">点击左侧“立即智能重写”<br />查看对比效果</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50  border-t border-gray-200  flex items-center justify-between">
                    <div className="text-xs text-gray-400 font-medium">
                        ✨ 基于先进语言模型提供内容优化建议
                    </div>
                    <div className="flex gap-3">
                        {rewrittenText && (
                            <button
                                type="button"
                                onClick={() => onAccept(rewrittenText)}
                                className="px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-100 transition-all text-sm font-bold flex items-center gap-2"
                            >
                                ✓ 确认应用到编辑器
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2.5 bg-white border border-gray-200  text-gray-600 rounded-xl hover:bg-gray-50 transition-colors text-sm font-bold"
                        >
                            放弃退出
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
