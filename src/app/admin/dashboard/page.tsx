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
    Eye,
    Sparkles,
    Zap
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
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* 顶部欢迎区域 */}
            <div className="relative overflow-hidden bg-[#0F172A] p-8 rounded-[32px] shadow-2xl shadow-gray-200/50 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700 group">
                {/* 背景装饰 */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-purple-600/20 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-600/10 to-transparent blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-500">
                        <LayoutDashboard className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3 mb-2">
                            {greeting}，管理员
                            <div className="relative">
                                <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                                <div className="absolute inset-0 bg-yellow-400/50 blur-sm animate-pulse" />
                            </div>
                        </h1>
                        <p className="text-sm text-slate-400 font-medium">
                            欢迎来到您的数字指挥中心，今天又是充满活力的一天
                        </p>
                    </div>
                </div>
                <div className="relative z-10 flex items-center gap-4 text-sm font-bold text-slate-300 bg-white/5 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span>{now.toLocaleDateString('zh-CN')}</span>
                    <span className="w-px h-3 bg-white/10" />
                    <span>{now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>

            {/* 统计卡片区域 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 fill-mode-backwards">
                {/* 文章统计 - Blue */}
                <div className="relative overflow-hidden bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm shadow-gray-100/50 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 group">
                    <div className="relative z-10 flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                            <FileText className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-blue-600 transition-colors">总文章数</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-gray-900 tracking-tight">{stats.articleCount}</span>
                                <span className="text-xs font-bold text-gray-400">篇</span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -bottom-6 -right-6 text-blue-50 transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500">
                        <FileText className="w-32 h-32 opacity-50" />
                    </div>
                </div>

                {/* 产品 - Purple */}
                <div className="relative overflow-hidden bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm shadow-gray-100/50 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300 group">
                    <div className="relative z-10 flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                            <ShoppingBag className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-purple-600 transition-colors">总产品数</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-gray-900 tracking-tight">{stats.productCount}</span>
                                <span className="text-xs font-bold text-gray-400">款</span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -bottom-6 -right-6 text-purple-50 transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500">
                        <ShoppingBag className="w-32 h-32 opacity-50" />
                    </div>
                </div>

                {/* 页面 - Green */}
                <div className="relative overflow-hidden bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm shadow-gray-100/50 hover:shadow-xl hover:shadow-green-500/10 hover:-translate-y-1 transition-all duration-300 group">
                    <div className="relative z-10 flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                            <Files className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-green-600 transition-colors">页面总数</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-gray-900 tracking-tight">{stats.pageCount}</span>
                                <span className="text-xs font-bold text-gray-400">个</span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -bottom-6 -right-6 text-green-50 transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500">
                        <Files className="w-32 h-32 opacity-50" />
                    </div>
                </div>

                {/* 文件 - Orange */}
                <div className="relative overflow-hidden bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm shadow-gray-100/50 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-300 group">
                    <div className="relative z-10 flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                            <ImageIcon className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-orange-600 transition-colors">资源文件</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-gray-900 tracking-tight">{stats.fileCount}</span>
                                <span className="text-xs font-bold text-gray-400">个</span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -bottom-6 -right-6 text-orange-50 transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500">
                        <ImageIcon className="w-32 h-32 opacity-50" />
                    </div>
                </div>
            </div>

            {/* 快捷入口 */}
            <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm shadow-gray-100/50 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-backwards">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full" />
                    <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        快捷操作
                    </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        href="/admin/articles/create"
                        className="relative overflow-hidden group p-5 bg-gray-50/50 rounded-2xl border border-gray-200 hover:bg-white hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
                    >
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-black text-gray-900 group-hover:text-blue-700 transition-colors truncate">发布文章</h4>
                                <p className="text-[10px] text-gray-400 font-medium mt-0.5 group-hover:text-blue-400 transition-colors truncate">撰写并发布新博文</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                        </div>
                    </Link>

                    <Link
                        href="/admin/products/create"
                        className="relative overflow-hidden group p-5 bg-gray-50/50 rounded-2xl border border-gray-200 hover:bg-white hover:border-purple-200 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                    >
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-purple-600 shadow-sm group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all duration-300">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-black text-gray-900 group-hover:text-purple-700 transition-colors truncate">发布产品</h4>
                                <p className="text-[10px] text-gray-400 font-medium mt-0.5 group-hover:text-purple-400 transition-colors truncate">上架新的商品信息</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                        </div>
                    </Link>

                    <Link
                        href="/admin/files"
                        className="relative overflow-hidden group p-5 bg-gray-50/50 rounded-2xl border border-gray-200 hover:bg-white hover:border-green-200 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300"
                    >
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-green-600 shadow-sm group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600 transition-all duration-300">
                                <ImageIcon className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-black text-gray-900 group-hover:text-green-700 transition-colors truncate">管理资源</h4>
                                <p className="text-[10px] text-gray-400 font-medium mt-0.5 group-hover:text-green-400 transition-colors truncate">查看图库与媒体</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
                        </div>
                    </Link>

                    <Link
                        href="/admin/settings/site"
                        className="relative overflow-hidden group p-5 bg-gray-50/50 rounded-2xl border border-gray-200 hover:bg-white hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300"
                    >
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-orange-600 shadow-sm group-hover:bg-orange-600 group-hover:text-white group-hover:border-orange-600 transition-all duration-300">
                                <Settings className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-black text-gray-900 group-hover:text-orange-700 transition-colors truncate">系统设置</h4>
                                <p className="text-[10px] text-gray-400 font-medium mt-0.5 group-hover:text-orange-400 transition-colors truncate">配置站点参数</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                        </div>
                    </Link>
                </div>
            </div>

            {/* 最近动态 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300 fill-mode-backwards">
                {/* 最新文章 */}
                <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm shadow-gray-100/50 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                            <h3 className="text-lg font-black text-gray-900 tracking-tight">最新文章</h3>
                        </div>
                        <Link href="/admin/articles" className="text-sm text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition-colors">
                            查看全部 <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    {recent.articles.length > 0 ? (
                        <div className="space-y-3 flex-1">
                            {recent.articles.map((article: any) => (
                                <Link key={article.id} href={`/admin/articles/${article.id}`} className="flex items-start gap-4 group hover:bg-gray-50 p-3 -mx-3 rounded-2xl transition-colors">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                                        {article.coverImage ? (
                                            <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-200 transition-colors">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{article.title}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-400 font-medium">{formatDate(article.createdAt)}</span>
                                            {article.author?.name && (
                                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-lg font-medium">{article.author.name}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                                        <ArrowRight className="w-4 h-4 text-gray-400" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-12">
                            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
                                <FileText className="w-8 h-8 opacity-30" />
                            </div>
                            <p className="text-sm font-medium">暂无文章发布</p>
                        </div>
                    )}
                </div>

                {/* 最新产品 - Hidden by user request */}
                {/* <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm shadow-gray-100/50 flex flex-col">
                   ... (hidden content) ...
                </div> */}
            </div>
        </div>
    );
}
