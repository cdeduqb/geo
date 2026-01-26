'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, Sparkles, ChevronLeft, Settings2, Target, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function NewAutomationProject() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [strategies, setStrategies] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        mode: 'topic' as 'topic' | 'titles',
        topic: '',
        titlesInput: '',
        keywords: '',
        totalCount: 10,
        dailyLimit: 2,
        preferredLength: 'medium' as 'short' | 'medium' | 'long',
        categoryId: '',

        strategyId: '',
        features: {
            geo: true,
            illustrate: true,
            autoLink: true,
            cover: true,
            seo: true,
            citations: true,
            entities: true,
            optimizeTitle: true
        },
        executionMode: 'auto' as 'manual' | 'auto'
    });

    // 当标题列表变化时，自动更新总数
    useEffect(() => {
        if (formData.mode === 'titles') {
            const titles = formData.titlesInput
                .split('\n')
                .map(t => t.trim())
                .filter(t => t.length > 0);
            setFormData(prev => ({ ...prev, totalCount: titles.length || 0 }));
        }
    }, [formData.titlesInput, formData.mode]);

    useEffect(() => {
        // Fetch categories and strategies
        const fetchData = async () => {
            try {
                const [catsRes, stratsRes] = await Promise.all([
                    fetch('/api/admin/categories'),
                    fetch('/api/admin/ai-strategies?targetType=article&type=WRITING')
                ]);

                if (catsRes.ok) {
                    const cats = await catsRes.json();
                    if (Array.isArray(cats)) setCategories(cats);
                }

                if (stratsRes.ok) {
                    const strats = await stratsRes.json();
                    if (Array.isArray(strats)) {
                        setStrategies(strats);
                        if (strats.length > 0) {
                            setFormData(prev => ({ ...prev, strategyId: strats[0].id }));
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to fetch automation config data', error);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 验证标题列表
        let finalTitlesList: string[] = [];
        if (formData.mode === 'titles') {
            finalTitlesList = formData.titlesInput
                .split('\n')
                .map(t => t.trim())
                .filter(t => t.length > 0);

            if (finalTitlesList.length === 0) {
                alert('请输入至少一个标题');
                return;
            }
        }

        setIsLoading(true);

        try {
            const res = await fetch('/api/admin/articles/automation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    titlesList: formData.mode === 'titles' ? finalTitlesList : undefined
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || '创建失败');
            }

            // 如果是自动执行模式，立即触发一次处理
            if (formData.executionMode === 'auto') {
                try {
                    // 非阻塞调用
                    fetch('/api/admin/articles/automation/process', { method: 'POST' });
                    alert('项目创建成功！已自动开始执行任务。');
                } catch (e) {
                    console.error('Auto trigger failed', e);
                }
            } else {
                alert('项目创建成功！请在列表中手动启动任务。');
            }

            router.push('/admin/articles/automation');
            router.refresh();
        } catch (error: any) {
            console.error('Submit Error:', error);
            // 尝试显示详情，如果有的话
            const detailMsg = error.message;
            alert(`创建失败: ${detailMsg}`);
        } finally {
            setIsLoading(false);
        }
    };


    const toggleFeature = (feature: keyof typeof formData.features) => {
        setFormData(prev => ({
            ...prev,
            features: {
                ...prev.features,
                [feature]: !prev.features[feature]
            }
        }));
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <Link href="/admin/articles/automation" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors mb-2">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        返回列表
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                            <Sparkles className="w-6 h-6 animate-pulse" />
                        </div>
                        新建自动创作项目
                    </h1>
                    <p className="text-gray-500">通过 AI 自动化管线，持续、稳定地生成高质量 SEO 文章。</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Config */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                        <div className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-2">
                            <Settings2 className="w-5 h-5 text-blue-500" />
                            基础配置
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 font-mono tracking-wider uppercase">项目名称</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 transition-all outline-none"
                                    placeholder="例如：2024 夏季数码转码专题"
                                />
                            </div>

                            <div className="space-y-3 p-1.5 bg-gray-50/50 rounded-2xl border border-gray-100">
                                <label className="text-xs font-black text-gray-400 px-3 uppercase tracking-widest">创作模式</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, mode: 'topic' }))}
                                        className={`flex flex-col items-center gap-1.5 p-4 rounded-xl transition-all border-2 ${formData.mode === 'topic'
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100 scale-[1.02]'
                                            : 'bg-white border-transparent text-gray-600 hover:border-blue-100'
                                            }`}
                                    >
                                        <Sparkles className={`w-5 h-5 ${formData.mode === 'topic' ? 'text-blue-100' : 'text-blue-500'}`} />
                                        <div className="font-black text-sm">主题批量模式</div>
                                        <div className={`text-[10px] text-center leading-relaxed ${formData.mode === 'topic' ? 'text-blue-100/70' : 'text-gray-400'}`}>基于一个主题关键词<br />由 AI 衍生多个标题</div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, mode: 'titles' }))}
                                        className={`flex flex-col items-center gap-1.5 p-4 rounded-xl transition-all border-2 ${formData.mode === 'titles'
                                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 scale-[1.02]'
                                            : 'bg-white border-transparent text-gray-600 hover:border-indigo-100'
                                            }`}
                                    >
                                        <Target className={`w-5 h-5 ${formData.mode === 'titles' ? 'text-indigo-100' : 'text-indigo-500'}`} />
                                        <div className="font-black text-sm">标题列表模式</div>
                                        <div className={`text-[10px] text-center leading-relaxed ${formData.mode === 'titles' ? 'text-indigo-100/70' : 'text-gray-400'}`}>一次性输入多个标题<br />精准控制创作方向</div>
                                    </button>
                                </div>
                            </div>

                            {formData.mode === 'topic' ? (
                                <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">内容核心主题 (Topic)</label>
                                        <textarea
                                            required={formData.mode === 'topic'}
                                            value={formData.topic}
                                            onChange={e => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                                            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 transition-all outline-none min-h-[120px] resize-none"
                                            placeholder="描述您希望 AI 创作的核心方向..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">优化词</label>
                                        <input
                                            type="text"
                                            value={formData.keywords}
                                            onChange={e => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                                            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 transition-all outline-none"
                                            placeholder="例如:全域魔力Molicms系统"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-bold text-gray-700">标题列表</label>
                                            <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full uppercase">每行一个标题</span>
                                        </div>
                                        <textarea
                                            required={formData.mode === 'titles'}
                                            value={formData.titlesInput}
                                            onChange={e => setFormData(prev => ({ ...prev, titlesInput: e.target.value }))}
                                            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-mono focus:bg-white focus:border-indigo-500 transition-all outline-none min-h-[300px] leading-relaxed"
                                            placeholder="每行输入一个标题"
                                        />
                                        <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
                                            <div className="w-1 h-1 rounded-full bg-indigo-400" />
                                            <span>当前已识别出 <strong className="text-indigo-600 text-xs">{formData.totalCount}</strong> 个标题</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">通用优化词 (可选)</label>
                                        <input
                                            type="text"
                                            value={formData.keywords}
                                            onChange={e => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                                            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:border-indigo-500 transition-all outline-none"
                                            placeholder="所有文章共用的 SEO 关键词"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* 文章篇幅控制 */}
                            <div className="space-y-4 pt-4 border-t border-gray-50">
                                <label className="text-sm font-bold text-gray-700 font-mono tracking-wider uppercase flex items-center gap-2">
                                    <Target className="w-4 h-4 text-blue-500" />
                                    文章预期篇幅
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: 'short', label: '简约型', desc: '约 800 字', color: 'blue' },
                                        { id: 'medium', label: '高级型', desc: '约 1500 字', color: 'blue' },
                                        { id: 'long', label: '深度型', desc: '3000 字以上', color: 'blue' },

                                    ].map((item) => (

                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, preferredLength: item.id as any }))}
                                            className={`relative p-3 rounded-xl border-2 transition-all text-left ${formData.preferredLength === item.id
                                                ? 'border-blue-600 bg-blue-50'
                                                : 'border-gray-100 bg-gray-50/50 hover:border-blue-200'
                                                }`}
                                        >
                                            <div className={`text-sm font-black ${formData.preferredLength === item.id ? 'text-blue-700' : 'text-gray-700'}`}>
                                                {item.label}
                                            </div>
                                            <div className="text-[10px] text-gray-400 font-medium">{item.desc}</div>
                                            {formData.preferredLength === item.id && (
                                                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[10px] text-gray-400 leading-relaxed italic">
                                    * 篇幅由 AI 自动控制。深度型文章会包含更详尽的章节、数据支撑及深度案例分析。
                                </p>
                            </div>
                        </div>
                    </div>


                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-6">
                            <Target className="w-5 h-5 text-purple-500" />
                            自动化管线 (Pipeline) 功能
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { id: 'geo', label: 'GEO 深度优化', desc: '自动注入 FAQ、表格和摘要' },
                                { id: 'illustrate', label: '正文智能配图', desc: '根据文章语义自动插入插图' },
                                { id: 'autoLink', label: '智能自动化内链', desc: '自动连接站内相关文章' },
                                { id: 'cover', label: 'AI 封面生成', desc: '一键生成高品质特色封面' },
                                { id: 'seo', label: 'SEO 自动配置', desc: '自动生成 TDK 和 URL Slug' },
                                { id: 'citations', label: '权威引用生成', desc: '自动检索并添加参考资料' },
                                { id: 'entities', label: '实体识别与画像', desc: '自动提取人物、组织、地点' },
                                { id: 'optimizeTitle', label: '优化文章标题', desc: 'AI 自动重写标题。不勾选则保留您的原始标题' },
                            ].map((f) => (
                                <div
                                    key={f.id}
                                    onClick={() => toggleFeature(f.id as any)}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${formData.features[f.id as keyof typeof formData.features]
                                        ? 'border-blue-500 bg-blue-50/50'
                                        : 'border-gray-100 bg-white hover:border-gray-300'
                                        }`}
                                >
                                    <div className={`mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${formData.features[f.id as keyof typeof formData.features] ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300'}`}>
                                        {formData.features[f.id as keyof typeof formData.features] && <Save className="w-3 h-3" />}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-800">{f.label}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">{f.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Config */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                        <div className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-2">
                            <Calendar className="w-5 h-5 text-green-500" />
                            发布计划 {formData.mode === 'titles' && <span className="text-[10px] text-indigo-500 font-black ml-auto bg-indigo-50 px-2 py-0.5 rounded-full">自动计算</span>}
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">生成文章总数</label>
                                {formData.mode === 'topic' ? (
                                    <input
                                        type="number"
                                        min="1"
                                        max="500"
                                        value={formData.totalCount}
                                        onChange={e => setFormData(prev => ({ ...prev, totalCount: parseInt(e.target.value) || 1 }))}
                                        className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 transition-all outline-none"
                                    />
                                ) : (
                                    <div className="w-full rounded-xl border border-indigo-100 bg-indigo-50/30 px-4 py-3 text-sm font-black text-indigo-600 flex items-center justify-between">
                                        <span>共识别到</span>
                                        <span className="text-lg">{formData.totalCount} 篇</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">每日发布限额</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={formData.dailyLimit}
                                    onChange={e => setFormData(prev => ({ ...prev, dailyLimit: parseInt(e.target.value) || 1 }))}
                                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 transition-all outline-none"
                                />
                                <p className="text-[10px] text-gray-400">系统将自动分散发布时间以保持自然更新频率。</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">所属分类</label>
                                <select
                                    value={formData.categoryId}
                                    onChange={e => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 transition-all outline-none cursor-pointer"
                                >
                                    <option value="">默认（无分类）</option>
                                    {categories.length > 0 ? (
                                        categories.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))
                                    ) : (
                                        <option disabled>加载分类中...</option>
                                    )}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">创作策略 (AI Strategy)</label>
                                <select
                                    required
                                    value={formData.strategyId}
                                    onChange={e => setFormData(prev => ({ ...prev, strategyId: e.target.value }))}
                                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 transition-all outline-none cursor-pointer"
                                >
                                    {strategies.length > 0 ? (
                                        <>
                                            <option value="" disabled>请选择创作策略</option>
                                            {strategies.map((s) => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </>
                                    ) : (
                                        <option value="">请先创建 AI 创作策略</option>
                                    )}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">执行模式</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, executionMode: 'auto' }))}
                                    className={`p-3 rounded-xl border text-left transition-all ${formData.executionMode === 'auto'
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-gray-200 hover:border-green-200'
                                        }`}
                                >
                                    <div className="font-bold text-sm mb-1 flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> 全自动
                                    </div>
                                    <div className="text-[10px] opacity-80">无需干预，创建即自动运行</div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, executionMode: 'manual' }))}
                                    className={`p-3 rounded-xl border text-left transition-all ${formData.executionMode === 'manual'
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-blue-200'
                                        }`}
                                >
                                    <div className="font-bold text-sm mb-1 flex items-center gap-1">
                                        <Target className="w-3 h-3" /> 手动控制
                                    </div>
                                    <div className="text-[10px] opacity-80">手动点击运行特定任务</div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-4 text-white rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 text-base font-bold disabled:opacity-50 mt-4 active:scale-[0.98] ${formData.mode === 'titles' ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'}`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>正在部署工厂...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                <span>启动自动化生产</span>
                            </>
                        )}
                    </button>
                </div>

                <div className={`rounded-2xl p-6 text-white shadow-xl border border-white/20 relative overflow-hidden group transition-colors duration-500 ${formData.mode === 'titles' ? 'bg-gradient-to-br from-indigo-700 to-violet-800 shadow-indigo-200' : 'bg-gradient-to-br from-indigo-600 to-blue-700 shadow-blue-200'}`}>
                    <div className="relative z-10">
                        <h4 className="font-bold flex items-center gap-2 mb-2 uppercase tracking-widest text-xs opacity-80">
                            <Target className="w-4 h-4" />
                            任务预估 / Estimation
                        </h4>
                        <div className="space-y-4 mt-6">
                            <div className="flex items-end justify-between border-b border-white/10 pb-2">
                                <span className="text-xs opacity-60">预计总耗时</span>
                                <span className="font-black text-xl">{Math.ceil(formData.totalCount / formData.dailyLimit)} <small className="text-[10px] font-normal opacity-60">天</small></span>
                            </div>
                            <div className="flex items-end justify-between border-b border-white/10 pb-2">
                                <span className="text-xs opacity-60">每日平均产出</span>
                                <span className="font-black text-xl">{formData.dailyLimit} <small className="text-[10px] font-normal opacity-60">篇 / 日</small></span>
                            </div>
                            <div className="flex items-end justify-between border-b border-white/10 pb-2">
                                <span className="text-xs opacity-60">激活功能项</span>
                                <span className="font-black text-xl">{Object.values(formData.features).filter(Boolean).length} <small className="text-[10px] font-normal opacity-60">项模块</small></span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        {formData.mode === 'topic' ? <Sparkles className="w-32 h-32" /> : <Target className="w-32 h-32" />}
                    </div>
                </div>
            </form>
        </div>
    );
}
