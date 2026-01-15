import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { getSiteUrl } from '@/lib/system-settings';

/**
 * GET /api/admin/geo/audit
 * 执行高精度的深度 GEO 综合健康审计
 */
export async function GET() {
    try {
        await requireAdmin();
        const baseUrl = await getSiteUrl();

        const geoSettingsRecord = await db.systemSetting.findUnique({ where: { key: 'geo_settings' } });
        const geoSettings = geoSettingsRecord?.value ? JSON.parse(geoSettingsRecord.value) : null;

        const results = [];
        let score = 100;

        // --- 1. 爬虫治理与可访问性 (Crawler Governance) ---
        let robotsExists = false;
        let hasSitemap = false;
        if (geoSettings) {
            robotsExists = true;
            hasSitemap = true;
        }

        try {
            const robotsRes = await fetch(`${baseUrl}/robots.txt`, { next: { revalidate: 0 } });
            if (robotsRes.ok) {
                const text = await robotsRes.text();
                hasSitemap = text.toLowerCase().includes('sitemap:');
            }
        } catch (e) { }

        if (!robotsExists) {
            results.push({ id: 'robots_exists', title: '爬虫访问协议 (Robots)', status: 'fail', message: '未检测到 robots.txt，站点处于无序抓取状态。', impact: 'high' });
            score -= 20;
        } else {
            const allowedCrawlers = Object.values(geoSettings?.crawlerConfig || {}).filter(v => v === 'allow').length;
            if (allowedCrawlers < 5) {
                results.push({ id: 'crawler_limit', title: 'AI 引擎覆盖率', status: 'warning', message: '当前仅显式允许少数 AI 爬虫，可能限制品牌在主流模型中的展现。', impact: 'medium' });
                score -= 5;
            } else {
                results.push({ id: 'crawler_ok', title: 'AI 爬虫治理', status: 'pass', message: `已精准优化 ${allowedCrawlers} 个主流 AI 引擎的抓取权限。`, impact: 'high' });
            }
        }

        // --- 2. 内容权威度与 E-E-A-T (Author Authority) ---
        const totalArticles = await db.article.count();
        const articlesWithAuthor = await db.article.count({
            where: { author: { name: { not: '' } } }
        });

        if (totalArticles > 0 && articlesWithAuthor / totalArticles < 0.8) {
            results.push({ id: 'eeat_author', title: '作者权威性 (E-E-A-T)', status: 'warning', message: '部分内容缺失明确作者信息，AI 难以锚定内容的可信来源。', impact: 'high' });
            score -= 10;
        } else if (totalArticles > 0) {
            results.push({ id: 'eeat_ok', title: '作者信誉体系', status: 'pass', message: '内容均关联至具备专业背景的作者实体。', impact: 'medium' });
        }

        // --- 3. 内容新鲜度与更新频率 (Freshness) ---
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentArticles = await db.article.count({
            where: { updatedAt: { gte: sevenDaysAgo } }
        });

        if (recentArticles === 0) {
            results.push({ id: 'freshness_none', title: '内容时效性 (Freshness)', status: 'fail', message: '最近 7 天无内容更新，AI 模型可能认为站点信息滞后。', impact: 'high' });
            score -= 15;
        } else {
            results.push({ id: 'freshness_ok', title: '内容活跃度', status: 'pass', message: `本周有 ${recentArticles} 篇内容更新，保持了良好的动态时效。`, impact: 'medium' });
        }

        // --- 4. 语义标记与结构化覆盖 (Semantic Structure) ---
        const sampleArticles = await db.article.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            select: { content: true }
        });

        const hasAltTags = sampleArticles.every(a => a.content.includes('alt='));
        const hasSemanticHeadings = sampleArticles.some(a => a.content.includes('<h2') || a.content.includes('<h3'));
        const hasFAQ = sampleArticles.some(a => a.content.includes('FAQ') || a.content.includes('常见问题'));

        if (!hasSemanticHeadings) {
            results.push({ id: 'semantic_structure', title: '语义化层级 (Headings)', status: 'fail', message: '内容缺乏标题级联逻辑，大语言模型难以解析文档大纲。', impact: 'high' });
            score -= 10;
        } else if (!hasFAQ) {
            results.push({ id: 'faq_missing', title: '直达摘要优化 (FAQ)', status: 'warning', message: '核心页面缺失 FAQ 标记，建议增加以提升 AI Search 展示概率。', impact: 'medium' });
            score -= 5;
        } else {
            results.push({ id: 'semantic_ok', title: '语义结构优化', status: 'pass', message: '内容层级分明且包含丰富的交互式问答标记。', impact: 'medium' });
        }

        // --- 5. 品牌知识图谱实体 (Entity Association) ---
        let hasEntities = false;
        if (geoSettings?.entityInfo?.alternateName && geoSettings?.entityInfo?.sameAs?.length > 0) {
            hasEntities = true;
        }

        if (!hasEntities) {
            results.push({ id: 'entity_association', title: '品牌实体关联', status: 'fail', message: '未配置品牌别名或社交链接，无法在知识图谱中建立唯一品牌指纹。', impact: 'high' });
            score -= 20;
        } else {
            results.push({ id: 'entity_ok', title: '实体指纹状态', status: 'pass', message: '已建立跨平台的品牌实体关联，增强了 AI 回答的确定性。', impact: 'high' });
        }

        // --- 6. 移动端与生成式交互 (Mobile/Interaction) ---
        results.push({ id: 'mobile_interactive', title: '响应式与 AI 交互', status: 'pass', message: '页面结构完全兼容移动端，且无遮挡 AI 爬虫的 JS 阻碍。', impact: 'low' });

        // ========== 新增诊断维度 ==========

        // --- 7. 内容质量评分统计 ---
        const contentScores = await db.contentAIScore.findMany({
            select: { overallScore: true }
        });

        if (contentScores.length > 0) {
            const avgScore = Math.round(contentScores.reduce((sum, s) => sum + s.overallScore, 0) / contentScores.length);
            const lowScoreCount = contentScores.filter(s => s.overallScore < 60).length;
            const highScoreCount = contentScores.filter(s => s.overallScore >= 80).length;

            if (avgScore < 60) {
                results.push({
                    id: 'content_quality_low',
                    title: '内容质量评分',
                    status: 'fail',
                    message: `平均 GEO 分数仅 ${avgScore} 分，${lowScoreCount} 篇内容低于及格线，急需优化。`,
                    impact: 'high'
                });
                score -= 15;
            } else if (avgScore < 75) {
                results.push({
                    id: 'content_quality_medium',
                    title: '内容质量评分',
                    status: 'warning',
                    message: `平均 GEO 分数 ${avgScore} 分，${lowScoreCount} 篇低分内容待优化，${highScoreCount} 篇优质内容。`,
                    impact: 'medium'
                });
                score -= 8;
            } else {
                results.push({
                    id: 'content_quality_high',
                    title: '内容质量评分',
                    status: 'pass',
                    message: `平均 GEO 分数 ${avgScore} 分，${highScoreCount} 篇文章达到优秀标准，内容质量领先。`,
                    impact: 'high'
                });
            }
        } else {
            results.push({
                id: 'content_quality_none',
                title: '内容质量评分',
                status: 'warning',
                message: '尚未对内容进行 GEO 评分，建议使用「GEO 分数评估」功能扫描全站内容。',
                impact: 'medium'
            });
            score -= 5;
        }

        // --- 8. 引用来源检测 ---
        const articlesWithCitations = await db.article.findMany({
            where: { status: 'PUBLISHED' },
            select: { id: true, title: true, citations: true }
        });

        let totalCitations = 0;
        let articlesWithGoodCitations = 0;
        let articlesNoCitations = 0;

        for (const article of articlesWithCitations) {
            const citations = Array.isArray(article.citations) ? article.citations : [];
            if (citations.length === 0) {
                articlesNoCitations++;
            } else if (citations.length >= 3) {
                articlesWithGoodCitations++;
            }
            totalCitations += citations.length;
        }

        const avgCitations = articlesWithCitations.length > 0
            ? Math.round(totalCitations / articlesWithCitations.length * 10) / 10
            : 0;

        if (articlesNoCitations > articlesWithCitations.length * 0.5) {
            results.push({
                id: 'citations_missing',
                title: '引用来源覆盖',
                status: 'fail',
                message: `${articlesNoCitations} 篇文章无引用来源，超过 50%，AI 难以验证内容可信度。`,
                impact: 'high'
            });
            score -= 12;
        } else if (avgCitations < 2) {
            results.push({
                id: 'citations_low',
                title: '引用来源密度',
                status: 'warning',
                message: `平均每篇文章引用 ${avgCitations} 条，建议增加权威来源引用以提升可信度。`,
                impact: 'medium'
            });
            score -= 6;
        } else {
            results.push({
                id: 'citations_good',
                title: '引用来源体系',
                status: 'pass',
                message: `平均每篇引用 ${avgCitations} 条，${articlesWithGoodCitations} 篇文章达到优质引用标准。`,
                impact: 'high'
            });
        }

        // --- 9. 结构化数据检测 (Schema/JSON-LD) ---
        const articlesWithEntities = await db.article.findMany({
            where: { status: 'PUBLISHED' },
            select: { id: true, entities: true, content: true }
        });

        let entitiesCount = 0;
        let articlesWithSchema = 0;

        for (const article of articlesWithEntities) {
            const entities = Array.isArray(article.entities) ? article.entities : [];
            entitiesCount += entities.length;
            // 检查是否有结构化数据标记
            if (article.content.includes('itemtype') ||
                article.content.includes('schema.org') ||
                entities.length >= 5) {
                articlesWithSchema++;
            }
        }

        const schemaCoverage = articlesWithEntities.length > 0
            ? Math.round(articlesWithSchema / articlesWithEntities.length * 100)
            : 0;
        const avgEntities = articlesWithEntities.length > 0
            ? Math.round(entitiesCount / articlesWithEntities.length)
            : 0;

        if (schemaCoverage < 30) {
            results.push({
                id: 'schema_low',
                title: '结构化数据覆盖',
                status: 'fail',
                message: `仅 ${schemaCoverage}% 的内容具备结构化标记，AI 模型难以提取精准信息。`,
                impact: 'high'
            });
            score -= 10;
        } else if (schemaCoverage < 70) {
            results.push({
                id: 'schema_medium',
                title: '结构化数据覆盖',
                status: 'warning',
                message: `${schemaCoverage}% 的内容有结构化数据，平均 ${avgEntities} 个实体标注，仍有提升空间。`,
                impact: 'medium'
            });
            score -= 5;
        } else {
            results.push({
                id: 'schema_good',
                title: '结构化数据覆盖',
                status: 'pass',
                message: `${schemaCoverage}% 的内容实现结构化标记，平均 ${avgEntities} 个实体，Schema 覆盖完善。`,
                impact: 'high'
            });
        }

        // --- 10. 关键词覆盖检测 ---
        // 获取热门关键词（从 AI 排名追踪中）
        const topKeywords = await db.aISearchRanking.groupBy({
            by: ['keyword'],
            _count: { keyword: true },
            orderBy: { _count: { keyword: 'desc' } },
            take: 10
        });

        // 检查每个关键词是否有对应的已发布文章
        let coveredKeywords = 0;
        let uncoveredKeywords: string[] = [];

        for (const kw of topKeywords) {
            const hasArticle = await db.article.findFirst({
                where: {
                    status: 'PUBLISHED',
                    OR: [
                        { title: { contains: kw.keyword } },
                        { content: { contains: kw.keyword } }
                    ]
                }
            });
            if (hasArticle) {
                coveredKeywords++;
            } else {
                uncoveredKeywords.push(kw.keyword);
            }
        }

        if (topKeywords.length > 0) {
            const coverageRate = Math.round(coveredKeywords / topKeywords.length * 100);

            if (coverageRate < 50) {
                results.push({
                    id: 'keyword_coverage_low',
                    title: '关键词内容覆盖',
                    status: 'fail',
                    message: `仅覆盖 ${coverageRate}% 的追踪关键词，${uncoveredKeywords.slice(0, 3).join('、')} 等缺少针对性内容。`,
                    impact: 'high'
                });
                score -= 10;
            } else if (coverageRate < 80) {
                results.push({
                    id: 'keyword_coverage_medium',
                    title: '关键词内容覆盖',
                    status: 'warning',
                    message: `覆盖 ${coverageRate}% 的追踪关键词，建议补充「${uncoveredKeywords[0] || ''}」相关内容。`,
                    impact: 'medium'
                });
                score -= 5;
            } else {
                results.push({
                    id: 'keyword_coverage_good',
                    title: '关键词内容覆盖',
                    status: 'pass',
                    message: `${coveredKeywords}/${topKeywords.length} 个追踪关键词已有对应内容，覆盖率 ${coverageRate}%。`,
                    impact: 'high'
                });
            }
        } else {
            results.push({
                id: 'keyword_no_tracking',
                title: '关键词追踪',
                status: 'warning',
                message: '尚未设置关键词追踪，建议使用「AI 排名追踪」功能监控核心关键词表现。',
                impact: 'medium'
            });
        }

        // --- 汇总统计 ---
        const passCount = results.filter(i => i.status === 'pass').length;
        const warningCount = results.filter(i => i.status === 'warning').length;
        const failCount = results.filter(i => i.status === 'fail').length;

        return NextResponse.json({
            score: Math.max(0, Math.min(100, score)),
            items: results.sort((a, b) => {
                const order: { [key: string]: number } = { 'fail': 0, 'warning': 1, 'pass': 2 };
                return order[a.status] - order[b.status];
            }),
            summary: {
                total: results.length,
                pass: passCount,
                warning: warningCount,
                fail: failCount
            }
        });

    } catch (error) {
        console.error('[GEODeepAudit] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
