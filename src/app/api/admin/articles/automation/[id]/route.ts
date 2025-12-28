import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET /api/admin/articles/automation/[id] - 获取特定自动化项目及其任务
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const project = await db.articleAutomationProject.findUnique({
            where: { id },
            include: {
                category: true,
                strategy: true,
                tasks: {
                    orderBy: { scheduledAt: 'asc' },
                    include: {
                        article: {
                            select: {
                                id: true,
                                title: true,
                                slug: true,
                                status: true
                            }
                        }
                    }
                }
            }
        });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (error) {
        console.error('Error fetching automation project details:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PATCH /api/admin/articles/automation/[id] - 更新项目状态 (暂停/恢复)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { status } = body;

        const project = await db.articleAutomationProject.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json(project);
    } catch (error) {
        console.error('Error updating automation project:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE /api/admin/articles/automation/[id] - 删除项目及其所有任务
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await db.articleAutomationProject.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting automation project:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
