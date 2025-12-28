'use client';

import { useState } from 'react';
import { Sparkles, X, Loader2, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';

interface AIInsertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onInsert: (content: string) => void;
    context?: string;
}

export default function AIInsertModal({ isOpen, onClose, onInsert, context }: AIInsertModalProps) {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState('');
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsLoading(true);
        setError('');
        try {
            const res = await fetch('/api/admin/ai/generate-segment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, context }),
            });

            if (!res.ok) throw new Error('生成失败');
            const data = await res.json();
            setResult(data.content);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInsert = () => {
        onInsert(result);
        onClose();
        setPrompt('');
        setResult('');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-600" />
                        AI 智能生成内容
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">写下你想生成的内容描述</label>
                        <div className="flex gap-2">
                            <input
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="例如：生成一段关于人工智能在医疗领域应用的文章片段..."
                                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                            />
                            <button
                                onClick={handleGenerate}
                                disabled={isLoading || !prompt.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {isLoading && (
                        <div className="py-12 flex flex-col items-center justify-center gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            <p className="text-sm text-gray-500">AI 正在思考并撰写中...</p>
                        </div>
                    )}

                    {result && !isLoading && (
                        <div className="space-y-3">
                            <div className="p-4 bg-gray-50 border rounded-lg max-h-[300px] overflow-y-auto">
                                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: result }} />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setResult('')}
                                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    重新输入
                                </button>
                                <button
                                    onClick={handleInsert}
                                    className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    插入到编辑器
                                </button>
                            </div>
                        </div>
                    )}

                    {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
                </div>
            </DialogContent>
        </Dialog>
    );
}
