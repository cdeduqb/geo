import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ taskId: string }> } // Use Promise based params
) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const params = await context.params;
        const { taskId } = params;

        const body = await request.json();
        const { action } = body;

        if (action === 'run_now') {
            // Update scheduledAt to now to allow immediate processing
            // Also reset status to PENDING if it was failed, so it can be retried
            const task = await db.aICreationTask.update({
                where: { id: taskId },
                data: {
                    scheduledAt: new Date(),
                    status: 'PENDING',
                    error: null
                }
            });
            return NextResponse.json(task);
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Error updating task:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
