'use client';

import { useState } from 'react';
import { Bot, Plus, Edit, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import AIConfigForm from './AIConfigForm';
import DeleteAIConfigButton from './DeleteAIConfigButton';

interface AIConfigContainerProps {
    configs: any[];
}

export default function AIConfigContainer({ configs }: AIConfigContainerProps) {
    const [open, setOpen] = useState(false);
    const [editingConfig, setEditingConfig] = useState<any>(null);

    const handleSuccess = () => {
        setOpen(false);
        setEditingConfig(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100 transition-transform hover:rotate-3">
                        <Bot className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">AI 模型配置</h1>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="bg-white rounded-[24px] border border-gray-100 p-3 flex items-center justify-between gap-4 shadow-sm shadow-gray-100/50">
                <div className="px-5">
                    <p className="text-sm text-gray-500 font-bold leading-relaxed">
                        配置多路 AI 模型，支持内容自动生成与润色
                    </p>
                </div>
                <button
                    onClick={() => setOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg shadow-blue-100 hover:shadow-blue-200 active:scale-95 flex items-center gap-2.5"
                >
                    <Plus className="w-4.5 h-4.5" />
                    <span>添加新配置</span>
                </button>
            </div>

            <div className="grid gap-5">
                {configs.map((config) => (
                    <div
                        key={config.id}
                        className="group relative bg-white rounded-[28px] border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-2xl hover:shadow-blue-50/50 transition-all duration-500 overflow-hidden"
                    >
                        {/* 装饰性背景 */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/30 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:scale-150" />

                        <div className="flex items-center gap-6 relative z-10">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all duration-500 group-hover:rotate-6 ${config.isActive ? 'bg-blue-600 shadow-blue-100 animate-pulse-slow' : 'bg-gray-100 text-gray-400 shadow-transparent'}`}>
                                {config.isActive ? <CheckCircle className="w-7 h-7" /> : <XCircle className="w-7 h-7" />}
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center gap-3">
                                    <h4 className="text-xl font-black text-gray-900 tracking-tight">{config.provider}</h4>
                                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-gray-900 text-white shadow-sm">
                                        {config.modelName}
                                    </span>
                                    {config.isActive && (
                                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">当前活跃</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter flex items-center gap-1.5">
                                        <div className="w-1 h-1 rounded-full bg-gray-300" />
                                        接入节点: <span className="font-mono lowercase">{config.baseUrl}</span>
                                    </div>
                                    {config.useCase && config.useCase !== 'GENERAL' && (
                                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${config.useCase === 'WRITING' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                            {config.useCase === 'WRITING' ? '系统属性: 内容写作' : '系统属性: 代码生成'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 relative z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                            <button
                                onClick={() => setEditingConfig(config)}
                                className="h-12 w-12 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all border border-transparent hover:border-blue-100 shadow-sm hover:shadow-lg"
                                title="编辑"
                            >
                                <Edit className="w-5 h-5" />
                            </button>
                            <DeleteAIConfigButton configId={config.id} />
                        </div>
                    </div>
                ))}

                {configs.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-[32px] border-2 border-dashed border-gray-100 flex flex-col items-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-[28px] flex items-center justify-center mb-6 border border-gray-100">
                            <Bot className="h-10 w-10 text-gray-200" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">尚未配置 AI 模型</h3>
                        <p className="text-sm text-gray-400 font-medium max-w-xs leading-relaxed mb-8">
                            接入 AI 模型后，您可以利用智能助手自动生成文章内容、改写段落或优化代码。
                        </p>
                        <button
                            onClick={() => setOpen(true)}
                            className="bg-gray-900 hover:bg-black text-white px-8 py-3.5 rounded-2xl text-xs font-black transition-all active:scale-95 shadow-xl shadow-gray-200"
                        >
                            立刻开始配置
                        </button>
                    </div>
                )}
            </div>

            {/* Add Config Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>添加新配置</DialogTitle>
                    </DialogHeader>
                    <AIConfigForm onSuccess={handleSuccess} />
                </DialogContent>
            </Dialog>

            {/* Edit Config Dialog */}
            <Dialog open={!!editingConfig} onOpenChange={(val: boolean) => !val && setEditingConfig(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>编辑配置</DialogTitle>
                    </DialogHeader>
                    {editingConfig && (
                        <AIConfigForm
                            initialData={editingConfig}
                            onSuccess={handleSuccess}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
