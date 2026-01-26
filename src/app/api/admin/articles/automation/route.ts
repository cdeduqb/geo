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
            mode = 'topic', // 'topic' 或 'titles'
            topic,
            titlesList, // 标题列表模式时使用
            keywords,
            totalCount,
            dailyLimit,
            preferredLength = 'medium',
            categoryId,
            strategyId,
            features
        } = body;


        // 验证必填字段
        if (!name || !strategyId) {
            return NextResponse.json({ error: 'Missing required fields: name, strategyId' }, { status: 400 });
        }

        // 根据模式验证不同的必填字段
        if (mode === 'topic') {
            if (!topic || !totalCount) {
                return NextResponse.json({ error: 'Missing required fields for topic mode: topic, totalCount' }, { status: 400 });
            }
        } else if (mode === 'titles') {
            if (!titlesList || !Array.isArray(titlesList) || titlesList.length === 0) {
                return NextResponse.json({ error: 'Missing required fields for titles mode: titlesList (non-empty array)' }, { status: 400 });
            }
        } else {
            return NextResponse.json({ error: 'Invalid mode. Must be "topic" or "titles"' }, { status: 400 });
        }

        // 计算实际的文章总数
        const actualTotalCount = mode === 'titles' ? titlesList.length : parseInt(totalCount.toString());
        const actualDailyLimit = parseInt(dailyLimit?.toString() || '2');

        // 1. 创建自动化项目
        console.log('--- Creating Automation Project ---');
        console.log('Mode:', mode);
        console.log('Total Count:', actualTotalCount);

        let project;
        try {
            project = await (db.articleAutomationProject as any).create({
                data: {
                    name,
                    mode,
                    topic: mode === 'topic' ? topic : `标题列表模式 (${titlesList.length} 篇)`,
                    keywords,
                    totalCount: actualTotalCount,
                    dailyLimit: actualDailyLimit,
                    preferredLength: preferredLength,
                    categoryId: categoryId || null,

                    authorId: user.id,
                    strategyId,
                    enableGeo: !!features?.geo,
                    enableIllustrate: !!features?.illustrate,
                    enableAutoLink: !!features?.autoLink,
                    enableCover: !!features?.cover,
                    enableSEO: !!features?.seo,
                    enableCitations: !!features?.citations,
                    enableEntities: !!features?.entities,
                    optimizeTitle: features?.optimizeTitle !== undefined ? !!features.optimizeTitle : true,
                    status: 'ACTIVE'
                }
            });
            console.log('Project created:', project.id);
        } catch (dbError) {
            console.error('Database Error (Project Create):', dbError);
            throw dbError;
        }

        // 2. 生成初始任务 (AICreationTask)
        const tasksData = [];
        for (let i = 0; i < actualTotalCount; i++) {
            // 计算发布日期
            const dayOffset = Math.floor(i / actualDailyLimit);
            let scheduledAt = new Date();
            scheduledAt.setDate(scheduledAt.getDate() + dayOffset);
            if (i === 0) {
                // 第一篇在 10 分钟后发布，给系统留出处理缓冲
                scheduledAt = new Date(Date.now() + 10 * 60 * 1000);
            } else {
                // 其他任务随机设置当天的具体小时 (9:00 - 17:00)
                scheduledAt.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60));
            }

            // 根据模式决定任务的 topic
            let taskTopic: string;
            if (mode === 'titles') {
                // 标题列表模式：直接使用用户提供的标题
                taskTopic = titlesList[i].trim();
            } else {
                // 主题批量模式：使用变体生成器
                taskTopic = generateUniqueTitle(topic, i, actualTotalCount);
            }

            tasksData.push({
                projectId: project.id,
                strategyId: project.strategyId,
                topic: taskTopic,
                keywords: project.keywords,
                status: 'PENDING' as const,
                scheduledAt
            });
        }

        console.log(`Attempting to create ${tasksData.length} tasks...`);

        // 批量创建任务
        try {
            await db.aICreationTask.createMany({
                data: tasksData
            });
            console.log('Tasks created successfully');
        } catch (dbError) {
            console.error('Database Error (Tasks Create):', dbError);
            throw dbError;
        }

        return NextResponse.json(project);
    } catch (error) {
        console.error('CRITICAL ERROR in automation project creation:', error);
        return NextResponse.json({
            error: 'Internal Server Error',
            details: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}



