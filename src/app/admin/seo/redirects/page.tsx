import { getRedirects } from './actions';
import { RedirectList } from './_components/RedirectList';

export const metadata = {
    title: '死链哨兵与重定向管理 | GeoCMS重定向',
};

export default async function RedirectsPage() {
    const redirects = await getRedirects();

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex bg-white items-center justify-between p-6 rounded-xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">301 重定向与死链哨兵</h1>
                    <p className="text-sm text-gray-500 mt-1">全局管理失效文章和变更 slug 后的 SEO 流量无损承接转移。</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <RedirectList initialData={redirects} />
            </div>
        </div>
    );
}
