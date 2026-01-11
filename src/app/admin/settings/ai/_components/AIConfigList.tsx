'use client';

import { useState } from 'react';
import { Edit, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AIConfigForm from './AIConfigForm';
import DeleteAIConfigButton from './DeleteAIConfigButton';

interface AIConfigListProps {
    configs: any[];
}

export default function AIConfigList({ configs }: AIConfigListProps) {
    const router = useRouter();
    const [editingConfig, setEditingConfig] = useState<any>(null);

    if (editingConfig) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">编辑配置</h3>
                    <button
                        onClick={() => setEditingConfig(null)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                        取消
                    </button>
                </div>
                <AIConfigForm
                    initialData={editingConfig}
                    onSuccess={() => setEditingConfig(null)}
                />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {configs.map((config) => (
                <div
                    key={config.id}
                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
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
                                <span className={`text-xs px-2 py-0.5 rounded-full ${config.useCase === 'WRITING' ? 'bg-blue-100 text-blue-600' :
                                        config.useCase === 'CODE' ? 'bg-purple-100 text-purple-600' :
                                            config.useCase === 'IMAGE' ? 'bg-green-100 text-green-600' :
                                                'bg-gray-100 text-gray-600'
                                    }`}>
                                    {config.useCase === 'WRITING' ? '写作' :
                                        config.useCase === 'CODE' ? '代码生成' :
                                            config.useCase === 'IMAGE' ? '图片生成' :
                                                '通用'}
                                </span>
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
    );
}
