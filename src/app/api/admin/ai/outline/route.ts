import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getAIService } from '@/lib/ai/service';

import fs from 'fs';
import path from 'path';

const logToFile = (message: string) => {
    const logPath = path.join(process.cwd(), 'debug.log');
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`);
};

export async function POST(request: NextRequest) {
    try {
        logToFile('Outline API called');
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            logToFile('Unauthorized access attempt');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { topic, keywords, strategyId } = await request.json();
        logToFile(`Request parsed: topic=${topic}, strategyId=${strategyId}`);

        if (!topic) {
            return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
        }

        logToFile('Getting AI Service...');
        const aiService = await getAIService();
        logToFile('AI Service obtained');
        const { db } = await import('@/lib/db');

        let prompt = '';
        let temperature = 0.7;

        // 基础 Prompt 模板，用于强制 JSON 格式
        const jsonEnforcement = `
            请根据上述要求或风格，为主题"${topic}"生成一份详细的文章大纲。
            ${keywords ? `关键词：${keywords}` : ''}
            
            核心要求：
            1. 必须返回合法的 JSON 格式。
            2. 结构清晰，包含 H1（主标题）、H2（主要章节）、H3（子章节）。
            3. 包含 4-6 个主要章节。
            
            请严格按照以下 JSON 格式返回：
            {
                "title": "建议的主标题",
                "sections": [
                    {
                        "title": "章节标题 (H2)",
                        "subsections": [
                            "子章节标题 (H3)",
                            "子章节标题 (H3)"
                        ],
                        "points": ["要点1", "要点2"]
                    }
                ]
            }
            
            仅返回 JSON，不要包含 Markdown 标记或 HTML。
        `;

        // 如果指定了策略，从数据库获取
        if (strategyId) {
            try {
                logToFile(`Fetching strategy: ${strategyId}`);
                const strategy = await db.aIStrategy.findUnique({
                    where: { id: strategyId }
                });
                logToFile(`Strategy fetch result: ${strategy ? 'Found' : 'Not Found'}`);

                if (strategy && strategy.prompt) {
                    // 将策略 Prompt 作为风格指导，但附加 JSON 强制要求
                    const strategyContext = strategy.prompt
                        .replace(/{{topic}}/g, topic)
                        .replace(/{{keywords}}/g, keywords || '');

                    prompt = `
                        参考以下写作风格和要求：
                        ${strategyContext}
                        
                        ----------------------------------------
                        
                        ${jsonEnforcement}
                    `;

                    temperature = strategy.temperature;
                    console.log('[Outline API] Using strategy:', strategy.name);
                } else if (strategyId) {
                    console.warn('[Outline API] Strategy not found:', strategyId);
                }
            } catch (dbError) {
                console.error('[Outline API] Database error fetching strategy:', dbError);
                logToFile(`Database error fetching strategy: ${dbError}`);
                // Continue with default prompt
            }
        }

        // 如果没有策略或策略未找到，使用默认 Prompt
        if (!prompt) {
            console.log('[Outline API] Using default prompt');
            prompt = `
            作为一名资深内容策划。
            ${jsonEnforcement}
        `;
        }



        console.log('[Outline API] Calling AI service...');
        logToFile('Calling AI service generateContent...');
        const response = await aiService.generateContent(prompt);
        console.log('[Outline API] AI response received, length:', response.length);
        logToFile(`AI response received, length: ${response.length}`);

        // Clean up response
        const cleanResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();

        let outline;
        try {
            outline = JSON.parse(cleanResponse);
            console.log('[Outline API] Successfully parsed outline');
            logToFile('Successfully parsed outline JSON');
        } catch (e) {
            console.error('[Outline API] Failed to parse AI response:', cleanResponse.substring(0, 200));
            logToFile(`Failed to parse AI response: ${cleanResponse.substring(0, 100)}...`);
            return NextResponse.json({
                error: 'AI返回的格式不正确，无法解析为大纲。请重试或检查AI配置。'
            }, { status: 500 });
        }

        return NextResponse.json(outline);
    } catch (error: any) {
        console.error('[Outline API] Error:', error);
        logToFile(`API Error: ${error.message}`);

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
