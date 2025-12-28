'use client';

import { Category, Article } from '@prisma/client';
import { Save, Loader2, Sparkles } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { useState, useEffect } from 'react';
import RichTextEditor from '@/components/ui/RichTextEditor';
import InternalLinkSuggester from '@/components/editor/InternalLinkSuggester';
import ContentAuditor from '@/components/editor/ContentAuditor';
import CitationManager, { Citation } from '@/components/editor/CitationManager';
import EntityManager, { Entity } from '@/components/editor/EntityManager';

import ImageUpload from '@/components/ui/ImageUpload';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import StrategySelector from '@/components/ui/StrategySelector';

interface ArticleFormProps {
    categories: Category[];
    article?: any;
    action: (formData: FormData) => any;
    enableMultiLanguage?: boolean;
    translationGroups?: { id: string; label: string; lang: string }[];
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
            {pending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {pending ? '保存中...' : '保存文章'}
        </button>
    );
}

export default function ArticleForm({ categories, article, action, enableMultiLanguage = false, translationGroups = [] }: ArticleFormProps) {
    const [content, setContent] = useState(article?.content || '');
    const [title, setTitle] = useState(article?.title || '');
    const [summary, setSummary] = useState(article?.summary || '');
    const [coverImage, setCoverImage] = useState(article?.coverImage || '');
    const [showCoverStrategy, setShowCoverStrategy] = useState(false);
    const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);
    const [isGeneratingCover, setIsGeneratingCover] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [isIllustrating, setIsIllustrating] = useState(false);
    const [isAutoLinking, setIsAutoLinking] = useState(false);
    const [lang, setLang] = useState(article?.lang || 'zh');
    const [selectedGroupId, setSelectedGroupId] = useState(article?.translationGroupId || '');

    const handleGroupIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val === '__new__') {
            setSelectedGroupId(`group_${Date.now()}`);
        } else {
            setSelectedGroupId(val);
        }
    };
    const [citations, setCitations] = useState<Citation[]>(
        article?.citations ? (typeof article.citations === 'string' ? JSON.parse(article.citations) : article.citations) : []
    );
    const [entities, setEntities] = useState<Entity[]>(
        article?.entities ? (typeof article.entities === 'string' ? JSON.parse(article.entities) : article.entities) : []
    );

    // 监听 article prop 变化
    useEffect(() => {
        if (article) {
            if (article.content && article.content !== content) setContent(article.content);
            if (article.title && article.title !== title) setTitle(article.title);
            if (article.summary !== undefined && article.summary !== summary) setSummary(article.summary || '');
            if (article.coverImage && article.coverImage !== coverImage) setCoverImage(article.coverImage);
            if (article.lang && article.lang !== lang) setLang(article.lang);
            if (article.citations) {
                const newCitations = typeof article.citations === 'string' ? JSON.parse(article.citations) : article.citations;
                setCitations(newCitations);
            }
            if (article.entities) {
                const newEntities = typeof article.entities === 'string' ? JSON.parse(article.entities) : article.entities;
                setEntities(newEntities);
            }
        }
    }, [article]);

    const handleGenerateCover = async (strategyId: string) => {
        console.log('[ArticleForm] handleGenerateCover started', { strategyId });
        setShowCoverStrategy(false);
        setIsGeneratingCover(true);

        try {
            const res = await fetch('/api/admin/ai/images/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    strategyId,
                    context: {
                        title: title,
                        summary: (document.getElementById('summary') as HTMLTextAreaElement)?.value || '',
                        keywords: (document.getElementById('seoKeywords') as HTMLInputElement)?.value || '',
                        lang: lang,
                    }
                })
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || `Generation failed with status ${res.status}`);
            }
            const data = await res.json();
            console.log('[ArticleForm] Cover generation response:', data);

            if (data.url) {
                console.log('[ArticleForm] Setting cover image state:', data.url);
                setCoverImage(data.url);
            } else {
                console.warn('[ArticleForm] Cover generation returned no URL');
            }
        } catch (error: any) {
            console.error('[ArticleForm] Cover generation error:', error);
            alert(`封面生成失败: ${error.message}`);
        } finally {
            setIsGeneratingCover(false);
        }
    };

    const handleGenerateSEO = async () => {
        console.log('[ArticleForm] handleGenerateSEO started');
        if (!content) {
            alert('请先填写文章内容');
            return;
        }

        setIsGeneratingSEO(true);
        try {
            const keywords = (document.getElementById('seoKeywords') as HTMLInputElement)?.value;

            const res = await fetch('/api/admin/seo/generate-metadata', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, keywords, lang }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || `SEO generation failed with status ${res.status}`);
            }

            const data = await res.json();
            console.log('[ArticleForm] SEO generation response:', data);

            if (data.title) {
                const titleInput = document.getElementById('seoTitle') as HTMLInputElement;
                if (titleInput) {
                    titleInput.value = data.title;
                    console.log('[ArticleForm] Updated seoTitle input');
                }
            }
            if (data.description) {
                const descInput = document.getElementById('seoDescription') as HTMLTextAreaElement;
                if (descInput) {
                    descInput.value = data.description;
                    console.log('[ArticleForm] Updated seoDescription input');
                }
                // 如果摘要为空,则同步到摘要
                if (!summary.trim()) {
                    setSummary(data.description);
                    console.log('[ArticleForm] Synced seoDescription to summary');
                }
            }
            if (data.slug) {
                const slugInput = document.getElementById('slug') as HTMLInputElement;
                if (slugInput) {
                    slugInput.value = data.slug;
                    console.log('[ArticleForm] Updated slug input');
                }
            }

            alert('SEO 元数据生成成功！');
        } catch (e: any) {
            console.error('[ArticleForm] SEO generation error:', e);
            alert(`生成失败: ${e.message}`);
        } finally {
            setIsGeneratingSEO(false);
        }
    };

    const handleOptimize = async () => {
        if (!content) {
            alert('请先填写内容');
            return;
        }

        if (!confirm('一键优化将重写文章部分结构以符合 GEO 标准（增加摘要、表格、FAQ 等），是否继续？')) {
            return;
        }

        setIsOptimizing(true);
        try {
            const keywords = (document.getElementById('seoKeywords') as HTMLInputElement)?.value;
            const res = await fetch('/api/admin/articles/optimize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, keywords, lang }),
            });
            if (!res.ok) throw new Error('优化失败');
            const data = await res.json();
            setContent(data.content);
            alert('GEO 优化完成！');
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsOptimizing(false);
        }
    };

    const handleIllustrate = async () => {
        if (!content) {
            alert('请先填写内容');
            return;
        }

        setIsIllustrating(true);
        try {
            const keywords = (document.getElementById('seoKeywords') as HTMLInputElement)?.value;
            const res = await fetch('/api/admin/articles/illustrate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, keywords, lang }),
            });
            if (!res.ok) throw new Error('配图失败');
            const data = await res.json();
            setContent(data.content);
            alert(`智能配图完成，已新增 ${data.addedCount} 张图片！`);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsIllustrating(false);
        }
    };

    const handleAutoLink = async () => {
        if (!content) {
            alert('请先填写内容');
            return;
        }

        setIsAutoLinking(true);
        try {
            const res = await fetch('/api/admin/articles/auto-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, articleId: article?.id, lang }),
            });
            if (!res.ok) throw new Error('内链添加失败');
            const data = await res.json();
            setContent(data.content);
            alert('AI 自动内链推荐并添加完成！');
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsAutoLinking(false);
        }
    };

    return (
        <form action={action} className="space-y-6">
            {article && <input type="hidden" name="id" value={article.id} />}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* 左侧主要内容 */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold mb-6 text-gray-900">文章内容</h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="title" className="text-sm font-medium text-gray-700">
                                    文章标题
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="输入文章标题"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="slug" className="text-sm font-medium text-gray-700">
                                    URL 路径 (Slug)
                                </label>
                                <input
                                    type="text"
                                    id="slug"
                                    name="slug"
                                    defaultValue={article?.slug}
                                    required
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="article-url-slug"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="summary" className="text-sm font-medium text-gray-700">
                                    摘要
                                </label>
                                <textarea
                                    id="summary"
                                    name="summary"
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                    rows={3}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                                    placeholder="文章简短摘要..."
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="content" className="text-sm font-medium text-gray-700">
                                        内容
                                    </label>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={handleOptimize}
                                            disabled={isOptimizing}
                                            className="inline-flex items-center px-3 py-1 text-xs font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
                                        >
                                            {isOptimizing ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
                                            一键 GEO 优化
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleIllustrate}
                                            disabled={isIllustrating}
                                            className="inline-flex items-center px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-50"
                                        >
                                            {isIllustrating ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
                                            智能配图
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleAutoLink}
                                            disabled={isAutoLinking}
                                            className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                                        >
                                            {isAutoLinking ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
                                            AI 智能内链
                                        </button>
                                    </div>
                                </div>
                                <input type="hidden" name="content" value={content} />
                                <RichTextEditor
                                    value={content}
                                    onChange={setContent}
                                    placeholder="开始撰写精彩文章..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 右侧设置 */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
                        <h2 className="text-lg font-semibold mb-6 text-gray-900">发布设置</h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="status" className="text-sm font-medium text-gray-700">
                                    状态
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    defaultValue={article?.status || 'DRAFT'}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="DRAFT">草稿</option>
                                    <option value="PUBLISHED">发布</option>
                                    <option value="SCHEDULED">计划发布</option>
                                    <option value="ARCHIVED">归档</option>
                                </select>
                            </div>

                            {enableMultiLanguage && (
                                <>
                                    <div className="space-y-2">
                                        <label htmlFor="lang" className="text-sm font-medium text-gray-700">
                                            语言
                                        </label>
                                        <select
                                            id="lang"
                                            name="lang"
                                            value={lang}
                                            onChange={(e) => setLang(e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                            <option value="zh">简体中文 (zh)</option>
                                            <option value="en">English (en)</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="translationGroupId" className="text-sm font-medium text-gray-700">
                                            翻译组
                                        </label>
                                        <input type="hidden" name="translationGroupId" value={selectedGroupId} />
                                        <select
                                            id="translationGroupId_select"
                                            value={selectedGroupId}
                                            onChange={handleGroupIdChange}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                            <option value="">不关联翻译组</option>
                                            <option value="__new__">➕ 创建新翻译组</option>
                                            {translationGroups
                                                .filter(group => group.lang !== lang)
                                                .map(group => (
                                                    <option key={group.id} value={group.id}>
                                                        {group.label}
                                                    </option>
                                                ))}
                                            {selectedGroupId && !translationGroups.find(g => g.id === selectedGroupId) && !selectedGroupId.startsWith('group_') && (
                                                <option value={selectedGroupId}>
                                                    当前组: {selectedGroupId}
                                                </option>
                                            )}
                                        </select>
                                        <p className="text-[10px] text-gray-400 font-normal">选择相同的翻译组可将不同语言版本的文章关联起来</p>
                                    </div>
                                </>
                            )}

                            {!enableMultiLanguage && (
                                <input type="hidden" name="lang" value="zh" />
                            )}

                            <div className="space-y-2">
                                <label htmlFor="categoryId" className="text-sm font-medium text-gray-700">
                                    分类
                                </label>
                                <select
                                    id="categoryId"
                                    name="categoryId"
                                    defaultValue={article?.categoryId || ''}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="">无分类</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="sortOrder" className="text-sm font-medium text-gray-700">
                                    排序权重
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        id="sortOrder"
                                        name="sortOrder"
                                        defaultValue={article?.sortOrder ?? 0}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="0"
                                    />
                                    <div className="text-xs text-gray-500 flex items-center shrink-0">
                                        (数字越小越靠前)
                                    </div>
                                </div>
                            </div>

                            <SubmitButton />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">封面图</h2>
                            <button
                                type="button"
                                onClick={() => setShowCoverStrategy(true)}
                                disabled={isGeneratingCover}
                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                            >
                                {isGeneratingCover ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
                                AI 生成
                            </button>
                        </div>
                        <div className="space-y-4">
                            <ImageUpload
                                value={coverImage}
                                onChange={setCoverImage}
                                label="上传文章封面"
                                className="w-full"
                            />
                            <input type="hidden" name="coverImage" value={coverImage} />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">SEO 设置</h2>
                            <button
                                type="button"
                                onClick={handleGenerateSEO}
                                disabled={isGeneratingSEO}
                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                            >
                                {isGeneratingSEO ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
                                AI 生成
                            </button>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="seoTitle" className="text-sm font-medium text-gray-700">
                                    SEO 标题
                                </label>
                                <input
                                    type="text"
                                    id="seoTitle"
                                    name="seoTitle"
                                    defaultValue={article?.seo?.title}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="默认为文章标题"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="seoKeywords" className="text-sm font-medium text-gray-700">
                                    关键词
                                </label>
                                <input
                                    type="text"
                                    id="seoKeywords"
                                    name="seoKeywords"
                                    defaultValue={article?.seo?.keywords}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="关键词1, 关键词2"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="seoDescription" className="text-sm font-medium text-gray-700">
                                    描述
                                </label>
                                <textarea
                                    id="seoDescription"
                                    name="seoDescription"
                                    defaultValue={article?.seo?.description}
                                    rows={3}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                                    placeholder="SEO 描述..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* 智能内链推荐 */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <InternalLinkSuggester
                            articleId={article?.id}
                            content={content}
                        />
                    </div>

                    {/* 引用管理 */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <CitationManager
                            citations={citations}
                            onChange={setCitations}
                            content={content}
                            lang={lang}
                            onInsert={(citation, index) => {
                                const superscript = `<sup><a href="#citation-${index}">[${index}]</a></sup>`;
                                alert(`请在编辑器中手动插入引用标记: ${superscript}`);
                            }}
                        />
                        <input type="hidden" name="citations" value={JSON.stringify(citations)} />
                    </div>

                    {/* 实体识别 */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <EntityManager
                            entities={entities}
                            onChange={setEntities}
                            content={content}
                            lang={lang}
                        />
                        <input type="hidden" name="entities" value={JSON.stringify(entities)} />
                    </div>

                    {/* 内容质量审计 - 放置在最后 */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        {(isGeneratingSEO || isGeneratingCover || isOptimizing || isIllustrating || isAutoLinking) ? (
                            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                                <p className="text-xs text-center">正在处理 AI 任务，<br />审计已暂停...</p>
                            </div>
                        ) : (
                            <ContentAuditor
                                title={title || article?.title || ''}
                                content={content}
                                citations={citations}
                                entities={entities}
                            />
                        )}
                    </div>
                </div>
            </div>

            <Dialog open={showCoverStrategy} onOpenChange={setShowCoverStrategy}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>选择封面生成策略</DialogTitle>
                    </DialogHeader>
                    <StrategySelector
                        targetType="IMAGE_COVER"
                        type="IMAGE"
                        onSelect={handleGenerateCover}
                        onCancel={() => setShowCoverStrategy(false)}
                    />
                </DialogContent>
            </Dialog>
        </form >
    );
}
