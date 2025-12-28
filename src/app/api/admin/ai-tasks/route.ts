import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET /api/admin/ai-tasks - List all tasks
export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        const tasks = await db.aICreationTask.findMany({
            where: status ? { status: status as any } : undefined,
            orderBy: { createdAt: 'desc' },
            include: {
                strategy: true,
                article: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                    },
                },
            },
            take: 100,
        });

        return NextResponse.json(tasks);
    } catch (error) {
        console.error('Error fetching AI tasks:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST /api/admin/ai-tasks - Create new tasks (batch)
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { strategyId, topics } = body; // topics is an array of {topic, keywords}

        if (!strategyId || !topics || !Array.isArray(topics) || topics.length === 0) {
            return NextResponse.json(
                { error: 'Strategy ID and topics are required' },
                { status: 400 }
            );
        }

        // Create tasks in batch
        const tasks = await db.aICreationTask.createMany({
            data: topics.map((item: { topic: string; keywords?: string }) => ({
                strategyId,
                topic: item.topic,
                keywords: item.keywords || null,
                status: 'PENDING',
            })),
        });

        return NextResponse.json({ created: tasks.count });
    } catch (error) {
        console.error('Error creating AI tasks:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE /api/admin/ai-tasks - Delete task(s)
export async function DELETE(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const ids = searchParams.get('ids');

        if (!id && !ids) {
            return NextResponse.json({ error: 'ID or IDs are required' }, { status: 400 });
        }

        if (ids) {
            const idList = ids.split(',').filter(Boolean);
            if (idList.length > 0) {
                await db.aICreationTask.deleteMany({
                    where: { id: { in: idList } },
                });
            }
        } else if (id) {
            await db.aICreationTask.delete({
                where: { id },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting AI task:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
