import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// POST /api/admin/articles/internal-links - 推荐内链
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { articleId, content, limit = 5 } = body;

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        // 提取关键词（简单实现：提取标题中的词和内容中的高频词）
        const keywords = extractKeywords(content);

        // 查找相关文章
        const relatedArticles = await db.article.findMany({
            where: {
                status: 'PUBLISHED',
                ...(articleId ? { id: { not: articleId } } : {}), // 排除当前文章
            },
            select: {
                id: true,
                title: true,
                slug: true,
                summary: true,
                content: true,
            },
            take: 50, // 先取 50 篇，然后计算相关度
        });

        // 计算每篇文章的相关度得分
        const scoredArticles = relatedArticles.map(article => {
            const score = calculateRelevanceScore(keywords, article);
            return {
                id: article.id,
                title: article.title,
                slug: article.slug,
                summary: article.summary,
                score,
                matchedKeywords: getMatchedKeywords(keywords, article),
            };
        });

        // 按得分排序并返回前 N 篇
        const recommendations = scoredArticles
            .filter(a => a.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);

        return NextResponse.json({ recommendations });
    } catch (error) {
        console.error('Error recommending internal links:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// 提取关键词（简化版）
function extractKeywords(text: string): string[] {
    // 去除 HTML 标签
    const cleanText = text.replace(/<[^>]*>/g, ' ');

    // 分词（简单按空格和标点分割）
    const words = cleanText
        .toLowerCase()
        .split(/[\s,，。.、！!？?；;：:""''《》<>（）()【】\[\]]+/)
        .filter(word => word.length >= 2 && word.length <= 20); // 过滤太短和太长的词

    // 统计词频
    const wordFreq: Record<string, number> = {};
    words.forEach(word => {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    // 过滤停用词（简化版）
    const stopWords = new Set([
        '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个',
        '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好',
        'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with',
        'to', 'for', 'of', 'as', 'by', 'that', 'this', 'it', 'from', 'be', 'are', 'was',
    ]);

    // 返回高频关键词（排除停用词）
    return Object.entries(wordFreq)
        .filter(([word]) => !stopWords.has(word))
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20) // 取前 20 个关键词
        .map(([word]) => word);
}

// 计算相关度得分
function calculateRelevanceScore(
    keywords: string[],
    article: { title: string; content: string; summary: string | null }
): number {
    let score = 0;
    const articleText = `${article.title} ${article.summary || ''} ${article.content}`.toLowerCase();

    keywords.forEach((keyword, index) => {
        // 标题匹配得分更高
        if (article.title.toLowerCase().includes(keyword)) {
            score += 5 * (keywords.length - index); // 排名越前的关键词权重越高
        }

        // 摘要匹配
        if (article.summary?.toLowerCase().includes(keyword)) {
            score += 3 * (keywords.length - index);
        }

        // 内容匹配
        const occurrences = (articleText.match(new RegExp(keyword, 'gi')) || []).length;
        score += Math.min(occurrences, 5) * (keywords.length - index) * 0.5; // 限制最多 5 次匹配
    });

    return score;
}

// 获取匹配的关键词
function getMatchedKeywords(
    keywords: string[],
    article: { title: string; content: string; summary: string | null }
): string[] {
    const articleText = `${article.title} ${article.summary || ''} ${article.content}`.toLowerCase();
    return keywords.filter(keyword => articleText.includes(keyword));
}
