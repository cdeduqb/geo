import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { getAIServiceForUseCase } from '@/lib/ai/service';

/**
 * 抓取网页内容（增强版）
 */
async function fetchWebContent(url: string): Promise<{
    success: boolean;
    title?: string;
    description?: string;
    keywords?: string;
    content?: string;
    wordCount?: number;
    headings?: { level: number; text: string }[];
    links?: { internal: number; external: number };
    images?: number;
    loadTime?: number;
    error?: string;
}> {
    const startTime = Date.now();
    try {
        const fullUrl = url.startsWith('http') ? url : `https://${url}`;

        const response = await fetch(fullUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; Molicms/1.0; +https://molicms.com)',
                'Accept': 'text/html,application/xhtml+xml',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
            },
            signal: AbortSignal.timeout(15000)
        });

        const loadTime = Date.now() - startTime;

        if (!response.ok) {
            return { success: false, error: `HTTP ${response.status}`, loadTime };
        }

        const html = await response.text();

        // 提取标题
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : '';

        // 提取 meta description
        const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
            html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
        const description = descMatch ? descMatch[1].trim() : '';

        // 提取 meta keywords
        const keywordsMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["']/i) ||
            html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']keywords["']/i);
        const keywords = keywordsMatch ? keywordsMatch[1].trim() : '';

        // 提取所有标题（H1-H6）
        const headingMatches = [...html.matchAll(/<h([1-6])[^>]*>([^<]*(?:<[^/][^>]*>[^<]*)*)<\/h\1>/gi)];
        const headings = headingMatches.map(m => ({
            level: parseInt(m[1]),
            text: m[2].replace(/<[^>]+>/g, '').trim()
        })).filter(h => h.text).slice(0, 20);

        // 统计链接
        const allLinks = [...html.matchAll(/<a[^>]+href=["']([^"']+)["']/gi)];
        const internalLinks = allLinks.filter(m => !m[1].startsWith('http') || m[1].includes(new URL(fullUrl).hostname)).length;
        const externalLinks = allLinks.length - internalLinks;

        // 统计图片
        const imageCount = (html.match(/<img[^>]+>/gi) || []).length;

        // 提取正文内容
        let content = html
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
            .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
            .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
            .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        content = content.substring(0, 8000);
        const wordCount = content.length;

        return {
            success: true,
            title,
            description,
            keywords,
            content,
            wordCount,
            headings,
            links: { internal: internalLinks, external: externalLinks },
            images: imageCount,
            loadTime
        };
    } catch (error: any) {
        const loadTime = Date.now() - startTime;
        console.error(`[fetchWebContent] 抓取 ${url} 失败:`, error.message);
        return { success: false, error: error.message, loadTime };
    }
}

/**
 * 抓取多个页面
 */
async function crawlWebsite(domain: string, keyword: string): Promise<{
    domain: string;
    pages: any[];
    aggregated: {
        totalWords: number;
        avgLoadTime: number;
        h1Count: number;
        hasKeywordInTitle: boolean;
        hasKeywordInDesc: boolean;
        linksInternal: number;
        linksExternal: number;
        imageCount: number;
    };
}> {
    const pages: any[] = [];
    const urlsToTry = [
        domain,
        `${domain}/blog`,
        `${domain}/articles`,
        `${domain}/news`,
        `${domain}/products`,
        `${domain}/services`
    ];

    for (const url of urlsToTry) {
        const result = await fetchWebContent(url);
        if (result.success) {
            pages.push({
                url,
                ...result
            });
        }
        // 限制抓取数量
        if (pages.length >= 3) break;
    }

    // 聚合统计
    const totalWords = pages.reduce((sum, p) => sum + (p.wordCount || 0), 0);
    const avgLoadTime = pages.length > 0
        ? Math.round(pages.reduce((sum, p) => sum + (p.loadTime || 0), 0) / pages.length)
        : 0;
    const h1Count = pages.reduce((sum, p) => sum + (p.headings?.filter((h: any) => h.level === 1).length || 0), 0);
    const hasKeywordInTitle = pages.some(p => p.title?.toLowerCase().includes(keyword.toLowerCase()));
    const hasKeywordInDesc = pages.some(p => p.description?.toLowerCase().includes(keyword.toLowerCase()));
    const linksInternal = pages.reduce((sum, p) => sum + (p.links?.internal || 0), 0);
    const linksExternal = pages.reduce((sum, p) => sum + (p.links?.external || 0), 0);
    const imageCount = pages.reduce((sum, p) => sum + (p.images || 0), 0);

    return {
        domain,
        pages,
        aggregated: {
            totalWords,
            avgLoadTime,
            h1Count,
            hasKeywordInTitle,
            hasKeywordInDesc,
            linksInternal,
            linksExternal,
            imageCount
        }
    };
}

