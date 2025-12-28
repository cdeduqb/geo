'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import Link from 'next/link';

export default function CreateStorageConfigPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        provider: 'LOCAL',
        isActive: false,
        // Local
        uploadDir: '',
        baseUrl: '/uploads',
        // Aliyun OSS
        accessKeyId: '',
        accessKeySecret: '',
        // Tencent COS
        secretId: '',
        secretKey: '',
        // Common
        region: '',
        bucket: '',
        endpoint: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.provider) {
            showToast('请填写必填字段', 'error');
            return;
        }

        // 构建config对象
        let config: any = {};

        if (formData.provider === 'LOCAL') {
            config = {
                uploadDir: formData.uploadDir,
                baseUrl: formData.baseUrl,
            };
        } else if (formData.provider === 'ALIYUN_OSS') {
            if (!formData.accessKeyId || !formData.accessKeySecret || !formData.bucket || !formData.region) {
                showToast('请填写阿里云 OSS 所有必填字段', 'error');
                return;
            }
            config = {
                accessKeyId: formData.accessKeyId,
                accessKeySecret: formData.accessKeySecret,
                bucket: formData.bucket,
                region: formData.region,
                endpoint: formData.endpoint,
            };
        } else if (formData.provider === 'TENCENT_COS') {
            if (!formData.secretId || !formData.secretKey || !formData.bucket || !formData.region) {
                showToast('请填写腾讯云 COS 所有必填字段', 'error');
                return;
            }
            config = {
                secretId: formData.secretId,
                secretKey: formData.secretKey,
                bucket: formData.bucket,
                region: formData.region,
            };
        }

        try {
            setLoading(true);
            const res = await fetch('/api/admin/storage/configs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    provider: formData.provider,
                    config,
                    isActive: formData.isActive,
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || '创建失败');
            }

            showToast('存储配置创建成功', 'success');
            router.push('/admin/settings/storage');
        } catch (error: any) {
            showToast(error.message || '创建失败', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/settings/storage"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">新建存储配置</h1>
                    <p className="text-sm text-gray-500">配置文件存储方式</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
                    {/* Basic Settings */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900">基本设置</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                配置名称 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="例如：默认本地存储"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                存储类型 <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.provider}
                                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                <option value="LOCAL">本地存储</option>
                                <option value="ALIYUN_OSS">阿里云 OSS</option>
                                <option value="TENCENT_COS">腾讯云 COS</option>
                            </select>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                                创建后立即激活（将停用其他配置）
                            </label>
                        </div>
                    </div>

                    {/* Provider-specific Settings */}
                    {formData.provider === 'LOCAL' && (
                        <div className="space-y-4 border-t border-gray-200 pt-4">
                            <h2 className="text-lg font-semibold text-gray-900">本地存储配置</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    上传目录
                                </label>
                                <input
                                    type="text"
                                    value={formData.uploadDir}
                                    onChange={(e) => setFormData({ ...formData, uploadDir: e.target.value })}
                                    placeholder="留空使用默认: public/uploads"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    基础 URL
                                </label>
                                <input
                                    type="text"
                                    value={formData.baseUrl}
                                    onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                                    placeholder="/uploads"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {formData.provider === 'ALIYUN_OSS' && (
                        <div className="space-y-4 border-t border-gray-200 pt-4">
                            <h2 className="text-lg font-semibold text-gray-900">阿里云 OSS 配置</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Access Key ID <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.accessKeyId}
                                    onChange={(e) => setFormData({ ...formData, accessKeyId: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Access Key Secret <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    value={formData.accessKeySecret}
                                    onChange={(e) => setFormData({ ...formData, accessKeySecret: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bucket <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.bucket}
                                    onChange={(e) => setFormData({ ...formData, bucket: e.target.value })}
                                    placeholder="my-bucket"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Region <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.region}
                                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                    placeholder="oss-cn-hangzhou"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Endpoint (可选)
                                </label>
                                <input
                                    type="text"
                                    value={formData.endpoint}
                                    onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                                    placeholder="https://oss-cn-hangzhou.aliyuncs.com"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {formData.provider === 'TENCENT_COS' && (
                        <div className="space-y-4 border-t border-gray-200 pt-4">
                            <h2 className="text-lg font-semibold text-gray-900">腾讯云 COS 配置</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Secret ID <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.secretId}
                                    onChange={(e) => setFormData({ ...formData, secretId: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Secret Key <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    value={formData.secretKey}
                                    onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bucket <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.bucket}
                                    onChange={(e) => setFormData({ ...formData, bucket: e.target.value })}
                                    placeholder="my-bucket-1250000000"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Region <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.region}
                                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                    placeholder="ap-guangzhou"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-4">
                        <Link
                            href="/admin/settings/storage"
                            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                        >
                            取消
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    创建中...
                                </>
                            ) : (
                                '创建配置'
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
