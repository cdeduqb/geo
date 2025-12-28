import { db } from '@/lib/db';
import {
    FileText,
    Files,
    Users,
    TrendingUp,
    Activity,
    MousePointerClick,
    LayoutGrid,
    Settings,
    LayoutDashboard,
    ShoppingBag,
    Image as ImageIcon,
    Clock,
    ArrowRight,
    Eye
} from 'lucide-react';
import Link from 'next/link';

async function getDashboardData() {
    try {
        const [
            articleCount,
            pageCount,
            productCount,
            fileCount,
            recentArticles,
            recentProducts,
            recentFiles
        ] = await Promise.all([
            db.article.count(),
            db.page.count(),
            db.product.count(),
            db.file.count(),
            db.article.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { author: { select: { name: true } } }
            }),
            db.product.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: { id: true, name: true, price: true, createdAt: true, coverImage: true }
            }),
            db.file.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { uploadedBy: { select: { name: true } } }
            })
        ]);

        return {
            stats: {
                articleCount,
                pageCount,
                productCount,
                fileCount
            },
            recent: {
                articles: recentArticles,
                products: recentProducts,
                files: recentFiles
            }
        };
    } catch (error) {
        console.warn('Database unavailable for dashboard stats, using defaults');
        return {
            stats: { articleCount: 0, pageCount: 0, productCount: 0, fileCount: 0 },
            recent: { articles: [], products: [], files: [] }
        };
    }
}

function formatDate(date: Date) {
    return new Date(date).toLocaleDateString('zh-CN', {
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });
}

function formatPrice(price: number) {
    return new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: 'CNY'
    }).format(price);
}

export default async function DashboardPage() {
    const { stats, recent } = await getDashboardData();
    const now = new Date();
    const hours = now.getHours();
    let greeting = '你好';
    if (hours < 12) greeting = '早上好';
    else if (hours < 18) greeting = '下午好';
    else greeting = '晚上好';

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        {greeting}，管理员
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        欢迎回到 GeoCMS 控制台，这里是您的系统概览。
                    </p>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                    <Clock className="w-4 h-4" />
                    <span>{now.toLocaleDateString('zh-CN')} {now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>

            {/* 统计卡片区域 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* 文章统计 */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">总文章数</h3>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
                            <FileText className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900">{stats.articleCount}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">已发布的内容总数</p>
                </div>

                {/* 产品统计 */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">总产品数</h3>
                        </div>
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600 group-hover:bg-purple-100 transition-colors">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900">{stats.productCount}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">在线展示的产品</p>
                </div>

                {/* 页面统计 */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">页面总数</h3>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg text-green-600 group-hover:bg-green-100 transition-colors">
                            <Files className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900">{stats.pageCount}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">包含所有自定义页面</p>
                </div>

                {/* 文件/资源统计 */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">资源文件</h3>
                        </div>
                        <div className="p-2 bg-orange-50 rounded-lg text-orange-600 group-hover:bg-orange-100 transition-colors">
                            <ImageIcon className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900">{stats.fileCount}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">图片与媒体资源</p>
                </div>
            </div>

            {/* 快捷入口 */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                        <LayoutGrid className="w-5 h-5 text-gray-400" />
                        快捷操作
                    </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link
                        href="/admin/articles/create"
                        className="flex flex-col items-center justify-center p-6 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm transition-all text-center group"
                    >
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-700 font-medium group-hover:text-blue-700">发布文章</span>
                    </Link>

                    <Link
                        href="/admin/products/create"
                        className="flex flex-col items-center justify-center p-6 border border-gray-100 rounded-xl hover:border-purple-200 hover:bg-purple-50/50 hover:shadow-sm transition-all text-center group"
                    >
                        <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-3 group-hover:bg-purple-100 transition-colors">
                            <ShoppingBag className="w-6 h-6 text-purple-600" />
                        </div>
                        <span className="text-sm text-gray-700 font-medium group-hover:text-purple-700">发布产品</span>
                    </Link>

                    <Link
                        href="/admin/files"
                        className="flex flex-col items-center justify-center p-6 border border-gray-100 rounded-xl hover:border-green-200 hover:bg-green-50/50 hover:shadow-sm transition-all text-center group"
                    >
                        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-3 group-hover:bg-green-100 transition-colors">
                            <ImageIcon className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="text-sm text-gray-700 font-medium group-hover:text-green-700">管理资源</span>
                    </Link>

                    <Link
                        href="/admin/settings/general"
                        className="flex flex-col items-center justify-center p-6 border border-gray-100 rounded-xl hover:border-orange-200 hover:bg-orange-50/50 hover:shadow-sm transition-all text-center group"
                    >
                        <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-3 group-hover:bg-orange-100 transition-colors">
                            <Settings className="w-6 h-6 text-orange-600" />
                        </div>
                        <span className="text-sm text-gray-700 font-medium group-hover:text-orange-700">系统设置</span>
                    </Link>
                </div>
            </div>

            {/* 最近动态 - 真实数据 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 最新文章 */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-gray-400" />
                            最新文章
                        </h3>
                        <Link href="/admin/articles" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                            查看全部 <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    {recent.articles.length > 0 ? (
                        <div className="space-y-4 flex-1">
                            {recent.articles.map(article => (
                                <Link key={article.id} href={`/admin/articles/${article.id}`} className="flex items-start gap-3 group hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-400">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">{article.title}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-500">{formatDate(article.createdAt)}</span>
                                            {article.author?.name && (
                                                <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{article.author.name}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-1 rounded-full bg-white border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-sm">
                                        <ArrowRight className="w-3 h-3 text-gray-400" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-8">
                            <FileText className="w-12 h-12 mb-2 opacity-20" />
                            <p className="text-sm">暂无文章发布</p>
                        </div>
                    )}
                </div>

                {/* 最新产品 */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-gray-400" />
                            最新产品
                        </h3>
                        <Link href="/admin/products" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                            查看全部 <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    {recent.products.length > 0 ? (
                        <div className="space-y-4 flex-1">
                            {recent.products.map(product => (
                                <Link key={product.id} href={`/admin/products/${product.id}`} className="flex items-start gap-3 group hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                                        {product.coverImage ? (
                                            <img src={product.coverImage} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                                                <ShoppingBag className="w-5 h-5" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">{product.name}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-orange-600 font-medium bg-orange-50 px-1.5 py-0.5 rounded">{formatPrice(Number(product.price))}</span>
                                            <span className="text-xs text-gray-500">{formatDate(product.createdAt)}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-8">
                            <ShoppingBag className="w-12 h-12 mb-2 opacity-20" />
                            <p className="text-sm">暂无产品发布</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
