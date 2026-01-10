import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '@/lib/auth';

const prisma = new PrismaClient();

/**
 * 智能分发推荐逻辑
 */
export async function POST(request: NextRequest) {
    try {
        await requireAdmin();

        const trendingTopics = await prisma.trendingTopic.findMany({

            where: { trendScore: { gte: 30 } },
            orderBy: { trendScore: 'desc' },
            take: 10
        });

        if (trendingTopics.length === 0) {
            return NextResponse.json({ message: '建议先运行趋势分析 API', recommendations: [] });
        }

        const existingArticles = await prisma.article.findMany({
            select: { title: true }
        });

        const newRecommendations = [];
        let updatedCount = 0;
        let skipCount = 0;

        // 获取 AI 服务进行市场分析
        const { getAIServiceForUseCase } = await import('@/lib/ai/service');
        const aiService = await getAIServiceForUseCase('GENERAL');

        for (const topic of trendingTopics) {
            // 检查内容缺口
            const isCovered = existingArticles.some(art =>
                art.title.toLowerCase().includes(topic.topic.toLowerCase())
            );

            if (!isCovered) {
                const title = `如何利用 ${topic.topic} 提升业务效率：完整指南`;

                const existingRec = await prisma.contentRecommendation.findFirst({
                    where: { topicId: topic.id, title }
                });

                // 如果已经存在且不是 pending 状态，我们跳过，避免重复处理已接受/忽略的建议
                if (existingRec && existingRec.status !== 'pending') {
                    skipCount++;
                    continue;
                }

                // 调用 AI 进行深度市场分析
                let trafficRange = "500 ~ 1,500";
                let trafficValue = 500;
                let difficulty = 'medium';
                let commercialValue = 'medium';
                let marketInsight = '基于基础趋势预估。';

                try {
                    const marketAnalysisPrompt = `
                        你是一个资深的 SEO/GEO 市场分析专家。请分析关键词: "${topic.topic}"。
                        该词在系统中的基础指数为 ${topic.queryCount}，近期增长率为 ${topic.growthRate}%。
                        
                        请结合 2024-2025 年的中国互联网市场语境，给出该词的：
                        1. 月度全网搜索量区间 (例如 "10k~50k")
                        2. 竞争激烈程度 (easy/medium/hard)
                        3. 商业变现价值指数 (low/medium/high)
                        4. 一句话核心分析
                        
                        请严格返回以下价格 JSON 格式：
                        {
                            "trafficRange": "区间文本",
                            "trafficValue": 数字(取区间均值),
                            "difficulty": "easy" | "medium" | "hard",
                            "commercialValue": "low" | "medium" | "high",
                            "insight": "一句话核心分析"
                        }
                    `;
                    const analysisResult = await aiService.generateContent(marketAnalysisPrompt, { response_format: { type: 'json_object' } });
                    const analysis = JSON.parse(analysisResult.replace(/```json|```/g, '').trim());

                    trafficRange = analysis.trafficRange || trafficRange;
                    trafficValue = analysis.trafficValue || trafficValue;
                    difficulty = analysis.difficulty || difficulty;
                    commercialValue = analysis.commercialValue || commercialValue;
                    marketInsight = analysis.insight || marketInsight;
                } catch (e) {
                    console.warn(`AI 市场调研失败: ${topic.topic}`);
                }

                const description = `${marketInsight} (增长率: ${Math.round(topic.growthRate)}%)`;

                const recommendation = await prisma.contentRecommendation.upsert({
                    where: {
                        id: existingRec?.id || '00000000-0000-0000-0000-000000000000'
                    },
                    create: {
                        topicId: topic.id,
                        title,
                        description,
                        estimatedTraffic: trafficValue,
                        keywords: JSON.stringify({ range: trafficRange, commercialValue }), // 扩展存储额外信息
                        difficulty: difficulty as any,
                        priority: Math.floor(topic.trendScore / 10),
                        status: 'pending'
                    },
                    update: {
                        estimatedTraffic: trafficValue,
                        description,
                        keywords: JSON.stringify({ range: trafficRange, commercialValue }),
                        priority: Math.floor(topic.trendScore / 10),
                        updatedAt: new Date()
                    }
                });

                if (existingRec) {
                    updatedCount++;
                } else {
                    newRecommendations.push(recommendation);
                }
            }
        }

        let message = `分析完成。`;
        if (newRecommendations.length > 0) message += `新增 ${newRecommendations.length} 条推荐。`;
        if (updatedCount > 0) message += `更新 ${updatedCount} 条既有建议。`;
        if (newRecommendations.length === 0 && updatedCount === 0) {
            message = skipCount > 0 ? "热门话题均已处理或收录，暂无新建议。" : "暂未发现新的内容缺口。";
        }

        return NextResponse.json({
            message,
            recommendations: newRecommendations,
            newCount: newRecommendations.length,
            updatedCount
        });

    } catch (error: any) {
        console.error('生成推荐失败:', error);
        return NextResponse.json({ error: error.message || '生成失败' }, { status: 500 });
    }
}

/**
 * 获取推荐列表
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || 'pending';

        const recommendations = await prisma.contentRecommendation.findMany({
            where: { status },
            include: {
                topic: true
            },
            orderBy: [
                { priority: 'desc' },
                { createdAt: 'desc' }
            ]
        });

        return NextResponse.json({ recommendations });
    } catch (error) {
        return NextResponse.json({ error: '获取推荐失败' }, { status: 500 });
    }
}

/**
 * 更新推荐状态 (接受/忽略)
 */
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: '参数不足' }, { status: 400 });
        }

        const updated = await prisma.contentRecommendation.update({
            where: { id },
            data: { status },
            include: { topic: true }
        });

        // 联动逻辑：如果状态变更为 'accepted'，自动创建一个 AI 创作任务
        if (status === 'accepted') {
            // 获取最接近的 AI 创作策略 (优先选包含 'SEO' 或 '内容' 关键字的，没有则选第一个)
            const strategies = await prisma.aIStrategy.findMany({
                take: 5
            });

            const strategyId = strategies.find(s => s.name.includes('内容') || s.name.includes('SEO'))?.id || strategies[0]?.id;

            if (strategyId) {
                await prisma.aICreationTask.create({
                    data: {
                        strategyId,
                        topic: updated.title,
                        keywords: updated.topic.topic,
                        status: 'PENDING'
                    }
                });
            }
        }

        return NextResponse.json({
            recommendation: updated,
            taskCreated: status === 'accepted'
        });
    } catch (error) {
        return NextResponse.json({ error: '更新失败' }, { status: 500 });
    }
}
