import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            console.error('[Cleanup API] Auth failed: No user found in session');
            return NextResponse.json({ error: 'Unauthorized', details: 'No active session' }, { status: 401 });
        }

        if (user.role !== 'ADMIN' && user.role !== 'EDITOR') {
            console.error(`[Cleanup API] Auth failed: User ${user.email} has role ${user.role}, ADMIN required`);
            return NextResponse.json({ error: 'Unauthorized', details: 'Admin privileges required' }, { status: 401 });
        }

        const body = await request.json();
        const { type } = body;
        let deletedCount = 0;
        let message = '';

        switch (type) {
            case 'temp_pages':
                const pageResult = await db.page.deleteMany({
                    where: {
                        OR: [
                            { slug: { startsWith: 'temp-' } },
                            { title: { startsWith: 'temp-' } }
                        ]
                    }
                });
                deletedCount = pageResult.count;
                message = `成功清理 ${deletedCount} 个临时页面`;
                break;

            case 'draft_articles':
                // 清理超过 30 天的草稿文章
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                const articleResult = await db.article.deleteMany({
                    where: {
                        status: 'DRAFT',
                        createdAt: { lte: thirtyDaysAgo }
                    }
                });
                deletedCount = articleResult.count;
                message = `成功清理 ${deletedCount} 篇超过30天的草稿文章`;
                break;

            case 'failed_ai_tasks':
                const taskResult = await db.aICreationTask.deleteMany({
                    where: {
                        status: 'FAILED'
                    }
                });
                deletedCount = taskResult.count;
                message = `成功清理 ${deletedCount} 条失败的 AI 创作任务`;
                break;

            case 'seo_push_logs':
                const seoLogResult = await db.sEOPushLog.deleteMany({
                    where: {
                        createdAt: { lte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // 清理一周前的日志
                    }
                });
                deletedCount = seoLogResult.count;
                message = `成功清理 ${deletedCount} 条一周前的 SEO 推送日志`;
                break;

            case 'crawler_logs':
                const crawlerLogResult = await db.crawlerLog.deleteMany({
                    where: {
                        createdAt: { lte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
                    }
                });
                deletedCount = crawlerLogResult.count;
                message = `成功清理 ${deletedCount} 条一周前的爬虫抓取日志`;
                break;

            case 'nextjs_cache':
                revalidatePath('/', 'layout');
                message = '全站缓存重置命令已发出';
                break;

            default:
                return NextResponse.json({ error: 'Invalid cleanup type' }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            deletedCount,
            message
        });
    } catch (error: any) {
        console.error('Cleanup error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
