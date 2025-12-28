'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, Loader2, TestTube } from 'lucide-react';

interface ValidateButtonProps {
    provider: string;
    baseUrl: string;
    apiKey: string;
    secretKey?: string;
    modelName?: string;
    configId?: string; // Add configId for edited configs
}

export default function ValidateButton({ provider, baseUrl, apiKey, secretKey, modelName, configId }: ValidateButtonProps) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string; details?: string } | null>(null);

    const handleValidate = async () => {
        if (!baseUrl) {
            setResult({
                success: false,
                message: '请先填写 Base URL'
            });
            return;
        }

        // For new configs, require API key. For edited configs with masked key, allow validation using configId
        if (!apiKey && !configId) {
            setResult({
                success: false,
                message: '请先填写 API Key'
            });
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const response = await fetch('/api/admin/ai-configs/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    provider,
                    baseUrl,
                    apiKey,
                    secretKey,
                    modelName,
                    configId // Include configId to allow fetching real API key from DB
                })
            });

            const data = await response.json();
            setResult(data);
        } catch (error: any) {
            setResult({
                success: false,
                message: '验证请求失败',
                details: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-2">
            <button
                type="button"
                onClick={handleValidate}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        验证中...
                    </>
                ) : (
                    <>
                        <TestTube className="w-4 h-4 mr-2" />
                        验证配置
                    </>
                )}
            </button>

            {result && (
                <div className={`p-3 rounded-lg flex items-start gap-2 text-sm ${result.success
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                    }`}>
                    {result.success ? (
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    ) : (
                        <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                        <div className="font-medium">{result.message}</div>
                        {result.details && (
                            <div className="mt-1 text-xs opacity-80">{result.details}</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
