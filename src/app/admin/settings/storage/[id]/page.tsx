import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { ArrowLeft, HardDrive } from 'lucide-react';
import Link from 'next/link';
import StorageConfigForm from '../_components/StorageConfigForm';

export default async function EditStorageConfigPage({ params }: { params: { id: string } }) {
    const config = await db.storageConfig.findUnique({
        where: { id: params.id },
    });

    if (!config) {
        notFound();
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/settings/storage"
                        className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Link>
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                        <HardDrive className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">编辑存储配置</h1>
                        <p className="text-[11px] text-gray-500 font-medium">修改现有的存储配置参数</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <StorageConfigForm initialData={config} isEdit={true} />
        </div>
    );
}
