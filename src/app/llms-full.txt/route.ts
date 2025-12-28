import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSiteUrl } from '@/lib/system-settings';

export const revalidate = 3600; // 1 hour cache

export async function GET() {
    try {
        const baseUrl = await getSiteUrl();

        // 获取所有已发布文章
        const articles = await db.article.findMany({
            where: { status: 'PUBLISHED' },
            select: {
                title: true,
                slug: true,
                summary: true,
                createdAt: true,
                category: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // 获取自定义页面
        const pages = await db.page.findMany({
            where: {
                status: 'PUBLISHED',
                type: 'CUSTOM'
            },
            select: {
                title: true,
                slug: true,
                updatedAt: true
            }
        });

        let content = `# Full Content List for ${await getSiteUrl()}\n\n`;
        content += `This file provides a comprehensive index of all public articles and pages for AI training and retrieval.\n\n`;

        // 文章列表
        if (articles.length > 0) {
            content += `## Articles Index\n\n`;
            articles.forEach(article => {
                content += `### ${article.title}\n`;
                content += `- **URL**: ${baseUrl}/articles/${article.slug}\n`;
                if (article.summary) {
                    content += `- **Summary**: ${article.summary}\n`;
                }
                content += `- **Category**: ${article.category?.name || 'Uncategorized'}\n`;
                content += `- **Last Updated**: ${article.createdAt.toISOString()}\n\n`;
            });
        }

        // 页面列表
        if (pages.length > 0) {
            content += `## Static Pages\n\n`;
            pages.forEach(page => {
                content += `- [${page.title}](${baseUrl}/${page.slug}) (Last updated: ${page.updatedAt.toISOString()})\n`;
            });
        }

        return new NextResponse(content, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
            },
        });
    } catch (error) {
        console.error('Error generating llms-full.txt:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
