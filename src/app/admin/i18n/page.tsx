import TranslationDashboard from './_components/TranslationDashboard';
import { getI18nSettings } from '@/lib/system-settings';
import Link from 'next/link';
import { Settings } from 'lucide-react';

export const metadata = {
    title: '全球化翻译中心 | 管理后台',
};

export default async function I18nPage() {
    const i18nSettings = await getI18nSettings();

    if (!i18nSettings.enableMultiLanguage) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
                <div className="p-4 bg-gray-100 rounded-full">
                    <Settings className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">多语言功能未开启</h2>
                <p className="text-gray-500 max-w-md">
                    相关的语言设置功能目前处于隐藏状态。请前往站点设置开启多语言支持后，再使用全球化翻译中心。
                </p>
                <Link
                    href="/admin/settings/site?tab=languages"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    前往开启
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6">
            <TranslationDashboard />
        </div>
    );
}
