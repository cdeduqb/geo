import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

// AI 评分提示词模板
const SCORING_PROMPT = `你是一个专业的内容质量评估专家。请从以下5个维度客观评估这篇文章的质量，每个维度给出0-100的分数：

1. **结构清晰度** (structureScore): 评估标题层次是否合理、段落组织是否清晰、是否有明确的大纲结构
2. **事实密度** (factualScore): 评估包含多少具体数据、是否有可验证的事实、信息密度如何
3. **可引用性** (citationScore): 评估内容是否具有权威性、是否包含独特见解、是否适合作为引用来源
4. **实体丰富度** (entityScore): 评估包含多少命名实体(人名、地名、组织等)、实体之间的关联度
5. **语义深度** (semanticScore): 评估内容深度、是否有深入分析、专业程度

**文章标题**: {title}

**文章内容**:
{content}

**要求**:
1. 严格按照0-100的标准打分
2. 总分(overallScore)为5个维度的平均分
3. 至少提供3-5条具体的改进建议
4. 建议要具体、可操作
5. 必须返回valid JSON格式

**返回格式**:
\`\`\`json
{
  "structureScore": 85,
  "factualScore": 90,
  "citationScore": 88,
  "entityScore": 75,
  "semanticScore": 82,
  "overallScore": 84,
  "suggestions": [
    "增加更多具体的数据支撑，提高事实密度",
    "补充更多命名实体的详细介绍，增强实体丰富度",
    "优化标题层次，使用H2、H3等标签明确内容结构"
  ]
}
\`\`\``;

// 调用AI进行评分
async function scoreWithAI(title: string, content: string): Promise<any> {
    try {
        // 图像生成模型关键词列表（这些模型不支持文本对话）
        const imageModelKeywords = ['seedream', 'dall-e', 'midjourney', 'stable-diffusion', 'image', 'paint', 'draw', 'cogview', 'wanx', 'flux'];

        // 辅助函数：检查模型是否为图像模型
        const isImageModel = (modelName: string | null) => {
            if (!modelName) return false;
            const lowerName = modelName.toLowerCase();
            return imageModelKeywords.some(keyword => lowerName.includes(keyword));
        };

        // 获取所有激活的 AI 配置
        const allConfigs = await prisma.aIConfig.findMany({
            where: { isActive: true },
            orderBy: { updatedAt: 'desc' },
        });

        if (allConfigs.length === 0) {
            throw new Error('没有可用的AI配置，请先在AI配置页面添加配置');
        }

        // 过滤掉图像模型，只保留文本模型
        const textConfigs = allConfigs.filter(config => !isImageModel(config.modelName));

        if (textConfigs.length === 0) {
            // 列出被跳过的模型
            const skippedModels = allConfigs.map(c => c.modelName).join(', ');
            throw new Error(`没有可用的文本对话模型。已跳过的图像模型: ${skippedModels}。请添加一个文本对话模型（如 doubao-pro-32k, deepseek-chat, gpt-3.5-turbo）`);
        }

        // 优先使用特定 provider（openai > deepseek > zhipu > minimax > 其他）
        const priorityProviders = ['openai', 'deepseek', 'zhipu', 'minimax'];
        let aiConfig = textConfigs.find(c => priorityProviders.includes(c.provider));

        // 如果没有优先 provider，使用第一个文本模型
        if (!aiConfig) {
            aiConfig = textConfigs[0];
        }

        console.log('[AI评分] 选择的模型配置:', {
            provider: aiConfig.provider,
            model: aiConfig.modelName,
            skippedImageModels: allConfigs.filter(c => isImageModel(c.modelName)).map(c => c.modelName),
        });

        // 构建提示词
        const prompt = SCORING_PROMPT
            .replace('{title}', title)
            .replace('{content}', content.substring(0, 4000)); // 限制长度

        // 调用AI API（根据配置的provider）
        let response;
        const apiKey = aiConfig.apiKey;
        const baseUrl = aiConfig.baseUrl;
        const model = aiConfig.modelName || 'gpt-3.5-turbo';

        // 详细日志
        console.log('[AI评分] 配置信息:', {
            provider: aiConfig.provider,
            baseUrl,
            model,
            hasApiKey: !!apiKey,
            apiKeyPrefix: apiKey?.substring(0, 10) + '...'
        });

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
                        { role: 'system', content: '你是一个专业的内容质量评估专家。' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.3,
                    response_format: { type: 'json_object' },
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
                        { role: 'system', content: '你是一个专业的内容质量评估专家。' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.3,
                }),
            });
        } else if (aiConfig.provider === 'volcengine') {
            // 火山引擎特殊处理 - 不同的API格式
            response = await fetch(`${baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model,  // 使用用户配置的endpoint ID
                    messages: [
                        { role: 'system', content: '你是一个专业的内容质量评估专家。请以JSON格式返回评分结果。' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.3,
                    // 火山引擎不支持response_format参数
                }),
            });
        } else {
            // 其他provider使用通用OpenAI格式
            response = await fetch(`${baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model,
                    messages: [
                        { role: 'system', content: '你是一个专业的内容质量评估专家。' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.3,
                }),
            });
        }

        console.log('[AI评分] API响应状态:', response.status, response.statusText);

        if (!response.ok) {
            // 获取详细错误信息
            const errorText = await response.text();
            console.error('[AI评分] AI API错误响应:', errorText);
            throw new Error(`AI API调用失败: ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        console.log('[AI评分] AI返回数据:', data);

        const content_result = data.choices?.[0]?.message?.content;

        if (!content_result) {
            throw new Error('AI返回内容为空');
        }

        console.log('[AI评分] AI返回内容:', content_result.substring(0, 500));

        // 解析JSON - 处理可能包裹在```json```代码块中的情况
        let jsonText = content_result.trim();

        // 移除markdown代码块标记
        if (jsonText.startsWith('```')) {
            // 提取代码块中的内容
            const match = jsonText.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
            if (match) {
                jsonText = match[1].trim();
            } else {
                // 简单移除开头和结尾的```
                jsonText = jsonText.replace(/^```(?:json)?/, '').replace(/```$/, '').trim();
            }
        }

        const scores = JSON.parse(jsonText);

        // 验证和标准化数据
        const {
            structureScore = 0,
            factualScore = 0,
            citationScore = 0,
            entityScore = 0,
            semanticScore = 0,
            suggestions = []
        } = scores;

        const overallScore = Math.round(
            (structureScore + factualScore + citationScore + entityScore + semanticScore) / 5
        );

        return {
            structureScore: Math.min(100, Math.max(0, structureScore)),
            factualScore: Math.min(100, Math.max(0, factualScore)),
            citationScore: Math.min(100, Math.max(0, citationScore)),
            entityScore: Math.min(100, Math.max(0, entityScore)),
            semanticScore: Math.min(100, Math.max(0, semanticScore)),
            overallScore: Math.min(100, Math.max(0, overallScore)),
            suggestions: Array.isArray(suggestions) ? suggestions : [],
        };
    } catch (error) {
        console.error('AI评分失败:', error);
        throw error;
    }
}

