import { ArrowLeft, ArrowRight, Calendar, User, Tag, MapPin, Building2, Package, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import AuthorCard from '@/components/articles/AuthorCard';
import { RichTextContent } from '@/components/security/SafeHTML';
import { getLocalePath, t } from '@/lib/i18n';

export default function ArticleLayoutTraditional({
    article,
    locale,
    showAuthorCard,
    showCitations,
    showEntities,
    processedContent,
    prevArticle,
    nextArticle
}: any) {
    return (
        <article className="min-h-screen bg-white pb-20">
            {/* 顶部 Hero 区域 */}
            <header className="relative w-full bg-gray-50 py-16 md:py-24 border-b border-gray-100 overflow-hidden">
                {/* 背景装饰 */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
                </div>

                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    {article.category && (
                        <Link
                            href={getLocalePath(`/category/${article.category.slug}`, locale as any)}
                            className="inline-flex items-center px-4 py-1.5 bg-blue-600 text-white text-sm font-bold rounded-full mb-8 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                        >
                            {article.category.name}
                        </Link>
                    )}
                    <h1 id="article-title" className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-8 tracking-tight">
                        {article.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm md:text-base font-medium">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden ring-2 ring-white ">
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
                            <Calendar className="w-4 h-4" />
                            <time dateTime={article.createdAt.toISOString()} suppressHydrationWarning>
                                {new Date(article.createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'zh-CN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </time>
                        </div>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <div>
                            {article.views} {t(locale, 'article.views')}
                        </div>
                        {article.aiGenerated && (
                            <>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600 rounded border border-purple-200 text-xs font-semibold">
                                    ✨ {locale === 'en' ? 'AI Assisted' : 'AI 辅助创作'}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <div className={`max-w-4xl mx-auto px-4 relative z-10 ${article.coverImage ? '-mt-8 sm:-mt-12' : 'mt-12'}`}>
                {/* 封面图 - 悬浮效果 */}
                {article.coverImage && (
                    <div className="rounded-2xl overflow-hidden shadow-2xl mb-12 ring-1 ring-black/5 aspect-video bg-gray-100 group">
                        <img
                            src={article.coverImage}
                            alt={article.title}
                            fetchPriority="high"
                            decoding="async"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>
                )}

                {/* 摘要 */}
                {article.summary && (
                    <div id="article-summary" className="mb-10 p-8 bg-blue-50/50 border-l-4 border-blue-500 rounded-r-xl">
                        <p className="text-xl leading-relaxed text-gray-700 font-serif italic">
                            {article.summary}
                        </p>
                    </div>
                )}

                {/* 文章内容 */}
                <RichTextContent
                    content={processedContent}
                    className="prose prose-lg md:prose-xl max-w-none GEO-traditional-content
                        prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900
                        prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                        prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                        prose-p:text-gray-600 prose-p:leading-8 prose-p:mb-6
                        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-700 prose-a:transition-colors prose-a:border-b prose-a:border-blue-200 hover:prose-a:border-blue-600
                        prose-strong:text-gray-900 prose-strong:font-bold
                        prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-[0.9em] before:prose-code:content-[''] after:prose-code:content-['']
                        prose-pre:bg-gray-900 prose-pre:rounded-xl prose-pre:shadow-lg prose-pre:p-6
                        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:bg-gray-50/50 prose-blockquote:rounded-r-lg
                        prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                        prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6 prose-li:my-2 prose-li:pl-2
                        prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-6"
                />

                {/* 底部信息区 */}
                <footer className="mt-16 space-y-12 border-t border-gray-100 pt-12">
                    {/* 标签 */}
                    {article.tags?.length > 0 && (
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                <Tag className="w-4 h-4" /> {t(locale, 'article.tags')}
                            </span>
                            {article.tags.map((tag: any) => (
                                <Link
                                    key={tag.id}
                                    href={`/tag/${tag.name}`}
                                    className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                                >
                                    #{tag.name}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* 参考资料 */}
                    {showCitations && article.citations && Array.isArray(article.citations) && article.citations.length > 0 && (
                        <section className="rounded-xl bg-gray-50 p-6 border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                {t(locale, 'article.citations')}
                                <span className="text-xs font-normal text-gray-400 ml-1">({locale === 'en' ? 'This article may refer to the following materials' : '本文可能会参考以下资料'})</span>
                            </h3>
                            <ol className="list-decimal list-outside ml-5 space-y-3 text-sm text-gray-600">
                                {article.citations.map((citation: any, index: number) => (
                                    <li key={index} id={`citation-${index + 1}`} className="pl-2">
                                        <span className="font-medium text-gray-900">
                                            {citation.title}
                                        </span>
                                        {citation.author && <span className="text-gray-500"> - {citation.author}</span>}
                                        {citation.publishDate && <span className="text-gray-400"> ({citation.publishDate})</span>}
                                        {citation.url && (
                                            <a
                                                href={citation.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="ml-2 text-blue-600 hover:underline inline-flex items-center"
                                            >
                                                [{locale === 'en' ? 'View Source' : '查看来源'}]
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ol>
                        </section>
                    )}

                    {/* 实体识别 */}
                    {showEntities && article.entities && Array.isArray(article.entities) && article.entities.length > 0 && (
                        <section className="rounded-xl bg-purple-50 p-6 border border-purple-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                                {t(locale, 'article.entities')}
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {article.entities.map((entity: any, index: number) => {
                                    let Icon = Tag;
                                    if (entity.type === 'Person') Icon = User;
                                    if (entity.type === 'Place') Icon = MapPin;
                                    if (entity.type === 'Organization') Icon = Building2;
                                    if (entity.type === 'Product') Icon = Package;
                                    if (entity.type === 'Concept') Icon = Lightbulb;

                                    return (
                                        <div key={index} className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-purple-100 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-default" title={entity.description || entity.type}>
                                            <Icon className="w-4 h-4 text-purple-500" />
                                            <span>{entity.text}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>
                    )}

                    {/* 作者卡片 */}
                    {showAuthorCard && <AuthorCard author={article.author} />}
                    
                    {/* GEO/SEO: 内部链接网构建 (上下文导航) */}
                    <nav className="pt-8 mt-12 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6">
                        {prevArticle ? (
                            <Link 
                                href={getLocalePath(`/articles/${prevArticle.slug}`, locale as any)}
                                className="group flex-1 flex flex-col items-start w-full sm:w-auto hover:bg-gray-50 p-4 rounded-xl transition-colors border border-transparent hover:border-gray-100"
                            >
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                                    {t(locale, 'article.previous')}
                                </span>
                                <span className="text-gray-900 font-medium line-clamp-2 leading-relaxed group-hover:text-blue-600 transition-colors">
                                    {prevArticle.title}
                                </span>
                            </Link>
                        ) : <div className="flex-1 hidden sm:block"></div>}
                        
                        {nextArticle ? (
                            <Link 
                                href={getLocalePath(`/articles/${nextArticle.slug}`, locale as any)}
                                className="group flex-1 flex flex-col items-end text-right w-full sm:w-auto hover:bg-gray-50 p-4 rounded-xl transition-colors border border-transparent hover:border-gray-100"
                            >
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                    {t(locale, 'article.next')}
                                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <span className="text-gray-900 font-medium line-clamp-2 leading-relaxed group-hover:text-blue-600 transition-colors">
                                    {nextArticle.title}
                                </span>
                            </Link>
                        ) : <div className="flex-1 hidden sm:block"></div>}
                    </nav>
                </footer>
            </div>
        </article>
    );
}
