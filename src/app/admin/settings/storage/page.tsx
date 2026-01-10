import { db } from '@/lib/db';
import Link from 'next/link';
import { Plus, HardDrive, Check, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import StorageConfigActions from './_components/StorageConfigActions';

const PROVIDER_LABELS: Record<string, string> = {
    LOCAL: '本地存储',
    ALIYUN_OSS: '阿里云 OSS',
    TENCENT_COS: '腾讯云 COS',
};

export default async function StorageConfigsPage() {
    const configs = await db.storageConfig.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                        <HardDrive className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">存储配置</h1>
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider opacity-60">Storage Management</p>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="bg-white rounded-[24px] border border-gray-100 p-3 flex items-center justify-between gap-4 shadow-sm shadow-gray-100/50">
                <div className="px-4">
                    <p className="text-sm text-gray-500 font-medium">管理系统文件存储方式，保障资源跨域访问与安全性</p>
                </div>
                <Link
                    href="/admin/settings/storage/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-100 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    新建配置
                </Link>
            </div>

            {/* Configs List */}
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm shadow-gray-100/50 p-6">
                <div className="space-y-4">
                    {configs.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                            <HardDrive className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                            <h3 className="text-sm font-bold text-gray-400 mb-2">暂无存储配置</h3>
                            <Link
                                href="/admin/settings/storage/create"
                                className="text-blue-600 text-sm font-bold hover:underline"
                            >
                                点击此处开始创建一个新配置
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {configs.map((config) => (
                                <div key={config.id} className="flex items-center justify-between py-5 first:pt-0 last:pb-0 group">
                                    <div className="flex items-center gap-5">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${config.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'}`}>
                                            <Check className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h4 className="font-bold text-gray-900 text-lg">{config.name}</h4>
                                                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-gray-100 text-gray-500 border border-gray-200/50">
                                                    {PROVIDER_LABELS[config.provider] || config.provider}
                                                </span>
                                                {config.isActive && (
                                                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100/50 uppercase tracking-widest">
                                                        当前默认存储
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1 font-medium">
                                                创建于 {new Date(config.createdAt).toLocaleDateString('zh-CN')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <StorageConfigActions config={config} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50/50 border border-blue-100/50 rounded-[24px] p-6 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-blue-900 mb-2 tracking-tight">存储配置说明</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                            <ul className="text-xs text-blue-800/70 space-y-2 font-medium">
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                    <strong>本地存储</strong>：文件保存在服务器 public/uploads 目录
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                    <strong>阿里云 OSS</strong>：需要 AccessKey、Bucket 和 Region
                                </li>
                            </ul>
                            <ul className="text-xs text-blue-800/70 space-y-2 font-medium">
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                    <strong>腾讯云 COS</strong>：需要 SecretId、Bucket 和 Region
                                </li>
                                <li className="flex items-center gap-2 text-blue-700">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-sm" />
                                    系统仅支持同时激活一个存储配置，切换后即刻生效
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
