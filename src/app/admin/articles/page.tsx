import { db } from '@/lib/db';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Eye, FileText, Sparkles } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import DeleteArticleButton from './_components/DeleteArticleButton';
import ArticleListTable from './_components/ArticleListTable';
import AdminFilters from '../_components/AdminFilters';

export default async function ArticlesPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; q?: string; status?: string; categoryId?: string; lang?: string }>;
}) {
    const { page: pageParam, q, status: statusParam, categoryId, lang } = await searchParams;
    const page = Number(pageParam) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const query = q || '';
    const status = statusParam;

    const where = {
        AND: [
            query ? { title: { contains: query } } : {},
            status ? { status: status as any } : {},
            categoryId ? { categoryId } : {},
            lang ? { lang } : {},
        ],
    };

    const categories = await db.category.findMany({ select: { id: true, name: true } });

    const i18nSettingsStr = await db.systemSetting.findUnique({ where: { key: 'i18n_settings' } });
    let supportedLocales = ['zh', 'en'];
    if (i18nSettingsStr?.value) {
        try {
            const config = JSON.parse(i18nSettingsStr.value);
            if (Array.isArray(config.supportedLocales)) {
                supportedLocales = config.supportedLocales;
            }
        } catch { }
    }

    const [articles, total] = await Promise.all([
        db.article.findMany({
            where,
            include: {
                author: { select: { name: true } },
                category: { select: { name: true } },
            },
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
            skip,
            take: limit,
        }),
        db.article.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PUBLISHED':
                return <Badge variant="success">已发布</Badge>;
            case 'DRAFT':
                return <Badge variant="warning">草稿</Badge>;
            case 'ARCHIVED':
                return <Badge variant="secondary">已归档</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                        <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                            <FileText className="w-8 h-8 text-blue-600" />
                        </div>
                        文章管理
                    </h1>
                </div>
                <div className="flex flex-col items-end gap-4">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/articles/copilot" className="inline-flex items-center justify-center rounded-2xl bg-white border border-slate-200/60 px-6 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all active:scale-95 group">
                            <Sparkles className="w-4 h-4 mr-2 text-purple-600 group-hover:animate-pulse" />
                            AI 智能创作
                        </Link>
                        <Link href="/admin/articles/create" className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white shadow-xl shadow-blue-100 hover:bg-black transition-all active:scale-95">
                            <Plus className="w-4 h-4 mr-2" />
                            新建文章
                        </Link>
                    </div>
                </div>
            </div>

            {/* Filter Section - Studio Glassmorphism */}
            <div className="bg-white/70 backdrop-blur-sm rounded-[32px] border border-slate-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
                <AdminFilters>
                    <div className="flex flex-col gap-1.5 flex-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">搜索</span>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                name="q"
                                placeholder="搜索文章标题或关键词..."
                                defaultValue={query}
                                className="w-full pl-11 pr-4 py-3.5 text-sm font-bold border border-gray-300 rounded-2xl outline-none transition-all bg-white/50 focus:bg-white focus:border-blue-600 placeholder:text-slate-300 text-slate-900"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-end gap-4">
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">状态</span>
                            <select
                                defaultValue={status || ''}
                                name="status"
                                className="min-w-[140px] px-4 py-3.5 text-sm font-bold border border-slate-200/60 rounded-2xl outline-none bg-white/50 hover:bg-white focus:border-blue-600 transition-all cursor-pointer appearance-none text-slate-700"
                            >
                                <option value="">所有状态</option>
                                <option value="PUBLISHED">已发布</option>
                                <option value="DRAFT">草稿</option>
                                <option value="ARCHIVED">已归档</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">分类</span>
                            <select
                                defaultValue={categoryId || ''}
                                name="categoryId"
                                className="min-w-[140px] px-4 py-3.5 text-sm font-bold border border-slate-200/60 rounded-2xl outline-none bg-white/50 hover:bg-white focus:border-blue-600 transition-all cursor-pointer appearance-none text-slate-700"
                            >
                                <option value="">所有分类</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">语言</span>
                            <select
                                defaultValue={lang || ''}
                                name="lang"
                                className="min-w-[120px] px-4 py-3.5 text-sm font-bold border border-slate-200/60 rounded-2xl outline-none bg-white/50 hover:bg-white focus:border-blue-600 transition-all cursor-pointer appearance-none text-slate-700"
                            >
                                <option value="">所有语言</option>
                                {supportedLocales.map(locale => (
                                    <option key={locale} value={locale}>
                                        {locale === 'zh' ? '简体中文' :
                                            locale === 'en' ? 'English' :
                                                locale === 'ja' ? '日语' :
                                                    locale === 'ko' ? '韩语' :
                                                        locale === 'fr' ? '法语' :
                                                            locale === 'de' ? '德语' :
                                                                locale === 'es' ? '西班牙语' :
                                                                    locale === 'ru' ? '俄语' :
                                                                        locale === 'pt' ? '葡萄牙语' :
                                                                            locale === 'ar' ? '阿拉伯语' : locale}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </AdminFilters>

                <div className="mt-8">
                    <ArticleListTable
                        articles={articles}
                        total={total}
                        page={page}
                        limit={limit}
                    />
                </div>
            </div>
        </div>
    );
}
