import { ArrowLeft, ArrowRight, Calendar, User, Tag, MapPin, Building2, Package, Lightbulb, Clock } from 'lucide-react';
import Link from 'next/link';
import AuthorCard from '@/components/articles/AuthorCard';
import { RichTextContent } from '@/components/security/SafeHTML';
import { getLocalePath, t } from '@/lib/i18n';
import TableOfContentsClient from './TableOfContentsClient';
import { db } from '@/lib/db';

export default async function ArticleLayoutBlog({
    article,
    locale,
    showAuthorCard,
    showCitations,
    showEntities,
    processedContent,
    prevArticle,
    nextArticle
}: any) {
    // 精准预估阅读时长 (按每分钟500中文字符计算，剥离HTML标签和所有空格/换行)
    const cleanWordCount = (processedContent || '').replace(/<[^>]*>?/gm, '').replace(/\s+/g, '').length;
    const readTime = Math.max(1, Math.ceil(cleanWordCount / 500));
    
    // 获取所有分类，用于右侧侧边栏展示
    const categories = await db.category.findMany({
        where: { lang: locale },
        orderBy: { sortOrder: 'asc' },
        include: {
            _count: {
                select: { articles: { where: { status: 'PUBLISHED' } } }
            }
        }
    });

    return (
        <article className="min-h-screen bg-gray-50/30 pb-20 pt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Grid 布局核心：左边大宽屏 (阅读区) + 右边侧边栏 */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* 左侧主要阅读区 (占比 9) */}
                    <main className="lg:col-span-9 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-12">
                        {/* 博客标题头 */}
                        <header className="mb-10 border-b border-gray-100 pb-10">
                            <h1 id="article-title" className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-8">
                                {article.title}
                            </h1>
                            
                            <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm font-medium">
                                <div className="flex items-center gap-2">
                                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden ring-2 ring-white">
                                        {article.author?.avatar ? (
                                            <img src={article.author.avatar} alt={article.author.name || ''} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-4 h-4" />
                                        )}
                                    </div>
                                    <span className="text-gray-900">{(article.author?.name === '管理员' || article.author?.name === 'Admin') ? t(locale, 'common.admin') : article.author?.name}</span>
                                </div>
                                
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <time dateTime={article.createdAt.toISOString()} suppressHydrationWarning>
                                        {new Date(article.createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'zh-CN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </time>
                                </div>

                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>

                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span>{locale === 'en' ? `${readTime} min read` : `阅读时间约 ${readTime} 分钟`}</span>
                                </div>
                            </div>
                        </header>

                        {/* 博客特色封面图 */}
                        {article.coverImage && (
                            <figure className="mb-12">
                                <div className="rounded-2xl overflow-hidden shadow-lg aspect-[21/9] bg-gray-100 group">
                                    <img
                                        src={article.coverImage}
                                        alt={article.title}
                                        fetchPriority="high"
                                        decoding="async"
                                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                    />
                                </div>
                            </figure>
                        )}

                        {/* 博客摘要 Blockquote化 */}
                        {article.summary && (
                            <div id="article-summary" className="mb-10 text-xl leading-relaxed text-gray-600 font-serif italic border-l-4 border-indigo-500 pl-6 py-2 bg-gradient-to-r from-indigo-50/50 to-transparent">
                                {article.summary}
                            </div>
                        )}

                        {/* 正文区域 - 移除 max-w-prose 限制以充分利用更宽的9列网格 */}
                        <RichTextContent
                            content={processedContent}
                            className="prose prose-lg max-w-none mx-auto GEO-blog-content
                                prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900
                                prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-3
                                prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                                prose-p:text-gray-600 prose-p:leading-8 prose-p:mb-6
                                prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:text-indigo-700 prose-a:border-b prose-a:border-indigo-200 hover:prose-a:border-indigo-600
                                prose-strong:text-gray-900 
                                prose-code:text-pink-600 prose-code:bg-gray-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-[0.9em] before:prose-code:content-[''] after:prose-code:content-['']
                                prose-pre:bg-[#1f2937] prose-pre:rounded-xl prose-pre:shadow-xl prose-pre:my-8
                                prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-gray-50 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:italic text-gray-700 prose-blockquote:rounded-r-xl
                                prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-10
                                prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6 prose-li:my-2
                                prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-6"
                        />

                        {/* 文末脚印区 */}
                        <footer className="mt-16 pt-10 border-t border-gray-100 space-y-8">
                            
                            {/* Tags 云 */}
                            {article.tags?.length > 0 && (
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="font-bold text-gray-400 text-sm mr-2 flex items-center gap-1.5">
                                        <Tag className="w-4 h-4" /> 相关标签
                                    </span>
                                    {article.tags.map((tag: any) => (
                                        <Link
                                            key={tag.id}
                                            href={`/tag/${tag.name}`}
                                            className="px-3.5 py-1 bg-gray-50 text-gray-600 border border-gray-200 rounded-md text-sm font-medium hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                                        >
                                            #{tag.name}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* 参考资料与实体融合 */}
                            {(showCitations || showEntities) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {showCitations && article.citations && Array.isArray(article.citations) && article.citations.length > 0 && (
                                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                            <h4 className="font-bold text-gray-900 text-sm mb-3">参考引用文献</h4>
                                            <ul className="space-y-2 text-xs text-gray-500">
                                                {article.citations.map((c: any, i: number) => (
                                                    <li key={i} className="flex gap-2">
                                                        <span className="text-gray-400">[{i+1}]</span>
                                                        <div>
                                                            <span className="font-semibold text-gray-700">{c.title}</span>
                                                            {c.url && <a href={c.url} target="_blank" rel="noopener noreferrer" className="ml-1 text-indigo-500 hover:underline">↗</a>}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {showEntities && article.entities && Array.isArray(article.entities) && article.entities.length > 0 && (
                                        <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-5 border border-indigo-100">
                                            <h4 className="font-bold text-indigo-900 text-sm mb-3">核心探索实体</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {article.entities.map((e: any, i: number) => (
                                                    <span key={i} className="px-2 py-1 bg-white border border-indigo-100 text-indigo-600 text-xs rounded shadow-sm">
                                                        {e.text}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </footer>

                        {/* GEO/SEO: 内部链接网构建 (上下文导航) */}
                        <nav className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6">
                            {prevArticle ? (
                                <Link 
                                    href={getLocalePath(`/articles/${prevArticle.slug}`, locale as any)}
                                    className="group flex-1 flex flex-col items-start w-full sm:w-auto hover:bg-gray-50 p-4 rounded-2xl transition-colors border border-transparent hover:border-gray-100"
                                >
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                                        {t(locale, 'article.previous')}
                                    </span>
                                    <span className="text-gray-900 font-medium line-clamp-2 leading-relaxed group-hover:text-indigo-600 transition-colors">
                                        {prevArticle.title}
                                    </span>
                                </Link>
                            ) : <div className="flex-1 hidden sm:block"></div>}
                            
                            {nextArticle ? (
                                <Link 
                                    href={getLocalePath(`/articles/${nextArticle.slug}`, locale as any)}
                                    className="group flex-1 flex flex-col items-end text-right w-full sm:w-auto hover:bg-gray-50 p-4 rounded-2xl transition-colors border border-transparent hover:border-gray-100"
                                >
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                        {t(locale, 'article.next')}
                                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                    <span className="text-gray-900 font-medium line-clamp-2 leading-relaxed group-hover:text-indigo-600 transition-colors">
                                        {nextArticle.title}
                                    </span>
                                </Link>
                            ) : <div className="flex-1 hidden sm:block"></div>}
                        </nav>
                    </main>

                    {/* 右侧边栏区 (占比 3, 具有粘性滑动) */}
                    <aside className="lg:col-span-3 space-y-8">
                        
                        {/* 粘性包裹组 */}
                        <div className="sticky top-24 space-y-8">
                            {/* 1. 作者增强名片 */}
                            {showAuthorCard && article.author && (
                                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 ring-2 ring-indigo-50">
                                            {article.author.avatar ? (
                                                <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover"/>
                                            ) : (
                                                <User className="w-6 h-6 m-auto text-gray-400 mt-4" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">{article.author.name}</h3>
                                            {article.author.expertise && <p className="text-xs text-indigo-600 font-medium">{article.author.expertise}</p>}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                                        {article.author.bio || "探索无尽的知识世界，分享见解。"}
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                                       <Link 
                                            href={getLocalePath('/articles', locale as any)} 
                                            className="flex-1 py-2 text-center bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors"
                                       >
                                            阅读更多作品
                                       </Link>
                                    </div>
                                </div>
                            )}

                            {/* 2. TOC 目录导航组件 */}
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hidden lg:block">
                                <TableOfContentsClient />
                            </div>

                            {/* 3. 全部分类模块 */}
                            {categories && categories.length > 0 && (
                                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hidden lg:block">
                                    <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                                        <Package className="w-5 h-5 text-indigo-500" /> 
                                        {locale === 'en' ? 'Categories' : '全部分类'}
                                    </h3>
                                    <ul className="space-y-1">
                                        {categories.map((cat: any) => (
                                            <li key={cat.id}>
                                                <Link 
                                                    href={getLocalePath(`/category/${cat.slug}`, locale as any)} 
                                                    className="flex items-center justify-between group px-3 py-2.5 hover:bg-indigo-50/50 rounded-xl transition-all duration-300"
                                                >
                                                    <span className="text-gray-600 font-medium group-hover:text-indigo-600 transition-colors">{cat.name}</span>
                                                    <span className="text-[11px] font-bold text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full group-hover:bg-indigo-100 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-colors">
                                                        {cat._count.articles}
                                                    </span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                    </aside>
                </div>
            </div>
        </article>
    );
}
