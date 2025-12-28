'use client';

import { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
    value?: string;
    onChange: (url: string) => void;
    className?: string;
}

export default function ImageUploader({ value, onChange, className = '' }: ImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 验证文件类型
        if (!file.type.startsWith('image/')) {
            setError('请选择图片文件');
            return;
        }

        // 验证文件大小 (10MB)
        if (file.size > 10 * 1024 * 1024) {
            setError('图片大小不能超过 10MB');
            return;
        }

        setError(null);
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('category', 'image');

            const response = await fetch('/api/admin/files/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '上传失败');
            }

            const data = await response.json();
            onChange(data.file.url);
        } catch (err) {
            console.error('上传错误:', err);
            setError(err instanceof Error ? err.message : '上传失败');
        } finally {
            setIsUploading(false);
        }
    };

    const handleClear = () => {
        onChange('');
        setError(null);
    };

    return (
        <div className={className}>
            {value ? (
                <div className="relative group">
                    <img
                        src={value}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                        onClick={handleClear}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        type="button"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={isUploading}
                    />
                    {isUploading ? (
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    ) : (
                        <>
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">点击上传图片</p>
                            <p className="text-xs text-gray-400 mt-1">最大 10MB</p>
                        </>
                    )}
                </label>
            )}
            {error && (
                <p className="text-xs text-red-500 mt-1">{error}</p>
            )}
        </div>
    );
}
