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
        topic: '',
        keywords: '',
        totalCount: 10,
        dailyLimit: 2,
        categoryId: '',
        strategyId: '',
        features: {
            geo: true,
            illustrate: true,
            autoLink: true,
            cover: true,
            seo: true,
            citations: true,
            entities: true
        },
        executionMode: 'manual' as 'manual' | 'auto'
    });

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
        setIsLoading(true);

        try {
            const res = await fetch('/api/admin/articles/automation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('创建失败');

            const result = await res.json();

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
            alert(error.message);
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

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">项目名称</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 transition-all outline-none"
                                    placeholder="例如：2024 夏季数码转码专题"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">内容核心主题 (Topic)</label>
                                <textarea
                                    required
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
                                    placeholder="例如:全域魔力GEOCMS系统"
                                />
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
                            发布计划
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">生成文章总数</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="500"
                                    value={formData.totalCount}
                                    onChange={e => setFormData(prev => ({ ...prev, totalCount: parseInt(e.target.value) || 1 }))}
                                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 transition-all outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">每日发布限额</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="50"
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
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-3 text-base font-bold disabled:opacity-50 mt-4 active:scale-[0.98]"
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

                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-200 border border-white/20 relative overflow-hidden group">
                    <div className="relative z-10">
                        <h4 className="font-bold flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4" />
                            任务预估
                        </h4>
                        <div className="space-y-2 text-sm text-blue-50">
                            <div className="flex justify-between">
                                <span>预计总耗时:</span>
                                <span className="font-mono">{Math.ceil(formData.totalCount / formData.dailyLimit)} 天</span>
                            </div>
                            <div className="flex justify-between">
                                <span>每日产出:</span>
                                <span className="font-mono">{formData.dailyLimit} 篇</span>
                            </div>
                            <div className="flex justify-between">
                                <span>自动处理项:</span>
                                <span className="font-mono">{Object.values(formData.features).filter(Boolean).length} 项</span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <Sparkles className="w-32 h-32" />
                    </div>
                </div>
            </form>
        </div>
    );
}
