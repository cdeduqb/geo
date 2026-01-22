import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

// AI 评分提示词模板
const SCORING_PROMPT = `你是一个专业的内容质量评估专家，精通 GEO (生成式引擎优化)，特别熟悉 DeepSeek、豆包 (ByteDance)、ChatGPT 及 Perplexity 的引证逻辑。

请从以下 5 个维度评估这篇文章的“全网 AI 引用潜力”，每个维度 0-100 分：

1. **逻辑推导与论证表现** (structureScore): 
   - [DeepSeek 特色]: 评估观点是否有严密的推导过程，是否不仅有结论还有实现逻辑。AI 推理模型更倾向于引用逻辑闭环的内容。
2. **客观事实与表格化数据** (factualScore): 
   - [国内平台偏好]: 评估是否包含具体数字、百分比。特别检查是否使用了 HTML 表格 (Table) 展示核心数据，这在国内爬虫中具有极高的解析权重。
3. **权威背书与信源多样性** (citationScore): 
   - [中外兼容]: 评估是否引用了权威来源（如：知乎、行业白皮书、国家统计数据、Wikipedia 等）。引用国内主流平台的见解能显著提升在 DeepSeek/豆包中的权重。
4. **实体指纹与中文语义深度** (entityScore): 
   - 评估品牌实体、专有名词、行业核心词的密度。文章应针对中文语境下的“意图匹配”进行深度设计，而非简单的关键词堆砌。
5. **合规性与表达纯净度** (semanticScore): 
   - [安全风控]: 评估内容是否客观中性、无极端措辞、符合主流审美与合规要求。纯净且高质量的文字更容易通过国内 AI 的安全过滤进入候选池。

**文章标题**: {title}

**文章内容**:
{content}

**要求**:
1. 提供 3-5 条具备“中外通用”特性的 GEO 改进建议。
2. 建议应包含：增加表格化展示、完善逻辑推导步骤、引入国内权威平台观点等具体动作。
3. 必须返回规范的 JSON 格式。

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
    "在关键论证部分增加『因为...所以...』的逻辑推导过程，以满足推理模型 (如 DeepSeek) 的抓取偏好",
    "将核心对比数据整理为 HTML 表格，国内 AI 爬虫对表格数据的提取成功率更高",
    "尝试引用知乎、行业标准或官方统计数据作为背书，提升信源在全球 AI 知识库中的权重"
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

        // 获取所有激活的 AI 配置，排除 useCase 为 IMAGE 的配置
        const allConfigs = await prisma.aIConfig.findMany({
            where: {
                isActive: true,
                // 排除图像生成用途的配置
                NOT: { useCase: 'IMAGE' }
            },
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