// POST - 评分文章
export async function POST(request: NextRequest) {
    try {
        await requireAdmin();

        const body = await request.json();
        const { articleId, forceRefresh = false } = body;


        if (!articleId) {
            return NextResponse.json(
                { error: '缺少articleId参数' },
                { status: 400 }
            );
        }

        // 检查是否已有评分（不强制刷新时）
        if (!forceRefresh) {
            const existingScore = await prisma.contentAIScore.findUnique({
                where: { articleId },
            });

            if (existingScore) {
                return NextResponse.json({ score: existingScore });
            }
        }

        // 获取文章内容
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

        // 调用AI评分
        const scores = await scoreWithAI(article.title, article.content);

        // 保存到数据库
        const scoreRecord = await prisma.contentAIScore.upsert({
            where: { articleId },
            create: {
                articleId,
                ...scores,
                suggestions: JSON.stringify(scores.suggestions),
            },
            update: {
                ...scores,
                suggestions: JSON.stringify(scores.suggestions),
                updatedAt: new Date(),
            },
        });

        return NextResponse.json({
            score: {
                ...scoreRecord,
                suggestions: JSON.parse(scoreRecord.suggestions || '[]'),
            },
        });
    } catch (error: any) {
        console.error('评分失败:', error);
        return NextResponse.json(
            { error: error.message || '评分失败' },
            { status: 500 }
        );
    }
}

// GET - 获取文章评分
export async function GET(request: NextRequest) {
    try {
        await requireAdmin();

        const { searchParams } = new URL(request.url);
        const articleId = searchParams.get('articleId');


        if (!articleId) {
            // 获取所有已评分的文章
            const scores = await prisma.contentAIScore.findMany({
                include: {
                    article: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                        },
                    },
                },
                orderBy: { overallScore: 'desc' },
                take: 50,
            });

            return NextResponse.json({
                scores: scores.map(s => ({
                    ...s,
                    suggestions: JSON.parse(s.suggestions || '[]'),
                })),
            });
        }

        // 获取特定文章的评分
        const score = await prisma.contentAIScore.findUnique({
            where: { articleId },
            include: {
                article: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                    },
                },
            },
        });

        if (!score) {
            return NextResponse.json(
                { error: '该文章尚未评分' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            score: {
                ...score,
                suggestions: JSON.parse(score.suggestions || '[]'),
            },
        });
    } catch (error) {
        console.error('获取评分失败:', error);
        return NextResponse.json(
            { error: '获取评分失败' },
            { status: 500 }
        );
    }
}
