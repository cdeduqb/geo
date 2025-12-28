import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getAIServiceForUseCase } from '@/lib/ai/service';

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { prompt, context } = await request.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const aiService = await getAIServiceForUseCase('WRITING');

        const fullPrompt = `
你是一位专业的网络文章编辑助理。
根据用户的提示和当前的上下文内容，生成一段高质量的文章片段。

用户提示：${prompt}
当前文章上下文（参考）：
${context ? context.substring(0, 1000) : '无'}

要求：
1. **直接输出内容**：不要包含任何解释性文字（如"好的，为您生成..."）。
2. **格式规范**：使用 HTML 格式 (p, strong, ul, table 等)。
3. **连贯性**：如果提供了上下文，请确保生成的内容与上下文语调一致。
4. **简洁高效**：生成的内容要充实且具有可读性。

由于是插入到编辑器中，请确保 HTML 标签闭合且不包含 <html> 或 <body>。
开始生成内容：
`;

        console.log('[Generate Segment API] Generating content...');
        const generatedContent = await aiService.generateContent(fullPrompt);

        // Clean up
        const cleanContent = generatedContent.replace(/```html/g, '').replace(/```/g, '').trim();

        return NextResponse.json({ content: cleanContent });

    } catch (error: any) {
        console.error('[Generate Segment API] Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
