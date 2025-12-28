import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

// POST /api/admin/articles/audit - 审计文章质量
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, content, citations, entities } = body;

        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
        }

        // 执行内容审计
        const audit = performContentAudit(title, content, citations, entities);

        return NextResponse.json({ audit });
    } catch (error) {
        console.error('Error auditing content:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

interface AuditResult {
    overallScore: number;
    issues: AuditIssue[];
    suggestions: string[];
    metrics: {
        wordCount: number;
        paragraphCount: number;
        headingCount: number;
        imageCount: number;
        linkCount: number;
        readabilityScore: number;
        // GEO 指标
        geoScore?: number;
        citationCount?: number;
        entityCount?: number;
    };
}

interface AuditIssue {
    type: 'error' | 'warning' | 'info';
    category: string;
    message: string;
    impact: number; // 1-10, 影响程度
}

function performContentAudit(title: string, content: string, citations: any[] = [], entities: any[] = []): AuditResult {
    const issues: AuditIssue[] = [];
    const suggestions: string[] = [];

    // 去除 HTML 标签获取纯文本
    const plainText = content.replace(/<[^>]*>/g, ' ').trim();

    // 改进的字数统计逻辑（支持中英文混合）
    const cjkMatch = plainText.match(/[\u4e00-\u9fa5]/g);
    const cjkCount = cjkMatch ? cjkMatch.length : 0;
    const nonCjkText = plainText.replace(/[\u4e00-\u9fa5]/g, ' ');
    const words = nonCjkText.split(/[\s,，。.、！!？?；;：:""''《》<>（）()【】\[\]]+/).filter(w => w.length > 0);
    const wordCount = cjkCount + words.length;

    // 改进的段落提取
    const paragraphs = content.match(/<(p|div)[^>]*>.*?<\/\1>/gi) || [];
    const paragraphCount = paragraphs.length > 0 ? paragraphs.length : (content.split(/\n\s*\n/).length);

    // 提取标题
    const headings = content.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi) || [];
    const headingCount = headings.length;
    const h1Count = (content.match(/<h1[^>]*>.*?<\/h1>/gi) || []).length;

    // 提取图片
    const images = content.match(/<img[^>]*>/gi) || [];
    const imageCount = images.length;

    // 提取链接
    const links = content.match(/<a[^>]*href/gi) || [];
    const linkCount = links.length;

    // 1. 标题检查
    if (title.length < 10) {
        issues.push({
            type: 'warning',
            category: '标题',
            message: '标题过短（少于10个字符），建议增加到10-60个字符',
            impact: 7,
        });
    } else if (title.length > 60) {
        issues.push({
            type: 'warning',
            category: '标题',
            message: '标题过长（超过60个字符），可能在搜索结果中被截断',
            impact: 5,
        });
    }

    // 2. 内容长度检查
    if (wordCount < 300) {
        issues.push({
            type: 'error',
            category: '内容长度',
            message: `文章过短（${wordCount} 字），建议至少 300-500 字以提升SEO效果`,
            impact: 9,
        });
        suggestions.push('增加更多有价值的内容，深入探讨主题');
    } else if (wordCount < 500) {
        issues.push({
            type: 'info',
            category: '内容长度',
            message: `文章较短（${wordCount} 字），建议增加到 500-1000 字`,
            impact: 4,
        });
    } else {
        suggestions.push(`当前字数 ${wordCount} 字，长度适中`);
    }

    // 3. 段落检查
    if (paragraphCount < 3) {
        issues.push({
            type: 'warning',
            category: '结构',
            message: '段落数量过少，建议增加段落以提升可读性',
            impact: 6,
        });
    }

    // 4. 标题层级检查
    if (headingCount === 0) {
        issues.push({
            type: 'error',
            category: '结构',
            message: '缺少标题标签（H1-H6），不利于SEO和可读性',
            impact: 8,
        });
        suggestions.push('添加2-5个子标题（H2-H3）组织内容结构');
    } else if (headingCount < 2) {
        issues.push({
            type: 'warning',
            category: '结构',
            message: '标题标签过少，建议增加子标题',
            impact: 5,
        });
    }

    if (h1Count === 0) {
        issues.push({
            type: 'warning',
            category: '结构',
            message: '建议添加一个 H1 标题作为文章主标题',
            impact: 6,
        });
    } else if (h1Count > 1) {
        issues.push({
            type: 'warning',
            category: '结构',
            message: `检测到多个 H1 标题（${h1Count}个），建议只保留一个`,
            impact: 5,
        });
    }

    // 5. 图片检查
    if (imageCount === 0 && wordCount > 300) {
        issues.push({
            type: 'info',
            category: '多媒体',
            message: '文章无图片，建议添加1-3张相关图片提升用户体验',
            impact: 4,
        });
        suggestions.push('添加相关图片、图表或截图');
    }

    const imagesWithoutAlt = images.filter(img => !img.includes('alt=') || img.includes('alt=""'));
    if (imagesWithoutAlt.length > 0) {
        issues.push({
            type: 'warning',
            category: 'SEO',
            message: `有 ${imagesWithoutAlt.length} 张图片缺少 alt 属性，不利于SEO`,
            impact: 6,
        });
        suggestions.push('为所有图片添加描述性的 alt 文本');
    }

    // 6. 内链检查
    if (linkCount === 0 && wordCount > 500) {
        issues.push({
            type: 'info',
            category: '内链',
            message: '文章无内部链接，建议添加2-3个相关文章链接',
            impact: 5,
        });
        suggestions.push('使用右侧的"智能内链推荐"添加相关文章链接');
    } else if (linkCount > 0 && linkCount < 3 && wordCount > 800) {
        suggestions.push(`已有 ${linkCount} 个链接，可考虑添加更多站内链接`);
    }

    // 7. 可读性评分
    const avgWordsPerParagraph = paragraphCount > 0 ? wordCount / paragraphCount : 0;
    let readabilityScore = 100;

    if (avgWordsPerParagraph > 100) {
        readabilityScore -= 20;
        issues.push({
            type: 'warning',
            category: '可读性',
            message: '段落过长（平均超过100字/段），建议分成更小的段落',
            impact: 5,
        });
    }

    if (headingCount < wordCount / 200) {
        readabilityScore -= 15;
    }

    // 8. SEO 最佳实践
    if (!content.includes('<strong>') && !content.includes('<b>')) {
        issues.push({
            type: 'info',
            category: 'SEO',
            message: '未使用加粗文本，建议重点关键词加粗',
            impact: 3,
        });
    }

    // --- GEO 评分逻辑 (MAX 100, 独立于 Overall Score) ---
    let geoScore = 60; // 基础分
    const citationCount = citations.length;
    const entityCount = entities.length;

    // 1. 权威性 (Citations)
    if (citationCount > 0) {
        geoScore += 10;
    } else {
        issues.push({
            type: 'info',
            category: 'GEO/权威性',
            message: '文章未包含引用来源，建议添加参考资料以提升 AI 信任度',
            impact: 5
        });
        suggestions.push('添加至少1个权威引用来源 (Citations)');
    }

    // 2. 知识图谱 (Entities)
    if (entityCount > 0) {
        geoScore += 10;
    } else {
        issues.push({
            type: 'info',
            category: 'GEO/实体',
            message: '未标记关键实体，建议标记品牌、人物或地名',
            impact: 5
        });
        suggestions.push('使用实体管理工具标记关键实体');
    }

    // 3. 数据密度 (Data Density)
    const dataDensityMatch = content.match(/\d+(\.\d+)?%?|第[一二三四五六七八九十]/g);
    const dataCount = dataDensityMatch ? dataDensityMatch.length : 0;
    if (dataCount > 3) {
        geoScore += 10;
    } else {
        suggestions.push('增加具体数据、统计数字或百分比，AI 偏好事实性内容');
    }

    // 4. 结构化特征 (Lists/Tables)
    const hasTable = content.includes('<table');
    const hasList = content.includes('<ul') || content.includes('<ol');
    if (hasTable || hasList) {
        geoScore += 5;
    } else {
        suggestions.push('使用列表或表格展示信息，利于 AI 提取结构化数据');
    }

    // 5. FAQ 模块检测
    const hasFAQ = content.includes('FAQ') || content.includes('常见问题') || content.includes('问答');
    if (hasFAQ) {
        geoScore += 5;
    } else {
        suggestions.push('增加 FAQ 章节，直接解答用户高频疑问，提升 AI 引用率');
    }

    // 6. 直接回答 (Direct Answer) 检查
    const headSection = content.substring(0, 800);
    const hasStrongInHead = headSection.includes('<strong>') || headSection.includes('<b>');
    if (hasStrongInHead && headSection.length > 100) {
        geoScore += 10;
    } else {
        issues.push({
            type: 'info',
            category: 'GEO/直接回答',
            message: '文章开头未检测到加粗的直接回答段落',
            impact: 4
        });
        suggestions.push('在文章开头增加 50-100 字的摘要，并加粗核心结论');
    }

    geoScore = Math.min(100, geoScore);

    // 计算总体得分 (权重 20% GEO)
    let overallScore = 100;
    issues.forEach(issue => {
        if (issue.type === 'error') {
            overallScore -= issue.impact * 1.5;
        } else if (issue.type === 'warning') {
            overallScore -= issue.impact;
        } else {
            overallScore -= issue.impact * 0.5;
        }
    });

    overallScore = Math.max(0, Math.min(100, overallScore));
    overallScore = (overallScore * 0.8) + (geoScore * 0.2);
    overallScore = Math.round(overallScore);

    return {
        overallScore,
        issues,
        suggestions,
        metrics: {
            wordCount,
            paragraphCount,
            headingCount,
            imageCount,
            linkCount,
            readabilityScore: Math.round(readabilityScore),
            geoScore,
            citationCount,
            entityCount
        },
    };
}
