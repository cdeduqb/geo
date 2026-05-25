import { db } from '@/lib/db';
import Link from 'next/link';
import SEOConfigList from './_components/SEOConfigList';
import { Search, Send, ChevronRight } from 'lucide-react';
import { hasPermission } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
    title: 'SEO 推送配置 - 企业官网 管理后台',
};

export default async function SEOConfigsPage() {
    // 权限校验
    if (!await hasPermission('seo')) {
        redirect('/admin/dashboard?error=unauthorized_seo');
    }

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
            {/* 页面头部 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-100/50">
                        <Search className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">搜索引擎推送配置</h1>
                    </div>
                </div>

                <Link
                    href="/admin/seo/push"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg shadow-blue-100 hover:shadow-blue-200 active:scale-95 flex items-center justify-center gap-2.5"
                >
                    <Send className="w-5 h-5" />
                    <span>批量推送</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <SEOConfigList configs={configs} />
                </div>

                {/* 平台说明卡片 */}
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm shadow-gray-100/50 overflow-hidden h-fit">
                    <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/20">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                            <h2 className="text-lg font-black text-gray-900 tracking-tight">平台说明</h2>
                        </div>
                    </div>
                    <div className="p-8 space-y-5">
                        <div className="flex items-start gap-4 group">
                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 group-hover:bg-red-600 transition-all">
                                <span className="text-red-600 font-black text-sm group-hover:text-white transition-colors">百</span>
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">百度搜索</p>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">中国最大搜索引擎，支持 API 推送和 JS 自动收录两种方式。</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 group">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-600 transition-all">
                                <span className="text-orange-600 font-black text-sm group-hover:text-white transition-colors">头</span>
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">头条搜索</p>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">字节跳动旗下搜索引擎，推荐使用 JS 自动收录脚本。</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 group">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600 transition-all">
                                <span className="text-purple-600 font-black text-[10px] group-hover:text-white transition-colors">IN</span>
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">IndexNow</p>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">开放协议，一次提交同时通知 Bing、Yandex 等搜索引擎。</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 group">
                            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0 group-hover:bg-green-600 transition-all">
                                <span className="text-green-600 font-black text-[10px] group-hover:text-white transition-colors">G</span>
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">Google Indexing</p>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">仅适用于招聘和直播活动类结构化数据页面。</p>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl">
                                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-sm">💡</span>
                                </div>
                                <p className="text-xs text-blue-700 font-medium leading-relaxed">
                                    配置保存后，发布文章时会自动推送到已启用的平台。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
