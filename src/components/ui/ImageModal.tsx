'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Sparkles, Loader2, Upload } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import StrategySelector from './StrategySelector';
import ImageUpload from './ImageUpload';

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (url: string, alt?: string) => void;
    contextText?: string;
    isPopover?: boolean;
}

export default function ImageModal({
    isOpen,
    onClose,
    onSubmit,
    contextText,
    isPopover = false
}: ImageModalProps) {
    const [url, setUrl] = useState('');
    const [alt, setAlt] = useState('');
    const [error, setError] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const urlInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setUrl('');
            setAlt('');
            setError('');
            setTimeout(() => urlInputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSubmit = (e?: React.SyntheticEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!url.trim()) {
            setError('请输入图片 URL');
            return;
        }

        try {
            // Basic validation
            if (!url.startsWith('http') && !url.startsWith('/')) {
                new URL(`https://${url}`);
            }
        } catch {
            setError('请输入有效的 URL');
            return;
        }

        const finalUrl = (url.startsWith('http') || url.startsWith('/')) ? url : `https://${url}`;
        onSubmit(finalUrl, alt.trim() || undefined);
        onClose();
    };

    const handleAIGenerate = async (strategyId: string) => {
        setIsGenerating(true);
        setError('');
        try {
            const res = await fetch('/api/admin/ai/images/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    strategyId,
                    context: {
                        selection: contextText || '',
                    }
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Generation failed');
            }

            const data = await res.json();
            if (data.url) {
                onSubmit(data.url, data.alt || '');
                onClose();
            }
        } catch (error: any) {
            console.error(error);
            setError(error.message || '生成图片失败，请重试');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleUploadSuccess = (uploadedUrl: string) => {
        setUrl(uploadedUrl);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    const modalContent = (
        <div
            className={`${isPopover
                ? 'absolute top-20 left-1/2 -translate-x-1/2 w-[480px] z-[101] animate-in slide-in-from-top-2 duration-200'
                : 'w-full max-w-md animate-in zoom-in-95 duration-200 flex flex-col'
                } bg-white shadow-2xl border border-gray-100 rounded-2xl overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
        >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                <h3 className="text-lg font-bold text-gray-900">
                    插入图片
                </h3>
                <button
                    type="button"
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh]">
                <Tabs defaultValue="url" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100 p-1 rounded-xl">
                        <TabsTrigger value="url" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">URL 链接</TabsTrigger>
                        <TabsTrigger value="upload" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-1">
                            <Upload className="w-3.5 h-3.5" />
                            上传
                        </TabsTrigger>
                        <TabsTrigger value="ai" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            AI 生成
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="url" className="mt-0 focus-visible:outline-none">
                        <div onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        图片 URL <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        ref={urlInputRef}
                                        type="text"
                                        value={url}
                                        onChange={(e) => {
                                            setUrl(e.target.value);
                                            setError('');
                                        }}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all sm:text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        图片描述 (可选)
                                    </label>
                                    <input
                                        type="text"
                                        value={alt}
                                        onChange={(e) => setAlt(e.target.value)}
                                        placeholder="输入图片描述内容"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all sm:text-sm"
                                    />
                                </div>

                                {error && (
                                    <div className="text-sm text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-1">
                                        {error}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    取消
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                                >
                                    确认插入
                                </button>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="upload" className="mt-0 focus-visible:outline-none">
                        <div className="space-y-4">
                            <ImageUpload
                                value={url}
                                onChange={handleUploadSuccess}
                                label="点击或拖拽上传图片"
                                className="w-full"
                                showDescription={true}
                                onDescriptionChange={setAlt}
                                initialDescription={alt}
                            />
                            <div className="flex gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    取消
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={!url}
                                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none disabled:active:scale-100"
                                >
                                    确认插入
                                </button>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="ai" className="mt-0 focus-visible:outline-none">
                        <div className="space-y-4">
                            {isGenerating ? (
                                <div className="flex flex-col items-center justify-center py-12 space-y-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                                    <div className="text-center">
                                        <p className="font-bold text-gray-900">正在拼命创作中...</p>
                                        <p className="text-xs text-gray-500 mt-1">AI 正在根据您的上下文选择最佳画面</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-2">
                                        {contextText ? (
                                            <div className="flex gap-2">
                                                <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                                <p className="text-sm text-blue-800 line-clamp-2 italic">"{contextText}"</p>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2 text-sm text-blue-800">
                                                <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
                                                <p>请选择一个生成策略。提示：先选中编辑器中的文字可获得更精准的配图。</p>
                                            </div>
                                        )}
                                    </div>
                                    <StrategySelector
                                        targetType="IMAGE_CONTENT"
                                        type="IMAGE"
                                        onSelect={handleAIGenerate}
                                        onCancel={() => { }}
                                    />
                                </>
                            )}
                            {error && (
                                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 mt-2">
                                    {error}
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );

    if (isPopover) return modalContent;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            {modalContent}
        </div>
    );
}
