'use client';

import { useState, useEffect } from 'react';
import { Save, Bot, Shield, Eye, EyeOff, Loader2, RefreshCw, BarChart3, List, AlertTriangle, Database, Globe, LayoutPanelLeft, Sparkles, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AISimulator from './_components/AISimulator';
import CitationTracker from './_components/CitationTracker';
import ContentScorer from './_components/ContentScorer';
import RankingTracker from './_components/RankingTracker';
import BehaviorAnalysis from './_components/BehaviorAnalysis';
import CompetitorAnalysis from './_components/CompetitorAnalysis';
import GEOAudit from './_components/GEOAudit';
import BulkOptimizer from './_components/BulkOptimizer';
import AuthoritySourceManager from './_components/AuthoritySourceManager';
import IndustryEntityManager from './_components/IndustryEntityManager';

const AI_CRAWLERS = [
    // --- 国际主流 AI 平台 ---
    { id: 'GPTBot', name: 'OpenAI (GPTBot)', description: 'ChatGPT 基础训练数据抓取' },
    { id: 'ChatGPT-User', name: 'ChatGPT-User', description: 'ChatGPT 用户实时联网搜索' },
    { id: 'OAI-SearchBot', name: 'OpenAI SearchBot', description: 'SearchGPT 搜索功能抓取' },
    { id: 'ClaudeBot', name: 'Anthropic Claude', description: 'Claude AI 模型训练与网页浏览' },
    { id: 'Google-Extended', name: 'Google Gemini', description: '谷歌 Gemini/Bard AI 模型训练' },
    { id: 'Googlebot', name: 'Google Search/AI', description: '谷歌搜索索引及 AI 搜索预览数据源' },
    { id: 'PerplexityBot', name: 'Perplexity AI', description: 'Perplexity 实时 AI 搜索与引用' },
    { id: 'Meta-ExternalAgent', name: 'Meta AI', description: 'Meta AI (Llama) 模型训练与抓取' },
    { id: 'Applebot', name: 'Apple Intelligence', description: '苹果 Siri 与 Apple AI 抓取' },
    { id: 'Bingbot', name: 'Microsoft Bing/AI', description: '必应搜索及 Copilot AI 数据源' },
    { id: 'Amazonbot', name: 'Amazon AI', description: '亚马逊 Alexa 与 AWS AI 服务' },

    // --- 中国主流 AI 平台 ---
    { id: 'Bytespider', name: '豆包 (Bytespider)', description: '字节跳动/火山引擎 AI 模型抓取' },
    { id: 'Baiduspider', name: '文心一言 (Baidu)', description: '百度文心一言模型与搜索索引' },
    { id: 'DeepSeekBot', name: 'DeepSeek', description: '深度求索 (DeepSeek) 模型训练抓取' },
    { id: 'MoonshotBot', name: 'Kimi (Moonshot)', description: '月之暗面 Kimi AI 实时联网站' },
    { id: 'QwenBot', name: '通义千问 (Qwen)', description: '阿里巴巴通义千问模型抓取' },
    { id: 'TencentBot', name: '腾讯混元/元宝', description: '腾讯混元大模型与元宝 AI 搜索' },
    { id: 'ZhipuBot', name: '智谱 AI (GLM)', description: '智谱 GLM 大模型训练抓取' },
    { id: '360Spider', name: '360 智脑', description: '360 搜索与 AI 智脑模型抓取' },
    { id: 'Sogou-spider', name: '搜狗 AI', description: '搜狗搜索及腾讯 AI 辅助抓取' },
    { id: 'YisouSpider', name: '神马搜索', description: '阿里巴巴/神马移动搜索 AI 抓取' },
    { id: 'BaiChuanBot', name: '百川智能', description: '王小川百川大模型训练抓取' },
    { id: 'MiniMaxBot', name: 'MiniMax', description: 'MiniMax 海螺 AI 模型训练抓取' },
    { id: 'PetalBot', name: '华为花瓣/盘古', description: '华为搜索与盘古大模型抓取' },

    // --- 数据集与基础架构 ---
    { id: 'CCBot', name: 'Common Crawl', description: '全球开源 AI 语料库（被多数 LLM 使用）' },
];


interface GEOSettings {
    crawlerConfig: { [key: string]: 'allow' | 'disallow' };
    enableStructuredData: boolean;
    enableEntityExtraction: boolean;
    defaultSchemaOrg: boolean;
    entityInfo: {
        alternateName: string;
        sameAs: string[]; // Social links
    };
    googleOptimization?: {
        enabled?: boolean;
        verificationId?: string;
    };
    bingOptimization?: {
        enabled?: boolean;
        verificationId?: string;
        indexNowEnabled?: boolean;
    };
    amazonOptimization?: {
        enabled?: boolean;
        amazonbotAllowed?: boolean;
    };
}

interface CrawlerStats {
    todayCount: number;
    weekCount: number;
    abnormalCount: number;
    crawlers: { name: string; value: number }[];
    trend: { date: string; count: number }[];
    topPaths: { path: string; count: number }[];
    crawlerCount?: number;
}

interface CrawlerLog {
    id: string;
    crawler: string;
    path: string;
    ip: string;
    userAgent: string;
    statusCode: number;
    isAbnormal: boolean;
    createdAt: string;
}

const defaultSettings: GEOSettings = {
    crawlerConfig: AI_CRAWLERS.reduce((acc, c) => ({ ...acc, [c.id]: 'allow' }), {}),
    enableStructuredData: true,
    enableEntityExtraction: true,
    defaultSchemaOrg: true,
    entityInfo: {
        alternateName: '',
        sameAs: [],
    },
    googleOptimization: {
        enabled: true,
    },
    bingOptimization: {
        enabled: true,
        indexNowEnabled: true
    },
    amazonOptimization: {
        enabled: true,
        amazonbotAllowed: true
    }
};

export default function GEOSettingsPage() {
    const { showToast } = useToast();
    const [settings, setSettings] = useState<GEOSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [siteUrl, setSiteUrl] = useState('https://yourdomain.com');

    // 统计数据
    const [stats, setStats] = useState<CrawlerStats | null>(null);
    const [logs, setLogs] = useState<CrawlerLog[]>([]);
    const [logsLoading, setLogsLoading] = useState(false);
    const [logsPage, setLogsPage] = useState(1);
    const [logsPagination, setLogsPagination] = useState({ total: 0, totalPages: 0, limit: 100 });

    useEffect(() => {
        fetchSettings();
        fetchStats();
        fetchSiteUrl();
    }, []);

    const fetchSiteUrl = async () => {
        try {
            // 从系统设置 API 获取 site_url
            const res = await fetch('/api/admin/settings');
            if (res.ok) {
                const data = await res.json();
                if (data.site_url) {
                    setSiteUrl(data.site_url.replace(/\/$/, ''));
                    return;
                }
            }
        } catch (error) {
            console.error('Failed to fetch site settings:', error);
        }
        // 回退到环境变量
        const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
        if (envUrl) {
            setSiteUrl(envUrl.replace(/\/$/, ''));
        }
    };

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/geo/settings');
            if (res.ok) {
                const data = await res.json();
                if (data.settings) {
                    setSettings({
                        ...defaultSettings,
                        ...data.settings,
                        crawlerConfig: {
                            ...defaultSettings.crawlerConfig,
                            ...data.settings.crawlerConfig
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Failed to fetch GEO settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/geo/crawler-stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const fetchLogs = async (page = 1) => {
        setLogsLoading(true);
        try {
            const res = await fetch(`/api/admin/geo/crawler-logs?limit=100&page=${page}`);
            if (res.ok) {
                const data = await res.json();
                setLogs(data.logs);
                setLogsPagination(data.pagination);
                setLogsPage(data.pagination.page);
            }
        } catch (error) {
            console.error('Failed to fetch logs:', error);
        } finally {
            setLogsLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/geo/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings }),
            });

            if (res.ok) {
                showToast('设置已保存', 'success');
            } else {
                throw new Error('保存失败');
            }
        } catch (error) {
            showToast('保存设置失败', 'error');
        } finally {
            setSaving(false);
        }
    };

    const toggleCrawler = (crawlerId: string) => {
        setSettings(prev => ({
            ...prev,
            crawlerConfig: {
                ...prev.crawlerConfig,
                [crawlerId]: prev.crawlerConfig[crawlerId] === 'allow' ? 'disallow' : 'allow'
            }
        }));
    };

    const handleBrandProfiler = async () => {
        try {
            showToast('AI 正在分析品牌特征...', 'info');
            const res = await fetch('/api/admin/geo/brand-profiler', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ siteName: '', description: '' }), // 这里可以传入全局 SiteSettings
            });
            const data = await res.json();
            if (res.ok) {
                const { analysis } = data;
                setSettings(p => ({
                    ...p,
                    entityInfo: {
                        ...p.entityInfo,
                        alternateName: analysis.alternateName,
                        sameAs: analysis.sameAs
                    }
                }));
                showToast('AI 已为您生成品牌建议', 'success');
            }
        } catch (e) {
            showToast('AI 品牌分析失败', 'error');
        }
    };

    const allowAll = () => {
        setSettings(prev => ({
            ...prev,
            crawlerConfig: AI_CRAWLERS.reduce((acc, c) => ({ ...acc, [c.id]: 'allow' }), {})
        }));
    };

    const disallowAll = () => {
        setSettings(prev => ({
            ...prev,
            crawlerConfig: AI_CRAWLERS.reduce((acc, c) => ({ ...acc, [c.id]: 'disallow' }), {})
        }));
    };

    const [activeTab, setActiveTab] = useState('audit');

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        if (value === 'logs') {
            fetchLogs();
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 页面头部 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                        <Bot className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">生成式引擎优化</h1>
                        <p className="text-[13px] text-gray-500 font-medium">
                            优化内容以提升在 AI 搜索引擎中的可见性和引用率
                        </p>
                    </div>
                </div>

            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
                {/* 主操作栏：标签页 + 保存按钮 */}
                <div className="bg-white rounded-[24px] border border-gray-100 p-2 shadow-sm shadow-gray-100/50">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <TabsList className="h-auto p-0 bg-transparent flex flex-wrap gap-2 flex-1">
                            <TabsTrigger
                                value="audit"
                                className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-100 text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent data-[state=active]:border-blue-600"
                            >
                                <Shield className="w-4 h-4" />
                                综合诊断
                            </TabsTrigger>
                            <TabsTrigger
                                value="stats"
                                className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-100 text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent data-[state=active]:border-blue-600"
                            >
                                <BarChart3 className="w-4 h-4" />
                                数据概览
                            </TabsTrigger>
                            <TabsTrigger
                                value="settings"
                                className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-100 text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent data-[state=active]:border-blue-600"
                            >
                                <List className="w-4 h-4" />
                                爬虫控制
                            </TabsTrigger>
                            <TabsTrigger
                                value="behavior"
                                className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-100 text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent data-[state=active]:border-blue-600"
                            >
                                <Bot className="w-4 h-4" />
                                行为分析
                            </TabsTrigger>
                            <TabsTrigger
                                value="competitors"
                                className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-100 text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent data-[state=active]:border-blue-600"
                            >
                                <Sparkles className="w-4 h-4" />
                                竞品分析
                            </TabsTrigger>
                            <TabsTrigger
                                value="optimization"
                                className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-100 text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent data-[state=active]:border-blue-600"
                            >
                                <Database className="w-4 h-4" />
                                内容优化
                            </TabsTrigger>
                            <TabsTrigger
                                value="simulation"
                                className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-100 text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent data-[state=active]:border-blue-600"
                            >
                                <Eye className="w-4 h-4" />
                                视角模拟
                            </TabsTrigger>
                            <TabsTrigger
                                value="citations"
                                className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-100 text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent data-[state=active]:border-blue-600"
                            >
                                <List className="w-4 h-4" />
                                引用追踪
                            </TabsTrigger>
                            <TabsTrigger
                                value="quality"
                                className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-100 text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent data-[state=active]:border-blue-600"
                            >
                                <Sparkles className="w-4 h-4" />
                                质量评分
                            </TabsTrigger>
                            <TabsTrigger
                                value="ranking"
                                className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-100 text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent data-[state=active]:border-blue-600"
                            >
                                <TrendingUp className="w-4 h-4" />
                                排名追踪
                            </TabsTrigger>
                            <TabsTrigger
                                value="logs"
                                className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-100 text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent data-[state=active]:border-blue-600"
                            >
                                <Database className="w-4 h-4" />
                                访问日志
                            </TabsTrigger>
                            <TabsTrigger
                                value="authority-graph"
                                className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-100 text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent data-[state=active]:border-indigo-600"
                            >
                                <Shield className="w-4 h-4" />
                                权威信源图谱
                            </TabsTrigger>
                        </TabsList>
                        <div className="flex items-center gap-2 px-1">
                            <button
                                onClick={() => window.location.reload()}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 border border-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                            >
                                <RefreshCw className="w-4 h-4" />
                                刷新
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100 disabled:opacity-50 active:scale-95"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                保存设置
                            </button>
                        </div>
                    </div>
                </div>

                {/* 综合诊断面板 */}
                <TabsContent value="audit">
                    <GEOAudit onNavigate={handleTabChange} />
                </TabsContent>

                {/* 引用追踪面板 */}
                <TabsContent value="citations">
                    <CitationTracker />
                </TabsContent>

                {/* 质量评分面板 */}
                <TabsContent value="quality">
                    <ContentScorer />
                </TabsContent>



                {/* 排名追踪面板 */}
                <TabsContent value="ranking">
                    <RankingTracker />
                </TabsContent>

                {/* 权威信源图谱面板 */}
                <TabsContent value="authority-graph">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
                        <AuthoritySourceManager />
                        <IndustryEntityManager />
                    </div>
                </TabsContent>

                {/* 行为分析面板 */}
                <TabsContent value="behavior">
                    <BehaviorAnalysis />
                </TabsContent>

                {/* 竞品对比面板 */}
                <TabsContent value="competitors">
                    <CompetitorAnalysis />
                </TabsContent>

                {/* 视角模拟面板 */}
                <TabsContent value="simulation">
                    <AISimulator />
                </TabsContent>

                {/* 内容优化面板 */}
                <TabsContent value="optimization" className="space-y-6">
                    <Card className="border-gray-100 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="w-5 h-5" />
                                结构化数据 (Schema.org)
                            </CardTitle>
                            <CardDescription>
                                帮助 AI 和搜索引擎更好地理解您的网站内容
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <h4 className="font-medium text-gray-900">启用自动化 Schema 注入</h4>
                                    <p className="text-sm text-gray-500 mt-1">
                                        自动为首页 (WebSite, Organization) 和文章页 (Article) 注入 JSON-LD 数据
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setSettings(p => ({ ...p, enableStructuredData: !p.enableStructuredData }))}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.enableStructuredData ? 'bg-blue-600' : 'bg-gray-200'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ${settings.enableStructuredData ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            </div>

                            {/* 实体信息配置 */}
                            <div className="space-y-4 border-t border-gray-100 pt-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium text-gray-900 flex items-center gap-2">
                                        <Globe className="w-4 h-4" />
                                        品牌知识图谱实体信息
                                    </h3>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs h-7 border-blue-200 text-blue-600 hover:bg-blue-50"
                                        onClick={handleBrandProfiler}
                                    >
                                        <Sparkles className="w-3 h-3 mr-1" />
                                        AI 智能填充建议
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[13px] font-bold text-gray-700 ml-1 block">品牌别名 (Alternate Name)</label>
                                        <input
                                            type="text"
                                            value={settings.entityInfo?.alternateName || ''}
                                            onChange={(e) => setSettings(p => ({
                                                ...p,
                                                entityInfo: { ...p.entityInfo, alternateName: e.target.value }
                                            }))}
                                            className="w-full rounded-2xl border border-gray-300 bg-gray-50/50 px-6 py-4 text-sm font-bold text-gray-900 focus:border-blue-600 focus:bg-white transition-all outline-none placeholder:text-gray-300"
                                            placeholder="例如：Geo AI"
                                        />
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1">用于帮助 AI 识别品牌的其他称呼</p>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[13px] font-bold text-gray-700 ml-1 block">社交媒体主页 (SameAs)</label>
                                        <textarea
                                            value={settings.entityInfo?.sameAs?.join('\n') || ''}
                                            onChange={(e) => setSettings(p => ({
                                                ...p,
                                                entityInfo: { ...p.entityInfo, sameAs: e.target.value.split('\n').filter(Boolean) }
                                            }))}
                                            className="w-full rounded-2xl border border-gray-300 bg-gray-50/50 px-6 py-4 text-sm font-bold text-gray-900 focus:border-blue-600 focus:bg-white transition-all outline-none placeholder:text-gray-300 resize-none leading-relaxed"
                                            placeholder="https://weibo.com/molicms&#10;https://twitter.com/molicms"
                                            rows={3}
                                        />
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1">每行一个 URL，用于建立品牌关联</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>


                    {/* 批量内容优化增强 (Fix for FAQ/HowTo issue) */}
                    <BulkOptimizer />

                    {/* 预览 */}
                    <Card className="border-gray-100 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm">JSON-LD 预览 (Organization)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="p-4 bg-gray-50 text-gray-600 rounded-lg text-xs overflow-x-auto font-mono">
                                {JSON.stringify({
                                    "@context": "https://schema.org",
                                    "@type": "Organization",
                                    "name": settings.entityInfo?.alternateName || "您的网站名称",
                                    "alternateName": settings.entityInfo?.alternateName,
                                    "url": siteUrl,
                                    "sameAs": settings.entityInfo?.sameAs
                                }, null, 2)}
                            </pre>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 数据概览面板 */}
                <TabsContent value="stats" className="space-y-4">
                    {stats ? (
                        <>
                            {/* 核心指标 */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card className="border-gray-100 shadow-sm">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-500">今日抓取量</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">{stats.todayCount}</div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {stats.todayCount > 0 ? 'AI 正在关注您的网站' : '暂无今日数据'}
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card className="border-gray-100 shadow-sm">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-500">活跃 AI 平台</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-blue-600">{stats.crawlerCount || stats.crawlers.length}</div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {stats.crawlers.length > 0 ? stats.crawlers[0].name + ' 最为活跃' : '等待爬虫访问'}
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card className="border-gray-100 shadow-sm">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-500">异常行为检测</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className={`text-3xl font-bold ${stats.abnormalCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                            {stats.abnormalCount}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {stats.abnormalCount > 0 ? '检测到高频抓取行为' : '未发现异常访问'}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* 图表区域 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className="border-gray-100 shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-base">最近7天抓取趋势</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-[200px] flex items-end justify-between gap-2 px-2">
                                            {stats.trend.map((point, i) => (
                                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                                    <div className="w-full bg-blue-100 rounded-t relative group-hover:bg-blue-200 transition-colors"
                                                        style={{ height: `${Math.max(10, (point.count / Math.max(1, ...stats.trend.map(t => t.count))) * 180)}px` }}
                                                    >
                                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {point.count}次
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-500 transform -rotate-45 origin-top-left translate-y-2">
                                                        {point.date.slice(5)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-gray-100 shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-base">最受 AI 关注的内容</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {stats.topPaths.map((path, index) => (
                                                <div key={index} className="flex items-center justify-between text-sm">
                                                    <span className="truncate max-w-[200px] text-gray-600" title={path.path}>
                                                        {path.path}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-purple-500" style={{ width: `${(path.count / Math.max(1, ...stats.topPaths.map(p => p.count))) * 100}%` }}></div>
                                                        </div>
                                                        <span className="font-medium w-8 text-right">{path.count}</span>
                                                    </div>
                                                </div>
                                            ))}
                                            {stats.topPaths.length === 0 && (
                                                <p className="text-sm text-gray-400 text-center py-8">暂无数据</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    ) : (
                        <div className="flex justify-center p-8">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                    )}
                </TabsContent>

                {/* 设置面板 */}
                <TabsContent value="settings" className="space-y-6">
                    {/* 特殊平台优化 */}
                    <Card className="border-blue-100 bg-blue-50/30 shadow-sm overflow-hidden">
                        <CardHeader className="bg-blue-600 text-white">
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="w-5 h-5" />
                                谷歌 & 亚马逊专项优化
                            </CardTitle>
                            <CardDescription className="text-blue-100">
                                针对全球最大的两个 AI 流量入口进行深度配置
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-blue-100">
                                <div className="p-4 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-900">Google AI (Gemini) 策略</span>
                                            <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold uppercase">SGE 已优化</span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            控制 <code className="bg-gray-100 px-1 rounded">Google-Extended</code>。
                                            允许它可以让 Gemini 引用您的内容并为您带来高质量引流流量。
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant={settings.crawlerConfig['Google-Extended'] === 'allow' ? 'default' : 'secondary'}
                                            size="sm"
                                            className={settings.crawlerConfig['Google-Extended'] === 'allow'
                                                ? 'h-8 bg-green-500 hover:bg-green-600 text-white border-none shadow-sm'
                                                : 'h-8 bg-gray-200 text-gray-600 hover:bg-gray-300'}
                                            onClick={() => toggleCrawler('Google-Extended')}
                                        >
                                            {settings.crawlerConfig['Google-Extended'] === 'allow' ? '状态：已允许' : '状态：已禁止'}
                                        </Button>
                                    </div>
                                </div>
                                {settings.googleOptimization?.enabled !== false && (
                                    <div className="px-4 py-3 bg-blue-50/50 border-b border-blue-100">
                                        <div className="flex items-center gap-4">
                                            <label className="text-xs font-bold text-blue-800 whitespace-nowrap outline-none">Google 搜索验证 ID:</label>
                                            <input
                                                type="text"
                                                value={settings.googleOptimization?.verificationId || ''}
                                                onChange={(e) => setSettings(p => ({
                                                    ...p,
                                                    googleOptimization: { ...p.googleOptimization, verificationId: e.target.value }
                                                }))}
                                                className="flex-1 bg-white border border-blue-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
                                                placeholder="粘贴 google-site-verification 的 content 值"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="p-4 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-900">Amazon (Alexa/AI) 策略</span>
                                            <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-bold uppercase">产品适配完成</span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            针对 <code className="bg-gray-100 px-1 rounded">Amazonbot</code>。
                                            允许它可以让 Alexa 引用您的产品信息及价格。
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant={settings.crawlerConfig['Amazonbot'] === 'allow' ? 'default' : 'secondary'}
                                            size="sm"
                                            className={settings.crawlerConfig['Amazonbot'] === 'allow'
                                                ? 'h-8 bg-green-500 hover:bg-green-600 text-white border-none shadow-sm'
                                                : 'h-8 bg-gray-200 text-gray-600 hover:bg-gray-300'}
                                            onClick={() => toggleCrawler('Amazonbot')}
                                        >
                                            {settings.crawlerConfig['Amazonbot'] === 'allow' ? '状态：已允许' : '状态：已禁止'}
                                        </Button>
                                    </div>
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-900">DeepSeek (深度求索) 策略</span>
                                            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold uppercase">国产推理大模型</span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            针对 <code className="bg-gray-100 px-1 rounded">DeepSeekBot</code>。
                                            允许它可以让您的深度内容被 DeepSeek 引用，提升在国产最强推理引擎中的权重。
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant={settings.crawlerConfig['DeepSeekBot'] === 'allow' ? 'default' : 'secondary'}
                                            size="sm"
                                            className={settings.crawlerConfig['DeepSeekBot'] === 'allow'
                                                ? 'h-8 bg-green-500 hover:bg-green-600 text-white border-none shadow-sm'
                                                : 'h-8 bg-gray-200 text-gray-600 hover:bg-gray-300'}
                                            onClick={() => toggleCrawler('DeepSeekBot')}
                                        >
                                            {settings.crawlerConfig['DeepSeekBot'] === 'allow' ? '状态：已允许' : '状态：已禁止'}
                                        </Button>
                                    </div>
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-900">豆包 (ByteDance / Bytespider) 策略</span>
                                            <span className="text-[10px] bg-cyan-100 text-cyan-700 px-1.5 py-0.5 rounded font-bold uppercase">字节跳动 AI 生态</span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            针对 <code className="bg-gray-100 px-1 rounded">Bytespider</code>。
                                            允许它可以让内容进入字节跳动大模型语料库，并同步到豆包及今日头条 AI。
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant={settings.crawlerConfig['Bytespider'] === 'allow' ? 'default' : 'secondary'}
                                            size="sm"
                                            className={settings.crawlerConfig['Bytespider'] === 'allow'
                                                ? 'h-8 bg-green-500 hover:bg-green-600 text-white border-none shadow-sm'
                                                : 'h-8 bg-gray-200 text-gray-600 hover:bg-gray-300'}
                                            onClick={() => toggleCrawler('Bytespider')}
                                        >
                                            {settings.crawlerConfig['Bytespider'] === 'allow' ? '状态：已允许' : '状态：已禁止'}
                                        </Button>
                                    </div>
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-900">Anthropic (ClaudeBot) 策略</span>
                                            <span className="text-[10px] bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded font-bold uppercase">安全与精准检索</span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            针对 <code className="bg-gray-100 px-1 rounded">ClaudeBot</code>。
                                            Claude 极其重视版权和结构化内容。允许它抓取可提升您的品牌在 Claude 企业版及 Artifacts 中的展示。
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant={settings.crawlerConfig['ClaudeBot'] === 'allow' ? 'default' : 'secondary'}
                                            size="sm"
                                            className={settings.crawlerConfig['ClaudeBot'] === 'allow'
                                                ? 'h-8 bg-green-500 hover:bg-green-600 text-white border-none shadow-sm'
                                                : 'h-8 bg-gray-200 text-gray-600 hover:bg-gray-300'}
                                            onClick={() => toggleCrawler('ClaudeBot')}
                                        >
                                            {settings.crawlerConfig['ClaudeBot'] === 'allow' ? '状态：已允许' : '状态：已禁止'}
                                        </Button>
                                    </div>
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-900">Microsoft Bing / Copilot 策略</span>
                                            <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold uppercase">Copilot 核心引用</span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            针对 <code className="bg-gray-100 px-1 rounded">Bingbot</code>。
                                            允许它可以让您的网站在微软 Copilot 和 Bing 引用结果中占据一席之地。
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant={settings.crawlerConfig['Bingbot'] === 'allow' ? 'default' : 'secondary'}
                                            size="sm"
                                            className={settings.crawlerConfig['Bingbot'] === 'allow'
                                                ? 'h-8 bg-green-500 hover:bg-green-600 text-white border-none shadow-sm'
                                                : 'h-8 bg-gray-200 text-gray-600 hover:bg-gray-300'}
                                            onClick={() => toggleCrawler('Bingbot')}
                                        >
                                            {settings.crawlerConfig['Bingbot'] === 'allow' ? '状态：已允许' : '状态：已禁止'}
                                        </Button>
                                    </div>
                                </div>

                                {settings.bingOptimization?.enabled !== false && (
                                    <div className="px-4 py-3 bg-blue-50/50 border-b border-blue-100">
                                        <div className="flex items-center gap-4">
                                            <label className="text-xs font-bold text-blue-800 whitespace-nowrap outline-none">Bing 搜索验证 ID:</label>
                                            <input
                                                type="text"
                                                value={settings.bingOptimization?.verificationId || ''}
                                                onChange={(e) => setSettings(p => ({
                                                    ...p,
                                                    bingOptimization: { ...p.bingOptimization, verificationId: e.target.value }
                                                }))}
                                                className="flex-1 bg-white border border-blue-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
                                                placeholder="粘贴 bing-site-verification 的 content 值"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="p-4 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-900">Perplexity AI 策略</span>
                                            <span className="text-[10px] bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded font-bold uppercase">Real-time Citations</span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            针对 <code className="bg-gray-100 px-1 rounded">PerplexityBot</code>。
                                            允许它可以让您的实时新闻或深度分析被 Perplexity 精准引用并带回流量。
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant={settings.crawlerConfig['PerplexityBot'] === 'allow' ? 'default' : 'secondary'}
                                            size="sm"
                                            className={settings.crawlerConfig['PerplexityBot'] === 'allow'
                                                ? 'h-8 bg-green-500 hover:bg-green-600 text-white border-none shadow-sm'
                                                : 'h-8 bg-gray-200 text-gray-600 hover:bg-gray-300'}
                                            onClick={() => toggleCrawler('PerplexityBot')}
                                        >
                                            {settings.crawlerConfig['PerplexityBot'] === 'allow' ? '状态：已允许' : '状态：已禁止'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI 爬虫访问控制 */}
                    <Card className="border-gray-100 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Bot className="w-5 h-5" />
                                        AI 爬虫访问控制
                                    </CardTitle>
                                    <CardDescription>
                                        控制各大 AI 平台爬虫对网站内容的访问权限
                                    </CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={allowAll}>
                                        全部允许
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={disallowAll}>
                                        全部禁止
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {AI_CRAWLERS.map(crawler => (
                                    <div
                                        key={crawler.id}
                                        className={`p-4 rounded-lg border cursor-pointer transition-all ${settings.crawlerConfig[crawler.id] === 'allow'
                                            ? 'border-green-200 bg-green-50'
                                            : 'border-red-200 bg-red-50'
                                            }`}
                                        onClick={() => toggleCrawler(crawler.id)}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-gray-900">{crawler.name}</span>
                                            {settings.crawlerConfig[crawler.id] === 'allow' ? (
                                                <Eye className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <EyeOff className="w-4 h-4 text-red-600" />
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500">{crawler.description}</p>
                                        <div className="mt-2">
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${settings.crawlerConfig[crawler.id] === 'allow'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                                }`}>
                                                {settings.crawlerConfig[crawler.id] === 'allow' ? '已允许' : '已禁止'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* robots.txt 预览 */}
                    <Card className="border-gray-100 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <RefreshCw className="w-5 h-5" />
                                robots.txt 预览
                            </CardTitle>
                            <CardDescription>
                                根据当前配置生成的 AI 爬虫规则
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg text-sm overflow-x-auto font-mono">
                                {`# AI Crawler Rules (Generated by 企业官网 GEO)
Sitemap: ${siteUrl}/sitemap.xml

${AI_CRAWLERS.map(crawler => {
                                    const status = settings.crawlerConfig[crawler.id];
                                    return `
User-agent: ${crawler.id}
${status === 'allow' ? 'Allow: /' : 'Disallow: /'}`;
                                }).join('\n')}`}
                            </pre>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 日志面板 */}
                <TabsContent value="logs">
                    <Card className="border-gray-100 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">详细抓取日志</CardTitle>
                                    <p className="text-xs text-gray-400 mt-1">系统仅保留并显示最近 7 天内的访问记录</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => fetchLogs(logsPage)} disabled={logsLoading}>
                                    <RefreshCw className={`w-4 h-4 mr-2 ${logsLoading ? 'animate-spin' : ''}`} />
                                    刷新
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>时间</TableHead>
                                        <TableHead>爬虫</TableHead>
                                        <TableHead>路径</TableHead>
                                        <TableHead>IP</TableHead>
                                        <TableHead>状态</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="text-sm text-gray-500">
                                                {new Date(log.createdAt).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium text-gray-900">{log.crawler}</div>
                                                <div className="text-xs text-gray-400 truncate max-w-[150px]" title={log.userAgent}>
                                                    {log.userAgent}
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-[200px] truncate" title={log.path}>
                                                {log.path}
                                            </TableCell>
                                            <TableCell className="text-sm">{log.ip}</TableCell>
                                            <TableCell>
                                                {log.isAbnormal ? (
                                                    <span className="inline-flex items-center text-red-600 text-xs font-medium">
                                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                                        异常高频
                                                    </span>
                                                ) : (
                                                    <span className="text-green-600 text-xs font-medium">正常</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {!logsLoading && logs.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                                暂无抓取日志
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

                            {/* 分页控制 */}
                            {logsPagination.totalPages > 1 && (
                                <div className="flex items-center justify-between mt-6">
                                    <div className="text-sm text-gray-500">
                                        共 {logsPagination.total} 条记录，当前第 {logsPage}/{logsPagination.totalPages} 页
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => fetchLogs(logsPage - 1)}
                                            disabled={logsPage <= 1 || logsLoading}
                                        >
                                            上一页
                                        </Button>
                                        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-md border border-gray-100">
                                            {Array.from({ length: Math.min(5, logsPagination.totalPages) }).map((_, i) => {
                                                const pageNum = i + 1; // 简化处理，只显示前几页或简单的逻辑
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => fetchLogs(pageNum)}
                                                        className={`px-3 py-1 text-xs font-bold rounded ${logsPage === pageNum ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                            {logsPagination.totalPages > 5 && <span className="text-gray-300 text-xs px-2">...</span>}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => fetchLogs(logsPage + 1)}
                                            disabled={logsPage >= logsPagination.totalPages || logsLoading}
                                        >
                                            下一页
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
