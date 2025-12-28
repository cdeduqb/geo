import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { triggerManualProcessing } from '@/lib/cron/ai-tasks';

// POST /api/admin/cron/trigger - Manually trigger cron job
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Trigger the processing in the background
        triggerManualProcessing().catch(error => {
            console.error('Manual cron trigger error:', error);
        });

        return NextResponse.json({
            message: '批量任务处理已启动，请稍后查看任务状态',
            triggered: true
        });
    } catch (error) {
        console.error('Error triggering cron:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
