import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { getAIServiceForUseCase } from '@/lib/ai/service';

/**
 * POST /api/admin/geo/brand-profiler
 * AI 智能提取品牌实体信息，用于构建知识图谱
 */
export async function POST(req: NextRequest) {
    try {
        await requireAdmin();
        const { siteName, description } = await req.json();

        const aiService = await getAIServiceForUseCase('GENERAL');

        const profilePrompt = `
            你是一个品牌专家和 SEO/GEO 顾问。
            请根据以下网站信息，推测并建议适合在 Schema.org 中配置的品牌实体信息。
            
            网站名称: ${siteName || '未命名'}
            内容描述: ${description || '通用企业/个人网站'}
            
            请输出 JSON 格式：
            {
                "alternateName": "建议的 1-2 个品牌别名（英文或不同中文叫法）",
                "sameAs": ["建议配置的社交平台 URL 占位符，如 https://twitter.com/yourbrand"],
                "description": "一段更符合品牌实体定义的 100 字内描述",
                "reasoning": "为什么建议这些信息"
            }
        `;

        const response = await aiService.generateContent(profilePrompt, { response_format: { type: 'json_object' } });
        const analysis = JSON.parse(response.replace(/```json|```/g, '').trim());

        return NextResponse.json({ analysis });
    } catch (error) {
        console.error('[BrandProfiler] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
