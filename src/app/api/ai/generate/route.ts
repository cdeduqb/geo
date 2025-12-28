import { NextResponse } from 'next/server';
import { getAIService } from '@/lib/ai/service';


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { topic, keywords, length, strategyId } = body;

        if (!topic) {
            return NextResponse.json(
                { error: 'Topic is required' },
                { status: 400 }
            );
        }

        const { db } = await import('@/lib/db');
        const aiService = await getAIService();
        let result;

        // 如果指定了策略，使用策略 Prompt
        if (strategyId) {
            const strategy = await db.aIStrategy.findUnique({
                where: { id: strategyId }
            });

            if (strategy && strategy.prompt) {
                const lengthMap = {
                    short: '500字左右',
                    medium: '1000字左右',
                    long: '2000字以上'
                };
                const lengthText = lengthMap[length as 'short' | 'medium' | 'long' || 'medium'];

                let prompt = strategy.prompt
                    .replace(/{{topic}}/g, topic)
                    .replace(/{{keywords}}/g, keywords || '')
                    .replace(/{{length}}/g, lengthText);

                // 如果策略 Prompt 没有处理 length，手动添加
                if (!strategy.prompt.includes('{{length}}')) {
                    prompt += `\n篇幅要求：${lengthText}`;
                }

                // 确保 HTML 格式要求
                if (!prompt.includes('HTML')) {
                    prompt += `\n要求：使用HTML格式输出，不要使用Markdown，直接输出HTML代码。`;
                }



                result = await aiService.generateContent(prompt);
                const cleanContent = result.replace(/```html/g, '').replace(/```/g, '').trim();
                result = { content: cleanContent };
            }
        }

        // 如果没有策略或策略未找到，使用默认模式
        if (!result) {
            result = await aiService.generateArticle({
                topic,
                keywords,
                length: length || 'medium'
            });
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Generate API error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
