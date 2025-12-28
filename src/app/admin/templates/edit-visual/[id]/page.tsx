'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save, Loader2, Eye } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/components/ui/toast';

export default function EditVisualTemplatePage() {
    const router = useRouter();
    const params = useParams();
    const { showToast } = useToast();
    const templateId = params.id as string;

    const [template, setTemplate] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [templateName, setTemplateName] = useState('');
    const isSavedRef = useRef(false);
    const [tempPageId, setTempPageId] = useState('');

    useEffect(() => {
        fetchTemplate();
    }, [templateId]);

    // Cleanup: Delete temp page if user navigates away without saving
    useEffect(() => {
        return () => {
            // If we have a temp page and haven't saved it, delete it
            if (tempPageId && !isSavedRef.current) {
                console.log('Cleaning up unsaved temp page:', tempPageId);
                const deleteUrl = `/api/admin/pages/${tempPageId}`;
                if (typeof navigator.sendBeacon === 'function') {
                    fetch(deleteUrl, {
                        method: 'DELETE',
                        keepalive: true,
                        credentials: 'include'
                    }).catch(err => console.error('Cleanup error:', err));
                } else {
                    fetch(deleteUrl, {
                        method: 'DELETE',
                        credentials: 'include'
                    }).catch(err => console.error('Cleanup error:', err));
                }
            }
        };
    }, [tempPageId]);

    const fetchTemplate = async () => {
        try {
            const res = await fetch(`/api/admin/templates/${templateId}`, {
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Failed to fetch template');

            const data = await res.json();
            setTemplate(data.template);

            // Create temp page with template sections
            const pageRes = await fetch('/api/admin/pages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: `temp-edit-${Date.now()}`,
                    slug: `temp-edit-${Date.now()}`,
                    type: 'CUSTOM',
                    status: 'DRAFT',
                    editorMode: 'VISUAL',
                    sections: (data.template.sections && data.template.sections.length > 0)
                        ? data.template.sections
                        : (data.template.content ? [{
                            id: `section-${Date.now()}`,
                            type: 'custom-html',
                            data: { html: data.template.content },
                            style: {}
                        }] : []),
                    content: '',
                }),
                credentials: 'include',
            });

            if (!pageRes.ok) throw new Error('Failed to create temp page');

            const { page } = await pageRes.json();
            setTempPageId(page.id);
            setIsLoading(false);
        } catch (error) {
            console.error('Error:', error);
            showToast('加载模板失败', 'error');
            router.push('/admin/templates');
        }
    };

    const handleSave = async () => {
        if (!tempPageId) return;

        setIsSaving(true);
        try {
            console.log('Requesting sections from iframe...');

            // Request sections from iframe via postMessage
            const iframe = document.querySelector('iframe');
            if (!iframe || !iframe.contentWindow) {
                throw new Error('无法访问编辑器');
            }

            // Send request to iframe
            iframe.contentWindow.postMessage({ type: 'GET_SECTIONS' }, '*');

            // Wait for response from iframe
            const sections = await new Promise<any>((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('获取编辑器内容超时'));
                }, 5000);

                const handleMessage = (event: MessageEvent) => {
                    if (event.data.type === 'SECTIONS_DATA') {
                        clearTimeout(timeout);
                        window.removeEventListener('message', handleMessage);
                        resolve(event.data.sections);
                    }
                };

                window.addEventListener('message', handleMessage);
            });

            console.log('Received sections from iframe:', sections);

            // Update template with sections from iframe
            const updateRes = await fetch(`/api/admin/templates/${templateId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sections: sections,
                }),
                credentials: 'include',
            });

            if (!updateRes.ok) throw new Error('Failed to update template');

            // Delete temp page - ensure it's deleted before navigating
            try {
                const deleteRes = await fetch(`/api/admin/pages/${tempPageId}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
                if (!deleteRes.ok) {
                    console.warn('Failed to delete temp page, but template updated successfully');
                }
            } catch (deleteError) {
                console.error('Error deleting temp page:', deleteError);
                // Continue anyway since template is updated
            }

            isSavedRef.current = true;
            showToast('模板更新成功！', 'success');
            router.push('/admin/templates');
        } catch (error) {
            console.error('Save error:', error);
            showToast(`保存失败: ${(error as Error).message}`, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
            {/* Header */}
            <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/admin/templates')}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h3 className="font-bold text-gray-900">{template?.name}</h3>
                        <p className="text-xs text-gray-500">编辑可视化模板</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            const iframe = document.querySelector('iframe');
                            if (iframe?.contentWindow) {
                                iframe.contentWindow.postMessage({ type: 'TOGGLE_PREVIEW' }, '*');
                            }
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-sm"
                    >
                        <Eye className="w-4 h-4" />
                        预览
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        保存更改
                    </button>
                </div>
            </div>

            {/* Builder iframe */}
            <iframe
                src={`/template-builder/${tempPageId}?hideToolbar=true&moduleType=${template?.moduleType}`}
                className="flex-1 w-full border-none"
            />
        </div>
    );
}
