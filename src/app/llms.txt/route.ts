import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSiteUrl } from '@/lib/system-settings';

export const revalidate = 3600; // 1 hour cache

export async function GET() {
    try {
        // 获取网站基本信息
        const settings = await db.systemSetting.findMany({
            where: {
                key: {
                    in: ['site_name', 'site_description']
                }
            }
        });

        const config: Record<string, string> = {};
        settings.forEach(s => config[s.key] = s.value);

        const siteName = config.site_name || 'GeoCMS';
        const siteDesc = config.site_description || 'A modern CMS built for the AI era.';
        const baseUrl = await getSiteUrl();

        // 构建 Markdown 内容
        let content = `# ${siteName}\n\n`;
        content += `> ${siteDesc}\n\n`;

        content += `## Core Navigation\n\n`;
        content += `- [Home](${baseUrl}/)\n`;
        content += `- [Articles](${baseUrl}/articles)\n`;
        content += `- [About](${baseUrl}/about)\n`;
        content += `- [Contact](${baseUrl}/contact)\n\n`;

        content += `## AI / Machine Learning Metadata\n\n`;
        content += `- Target Audience: General\n`;
        content += `- Primary Category: Business/Enterprise\n`;
        content += `- Data Freshness: Real-time via Sitemap\n`;
        content += `- Language Support: Chinese (Simplified), English\n`;
        content += `- Semantic Structure: Schema.org JSON-LD, Knowledge Graph Enabled\n`;
        content += `- Optimization Focus: Reasoning (DeepSeek), Generative Search (Doubao/Gemini)\n\n`;

        content += `## Detailed Content\n\n`;
        content += `For a comprehensive list of all content, please visit:\n`;
        content += `[Full Content List](${baseUrl}/llms-full.txt)\n`;

        return new NextResponse(content, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
            },
        });
    } catch (error) {
        console.error('Error generating llms.txt:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
