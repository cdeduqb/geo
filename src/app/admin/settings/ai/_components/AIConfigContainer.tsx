'use client';

import { useState } from 'react';
import { Bot, Plus, Edit, CheckCircle, XCircle } from 'lucide-react';
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Bot className="w-8 h-8 text-blue-600" />
                        AI 模型配置
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        管理 AI 服务提供商、API 密钥和模型参数。
                    </p>
                </div>
                <Button onClick={() => setOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    添加新配置
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="space-y-4">
                    {configs.map((config) => (
                        <div
                            key={config.id}
                            className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${config.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                    {config.isActive ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                        {config.provider}
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                            {config.modelName}
                                        </span>
                                        {config.useCase && config.useCase !== 'GENERAL' && (
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${config.useCase === 'WRITING' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                                {config.useCase === 'WRITING' ? '写作' : '代码'}
                                            </span>
                                        )}
                                    </h4>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        Base URL: {config.baseUrl}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setEditingConfig(config)}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="编辑"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <DeleteAIConfigButton configId={config.id} />
                            </div>
                        </div>
                    ))}

                    {configs.length === 0 && (
                        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            暂无 AI 配置，请添加一个新的配置。
                        </div>
                    )}
                </div>
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
