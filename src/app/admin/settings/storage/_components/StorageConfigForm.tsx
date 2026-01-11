'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Save, HardDrive, Shield, Globe } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import Link from 'next/link';

interface StorageConfigFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function StorageConfigForm({ initialData, isEdit = false }: StorageConfigFormProps) {
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

    useEffect(() => {
        if (initialData) {
            // 解析 initialData 到 formData
            const config = initialData.config || {};
            setFormData({
                name: initialData.name,
                provider: initialData.provider,
                isActive: initialData.isActive,
                uploadDir: config.uploadDir || '',
                baseUrl: config.baseUrl || '/uploads',
                accessKeyId: config.accessKeyId || '',
                accessKeySecret: config.accessKeySecret || '',
                secretId: config.secretId || '',
                secretKey: config.secretKey || '',
                region: config.region || '',
                bucket: config.bucket || '',
                endpoint: config.endpoint || '',
            });
        }
    }, [initialData]);

    // 样式常量
    const inputClass = "w-full rounded-2xl border border-gray-300 bg-gray-50/50 px-6 py-4 text-sm font-bold text-gray-900 focus:border-blue-600 focus:bg-white transition-all outline-none placeholder:text-gray-300";
    const labelClass = "text-[13px] font-bold text-gray-700 ml-1 block mb-2";
    const cardClass = "bg-white rounded-[32px] border border-gray-100 shadow-sm ring-1 ring-gray-100/50 p-10";

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
            const url = isEdit
                ? `/api/admin/storage/configs/${initialData.id}`
                : '/api/admin/storage/configs';

            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
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
                throw new Error(error.error || (isEdit ? '更新失败' : '创建失败'));
            }

            showToast(isEdit ? '存储配置已更新' : '存储配置创建成功', 'success');
            router.push('/admin/settings/storage');
            router.refresh();
        } catch (error: any) {
            showToast(error.message || (isEdit ? '更新失败' : '创建失败'), 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className={cardClass}>
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                            <h2 className="text-lg font-black text-gray-900 tracking-tight">核心配置</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className={labelClass}>
                                    配置显示名称 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="例如：主站生产环境 OSS"
                                    className={inputClass}
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <label className={labelClass}>
                                    存储引擎供应商 <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.provider}
                                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                                    className={inputClass}
                                    disabled={isEdit} // 修改时不允许更改提供商
                                >
                                    <option value="LOCAL">服务器本地存储 (Internal)</option>
                                    <option value="ALIYUN_OSS">阿里云 OSS (Object Storage)</option>
                                    <option value="TENCENT_COS">腾讯云 COS (Cloud Object Storage)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Provider-specific Settings */}
                    {formData.provider === 'LOCAL' && (
                        <div className={cardClass}>
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
                                <h2 className="text-lg font-black text-gray-900 tracking-tight">本地文件系统参数</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className={labelClass}>文件上传绝对路径</label>
                                    <input
                                        type="text"
                                        value={formData.uploadDir}
                                        onChange={(e) => setFormData({ ...formData, uploadDir: e.target.value })}
                                        placeholder="建议留空，使用默认: public/uploads"
                                        className={inputClass}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className={labelClass}>静态资源访问前缀 (URL)</label>
                                    <input
                                        type="text"
                                        value={formData.baseUrl}
                                        onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                                        placeholder="/uploads"
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {formData.provider === 'ALIYUN_OSS' && (
                        <div className={cardClass}>
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
                                <h2 className="text-lg font-black text-gray-900 tracking-tight">阿里云 OSS 凭证详情</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className={labelClass}>Access Key ID <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.accessKeyId}
                                        onChange={(e) => setFormData({ ...formData, accessKeyId: e.target.value })}
                                        className={`${inputClass} font-mono`}
                                        placeholder="LTAI5t..."
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className={labelClass}>Access Key Secret <span className="text-red-500">*</span></label>
                                    <input
                                        type="password"
                                        value={formData.accessKeySecret}
                                        onChange={(e) => setFormData({ ...formData, accessKeySecret: e.target.value })}
                                        className={`${inputClass} font-mono`}
                                        placeholder="••••••••••••••••"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className={labelClass}>Bucket 名称 <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.bucket}
                                        onChange={(e) => setFormData({ ...formData, bucket: e.target.value })}
                                        placeholder="my-project-assets"
                                        className={inputClass}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className={labelClass}>Region 区域 <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.region}
                                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                        placeholder="oss-cn-hangzhou"
                                        className={inputClass}
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-3">
                                    <label className={labelClass}>自定义 Endpoint (可选)</label>
                                    <input
                                        type="text"
                                        value={formData.endpoint}
                                        onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                                        placeholder="https://oss-cn-hangzhou.aliyuncs.com"
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {formData.provider === 'TENCENT_COS' && (
                        <div className={cardClass}>
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                                <h2 className="text-lg font-black text-gray-900 tracking-tight">腾讯云 COS 接入凭证</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className={labelClass}>Secret ID <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.secretId}
                                        onChange={(e) => setFormData({ ...formData, secretId: e.target.value })}
                                        className={`${inputClass} font-mono`}
                                        placeholder="AKID..."
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className={labelClass}>Secret Key <span className="text-red-500">*</span></label>
                                    <input
                                        type="password"
                                        value={formData.secretKey}
                                        onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                                        className={`${inputClass} font-mono`}
                                        placeholder="••••••••••••••••"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className={labelClass}>Bucket 名称 <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.bucket}
                                        onChange={(e) => setFormData({ ...formData, bucket: e.target.value })}
                                        placeholder="project-1250000000"
                                        className={inputClass}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className={labelClass}>Region 区域 <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.region}
                                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                        placeholder="ap-shanghai"
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className={cardClass}>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                            <h2 className="text-lg font-black text-gray-900 tracking-tight">立即生效</h2>
                        </div>

                        <div
                            className={`p-6 rounded-[24px] border transition-all cursor-pointer ${formData.isActive ? 'bg-blue-50/50 border-blue-100 shadow-inner' : 'bg-gray-50 border-gray-100 opacity-60'}`}
                            onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${formData.isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-300'}`}>
                                    <Shield className="w-5 h-5" />
                                </div>
                                <h4 className="font-black text-gray-900 text-sm">设为默认存储</h4>
                            </div>
                            <p className="text-[11px] text-gray-500 font-bold leading-relaxed mb-6">启用后，所有新上传的文件将通过此引擎进行处理。系统会自动停用当前的活跃配置。</p>

                            <div className="flex items-center justify-between">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${formData.isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                                    {formData.isActive ? '已激活' : '已停用'}
                                </span>
                                <div className={`w-12 h-6 rounded-full relative transition-colors ${formData.isActive ? 'bg-blue-600' : 'bg-gray-200'}`}>
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.isActive ? 'translate-x-7' : 'translate-x-1'}`} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 rounded-[32px] p-10 text-white shadow-2xl shadow-indigo-200">
                        <div className="flex items-center gap-3 mb-6">
                            <Globe className="w-6 h-6 text-blue-400" />
                            <h3 className="font-black text-lg">部署提示</h3>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400 font-bold text-[10px]">1</div>
                                <p className="text-xs text-gray-300 font-medium leading-relaxed">请确保云端存储桶已开启 <span className="text-blue-400 font-bold">公共读 (Public Read)</span> 权限，否则前端资源将无法加载。</p>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400 font-bold text-[10px]">2</div>
                                <p className="text-xs text-gray-300 font-medium leading-relaxed">对于 OSS/COS，建议配置 <span className="text-blue-400 font-bold">CORS 跨域规则</span>，特别是需要处理 Canvas 或直接导出文件时。</p>
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 font-black text-sm text-white shadow-xl shadow-blue-100 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    处理中...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    {isEdit ? '更新配置' : '创建配置'}
                                </>
                            )}
                        </button>
                        <Link
                            href="/admin/settings/storage"
                            className="w-full flex items-center justify-center px-8 py-4 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            取消并返回
                        </Link>
                    </div>
                </div>
            </div>
        </form>
    );
}
