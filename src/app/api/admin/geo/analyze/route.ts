import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getAIServiceForUseCase } from '@/lib/ai/service';

export interface GEOAnalysisResult {
    score: number; // 0-100
    suggestions: Array<{
        type: 'info' | 'warning' | 'success' | 'error';
        category: string;
        title: string;
        description: string;
    }>;
    structuredDataStatus: {
        hasArticleSchema: boolean;
        hasBreadcrumb: boolean;
        hasAuthor: boolean;
        hasFAQ: boolean;
    };
    contentAnalysis: {
        wordCount: number;
        hasHeadings: boolean;
        hasLists: boolean;
        hasImages: boolean;
        readabilityScore: number;
    };
}

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { title, content, summary } = await request.json();

        if (!content) {
            return NextResponse.json({ error: '内容不能为空' }, { status: 400 });
        }

        const suggestions: GEOAnalysisResult['suggestions'] = [];
        let score = 50; // 基础分

        // ==================== 内容分析 ====================
        const wordCount = content.replace(/<[^>]*>/g, '').length;
        const hasHeadings = /<h[1-6]/i.test(content);
        const hasLists = /<(ul|ol)/i.test(content);
        const hasImages = /<img/i.test(content);

        // 计算可读性
        const sentences = content.replace(/<[^>]*>/g, '').split(/[。！？.!?]/).filter((s: string) => s.trim());
        const avgSentenceLength = sentences.length > 0 ? wordCount / sentences.length : 0;
        const readabilityScore = Math.max(0, Math.min(100, 100 - Math.abs(avgSentenceLength - 20) * 2));

        // ==================== 生成建议 ====================

        // 标题检查
        if (!title || title.length < 10) {
            suggestions.push({
                type: 'warning',
                category: '标题优化',
                title: '标题太短',
                description: '建议标题长度在 15-60 字符之间，以便在搜索结果中完整显示'
            });
        } else if (title.length > 60) {
            suggestions.push({
                type: 'warning',
                category: '标题优化',
                title: '标题可能被截断',
                description: '标题超过 60 字符可能在搜索结果中被截断'
            });
        } else {
            score += 5;
            suggestions.push({
                type: 'success',
                category: '标题优化',
                title: '标题长度适中',
                description: '标题长度在推荐范围内'
            });
        }

        // 摘要检查
        if (!summary || summary.length < 50) {
            suggestions.push({
                type: 'warning',
                category: '元描述',
                title: '添加文章摘要',
                description: '添加 100-160 字的摘要可以提高在 AI 搜索结果中的展示效果'
            });
        } else {
            score += 10;
            suggestions.push({
                type: 'success',
                category: '元描述',
                title: '摘要已填写',
                description: '摘要有助于 AI 理解文章核心内容'
            });
        }

        // 内容长度
        if (wordCount < 500) {
            suggestions.push({
                type: 'warning',
                category: '内容深度',
                title: '内容较短',
                description: 'AI 搜索引擎倾向于推荐更全面、深入的内容，建议扩充至 800 字以上'
            });
        } else if (wordCount >= 1500) {
            score += 15;
            suggestions.push({
                type: 'success',
                category: '内容深度',
                title: '内容充实',
                description: '文章内容充实，有利于获得 AI 搜索引擎的青睐'
            });
        } else {
            score += 8;
        }

        // 结构检查
        if (!hasHeadings) {
            suggestions.push({
                type: 'error',
                category: '内容结构',
                title: '缺少标题结构',
                description: '使用 H2、H3 等标题来组织内容，帮助 AI 理解文章结构'
            });
        } else {
            score += 10;
            suggestions.push({
                type: 'success',
                category: '内容结构',
                title: '标题结构良好',
                description: '文章使用了标题标签来组织内容'
            });
        }

        if (!hasLists) {
            suggestions.push({
                type: 'info',
                category: '内容结构',
                title: '考虑添加列表',
                description: '使用项目符号或编号列表可以提高内容的可扫描性'
            });
        } else {
            score += 5;
        }

        // FAQ 检查
        const hasFAQ = content.includes('?') && (content.match(/\?/g) || []).length >= 3;
        if (hasFAQ) {
            score += 10;
            suggestions.push({
                type: 'success',
                category: 'AI 优化',
                title: '内容包含问答结构',
                description: '检测到问答模式，建议使用 FAQ 结构化数据进行标注，这能显著提高在 AI 摘要中的曝光'
            });
        }

        // 图片检查
        if (!hasImages) {
            suggestions.push({
                type: 'info',
                category: '多媒体',
                title: '添加相关图片',
                description: '配图可以提升用户体验和内容理解度'
            });
        } else {
            score += 5;
        }

        // 开头段落检查 - 直接答案优化
        const firstParagraphMatch = content.match(/<p[^>]*>(.*?)<\/p>/i);
        const firstParagraph = firstParagraphMatch ? firstParagraphMatch[1].replace(/<[^>]*>/g, '') : '';

        if (firstParagraph.length < 100) {
            suggestions.push({
                type: 'warning',
                category: 'AI 优化',
                title: '优化开头段落',
                description: '开头段落应该直接回答核心问题，这是 AI 搜索最可能引用的部分'
            });
        } else {
            score += 10;
            suggestions.push({
                type: 'success',
                category: 'AI 优化',
                title: '开头段落充实',
                description: '有充实的开头段落有利于被 AI 引用'
            });
        }

        // ==================== 平台专项建议 ====================
        suggestions.push({
            type: 'info',
            category: 'DeepSeek 优化',
            title: '强化逻辑推导',
            description: 'DeepSeek 擅长逻辑推理，建议在内容中使用“首先...其次...最后...”或代码块来增强结构性'
        });

        suggestions.push({
            type: 'info',
            category: '豆包/字节优化',
            title: '精炼核心摘要',
            description: '豆包倾向于快节奏抓取，确保摘要包含高频垂直词汇，有利于进入字节跳动兴趣推荐算法'
        });

        // 确保分数在范围内
        score = Math.min(100, Math.max(0, score));

        const result: GEOAnalysisResult = {
            score,
            suggestions,
            structuredDataStatus: {
                hasArticleSchema: true, // 系统会自动添加
                hasBreadcrumb: true,
                hasAuthor: true,
                hasFAQ: hasFAQ
            },
            contentAnalysis: {
                wordCount,
                hasHeadings,
                hasLists,
                hasImages,
                readabilityScore: Math.round(readabilityScore)
            }
        };

        return NextResponse.json(result);

    } catch (error) {
        console.error('GEO analysis error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : '分析失败' },
            { status: 500 }
        );
    }
}
