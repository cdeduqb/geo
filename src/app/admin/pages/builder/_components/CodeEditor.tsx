'use client';

import { useState, useRef } from 'react';
import Editor, { loader } from '@monaco-editor/react';

// Configure monaco loader to use local assets for reliability
loader.config({
    paths: {
        vs: '/monaco-editor/min/vs'
    }
});
import { Save, Loader2, ArrowLeft, Eye, Code } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CodeEditorProps {
    pageId: string;
    initialContent: string;
}

export default function CodeEditor({ pageId, initialContent }: CodeEditorProps) {
    const router = useRouter();
    const [content, setContent] = useState(initialContent || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isPreview, setIsPreview] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/admin/pages/${pageId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });

            if (!res.ok) throw new Error('Failed to save');

            alert('保存成功！');
        } catch (error) {
            console.error('Save error:', error);
            alert('保存失败，请重试');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white">
            {/* Header */}
            <div className="h-14 border-b border-gray-800 flex items-center justify-between px-4 bg-gray-900">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="h-6 w-px bg-gray-800" />
                    <h1 className="font-mono text-sm text-gray-400">HTML Source Editor</h1>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsPreview(!isPreview)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isPreview
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                    >
                        {isPreview ? <Code className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {isPreview ? '编辑代码' : '预览页面'}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm text-sm font-medium"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        保存代码
                    </button>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 overflow-hidden relative">
                {isPreview ? (
                    <div className="w-full h-full bg-white overflow-y-auto">
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                    </div>
                ) : (
                    <Editor
                        height="100%"
                        defaultLanguage="html"
                        theme="vs-dark"
                        value={content}
                        onChange={(value) => setContent(value || '')}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            wordWrap: 'on',
                            padding: { top: 20 },
                            scrollBeyondLastLine: false,
                        }}
                    />
                )}
            </div>
        </div>
    );
}
