import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getAIServiceForUseCase } from '@/lib/ai/service';

/**
 * POST /api/admin/geo/smart-schema
 * 使用 AI 为内容自动生成最合适的 Schema.org 结构
 */
export async function POST(req: NextRequest) {
    try {
        await requireAdmin();
        const { content, title, url } = await req.json();

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        const aiService = await getAIServiceForUseCase('WRITING');

        const schemaPrompt = `
            你是一个高级 SEO 专家。请分析以下文章内容，并生成一套完整的 Schema.org 结构化数据建议。
            
            文章标题: ${title || '未命名'}
            文章 URL: ${url || 'https://example.com'}
            文章内容预览: ${content.substring(0, 3000)}
            
            请根据内容判断最适合的 Schema 类型（可能包含 Article, FAQPage, HowTo, Product 等）。
            如果文章包含多个 FAQ 或 步骤，请务必提取。
            
            请返回符合 src/components/geo/StructuredData.tsx 定义的 props 格式的 JSON 数组。
            每个对象必须包含 "type" 字段。
            
            示例返回：
            [
              { "type": "Article", "title": "...", "datePublished": "..." },
              { "type": "FAQPage", "questions": [...] }
            ]
            
            要求：
            1. 只返回 JSON 数组，不要有其他解释。
            2. 数据要真实反映文章内容。
            3. 如果内容不涉及某些类型，则不生成。
        `;

        const response = await aiService.generateContent(schemaPrompt, { response_format: { type: 'json_object' } });
        // 有些模型可能返回 { schemas: [...] }，我们要兼容处理
        let result;
        try {
            const parsed = JSON.parse(response.replace(/```json|```/g, '').trim());
            result = Array.isArray(parsed) ? parsed : (parsed.schemas || parsed.data || [parsed]);
        } catch (e) {
            console.error('Parse Error:', e);
            result = [];
        }

        return NextResponse.json({ schemas: result });
    } catch (error) {
        console.error('[SmartSchema] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
