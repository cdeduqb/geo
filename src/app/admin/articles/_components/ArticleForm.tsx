'use client';

import { Category, Article } from '@prisma/client';
import { Save, Loader2, Sparkles, Languages, ChevronRight, ArrowLeft, FileText, Info, Globe, Layout, Image, Settings, History, Box, Layers, MousePointer2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/ui/RichTextEditor';
import InternalLinkSuggester from '@/components/editor/InternalLinkSuggester';
import ContentAuditor from '@/components/editor/ContentAuditor';
import CitationManager, { Citation } from '@/components/editor/CitationManager';
import EntityManager, { Entity } from '@/components/editor/EntityManager';

import ImageUpload from '@/components/ui/ImageUpload';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import StrategySelector from '@/components/ui/StrategySelector';
import { useToast } from '@/components/ui/toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface ArticleFormProps {
    categories: Category[];
    article?: any;
    action: (formData: FormData) => any;
    enableMultiLanguage?: boolean;
    translationGroups?: { id: string; label: string; lang: string }[];
    supportedLocales?: string[];
}

function SubmitButton({ className }: { className?: string }) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className={className || "inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-100 hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"}
        >
            {pending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {pending ? '保存中...' : '保存文章'}
        </button>
    );
}

export default function ArticleForm({ categories, article, action, enableMultiLanguage = false, translationGroups = [], supportedLocales = ['zh', 'en'] }: ArticleFormProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const [content, setContent] = useState(article?.content || '');
    const [title, setTitle] = useState(article?.title || '');
    const [slug, setSlug] = useState(article?.slug || '');
    const [summary, setSummary] = useState(article?.summary || '');
    const [coverImage, setCoverImage] = useState(article?.coverImage || '');
    const [showCoverStrategy, setShowCoverStrategy] = useState(false);
    const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);
    const [isGeneratingCover, setIsGeneratingCover] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [isIllustrating, setIsIllustrating] = useState(false);
    const [isAutoLinking, setIsAutoLinking] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [showTranslateDialog, setShowTranslateDialog] = useState(false);
    const [targetLang, setTargetLang] = useState('en');
    const [lang, setLang] = useState(article?.lang || 'zh');
    const [selectedGroupId, setSelectedGroupId] = useState(article?.translationGroupId || '');

    const [slugConfirmModal, setSlugConfirmModal] = useState<{ open: boolean; currentSlug: string; newSlug: string }>({ open: false, currentSlug: '', newSlug: '' });
    const [optimizeConfirmModal, setOptimizeConfirmModal] = useState(false);
    const [translateSuccessModal, setTranslateSuccessModal] = useState<{ open: boolean; redirectUrl: string; targetLang: string }>({ open: false, redirectUrl: '', targetLang: '' });

    // 样式常量
    const inputClass = "w-full rounded-2xl border border-gray-300 bg-gray-50/50 px-6 py-4 text-sm font-bold text-gray-900 focus:border-blue-600 focus:bg-white transition-all outline-none placeholder:text-gray-300";
    const labelClass = "text-[13px] font-bold text-gray-700 ml-1 block";
    const selectClass = "w-full rounded-2xl border border-gray-300 bg-gray-50/50 px-6 py-4 text-sm font-bold text-gray-900 focus:border-blue-600 focus:bg-white transition-all outline-none";
    const cardClass = "bg-white rounded-[32px] border border-gray-100 shadow-sm ring-1 ring-gray-100/50 p-10";

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
            if (data.url) {
                setCoverImage(data.url);
            }
        } catch (error: any) {
            showToast(`封面生成失败: ${error.message}`, 'error');
        } finally {
            setIsGeneratingCover(false);
        }
    };

    const handleGenerateSEO = async () => {
        if (!content) {
            showToast('请先填写文章内容', 'warning');
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
            if (data.title) {
                const titleInput = document.getElementById('seoTitle') as HTMLInputElement;
                if (titleInput) titleInput.value = data.title;
            }
            if (data.description) {
                const descInput = document.getElementById('seoDescription') as HTMLTextAreaElement;
                if (descInput) descInput.value = data.description;
                if (!summary.trim()) setSummary(data.description);
            }
            if (data.slug) {
                if (!slug.trim()) {
                    setSlug(data.slug);
                } else {
                    setSlugConfirmModal({ open: true, currentSlug: slug, newSlug: data.slug });
                }
            }
            showToast('SEO 元数据生成成功！', 'success');
        } catch (e: any) {
            showToast(`生成失败: ${e.message}`, 'error');
        } finally {
            setIsGeneratingSEO(false);
        }
    };

    const handleOptimize = async () => {
        if (!content) {
            showToast('请先填写内容', 'warning');
            return;
        }
        setOptimizeConfirmModal(true);
    };

    const confirmOptimize = async () => {
        setOptimizeConfirmModal(false);
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
            showToast('GEO 优化完成！', 'success');
        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setIsOptimizing(false);
        }
    };

    const handleIllustrate = async () => {
        if (!content) {
            showToast('请先填写内容', 'warning');
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
            showToast(`智能配图完成，已新增 ${data.addedCount} 张图片！`, 'success');
        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setIsIllustrating(false);
        }
    };

    const handleAutoLink = async () => {
        if (!content) {
            showToast('请先填写内容', 'warning');
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
            showToast('AI 自动内链推荐并添加完成！', 'success');
        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setIsAutoLinking(false);
        }
    };

    const handleTranslate = async () => {
        if (!article?.id) {
            showToast('请先保存文章后再进行翻译', 'warning');
            return;
        }
        if (!content) {
            showToast('文章内容为空，无法翻译', 'warning');
            return;
        }
        setIsTranslating(true);
        try {
            const res = await fetch('/api/admin/articles/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    articleId: article.id,
                    targetLang: targetLang,
                    createNew: true,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || '翻译失败');
            }
            setShowTranslateDialog(false);
            if (data.redirectUrl) {
                setTranslateSuccessModal({ open: true, redirectUrl: data.redirectUrl, targetLang: targetLang });
            } else {
                showToast('翻译完成！', 'success');
            }
        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setIsTranslating(false);
        }
    };

    return (
        <>
            <form action={action} className="space-y-6">
                {article && <input type="hidden" name="id" value={article.id} />}

                {/* 顶部操作栏 - 仅保留保存按钮 */}
                <div className="flex items-center justify-end">
                    <SubmitButton />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 左侧主要内容 */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* 基本信息卡片 */}
                        <div className={cardClass}>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                                <h2 className="text-lg font-black text-gray-900 tracking-tight">基本信息</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="space-y-3">
                                    <label htmlFor="title" className={labelClass}>
                                        文章标题
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        className={inputClass}
                                        placeholder="输入文章标题"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label htmlFor="slug" className={labelClass}>
                                        URL 路径
                                    </label>
                                    <input
                                        type="text"
                                        id="slug"
                                        name="slug"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        required
                                        className={`${inputClass} font-mono`}
                                        placeholder="article-url-slug"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label htmlFor="summary" className={labelClass}>
                                    摘要
                                </label>
                                <textarea
                                    id="summary"
                                    name="summary"
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                    rows={3}
                                    className={`${inputClass} resize-none leading-relaxed`}
                                    placeholder="文章简短摘要..."
                                />
                            </div>
                        </div>

                        {/* SEO 设置卡片 */}
                        <div className={cardClass}>
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-green-600 rounded-full" />
                                    <h2 className="text-lg font-black text-gray-900 tracking-tight">SEO 设置</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleGenerateSEO}
                                    disabled={isGeneratingSEO}
                                    className="inline-flex items-center px-4 py-2 text-[13px] font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50"
                                >
                                    {isGeneratingSEO ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-1.5" />}
                                    AI 生成
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label htmlFor="seoTitle" className={labelClass}>
                                        SEO 标题
                                    </label>
                                    <input
                                        type="text"
                                        id="seoTitle"
                                        name="seoTitle"
                                        defaultValue={article?.seo?.title}
                                        className={inputClass}
                                        placeholder="默认为文章标题"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label htmlFor="seoKeywords" className={labelClass}>
                                        关键词
                                    </label>
                                    <input
                                        type="text"
                                        id="seoKeywords"
                                        name="seoKeywords"
                                        defaultValue={article?.seo?.keywords}
                                        className={inputClass}
                                        placeholder="关键词1, 关键词2"
                                    />
                                </div>

                                <div className="space-y-3 md:col-span-2">
                                    <label htmlFor="seoDescription" className={labelClass}>
                                        描述
                                    </label>
                                    <textarea
                                        id="seoDescription"
                                        name="seoDescription"
                                        defaultValue={article?.seo?.description}
                                        rows={4}
                                        className={`${inputClass} resize-none leading-relaxed`}
                                        placeholder="SEO 描述..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 内容编辑卡片 */}
                        <div className={cardClass}>
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-purple-600 rounded-full" />
                                    <h2 className="text-lg font-black text-gray-900 tracking-tight">文章内容</h2>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={handleOptimize}
                                        disabled={isOptimizing}
                                        className="inline-flex items-center px-3 py-1.5 text-[12px] font-bold text-purple-600 bg-purple-50 rounded-xl hover:bg-purple-600 hover:text-white transition-all disabled:opacity-50"
                                    >
                                        {isOptimizing ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-1.5" />}
                                        GEO 优化
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleIllustrate}
                                        disabled={isIllustrating}
                                        className="inline-flex items-center px-3 py-1.5 text-[12px] font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50"
                                    >
                                        {isIllustrating ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-1.5" />}
                                        智能配图
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleAutoLink}
                                        disabled={isAutoLinking}
                                        className="inline-flex items-center px-3 py-1.5 text-[12px] font-bold text-green-600 bg-green-50 rounded-xl hover:bg-green-600 hover:text-white transition-all disabled:opacity-50"
                                    >
                                        {isAutoLinking ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-1.5" />}
                                        AI 内链
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

                    {/* 右侧设置 */}
                    <div className="space-y-6">
                        {/* 发布设置卡片 */}
                        <div className={cardClass}>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
                                <h2 className="text-lg font-black text-gray-900 tracking-tight">发布设置</h2>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label htmlFor="status" className={labelClass}>
                                        状态
                                    </label>
                                    <select
                                        id="status"
                                        name="status"
                                        defaultValue={article?.status || 'DRAFT'}
                                        className={selectClass}
                                    >
                                        <option value="DRAFT">草稿</option>
                                        <option value="PUBLISHED">发布</option>
                                        <option value="SCHEDULED">计划发布</option>
                                        <option value="ARCHIVED">归档</option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label htmlFor="categoryId" className={labelClass}>
                                        分类
                                    </label>
                                    <select
                                        id="categoryId"
                                        name="categoryId"
                                        defaultValue={article?.categoryId || ''}
                                        className={selectClass}
                                    >
                                        <option value="">无分类</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label htmlFor="sortOrder" className={labelClass}>
                                        排序权重
                                    </label>
                                    <input
                                        type="number"
                                        id="sortOrder"
                                        name="sortOrder"
                                        defaultValue={article?.sortOrder ?? 0}
                                        className={inputClass}
                                        placeholder="0"
                                    />
                                    <p className="text-xs text-gray-400 font-medium ml-1">数字越小越靠前</p>
                                </div>

                                {enableMultiLanguage && (
                                    <>
                                        <div className="space-y-3">
                                            <label htmlFor="lang" className={labelClass}>
                                                语言
                                            </label>
                                            <select
                                                id="lang"
                                                name="lang"
                                                value={lang}
                                                onChange={(e) => setLang(e.target.value)}
                                                className={selectClass}
                                            >
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

                                        <div className="space-y-3">
                                            <label className={labelClass}>
                                                翻译组
                                            </label>
                                            <input type="hidden" name="translationGroupId" value={selectedGroupId} />
                                            <select
                                                value={selectedGroupId}
                                                onChange={handleGroupIdChange}
                                                className={selectClass}
                                            >
                                                <option value="">不关联翻译组</option>
                                                <option value="__new__">➕ 新建翻译组</option>
                                                {translationGroups
                                                    .filter(group => group.lang !== lang)
                                                    .map(group => (
                                                        <option key={group.id} value={group.id}>
                                                            {group.label}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>

                                        {article?.id && (
                                            <button
                                                type="button"
                                                onClick={() => setShowTranslateDialog(true)}
                                                className="w-full inline-flex items-center justify-center px-4 py-3.5 text-sm font-bold text-cyan-700 bg-cyan-50 rounded-2xl hover:bg-cyan-600 hover:text-white transition-all shadow-sm"
                                            >
                                                <Languages className="w-4 h-4 mr-2" />
                                                一键翻译
                                            </button>
                                        )}
                                    </>
                                )}

                                {!enableMultiLanguage && (
                                    <input type="hidden" name="lang" value="zh" />
                                )}
                            </div>
                        </div>

                        {/* 封面图卡片 */}
                        <div className={cardClass}>
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-pink-500 rounded-full" />
                                    <h2 className="text-lg font-black text-gray-900 tracking-tight">封面图</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowCoverStrategy(true)}
                                    disabled={isGeneratingCover}
                                    className="inline-flex items-center px-4 py-2 text-[13px] font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50"
                                >
                                    {isGeneratingCover ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-1.5" />}
                                    AI 生成
                                </button>
                            </div>
                            <ImageUpload
                                value={coverImage}
                                onChange={setCoverImage}
                                label="上传文章封面"
                                className="w-full"
                            />
                            <input type="hidden" name="coverImage" value={coverImage} />
                        </div>

                        {/* 内链推荐 */}
                        <div className={cardClass}>
                            <InternalLinkSuggester
                                articleId={article?.id}
                                content={content}
                            />
                        </div>

                        {/* 引用管理 */}
                        <div className={cardClass}>
                            <CitationManager
                                citations={citations}
                                onChange={setCitations}
                                content={content}
                                lang={lang}
                                onInsert={(citation, index) => {
                                    showToast(`请在编辑器中手动插入引用标记: [${index}]`, 'info');
                                }}
                            />
                            <input type="hidden" name="citations" value={JSON.stringify(citations)} />
                        </div>

                        {/* 实体识别 */}
                        <div className={cardClass}>
                            <EntityManager
                                entities={entities}
                                onChange={setEntities}
                                content={content}
                                lang={lang}
                            />
                            <input type="hidden" name="entities" value={JSON.stringify(entities)} />
                        </div>

                        {/* 内容质量审计 */}
                        <div className={cardClass}>
                            {(isGeneratingSEO || isGeneratingCover || isOptimizing || isIllustrating || isAutoLinking) ? (
                                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                    <Loader2 className="w-10 h-10 animate-spin mb-3 text-blue-500/30" />
                                    <p className="text-sm font-bold text-gray-400 text-center leading-relaxed">正在处理 AI 任务，<br />审计已暂停...</p>
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
                    <DialogContent className="sm:max-w-xl rounded-[32px] p-0 overflow-hidden border-none shadow-2xl">
                        <DialogHeader className="p-8 pb-0">
                            <DialogTitle className="text-xl font-black text-gray-900 tracking-tight">选择封面生成策略</DialogTitle>
                        </DialogHeader>
                        <div className="p-8">
                            <StrategySelector
                                targetType="IMAGE_COVER"
                                type="IMAGE"
                                onSelect={handleGenerateCover}
                                onCancel={() => setShowCoverStrategy(false)}
                            />
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={showTranslateDialog} onOpenChange={setShowTranslateDialog}>
                    <DialogContent className="sm:max-w-md rounded-[32px] p-0 overflow-hidden border-none shadow-2xl">
                        <DialogHeader className="p-8 pb-4">
                            <DialogTitle className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                                <Languages className="w-6 h-6 text-cyan-600" />
                                一键翻译文章
                            </DialogTitle>
                        </DialogHeader>
                        <div className="p-8 pt-0 space-y-6">
                            <div className="space-y-3">
                                <label className={labelClass}>当前语言</label>
                                <div className="px-5 py-4 bg-gray-50/80 rounded-2xl text-sm text-gray-900 font-bold border border-gray-100">
                                    {lang === 'zh' ? '简体中文' : lang === 'en' ? 'English' : lang}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className={labelClass}>翻译目标语言</label>
                                <select
                                    value={targetLang}
                                    onChange={(e) => setTargetLang(e.target.value)}
                                    className={selectClass}
                                >
                                    {lang !== 'en' && <option value="en">English (英语)</option>}
                                    {lang !== 'zh' && <option value="zh">简体中文</option>}
                                    <option value="ja">日本語 (日语)</option>
                                    <option value="ko">한국어 (韩语)</option>
                                    <option value="fr">Français (法语)</option>
                                    <option value="de">Deutsch (德语)</option>
                                    <option value="es">Español (西班牙语)</option>
                                </select>
                            </div>
                            <div className="bg-blue-50/50 border border-blue-100/50 rounded-2xl p-5 shadow-inner">
                                <p className="text-xs text-blue-700 font-bold leading-relaxed">
                                    <Sparkles className="w-3.5 h-3.5 inline mr-1 mb-0.5" />
                                    提示：翻译完成后将自动创建新的文章草稿，并自动关联到同一翻译组。
                                </p>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowTranslateDialog(false)}
                                    className="flex-1 px-6 py-3 text-sm font-bold text-gray-600 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors"
                                >
                                    取消
                                </button>
                                <button
                                    type="button"
                                    onClick={handleTranslate}
                                    disabled={isTranslating}
                                    className="flex-1 inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-cyan-600 rounded-2xl hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-100 disabled:opacity-50"
                                >
                                    {isTranslating ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            翻译中...
                                        </>
                                    ) : (
                                        <>
                                            <Languages className="w-4 h-4 mr-2" />
                                            开始翻译
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </form>

            <ConfirmDialog
                isOpen={slugConfirmModal.open}
                onCancel={() => setSlugConfirmModal({ open: false, currentSlug: '', newSlug: '' })}
                onConfirm={() => {
                    setSlug(slugConfirmModal.newSlug);
                    setSlugConfirmModal({ open: false, currentSlug: '', newSlug: '' });
                }}
                title="覆盖 URL Slug？"
                message={`检测到已有 URL Slug，是否用 AI 生成的值覆盖？\n\n当前值: ${slugConfirmModal.currentSlug}\nAI 建议: ${slugConfirmModal.newSlug}\n\n注意：修改 URL 会影响 SEO 和已分享的链接`}
                confirmText="使用 AI 建议"
                cancelText="保留当前"
                confirmButtonClass="bg-blue-600 hover:bg-blue-700 text-white"
            />

            <ConfirmDialog
                isOpen={optimizeConfirmModal}
                onCancel={() => setOptimizeConfirmModal(false)}
                onConfirm={confirmOptimize}
                title="一键 GEO 优化"
                message="一键优化将使用 AI 重写文章部分结构，以符合 GEO 标准：\n\n• 增加结构化摘要\n• 添加表格数据\n• 生成 FAQ 问答\n• 优化标题层级"
                confirmText="开始优化"
                confirmButtonClass="bg-purple-600 hover:bg-purple-700 text-white"
                isLoading={isOptimizing}
            />

            <ConfirmDialog
                isOpen={translateSuccessModal.open}
                onCancel={() => setTranslateSuccessModal({ open: false, redirectUrl: '', targetLang: '' })}
                onConfirm={() => router.push(translateSuccessModal.redirectUrl)}
                title="翻译完成！"
                message={`已成功将文章翻译为${translateSuccessModal.targetLang === 'en' ? '英文' : translateSuccessModal.targetLang}版本。是否立即编辑新创建的翻译版本？`}
                confirmText="立即编辑"
                cancelText="稍后编辑"
                confirmButtonClass="bg-green-600 hover:bg-green-700 text-white"
            />
        </>
    );
}
