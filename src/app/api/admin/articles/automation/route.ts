import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// 标题变体模板 - 用于生成独特的文章标题
const titlePrefixes = [
    '', // 无前缀
    '深度解析：',
    '全面解读：',
    '专家视角：',
    '行业观察：',
    '实战指南：',
    '核心要点：',
    '一文读懂：',
    '权威分析：',
    '前沿探索：',
];

const titleSuffixes = [
    '', // 无后缀
    '的完整指南',
    '的深度分析',
    '的核心要点',
    '的实践经验',
    '的发展趋势',
    '的应用场景',
    '的关键策略',
    '的最佳实践',
    '的全面解读',
];

const titleAngles = [
    (topic: string) => topic,
    (topic: string) => `${topic}详解`,
    (topic: string) => `关于${topic}的思考`,
    (topic: string) => `${topic}的现状与未来`,
    (topic: string) => `如何理解${topic}`,
    (topic: string) => `${topic}入门到精通`,
    (topic: string) => `${topic}的核心概念`,
    (topic: string) => `探索${topic}的奥秘`,
    (topic: string) => `${topic}的实战应用`,
    (topic: string) => `${topic}背后的逻辑`,
];

/**
 * 生成独特的文章标题
 * 保留中心主题的同时，通过不同的前缀、后缀和角度创建独特的标题
 */
function generateUniqueTitle(baseTopic: string, index: number, total: number): string {
    // 清理基础主题
    const cleanTopic = baseTopic.trim().slice(0, 50);

    // 使用组合策略确保每个标题都不同
    const prefixIndex = index % titlePrefixes.length;
    const suffixIndex = Math.floor(index / titlePrefixes.length) % titleSuffixes.length;
    const angleIndex = Math.floor(index / (titlePrefixes.length * titleSuffixes.length)) % titleAngles.length;

    // 如果只有一篇，直接返回原标题
    if (total === 1) {
        return cleanTopic;
    }

    // 第一篇使用原始标题
    if (index === 0) {
        return cleanTopic;
    }

    // 根据索引选择不同的标题生成策略
    const strategy = index % 4;

    switch (strategy) {
        case 0:
            // 使用前缀
            return `${titlePrefixes[prefixIndex]}${cleanTopic}`;
        case 1:
            // 使用后缀
            return `${cleanTopic}${titleSuffixes[suffixIndex]}`;
        case 2:
            // 使用角度变换
            return titleAngles[angleIndex](cleanTopic);
        case 3:
            // 组合前缀和后缀
            return `${titlePrefixes[prefixIndex]}${cleanTopic}${titleSuffixes[suffixIndex]}`.replace(/^：|：$/g, '');
        default:
            return cleanTopic;
    }
}


// GET /api/admin/articles/automation - 获取所有自动化项目
export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const projects = await db.articleAutomationProject.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                category: true,
                strategy: true,
                tasks: {
                    select: {
                        status: true
                    }
                },
                _count: {
                    select: { tasks: true }
                }
            }
        });

        return NextResponse.json(projects);
    } catch (error) {
        console.error('Error fetching automation projects:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST /api/admin/articles/automation - 创建新的自动化项目
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            name,
            topic,
            keywords,
            totalCount,
            dailyLimit,
            categoryId,
            strategyId,
            features
        } = body;

        if (!name || !topic || !totalCount || !strategyId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. 创建自动化项目
        const project = await db.articleAutomationProject.create({
            data: {
                name,
                topic,
                keywords,
                totalCount: parseInt(totalCount.toString()),
                dailyLimit: parseInt(dailyLimit.toString()),
                categoryId: categoryId || null,
                authorId: user.id,
                strategyId,
                enableGeo: !!features.geo,
                enableIllustrate: !!features.illustrate,
                enableAutoLink: !!features.autoLink,
                enableCover: !!features.cover,
                enableSEO: !!features.seo,
                enableCitations: !!features.citations,
                enableEntities: !!features.entities,
                status: 'ACTIVE'
            }
        });

        // 2. 生成初始任务 (AICreationTask)
        // 这里的逻辑可以比较复杂：比如直接根据 totalCount 生成任务，或者只生成第一批
        // 为了演示，我们先生成所有任务，并将 scheduledAt 分散在未来几天
        const tasksData = [];
        for (let i = 0; i < project.totalCount; i++) {
            // 计算发布日期
            const dayOffset = Math.floor(i / project.dailyLimit);
            let scheduledAt = new Date();
            scheduledAt.setDate(scheduledAt.getDate() + dayOffset);
            if (i === 0) {
                // 第一篇在 10 分钟后发布，给系统留出处理缓冲
                scheduledAt = new Date(Date.now() + 10 * 60 * 1000);
            } else {
                // 其他任务随机设置当天的具体小时 (9:00 - 17:00)
                scheduledAt.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60));
            }

            tasksData.push({
                projectId: project.id,
                strategyId: project.strategyId,
                topic: generateUniqueTitle(project.topic, i, project.totalCount),
                keywords: project.keywords,
                status: 'PENDING' as const,
                scheduledAt
            });
        }

        // 批量创建任务
        await db.aICreationTask.createMany({
            data: tasksData
        });

        return NextResponse.json(project);
    } catch (error) {
        console.error('Error creating automation project:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
