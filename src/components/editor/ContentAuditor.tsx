'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, Loader2, TrendingUp, Sparkles } from 'lucide-react';

interface AuditMetrics {
    wordCount: number;
    paragraphCount: number;
    headingCount: number;
    imageCount: number;
    linkCount: number;
    readabilityScore: number;
    geoScore?: number;
    citationCount?: number;
    entityCount?: number;
}

interface AuditIssue {
    type: 'error' | 'warning' | 'info';
    category: string;
    message: string;
    impact: number;
}

interface AuditResult {
    overallScore: number;
    issues: AuditIssue[];
    suggestions: string[];
    metrics: AuditMetrics;
}

interface ContentAuditorProps {
    title: string;
    content: string;
    citations?: any[];
    entities?: any[];
}

export default function ContentAuditor({ title, content, citations = [], entities = [] }: ContentAuditorProps) {
    const [isAuditing, setIsAuditing] = useState(false);
    const [audit, setAudit] = useState<AuditResult | null>(null);

    const runAudit = async () => {
        if (!title || !content) {
            alert('请先填写标题和内容');
            return;
        }

        setIsAuditing(true);
        try {
            const res = await fetch('/api/admin/articles/audit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, citations, entities }),
            });

            const data = await res.json();
            if (res.ok) {
                setAudit(data.audit);
            } else {
                alert('审计失败：' + data.error);
            }
        } catch (error) {
            console.error('Audit error:', error);
            alert('审计失败，请重试');
        } finally {
            setIsAuditing(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 ';
        if (score >= 60) return 'text-yellow-600 ';
        return 'text-red-600 ';
    };

    const getScoreBg = (score: number) => {
        if (score >= 80) return 'bg-green-50 ';
        if (score >= 60) return 'bg-yellow-50 ';
        return 'bg-red-50 ';
    };

    const getIssueIcon = (type: string) => {
        switch (type) {
            case 'error':
                return <XCircle className="w-4 h-4 text-red-600" />;
            case 'warning':
                return <AlertCircle className="w-4 h-4 text-yellow-600" />;
            default:
                return <Info className="w-4 h-4 text-blue-600" />;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900  flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    内容质量审计
                </h3>
                {audit?.metrics.geoScore !== undefined && (
                    <div className="flex items-center gap-2 text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full border border-purple-100">
                        <Sparkles className="w-3 h-3" />
                        GEO指数: {audit.metrics.geoScore}
                    </div>
                )}
            </div>
            <div className="flex justify-end">
                <button
                    onClick={runAudit}
                    disabled={isAuditing || !title || !content}
                    className="px-3 py-1.5 text-xs font-medium text-green-600  hover:bg-green-50 :bg-green-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                    {isAuditing ? (
                        <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            审计中...
                        </>
                    ) : (
                        <>
                            <TrendingUp className="w-3 h-3" />
                            开始审计
                        </>
                    )}
                </button>
            </div>

            {audit && (
                <div className="space-y-4">
                    {/* 总体得分 */}
                    <div className={`p-4 rounded-lg ${getScoreBg(audit.overallScore)}`}>
                        <div className="text-center">
                            <div className={`text-4xl font-bold ${getScoreColor(audit.overallScore)}`}>
                                {audit.overallScore}
                            </div>
                            <div className="text-xs text-gray-600  mt-1">总体评分</div>
                        </div>
                    </div>

                    {/* 核心指标 */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 bg-gray-50  rounded">
                            <div className="text-gray-500 ">字数</div>
                            <div className="font-semibold text-gray-900 ">{audit.metrics.wordCount}</div>
                        </div>
                        <div className="p-2 bg-gray-50  rounded">
                            <div className="text-gray-500 ">段落</div>
                            <div className="font-semibold text-gray-900 ">{audit.metrics.paragraphCount}</div>
                        </div>
                        <div className="p-2 bg-gray-50  rounded">
                            <div className="text-gray-500 ">标题</div>
                            <div className="font-semibold text-gray-900 ">{audit.metrics.headingCount}</div>
                        </div>
                        <div className="p-2 bg-gray-50  rounded">
                            <div className="text-gray-500 ">图片</div>
                            <div className="font-semibold text-gray-900 ">{audit.metrics.imageCount}</div>
                        </div>
                    </div>

                    {/* GEO 指标 */}
                    {(audit.metrics.citationCount !== undefined || audit.metrics.entityCount !== undefined) && (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="p-2 bg-purple-50 rounded">
                                <div className="text-purple-600">引用</div>
                                <div className="font-semibold text-gray-900">{audit.metrics.citationCount || 0}</div>
                            </div>
                            <div className="p-2 bg-purple-50 rounded">
                                <div className="text-purple-600">实体</div>
                                <div className="font-semibold text-gray-900">{audit.metrics.entityCount || 0}</div>
                            </div>
                        </div>
                    )}

                    {/* 问题列表 */}
                    {audit.issues.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-xs font-semibold text-gray-700 ">发现的问题</h4>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {audit.issues.map((issue, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-start gap-2 p-2 bg-gray-50  rounded text-xs"
                                    >
                                        {getIssueIcon(issue.type)}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-900 ">{issue.category}</div>
                                            <div className="text-gray-600  mt-0.5">{issue.message}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 优化建议 */}
                    {audit.suggestions.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-xs font-semibold text-gray-700 ">优化建议</h4>
                            <ul className="space-y-1 text-xs">
                                {audit.suggestions.map((suggestion, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-gray-600 ">
                                        <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                                        <span>{suggestion}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {!audit && !isAuditing && (
                <div className="text-center py-6 text-xs text-gray-500 ">
                    点击"开始审计"按钮分析内容质量
                </div>
            )}
        </div>
    );
}
