import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { getSiteUrl } from '@/lib/system-settings';

/**
 * 模拟 AI 视角下的网页内容
 * 提取核心文本、结构化数据和元数据，过滤掉冗余的 UI 组件、脚本和样式
 */
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        let { title, content, summary, entities, citations, url } = body;

        // 如果提供了 URL，从数据库获取文章内容
        if (url && !content) {
            // 从 URL 提取 slug（去除开头斜杠和 /articles/ 前缀）
            const slug = url.replace(/^\/?(articles\/)?/, '').replace(/\/$/, '');

            const article = await db.article.findFirst({
                where: {
                    slug: slug,
                    status: 'PUBLISHED'
                },
                select: {
                    title: true,
                    content: true,
                    summary: true,
                    entities: true,
                    citations: true
                }
            });

            if (!article) {
                return NextResponse.json({ error: `未找到已发布的文章: ${slug}。请确认文章已发布。` }, { status: 422 });
            }

            title = article.title;
            content = article.content;
            summary = article.summary;
            entities = article.entities;
            citations = article.citations;
        }

        if (!content) {
            return NextResponse.json({ error: '请提供 URL 或 content 参数' }, { status: 400 });
        }

        const baseUrl = await getSiteUrl();

        // 1. 构建纯文本版本 (AI 最容易理解)
        // 移除 HTML 标签但保留标题结构
        let markdownView = `# ${title}\n\n`;
        if (summary) {
            markdownView += `> Summary: ${summary}\n\n`;
        }

        // 简易 HTML 转 Markdown
        let bodyText = content
            .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
            .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
            .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
            .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
            .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
            .replace(/<ul[^>]*>/gi, '')
            .replace(/<\/ul>/gi, '\n')
            .replace(/<ol[^>]*>/gi, '')
            .replace(/<\/ol>/gi, '\n')
            .replace(/<[^>]*>/g, ''); // 移除剩余标签

        markdownView += bodyText;

        // 2. 构建知识图谱视图
        let knowledgeGraph: any[] = [];
        if (entities && Array.isArray(entities)) {
            knowledgeGraph = entities.map(e => ({
                label: e.text,
                type: e.type,
                description: e.description,
                externalLink: e.url
            }));
        }

        // 3. 构建参考文献视图
        let sourceList: any[] = [];
        if (citations && Array.isArray(citations)) {
            sourceList = citations.map(c => ({
                title: c.title,
                url: c.url,
                author: c.author
            }));
        }

        return NextResponse.json({
            aiVersion: {
                text: markdownView,
                tokensEstimate: Math.ceil(markdownView.length / 1.5), // 粗略估计
            },
            structuredData: {
                knowledgeGraph,
                sourceList,
                hasBreadcrumbs: true,
                schemaType: 'Article'
            },
            suggestions: [
                markdownView.length > 2000 ? "内容充实，非常适合长文本 LLM 检索" : "内容略短，建议补充细节",
                knowledgeGraph.length > 0 ? "已检测到命名实体，有利于知识图谱构建" : "未发现明确命名实体，建议手动标注关键词",
                sourceList.length > 0 ? "包含权威引用，有助于 AI 验证真实性" : "缺少参考文献，AI 可能会降低内容的权威性权重"
            ]
        });

    } catch (error: any) {
        console.error('AI Simulation error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
