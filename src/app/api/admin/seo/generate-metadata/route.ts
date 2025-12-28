import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getAIServiceForUseCase } from '@/lib/ai/service';

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { content, keywords, type = 'article', lang = 'zh' } = await request.json();

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        const aiService = await getAIServiceForUseCase('WRITING');
        const isEn = lang === 'en';

        const prompt = isEn ? `
            As an SEO expert, generate optimized metadata for the following ${type === 'article' ? 'article' : 'page'} content.
            
            Content Summary/Body:
            ${content.substring(0, 2000)}... (truncated)
            
            ${keywords ? `Keywords: ${keywords}` : ''}
            
            Please generate the following 4 items and return in JSON format:
            1. title: SEO Optimized Title (50-60 characters, click-worthy, includes keywords)
            2. description: Meta Description (150-160 characters, summarizes content, includes keywords, click-worthy)
            3. slug: URL Slug (English, hyphenated, concise description)
            4. altText: Suggested main image Alt Text (descriptive, includes keywords)

            Example Return Format:
            {
                "title": "...",
                "description": "...",
                "slug": "...",
                "altText": "..."
            }
            
            Return ONLY JSON, do not include markdown blocks or other text.
        ` : `
            作为一名 SEO 专家，请为以下${type === 'article' ? '文章' : '页面'}内容生成优化的元数据。
            
            内容摘要/正文：
            ${content.substring(0, 2000)}... (内容截断)
            
            ${keywords ? `关键词：${keywords}` : ''}
            
            请生成以下 4 项内容，并以 JSON 格式返回：
            1. title: SEO 优化标题 (50-60字符，吸引点击，包含关键词)
            2. description: Meta Description (150-160字符，概括内容，包含关键词，吸引点击)
            3. slug: URL Slug (英文，短横线分隔，简短描述)
            4. altText: 建议的主图 Alt 文本 (描述性，包含关键词)

            返回格式示例：
            {
                "title": "...",
                "description": "...",
                "slug": "...",
                "altText": "..."
            }
            
            仅返回 JSON，不要包含 Markdown 标记或其他文本。
        `;

        console.log(`[AI_SEO_GEN] Generating metadata for content length: ${content.length}`);
        const response = await aiService.generateContent(prompt);
        console.log(`[AI_SEO_GEN] AI Response received:`, response);

        // Clean up response (remove markdown code blocks if any)
        const cleanResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();

        let metadata;
        try {
            metadata = JSON.parse(cleanResponse);
            console.log(`[AI_SEO_GEN] Successfully parsed metadata:`, metadata);
        } catch (e) {
            console.error('[AI_SEO_GEN] Failed to parse AI response:', cleanResponse);
            return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
        }

        return NextResponse.json(metadata);
    } catch (error: any) {
        console.error('[AI_SEO_GEN] Error generating metadata:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
