import { db } from '@/lib/db';
import Link from 'next/link';
import SEOConfigList from './_components/SEOConfigList';
import { Search, Send } from 'lucide-react';

export const metadata = {
    title: 'SEO 推送配置 - GeoCMS 管理后台',
};

export default async function SEOConfigsPage() {
    const configs = await db.sEOPushConfig.findMany({
        orderBy: { platform: 'asc' },
        include: {
            _count: {
                select: { pushLogs: true },
            },
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Search className="w-8 h-8 text-blue-600" />
                        SEO 推送配置
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        配置搜索引擎推送平台，自动提交网站内容
                    </p>
                </div>
                <Link
                    href="/admin/seo/push"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    <Send className="w-4 h-4" />
                    批量推送
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <SEOConfigList configs={configs} />
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
                        <h2 className="text-lg font-semibold mb-4 text-gray-900">📚 平台说明</h2>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                                <span className="font-semibold text-gray-900 min-w-[40px]">百度:</span>
                                <span>需要在百度站长平台获取推送 Token，支持普通收录和快速收录。</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-semibold text-gray-900 min-w-[40px]">360:</span>
                                <span>需要站点 ID 和 API Token，仅支持普通收录。</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-semibold text-gray-900 min-w-[40px]">搜狗:</span>
                                <span>需要推送 Token，通过验证站点后获取。</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-semibold text-gray-900 min-w-[40px]">头条:</span>
                                <span>需要头条搜索 API Token，支持自动推送。</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
