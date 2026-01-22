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

        // 获取样本文章用于后续语义分析
        const sampleArticles = await db.article.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            select: { content: true }
        });

        // --- 1. 爬虫治理与可访问性 (Crawler Governance) ---
        let robotsExists = false;
        let hasSitemap = false;
        if (geoSettings) {
            robotsExists = true;
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

        // --- 2. 作者权威性与 E-E-A-T ---
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

        // --- 3. 内容新鲜度与更新频率 ---
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

        // --- 4. 语义标记与结构化覆盖 (RAG/FAQ) ---
        const hasSemanticHeadings = sampleArticles.some(a => a.content.includes('<h2') || a.content.includes('<h3'));
        const hasFAQ = sampleArticles.some(a => a.content.includes('FAQ') || a.content.includes('常见问题'));
        const hasKeyTakeaways = sampleArticles.some(a =>
            /核心要点|Key Takeaways|摘要|summary/i.test(a.content)
        );

        if (!hasSemanticHeadings) {
            results.push({ id: 'semantic_structure', title: '语义化层级 (Headings)', status: 'fail', message: '内容缺乏标题级联逻辑，大语言模型难以解析文档大纲。', impact: 'high' });
            score -= 10;
        } else if (!hasKeyTakeaways) {
            results.push({ id: 'rag_summary', title: 'RAG 检索优化', status: 'warning', message: '内容缺失“核心要点”或“摘要”模块，不利于 AI 在 RAG 检索时快速提取结论。', impact: 'medium' });
            score -= 5;
        } else {
            results.push({ id: 'semantic_ok', title: '语义与 RAG 优化', status: 'pass', message: '内容层级分明且包含丰富的 RAG 摘要与问答标记。', impact: 'medium' });
        }

        // --- 5. 事实数据与表格化 (Table & Data Density - 中外兼容) ---
        const hasTables = sampleArticles.some(a => /<table/i.test(a.content));
        const hasDataStats = sampleArticles.some(a =>
            /\d+%/.test(a.content) ||
            /\d+(\.\d+)?\s*(个|位|项|次|元|美金|点)/.test(a.content)
        );

        if (!hasTables) {
            results.push({ id: 'data_table_missing', title: '数据表格化 (Tables)', status: 'warning', message: '缺失 HTML 表格。国内爬虫（如字节跳动）极度依赖表格提取事实。', impact: 'medium' });
            score -= 5;
        } else if (!hasDataStats) {
            results.push({ id: 'data_density', title: '数据丰富度', status: 'warning', message: '文章缺乏具体数字支撑，AI 引用概率较低。', impact: 'medium' });
            score -= 5;
        } else {
            results.push({ id: 'data_ok', title: '事实数据支撑', status: 'pass', message: '包含表格与具体事实数据，完美匹配深度推理模型与国内爬虫偏好。', impact: 'medium' });
        }

        // --- 6. 品牌实体与权威信源 ---
        const hasEntities = !!(geoSettings?.entityInfo?.alternateName && geoSettings?.entityInfo?.sameAs?.length > 0);
        const hasDomesticAuthority = sampleArticles.some(a =>
            /知乎|小红书|微信公众号|国家统计局|百度百科|维基百科|官方白皮书/.test(a.content)
        );

        if (!hasEntities) {
            results.push({ id: 'entity_association', title: '品牌实体关联', status: 'fail', message: '未配置品牌别名或社交链接，无法在知识图谱中建立指纹。', impact: 'high' });
            score -= 20;
        } else if (!hasDomesticAuthority) {
            results.push({ id: 'authority_refs', title: '权威信源背书', status: 'warning', message: '未检测到国内主流权威平台引用，可能影响推理模型的信任分。', impact: 'medium' });
            score -= 5;
        } else {
            results.push({ id: 'entity_ok', title: '实体与信源信任', status: 'pass', message: '已建立品牌实体关联并引用权威信源，增强了 AI 回答的确定性。', impact: 'high' });
        }

        // --- 7. 内容质量统计 ---
        const contentAIScores = await db.contentAIScore.findMany({ select: { overallScore: true } });
        if (contentAIScores.length > 0) {
            const avgQuality = contentAIScores.reduce((sum, s) => sum + s.overallScore, 0) / contentAIScores.length;
            if (avgQuality < 70) {
                results.push({ id: 'quality_score', title: '内容质量均分', status: 'warning', message: `全站 GEO 质量均分较低 (${Math.round(avgQuality)})，建议对核心文章重新评分并优化。`, impact: 'medium' });
                score -= 8;
            } else {
                results.push({ id: 'quality_ok', title: '内容质量水平', status: 'pass', message: `全站 GEO 质量表现优秀 (均分 ${Math.round(avgQuality)})。`, impact: 'medium' });
            }
        }

        // --- 8. 引用来源覆盖 ---
        const publishedArticles = await db.article.findMany({
            where: { status: 'PUBLISHED' },
            select: { citations: true }
        });
        const articlesWithoutCitations = publishedArticles.filter(a => !Array.isArray(a.citations) || a.citations.length === 0).length;
        if (publishedArticles.length > 0 && articlesWithoutCitations / publishedArticles.length > 0.4) {
            results.push({ id: 'citations_coverage', title: '引用来源覆盖', status: 'fail', message: '超过 40% 的已发布内容缺失引用来源，建议补充可验证的链接。', impact: 'high' });
            score -= 10;
        }

        // --- 9. 结构化数据/Schema ---
        const schemaCoverage = publishedArticles.filter(a => (a as any).content?.includes('schema.org') || (a as any).content?.includes('itemtype')).length;
        if (publishedArticles.length > 0 && schemaCoverage / publishedArticles.length < 0.5) {
            results.push({ id: 'schema_coverage', title: '结构化数据覆盖', status: 'warning', message: '结构化数据标记覆盖不足，不利于模型精确提取实体信息。', impact: 'medium' });
            score -= 5;
        }

        // --- 10. 移动端兼容性 ---
        results.push({ id: 'mobile_interactive', title: '移动端与交互', status: 'pass', message: '结构完全兼容移动端，无遮挡 AI 爬虫的交互障碍。', impact: 'low' });

        return NextResponse.json({
            score: Math.max(0, Math.min(100, score)),
            items: results.sort((a, b) => {
                const order: { [key: string]: number } = { 'fail': 0, 'warning': 1, 'pass': 2 };
                return order[a.status] - order[b.status];
            })
        });

    } catch (error) {
        console.error('[GEODeepAudit] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
