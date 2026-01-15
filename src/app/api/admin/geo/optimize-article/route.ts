import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

// AI 优化提示词模板
const OPTIMIZE_PROMPT = `你是一个专业的内容优化专家。请根据以下改进建议，优化这篇文章：

**文章标题**: {title}

**文章内容**:
{content}

**需要改进的方面**:
{suggestions}

**优化要求**:
1. 保持文章的核心主题和观点不变
2. 根据建议逐条进行针对性优化
3. 提升内容结构的清晰度
4. 增加事实数据和可引用的信息
5. 丰富命名实体（人名、机构、数据等）
6. 保持原文风格，自然融入改进内容
7. 确保优化后的内容流畅、专业

**返回格式**:
请直接返回优化后的完整文章内容（HTML格式），不要添加任何解释性文字。`;

// 调用AI进行内容优化
async function optimizeWithAI(title: string, content: string, suggestions: string[]): Promise<string> {
    try {
        // 获取AI配置，排除图像生成模型
        let aiConfig = await prisma.aIConfig.findFirst({
            where: {
                isActive: true,
                NOT: { useCase: 'IMAGE' },
                provider: { in: ['openai', 'deepseek', 'zhipu', 'minimax', 'qwen', 'kimi'] }
            },
            orderBy: { updatedAt: 'desc' },
        });

        if (!aiConfig) {
            aiConfig = await prisma.aIConfig.findFirst({
                where: {
                    isActive: true,
                    NOT: { useCase: 'IMAGE' }
                },
                orderBy: { updatedAt: 'desc' },
            });
        }

        if (!aiConfig) {
            throw new Error('没有可用的AI配置');
        }

        // 构建提示词
        const suggestionsText = suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n');
        const prompt = OPTIMIZE_PROMPT
            .replace('{title}', title)
            .replace('{content}', content.substring(0, 6000))
            .replace('{suggestions}', suggestionsText);

        const apiKey = aiConfig.apiKey;
        const baseUrl = aiConfig.baseUrl;
        const model = aiConfig.modelName || 'gpt-3.5-turbo';

        console.log('[AI优化] 开始优化文章:', title);
        console.log('[AI优化] 使用配置:', { provider: aiConfig.provider, model });

        let response;

        if (aiConfig.provider === 'openai') {
            response = await fetch(`${baseUrl || 'https://api.openai.com/v1'}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model,
                    messages: [
                        { role: 'system', content: '你是一个专业的内容优化专家，擅长提升文章质量和SEO效果。' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 4000,
                }),
            });
        } else if (aiConfig.provider === 'deepseek') {
            response = await fetch(`${baseUrl || 'https://api.deepseek.com/v1'}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: model || 'deepseek-chat',
                    messages: [
                        { role: 'system', content: '你是一个专业的内容优化专家，擅长提升文章质量和SEO效果。' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 4000,
                }),
            });
        } else if (aiConfig.provider === 'volcengine') {
            response = await fetch(`${baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model,
                    messages: [
                        { role: 'system', content: '你是一个专业的内容优化专家，擅长提升文章质量和SEO效果。' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.7,
                }),
            });
        } else {
            response = await fetch(`${baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model,
                    messages: [
                        { role: 'system', content: '你是一个专业的内容优化专家，擅长提升文章质量和SEO效果。' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.7,
                }),
            });
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[AI优化] API错误:', errorText);
            throw new Error(`AI API调用失败: ${response.statusText}`);
        }

        const data = await response.json();
        const optimizedContent = data.choices?.[0]?.message?.content;

        if (!optimizedContent) {
            throw new Error('AI返回内容为空');
        }

        console.log('[AI优化] 优化完成，内容长度:', optimizedContent.length);
        return optimizedContent.trim();
    } catch (error) {
        console.error('[AI优化] 优化失败:', error);
        throw error;
    }
}

// POST - 一键优化文章
export async function POST(request: NextRequest) {
    try {
        await requireAdmin();

        const body = await request.json();
        const { articleId, suggestions } = body;

        if (!articleId) {
            return NextResponse.json(
                { error: '缺少articleId参数' },
                { status: 400 }
            );
        }

        if (!suggestions || !Array.isArray(suggestions) || suggestions.length === 0) {
            return NextResponse.json(
                { error: '缺少优化建议' },
                { status: 400 }
            );
        }

        // 获取文章
        const article = await prisma.article.findUnique({
            where: { id: articleId },
            select: {
                id: true,
                title: true,
                content: true,
            },
        });

        if (!article) {
            return NextResponse.json(
                { error: '文章不存在' },
                { status: 404 }
            );
        }

        // 调用AI优化
        const optimizedContent = await optimizeWithAI(article.title, article.content, suggestions);

        // 更新文章内容
        const updatedArticle = await prisma.article.update({
            where: { id: articleId },
            data: {
                content: optimizedContent,
                updatedAt: new Date(),
            },
            select: {
                id: true,
                title: true,
                slug: true,
                content: true,
            },
        });

        // 删除旧的评分记录，以便重新评分
        await prisma.contentAIScore.deleteMany({
            where: { articleId },
        });

        return NextResponse.json({
            success: true,
            message: '文章优化成功',
            article: updatedArticle,
        });
    } catch (error: any) {
        console.error('优化失败:', error);
        return NextResponse.json(
            { error: error.message || '优化失败' },
            { status: 500 }
        );
    }
}
