import { db } from '@/lib/db';
import Link from 'next/link';
import { Plus, HardDrive, Check } from 'lucide-react';
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
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <HardDrive className="w-8 h-8 text-blue-600" />
                        存储配置
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        管理文件存储方式，支持本地存储和云存储
                    </p>
                </div>
                <Link
                    href="/admin/settings/storage/create"
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    新建配置
                </Link>
            </div>

            {/* Configs List */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {configs.length === 0 ? (
                    <div className="py-12 text-center">
                        <HardDrive className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">暂无存储配置</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            开始创建一个存储配置
                        </p>
                        <div className="mt-6">
                            <Link
                                href="/admin/settings/storage/create"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                新建配置
                            </Link>
                        </div>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    配置名称
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    存储类型
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    状态
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    创建时间
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    操作
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {configs.map((config) => (
                                <tr key={config.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="font-medium text-gray-900">
                                                {config.name}
                                                {config.isActive && (
                                                    <Check className="inline-block w-4 h-4 ml-2 text-green-600" />
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {PROVIDER_LABELS[config.provider] || config.provider}
                                    </td>
                                    <td className="px-6 py-4">
                                        {config.isActive ? (
                                            <Badge variant="success">已激活</Badge>
                                        ) : (
                                            <Badge variant="secondary">未激活</Badge>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(config.createdAt).toLocaleDateString('zh-CN')}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <StorageConfigActions config={config} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">💡 存储配置说明</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>本地存储</strong>: 文件保存在服务器 public/uploads 目录</li>
                    <li>• <strong>阿里云 OSS</strong>: 需要配置 AccessKey、SecretKey、Bucket 和 Region</li>
                    <li>• <strong>腾讯云 COS</strong>: 需要配置 SecretId、SecretKey、Bucket 和 Region</li>
                    <li>• 同时只能激活一个存储配置，切换后新上传的文件将使用新配置</li>
                </ul>
            </div>
        </div>
    );
}
