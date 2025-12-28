'use client';

import { useState } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
    disabled?: boolean;
    className?: string;
    showDescription?: boolean;
    onDescriptionChange?: (desc: string) => void;
    initialDescription?: string;
}

export default function ImageUpload({
    value,
    onChange,
    label = '点击上传图片',
    disabled = false,
    className = '',
    showDescription = false,
    onDescriptionChange,
    initialDescription = ''
}: ImageUploadProps) {
    const { showToast } = useToast();
    const [uploading, setUploading] = useState(false);
    const [description, setDescription] = useState(initialDescription);
    const [currentFileId, setCurrentFileId] = useState<string | null>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            showToast('图片大小不能超过5MB', 'error');
            return;
        }

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('category', 'image');

            // If description is already entered, send it with upload
            if (description) {
                formData.append('description', description);
            }

            const res = await fetch('/api/admin/files/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('上传失败');

            const data = await res.json();

            // Set file ID for subsequent description updates
            if (data.file?.id) {
                setCurrentFileId(data.file.id);
            }

            onChange(data.file.url);
            showToast('图片上传成功', 'success');
        } catch (error) {
            console.error('Upload error:', error);
            showToast('图片上传失败', 'error');
        } finally {
            setUploading(false);
            // Reset input value to allow uploading same file again if needed
            e.target.value = '';
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onChange('');
        setCurrentFileId(null);
        setDescription('');
    };

    const handleDescriptionBlur = async () => {
        // Only update if we have a file ID (freshly uploaded) and description changed
        if (currentFileId && description) {
            try {
                const res = await fetch(`/api/admin/files/${currentFileId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ description }),
                });

                if (!res.ok) throw new Error('更新描述失败');
                // showToast('描述已更新', 'success'); // Optional: notify user, or keep silent for auto-save feel
            } catch (error) {
                console.error('Description update error:', error);
                // showToast('描述更新失败', 'error');
            }
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {value ? (
                <div className="relative w-full h-40 bg-gray-50  rounded-lg border border-gray-200  overflow-hidden group">
                    <img
                        src={value}
                        alt={description || "Uploaded image"}
                        className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            type="button"
                            onClick={handleRemove}
                            disabled={disabled}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            title="移除图片"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ) : (
                <label className={`block w-full h-40 border-2 border-dashed border-gray-300  rounded-lg hover:border-blue-500 :border-blue-500 cursor-pointer transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className="flex flex-col items-center justify-center h-full">
                        {uploading ? (
                            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                        ) : (
                            <>
                                <Upload className="w-8 h-8 text-gray-400  mb-2" />
                                <span className="text-sm text-gray-500 ">{label}</span>
                            </>
                        )}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUpload}
                        disabled={disabled || uploading}
                    />
                </label>
            )}

            {showDescription && value && (
                <div className="mt-2">
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                            onDescriptionChange?.(e.target.value);
                        }}
                        onBlur={handleDescriptionBlur}
                        placeholder="图片描述 (Alt Text)"
                        className="w-full px-3 py-2 text-sm border border-gray-300  rounded-lg bg-white  focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            )}
        </div>
    );
}