/**
 * 计算关键词密度
 */
function calculateKeywordDensity(content: string, keyword: string): number {
    if (!content || !keyword) return 0;
    const contentLower = content.toLowerCase();
    const keywordLower = keyword.toLowerCase();
    const matches = contentLower.split(keywordLower).length - 1;
    const totalWords = content.split(/\s+/).length;
    return totalWords > 0 ? Math.round((matches / totalWords) * 1000) / 10 : 0;
}

/**
 * POST /api/admin/geo/competitor
 * 增强版竞品分析
 */
export async function POST(req: NextRequest) {
    try {
        await requireAdmin();
        const { keyword, competitors = [] } = await req.json();

        if (!keyword) {
            return NextResponse.json({ error: '请输入分析关键词' }, { status: 400 });
        }

        // 1. 获取本站数据
        const ourArticles = await db.article.findMany({
            where: {
                status: 'PUBLISHED',
                OR: [
                    { title: { contains: keyword } },
                    { content: { contains: keyword } },
                    { summary: { contains: keyword } }
                ]
            },
            select: {
                id: true,
                title: true,
                summary: true,
                content: true,
                entities: true,
                citations: true
            },
            take: 20
        });

        const ourContentStats = {
            articleCount: ourArticles.length,
            totalWords: ourArticles.reduce((acc, a) => acc + (a.content?.length || 0), 0),
            entitiesCount: ourArticles.reduce((acc, a) => acc + (Array.isArray(a.entities) ? a.entities.length : 0), 0),
            citationsCount: ourArticles.reduce((acc, a) => acc + (Array.isArray(a.citations) ? a.citations.length : 0), 0),
            titles: ourArticles.map(a => a.title).slice(0, 5),
            keywordDensity: ourArticles.length > 0
                ? calculateKeywordDensity(ourArticles.map(a => a.content || '').join(' '), keyword)
                : 0
        };

        // 2. 抓取竞品网站（增强版）
        const competitorData: any[] = [];

        if (competitors.length > 0) {
            console.log('[CompetitorAnalysis] 开始深度抓取竞品网站...');

            for (const domain of competitors.slice(0, 5)) {
                const cleanDomain = domain.trim();
                if (!cleanDomain) continue;

                const crawlResult = await crawlWebsite(cleanDomain, keyword);
                competitorData.push(crawlResult);

                console.log(`[CompetitorAnalysis] 抓取 ${cleanDomain}: ${crawlResult.pages.length} 页面, ${crawlResult.aggregated.totalWords} 字`);
            }
        }

        // 3. 构建分析 prompt
        const aiService = await getAIServiceForUseCase('GENERAL');

        const competitorSummaries = competitorData.map(c => `
### ${c.domain}
- 抓取页面数: ${c.pages.length}
- 总字数: ${c.aggregated.totalWords}
- 平均加载时间: ${c.aggregated.avgLoadTime}ms
- H1 标签数: ${c.aggregated.h1Count}
- 标题含关键词: ${c.aggregated.hasKeywordInTitle ? '是' : '否'}
- 描述含关键词: ${c.aggregated.hasKeywordInDesc ? '是' : '否'}
- 内链数量: ${c.aggregated.linksInternal}
- 外链数量: ${c.aggregated.linksExternal}
- 图片数量: ${c.aggregated.imageCount}
- 首页标题: ${c.pages[0]?.title || '未知'}
- 首页描述: ${c.pages[0]?.description?.substring(0, 100) || '无'}
`).join('\n');

        const analysisPrompt = `
你是资深的 GEO (Generative Engine Optimization) 和 SEO 专家。
请基于以下**真实抓取的数据**进行深度竞品分析：

## 分析关键词: "${keyword}"

## 本站数据:
- 相关文章: ${ourContentStats.articleCount} 篇
- 总字数: ${Math.round(ourContentStats.totalWords / 1000)}k
- 实体标注: ${ourContentStats.entitiesCount} 个
- 引用来源: ${ourContentStats.citationsCount} 个
- 关键词密度: ${ourContentStats.keywordDensity}%
- 代表文章: ${ourContentStats.titles.slice(0, 3).join('、') || '无'}

## 竞品抓取数据:
${competitorSummaries || '（用户未指定竞品）'}

## 分析任务:

1. **GEO 竞争力评分** (基于真实数据):
   - 本站提及占有率 (0-100): 根据内容量、关键词覆盖估算
   - 本站权威度 (0-100): 根据引用、实体、内容深度评估
   - 给出评价说明

2. **竞品逐一评分** (仅分析用户指定的竞品):
${competitors.length > 0
                ? competitors.map((c: string) => `   - ${c}: 根据抓取数据评估其 GEO 表现`).join('\n')
                : '   - 无指定竞品，返回空数组'}

3. **SEO 对比分析**:
   - 关键词布局对比
   - 内容深度对比
   - 技术 SEO 对比（加载速度、标签使用等）

4. **内容缺口** (具体可执行):
   - 本站相比竞品缺少的内容类型
   - 建议新增的文章主题

5. **战略建议**:
   - 短期行动（1周内可完成）
   - 中期目标（1个月内）

请返回 JSON:
{
    "ourStats": { 
        "mentionShare": 0-100, 
        "authority": 0-100,
        "analysis": "评价说明"
    },
    "competitorStats": [
        { "name": "域名", "mentionShare": 0-100, "authority": 0-100, "strengths": "优势", "weaknesses": "劣势" }
    ],
    "seoComparison": {
        "keywordOptimization": "关键词优化对比分析",
        "contentDepth": "内容深度对比分析",
        "technicalSeo": "技术SEO对比分析"
    },
    "contentGap": ["具体缺口1", "具体缺口2", "具体缺口3"],
    "recommendation": {
        "shortTerm": "短期行动建议",
        "midTerm": "中期目标建议"
    }
}`;

        const response = await aiService.generateContent(analysisPrompt, { response_format: { type: 'json_object' } });

        let analysis;
        try {
            const cleanedResponse = response.replace(/```json|```/g, '').trim();
            analysis = JSON.parse(cleanedResponse);
        } catch (parseError) {
            console.error('[CompetitorAnalysis] JSON 解析失败:', response);
            return NextResponse.json({ error: 'AI 返回的数据格式无效' }, { status: 500 });
        }

        // 确保数据结构完整
        console.log('[CompetitorAnalysis] AI 原始返回:', JSON.stringify(analysis).substring(0, 500));

        if (!analysis.ourStats) {
            analysis.ourStats = { mentionShare: 0, authority: 50, analysis: '数据不足' };
        }
        // 确保 ourStats 数值类型正确
        analysis.ourStats.mentionShare = Number(analysis.ourStats.mentionShare) || 0;
        analysis.ourStats.authority = Number(analysis.ourStats.authority) || 50;

        if (!analysis.competitorStats || !Array.isArray(analysis.competitorStats)) {
            analysis.competitorStats = [];
        }

        // 过滤掉无效的竞品条目（空对象、字符串等）
        analysis.competitorStats = analysis.competitorStats.filter((stat: any) =>
            stat && typeof stat === 'object' && (stat.name || stat.domain) && Object.keys(stat).length > 1
        );

        // 检查 AI 是否把竞品数据放在了根级别（常见的 AI 输出错误）
        // 包括直接用域名作为 key 的情况，如 "aigeotool.com": {...}
        if (analysis.competitorStats.length === 0) {
            // 方式1：检查 analysis.name 字段
            if (analysis.name && typeof analysis.name === 'string' && analysis.name.includes('.')) {
                console.log('[CompetitorAnalysis] 检测到竞品数据在根级别 (name)，正在修复...');
                // 查找对应的抓取数据来估算数值
                const crawledData = competitorData.find((c: any) => c.domain === analysis.name);
                const hasContent = crawledData?.aggregated?.totalWords > 0;
                const hasKeyword = crawledData?.aggregated?.hasKeywordInTitle || crawledData?.aggregated?.hasKeywordInDesc;

                analysis.competitorStats = [{
                    name: analysis.name,
                    // 优先使用 AI 返回的值，否则基于抓取数据估算
                    mentionShare: Number(analysis.mentionShare) || (hasContent ? (hasKeyword ? 35 : 20) : 15),
                    authority: Number(analysis.authority) || (hasContent ? Math.min(50, Math.floor(crawledData.aggregated.totalWords / 500) + 20) : 20),
                    strengths: analysis.strengths || (crawledData ? `加载速度 ${crawledData.aggregated.avgLoadTime}ms` : ''),
                    weaknesses: analysis.weaknesses || (!hasKeyword ? '标题/描述未包含目标关键词' : '')
                }];
            }
            // 方式2：检查是否有域名作为 key
            else {
                for (const comp of competitors) {
                    const domainKey = comp.trim();
                    if (analysis[domainKey] && typeof analysis[domainKey] === 'object') {
                        console.log(`[CompetitorAnalysis] 检测到竞品数据在根级别 (${domainKey})，正在修复...`);
                        const data = analysis[domainKey];
                        analysis.competitorStats.push({
                            name: domainKey,
                            mentionShare: Number(data.mentionShare) || Number(analysis.mentionShare) || 20,
                            authority: Number(data.authority) || Number(analysis.authority) || 30,
                            strengths: data.strengths || analysis.strengths || '',
                            weaknesses: data.weaknesses || analysis.weaknesses || ''
                        });
                    }
                }
            }
        }

        // 最后的保底：使用抓取数据
        if (analysis.competitorStats.length === 0 && competitorData.length > 0) {
            console.log('[CompetitorAnalysis] 使用抓取数据生成竞品统计...');
            analysis.competitorStats = competitorData.map((c: any) => {
                const hasContent = c.aggregated?.totalWords > 0;
                const hasKeyword = c.aggregated?.hasKeywordInTitle || c.aggregated?.hasKeywordInDesc;
                return {
                    name: c.domain,
                    mentionShare: hasContent ? (hasKeyword ? 35 : 20) : 10,
                    authority: hasContent ? Math.min(60, Math.floor(c.aggregated.totalWords / 500) + 20) : 15,
                    strengths: hasContent ? `加载速度 ${c.aggregated.avgLoadTime}ms，内链 ${c.aggregated.linksInternal} 个` : '待分析',
                    weaknesses: !hasKeyword ? '标题/描述未包含目标关键词' : (c.aggregated?.h1Count === 0 ? '缺少H1标签' : '待分析')
                };
            });
        }

        // 确保数值类型正确
        analysis.competitorStats = analysis.competitorStats.map((stat: any) => ({
            name: String(stat.name || '').trim() || '未知',
            mentionShare: Math.min(100, Math.max(0, Number(stat.mentionShare) || 0)),
            authority: Math.min(100, Math.max(0, Number(stat.authority) || 0)),
            strengths: String(stat.strengths || ''),
            weaknesses: String(stat.weaknesses || '')
        }));

        console.log('[CompetitorAnalysis] 处理后的 competitorStats:', JSON.stringify(analysis.competitorStats));

        // 确保 contentGap 有内容
        if (!analysis.contentGap || !Array.isArray(analysis.contentGap) || analysis.contentGap.length === 0) {
            // 基于抓取数据生成内容缺口建议
            analysis.contentGap = [];
            if (ourContentStats.articleCount < 10) {
                analysis.contentGap.push(`增加关于"${keyword}"的深度文章数量`);
            }
            if (ourContentStats.citationsCount < 20) {
                analysis.contentGap.push('补充更多权威引用来源');
            }
            if (ourContentStats.entitiesCount < 50) {
                analysis.contentGap.push('加强实体标注以提升结构化程度');
            }
            if (analysis.contentGap.length === 0) {
                analysis.contentGap.push('持续产出高质量内容以保持竞争优势');
            }
        }

        // 确保 seoComparison 有内容
        if (!analysis.seoComparison || Object.keys(analysis.seoComparison).length === 0) {
            const competitorInfo = analysis.competitorStats[0];
            analysis.seoComparison = {
                keywordOptimization: ourContentStats.keywordDensity > 5
                    ? `本站关键词密度${ourContentStats.keywordDensity}%，覆盖良好`
                    : `本站关键词密度${ourContentStats.keywordDensity}%，建议适当增加`,
                contentDepth: `本站共${ourContentStats.articleCount}篇相关文章，总计${Math.round(ourContentStats.totalWords / 1000)}k字${competitorInfo ? `；竞品${competitorInfo.name}内容量较少` : ''}`,
                technicalSeo: competitorData[0]?.aggregated
                    ? `竞品平均加载速度${competitorData[0].aggregated.avgLoadTime}ms，H1标签${competitorData[0].aggregated.h1Count}个`
                    : '暂无竞品技术数据'
            };
        }

        // 确保 recommendation 有内容
        if (!analysis.recommendation ||
            (typeof analysis.recommendation === 'object' && !analysis.recommendation.shortTerm && !analysis.recommendation.midTerm)) {
            const weaknessInfo = analysis.competitorStats[0]?.weaknesses || '';
            analysis.recommendation = {
                shortTerm: ourContentStats.citationsCount < 50
                    ? '增加文章引用来源，提升内容权威性'
                    : `继续发布"${keyword}"相关的深度内容`,
                midTerm: weaknessInfo
                    ? `针对竞品劣势（${weaknessInfo.substring(0, 50)}...）强化本站优势`
                    : `建立"${keyword}"领域的内容矩阵，覆盖用户搜索意图`
            };
        }

        // 4. 保存分析历史
        try {
            await db.competitorAnalysis.create({
                data: {
                    keyword,
                    competitors: competitors,
                    ourStats: ourContentStats,
                    competitorData: competitorData,
                    analysis: analysis
                }
            });
            console.log('[CompetitorAnalysis] 分析历史已保存');
        } catch (saveError) {
            console.error('[CompetitorAnalysis] 保存历史失败:', saveError);
        }

        // 添加真实数据到响应
        analysis.realData = {
            keyword,
            ...ourContentStats
        };

        // 添加竞品抓取详情
        analysis.competitorCrawlResults = competitorData.map(c => ({
            domain: c.domain,
            pagesCount: c.pages.length,
            homeTitle: c.pages[0]?.title || null,
            homeWordCount: c.pages[0]?.wordCount || 0,
            aggregated: c.aggregated
        }));

        console.log('[CompetitorAnalysis] 分析完成，关键词:', keyword);
        return NextResponse.json({ analysis });
    } catch (error: any) {
        console.error('[CompetitorAnalysis] Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

/**
 * GET /api/admin/geo/competitor
 * 获取分析历史
 */
export async function GET(req: NextRequest) {
    try {
        await requireAdmin();

        const { searchParams } = new URL(req.url);
        const keyword = searchParams.get('keyword');
        const limit = parseInt(searchParams.get('limit') || '10');

        const where = keyword ? { keyword: { contains: keyword } } : {};

        const history = await db.competitorAnalysis.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit
        });

        return NextResponse.json({ history });
    } catch (error: any) {
        console.error('[CompetitorAnalysis] GET Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
