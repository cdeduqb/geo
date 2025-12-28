import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getAIService } from '@/lib/ai/service';


export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { topic, keywords, outline, strategyId } = await request.json();

        if (!topic || !outline) {
            return NextResponse.json({ error: 'Topic and outline are required' }, { status: 400 });
        }

        console.log('[Draft API] Request:', { topic, keywords: keywords || '(none)', strategyId: strategyId || '(default)' });

        const aiService = await getAIService();
        const { db } = await import('@/lib/db');

        let prompt = '';
        let temperature = 0.7;

        // 如果指定了策略，从数据库获取
        if (strategyId) {
            try {
                const strategy = await db.aIStrategy.findUnique({
                    where: { id: strategyId }
                });

                if (strategy && strategy.prompt) {
                    temperature = strategy.temperature;
                    console.log('[Draft API] Using strategy:', strategy.name);

                    // 如果策略 Prompt 包含 {{outline}}，则完全使用它
                    if (strategy.prompt.includes('{{outline}}')) {
                        prompt = strategy.prompt
                            .replace(/{{topic}}/g, topic)
                            .replace(/{{keywords}}/g, keywords || '')
                            .replace(/{{outline}}/g, JSON.stringify(outline, null, 2));
                    } else {
                        // 否则，将策略 Prompt 作为风格指导附加到默认 Prompt
                        prompt = `
                            请根据以下大纲，撰写一篇关于"${topic}"的深度文章。
                            ${keywords ? `关键词：${keywords}` : ''}
                            
                            风格与要求：
                            ${strategy.prompt.replace(/{{topic}}/g, topic).replace(/{{keywords}}/g, keywords || '')}
                            
                            文章大纲：
                            ${JSON.stringify(outline, null, 2)}
                            
                            撰写要求：
                            1. **严格遵循大纲结构**：按大纲顺序撰写，不要遗漏章节。
                            2. **内容专业详实**：每个章节内容要充实，避免空洞。
                            3. **GEO/SEO 优化**：
                               - 使用语义化 HTML 标签 (h2, h3, p, ul, li, strong, blockquote)。
                               - 包含问答式内容（如"什么是..."）。
                               - 适当使用列表和表格。
                            4. **格式要求**：
                               - 直接输出 HTML 内容。
                               - 不要包含 <html>, <head>, <body> 标签。
                               - 不要包含 Markdown 代码块标记。
                               - 确保 HTML 结构完整有效。
                            
                            请开始撰写：
                        `;
                    }
                } else if (strategyId) {
                    console.warn('[Draft API] Strategy not found:', strategyId);
                }
            } catch (dbError) {
                console.error('[Draft API] Database error fetching strategy:', dbError);
                // Continue with default prompt
            }
        }

        // 如果没有策略或策略未找到，使用默认 Prompt
        if (!prompt) {
            console.log('[Draft API] Using default prompt');
            prompt = `
                请根据以下大纲，撰写一篇关于"${topic}"的深度文章。
                ${keywords ? `关键词：${keywords}` : ''}
                
                文章大纲：
                ${JSON.stringify(outline, null, 2)}
                
                撰写要求：
                1. **严格遵循大纲结构**：按大纲顺序撰写，不要遗漏章节。
                2. **内容专业详实**：每个章节内容要充实，避免空洞。
                3. **GEO/SEO 优化**：
                   - 使用语义化 HTML 标签 (h2, h3, p, ul, li, strong, blockquote)。
                   - 包含问答式内容（如"什么是..."）。
                   - 适当使用列表和表格。
                4. **格式要求**：
                   - 直接输出 HTML 内容。
                   - 不要包含 <html>, <head>, <body> 标签。
                   - 不要包含 Markdown 代码块标记。
                   - 确保 HTML 结构完整有效。
                
                请开始撰写：
            `;
        }



        console.log('[Draft API] Calling AI service...');
        const response = await aiService.generateContent(prompt);
        console.log('[Draft API] AI response received, length:', response.length);

        // Clean up response
        const cleanContent = response.replace(/```html/g, '').replace(/```/g, '').trim();

        return NextResponse.json({ content: cleanContent });
    } catch (error: any) {
        console.error('[Draft API] Error:', error);

        // Provide more specific error messages
        let errorMessage = 'Internal Server Error';
        if (error.message) {
            if (error.message.includes('database') || error.message.includes('prisma')) {
                errorMessage = '数据库连接失败，请检查数据库配置';
            } else if (error.message.includes('AI') || error.message.includes('API')) {
                errorMessage = `AI服务错误: ${error.message}`;
            } else {
                errorMessage = error.message;
            }
        }

        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
