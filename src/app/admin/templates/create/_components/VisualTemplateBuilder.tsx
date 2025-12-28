'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save, Loader2, Info, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface VisualTemplateBuilderProps {
    onBack: () => void;
}

export default function VisualTemplateBuilder({ onBack }: VisualTemplateBuilderProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [templateInfo, setTemplateInfo] = useState({
        name: '',
        description: '',
        moduleType: 'HEADER',
        type: 'CUSTOM'
    });
    const [tempPageId, setTempPageId] = useState<string>('');
    const [step, setStep] = useState<'form' | 'build'>('form');
    const [showEmptyConfirm, setShowEmptyConfirm] = useState(false);
    const [nameError, setNameError] = useState('');
    const [isCheckingName, setIsCheckingName] = useState(false);
    const isSavedRef = useRef(false); // Track if template is successfully saved

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

    // Cleanup: Delete temp page if user navigates away without saving
    useEffect(() => {
        return () => {
            // If we have a temp page and haven't saved it, delete it
            if (tempPageId && !isSavedRef.current) {
                console.log('Cleaning up unsaved temp page:', tempPageId);
                // Use sendBeacon for more reliable cleanup on page unload, or fetch for navigation
                const deleteUrl = `/api/admin/pages/${tempPageId}`;
                if (typeof navigator.sendBeacon === 'function') {
                    // sendBeacon doesn't support DELETE method usually, so we might need a special endpoint or stick to fetch with keepalive
                    // But fetch with keepalive is better
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

    const handleContinue = async () => {
        if (!templateInfo.name.trim()) {
            showToast('请填写模板名称', 'warning');
            return;
        }

        if (nameError) {
            showToast(nameError, 'error');
            return;
        }

        // Create a temporary page for building
        try {
            const res = await fetch('/api/admin/pages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: `temp-template-${Date.now()}`,
                    slug: `temp-template-${Date.now()}`,
                    type: 'CUSTOM',
                    status: 'DRAFT',
                    editorMode: 'VISUAL',
                    content: '',
                }),
                credentials: 'include',
            });

            console.log('Create page response status:', res.status);

            if (!res.ok) {
                const errorData = await res.json();
                console.error('Create page error:', errorData);
                throw new Error(errorData.details || errorData.error || 'Failed to create temp page');
            }

            const { page } = await res.json();
            console.log('Created temp page:', page.id);
            setTempPageId(page.id);
            setStep('build');
        } catch (error) {
            console.error('Error creating temp page:', error);
            showToast(`创建临时页面失败: ${(error as Error).message}`, 'error');
        }
    };

    const handleSaveAsTemplate = async () => {
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
            console.log('Sections length:', sections ? (Array.isArray(sections) ? sections.length : 'not array') : 'null');

            if (!sections || (Array.isArray(sections) && sections.length === 0)) {
                // Show confirm dialog for empty template
                setShowEmptyConfirm(true);
                setIsSaving(false);
                return;
            }

            await saveTemplate(sections);
        } catch (error) {
            console.error('Save error:', error);
            showToast(`保存失败: ${(error as Error).message}`, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const saveTemplate = async (sections: any) => {
        try {
            // Create template with sections
            const templateData = {
                ...templateInfo,
                sections,
                content: '', // Visual template doesn't need content
            };

            console.log('Creating template with data:', templateData);

            const templateRes = await fetch('/api/admin/templates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(templateData),
                credentials: 'include',
            });

            console.log('Create template response status:', templateRes.status);

            if (!templateRes.ok) {
                const data = await templateRes.json();
                console.error('Create template error:', data);
                throw new Error(data.details || data.error || 'Failed to save template');
            }

            const { template } = await templateRes.json();
            console.log('Template created successfully:', template.id);

            // Delete temp page - ensure it's deleted before navigating
            try {
                const deleteRes = await fetch(`/api/admin/pages/${tempPageId}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
                if (!deleteRes.ok) {
                    console.warn('Failed to delete temp page, but template saved successfully');
                }
            } catch (deleteError) {
                console.error('Error deleting temp page:', deleteError);
                // Continue anyway since template is saved
            }

            isSavedRef.current = true; // Mark as saved so cleanup doesn't try to delete again
            showToast('模板保存成功！', 'success');
            router.push('/admin/templates');
        } catch (error) {
            console.error('Save error:', error);
            showToast(`保存失败: ${(error as Error).message}`, 'error');
            throw error;
        }
    };

    const handleEmptyTemplateConfirm = async () => {
        setShowEmptyConfirm(false);
        setIsSaving(true);

        try {
            // Fetch page sections again and save
            const pageRes = await fetch(`/api/admin/pages/${tempPageId}`, {
                credentials: 'include',
            });

            if (!pageRes.ok) throw new Error('Failed to fetch page');
            const { page } = await pageRes.json();

            await saveTemplate(page.sections || []);
            // Delete temp page after saving (saveTemplate already deletes it)
        } catch (error) {
            console.error('Save error:', error);
            showToast(`保存失败: ${(error as Error).message}`, 'error');
            setIsSaving(false);
        }
    };

    if (step === 'form') {
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
                        <h2 className="text-2xl font-bold text-gray-900">可视化模板构建</h2>
                        <p className="text-sm text-gray-500">填写基本信息，然后进入可视化编辑</p>
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
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${nameError ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="例如：企业官网首页模板"
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            模板类型
                        </label>
                        <select
                            value={templateInfo.moduleType}
                            onChange={(e) => setTemplateInfo({
                                ...templateInfo, moduleType: e.target.value
                            })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
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
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-white text-gray-900"
                        />
                    </div>

                    <div className="flex items-start gap-2 p-4 bg-blue-50 rounded-lg">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-700">
                            接下来您将进入可视化编辑器，通过拖拽组件来设计模板。编辑完成后点击"保存为模板"即可。
                        </p>
                    </div>

                    <button
                        onClick={handleContinue}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
                    >
                        继续 →
                    </button>
                </div>
            </div>
        );
    }

    // step === 'build'
    if (!tempPageId) return <div>Loading...</div>;

    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
            {/* Custom header for template mode */}
            <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h3 className="font-bold text-gray-900">{templateInfo.name}</h3>
                        <p className="text-xs text-gray-500">可视化模板编辑</p>
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
                        onClick={handleSaveAsTemplate}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        保存为模板
                    </button>
                </div>
            </div>

            {/* Embed the builder in an iframe to reuse existing page builder */}
            <iframe
                src={`/template-builder/${tempPageId}?hideToolbar=true&moduleType=${templateInfo.moduleType}`}
                className="flex-1 w-full border-none"
            />

            {/* Empty template confirmation dialog */}
            <ConfirmDialog
                isOpen={showEmptyConfirm}
                title="警告"
                message="当前模板没有任何组件内容。\n\n是否仍要保存空模板？"
                confirmText="保存"
                cancelText="取消"
                confirmButtonClass="bg-yellow-600 hover:bg-yellow-700"
                onConfirm={handleEmptyTemplateConfirm}
                onCancel={() => setShowEmptyConfirm(false)}
            />
        </div>
    );
}
