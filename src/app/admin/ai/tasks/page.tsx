export const dynamic = 'force-dynamic';

import { db } from '@/lib/db';
import AITaskContainer from './_components/AITaskContainer';

export const metadata = {
    title: '批量 AI 创作 - GeoCMS 管理后台',
};

export default async function AITasksPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedSearchParams = await searchParams;
    const page = Number(resolvedSearchParams.page) || 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const [tasks, totalCount, strategies, pendingCount, processingCount, completedCount, failedCount] = await Promise.all([
        db.aICreationTask.findMany({
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
            skip,
            take: pageSize,
        }),
        db.aICreationTask.count(),
        db.aIStrategy.findMany({
            orderBy: { createdAt: 'desc' },
        }),
        // Count by status separately because we are paginating
        db.aICreationTask.count({ where: { status: 'PENDING' } }),
        db.aICreationTask.count({ where: { status: 'PROCESSING' } }),
        db.aICreationTask.count({ where: { status: 'COMPLETED' } }),
        db.aICreationTask.count({ where: { status: 'FAILED' } }),
    ]);

    const stats = {
        pending: pendingCount,
        processing: processingCount,
        completed: completedCount,
        failed: failedCount,
    };

    const pagination = {
        page,
        totalPages: Math.ceil(totalCount / pageSize),
        totalCount,
    };

    return (
        <AITaskContainer
            tasks={tasks}
            strategies={strategies}
            stats={stats}
            pagination={pagination}
        />
    );
}
