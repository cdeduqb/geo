import { db } from '@/lib/db';
import SystemSettingsForm from './_components/SystemSettingsForm';
import { Settings } from 'lucide-react';

export const metadata = {
    title: '系统设置 - GeoCMS 管理后台',
};

export default async function GeneralSettingsPage() {
    const settings = await db.systemSetting.findMany();

    // Convert to key-value object
    const settingsObject: Record<string, string> = {};
    settings.forEach(setting => {
        settingsObject[setting.key] = setting.value;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Settings className="w-8 h-8 text-blue-600" />
                        系统基本设置
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        配置网站基本信息、联系方式和社交媒体账号
                    </p>
                </div>
            </div>

            <SystemSettingsForm initialSettings={settingsObject} />
        </div>
    );
}
