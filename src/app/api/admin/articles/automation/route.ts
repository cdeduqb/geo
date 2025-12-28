import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

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
                // 第一篇立即发布，以便用户立刻看到效果
                scheduledAt = new Date();
            } else {
                // 其他任务随机设置当天的具体小时 (9:00 - 17:00)
                scheduledAt.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60));
            }

            tasksData.push({
                projectId: project.id,
                strategyId: project.strategyId,
                topic: `${project.name} - 第 ${i + 1} 篇: ${project.topic.slice(0, 30)}`,
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
