'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Plus, Loader2, X, Wand2 } from 'lucide-react';

interface SectionConfig {
    id: string;
    type: string;
    data: Record<string, any>;
    style?: Record<string, any>;
}

interface AIRecommendation {
    type: string;
    name: string;
    reason: string;
}

interface AIRecommendPanelProps {
    currentSections: SectionConfig[];
    onAddSection: (type: string) => void;
}

// 智能分析当前页面结构并推荐组件
function analyzeAndRecommend(sections: SectionConfig[]): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];

    const hasHeader = sections.some(s => s.type.startsWith('header'));
    const hasHero = sections.some(s => s.type.startsWith('hero'));
    const hasFeatures = sections.some(s => s.type.includes('features') || s.type.includes('feature'));
    const hasCTA = sections.some(s => s.type.includes('cta'));
    const hasTestimonials = sections.some(s => s.type.includes('testimonial'));
    const hasFAQ = sections.some(s => s.type.includes('faq'));
    const hasContact = sections.some(s => s.type.includes('contact'));
    const hasFooter = sections.some(s => s.type.startsWith('footer'));
    const hasStats = sections.some(s => s.type.includes('stats'));
    const hasPricing = sections.some(s => s.type.includes('pricing'));

    // 优先推荐首屏
    if (!hasHero && sections.length === 0) {
        recommendations.push({
            type: 'hero',
            name: '首屏横幅',
            reason: '建议添加首屏区域，吸引访客注意力'
        });
    }

    // 推荐特性展示
    if (!hasFeatures && hasHero) {
        recommendations.push({
            type: 'features',
            name: '功能特性',
            reason: '展示产品/服务的核心优势'
        });
    }

    // 推荐数据统计
    if (!hasStats && sections.length >= 2) {
        recommendations.push({
            type: 'stats-01',
            name: '数据统计',
            reason: '用数据增强说服力'
        });
    }

    // 推荐客户评价
    if (!hasTestimonials && sections.length >= 3) {
        recommendations.push({
            type: 'testimonials-01',
            name: '客户评价',
            reason: '添加社会认证，增强信任'
        });
    }

    // 推荐 FAQ
    if (!hasFAQ && sections.length >= 4) {
        recommendations.push({
            type: 'faq',
            name: '常见问题',
            reason: '解答访客疑问，降低跳出率'
        });
    }

    // 推荐 CTA
    if (!hasCTA && sections.length >= 2) {
        recommendations.push({
            type: 'cta-01',
            name: '行动号召',
            reason: '引导用户采取行动'
        });
    }

    // 推荐联系表单
    if (!hasContact && sections.length >= 5) {
        recommendations.push({
            type: 'contact-01',
            name: '联系表单',
            reason: '方便访客与您取得联系'
        });
    }

    // 推荐页脚
    if (!hasFooter && sections.length >= 3) {
        recommendations.push({
            type: 'footer-01',
            name: '页脚导航',
            reason: '完善页面结构，提供导航链接'
        });
    }

    return recommendations.slice(0, 4); // 最多推荐4个
}

export default function AIRecommendPanel({ currentSections, onAddSection }: AIRecommendPanelProps) {
    const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
    const [isExpanded, setIsExpanded] = useState(true);

    useEffect(() => {
        const recs = analyzeAndRecommend(currentSections);
        setRecommendations(recs);
    }, [currentSections]);

    if (recommendations.length === 0) {
        return null;
    }

    return (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 overflow-hidden">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-3 text-sm font-medium text-purple-700 hover:bg-purple-100/50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>AI 智能推荐</span>
                    <span className="px-1.5 py-0.5 bg-purple-200 text-purple-700 rounded-full text-xs">
                        {recommendations.length}
                    </span>
                </div>
                <X
                    className={`w-4 h-4 transition-transform ${isExpanded ? '' : 'rotate-45'}`}
                />
            </button>

            {isExpanded && (
                <div className="p-3 pt-0 space-y-2">
                    <p className="text-xs text-purple-600 mb-2">
                        根据页面结构分析，建议添加以下组件：
                    </p>
                    {recommendations.map((rec, idx) => (
                        <button
                            key={idx}
                            onClick={() => onAddSection(rec.type)}
                            className="w-full flex items-center gap-3 p-2 bg-white rounded-lg border border-purple-100 hover:border-purple-300 hover:shadow-sm transition-all text-left group"
                        >
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                <Plus className="w-4 h-4 text-purple-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {rec.name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {rec.reason}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
