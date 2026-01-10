import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { createPushService } from '@/lib/seo/push-service';
import { SEO_PLATFORMS } from '@/lib/seo/platform-config';

// POST /api/admin/seo/push - Push URLs to search engines
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { urls, platforms } = body; // platforms is array of platform names, or "all"

        if (!urls || !Array.isArray(urls) || urls.length === 0) {
            return NextResponse.json({ error: 'URLs are required' }, { status: 400 });
        }

        // Get active configs
        const configs = await db.sEOPushConfig.findMany({
            where: {
                isActive: true,
                ...(platforms && platforms !== 'all' ? { platform: { in: platforms } } : {}),
            },
        });

        // 过滤掉仅支持脚本收录的平台（这些平台不支持 API 推送）
        const apiConfigs = configs.filter(config => {
            const platformCfg = SEO_PLATFORMS[config.platform];
            return platformCfg && (platformCfg.pushType === 'api' || platformCfg.pushType === 'both');
        });

        if (apiConfigs.length === 0) {
            return NextResponse.json({
                error: '没有发现支持 API 推送的激活配置',
                results: []
            }, { status: 200 }); // 返回 200 避免前端报错，但告知没任务
        }

        // Push to each platform
        const results = await Promise.all(
            apiConfigs.map(async (config) => {
                try {
                    const service = createPushService(
                        config.platform,
                        config.apiUrl || '',
                        config.token || '',
                        config.siteId || undefined
                    );

                    const result = await service.push(urls);

                    // Log the push
                    await db.sEOPushLog.create({
                        data: {
                            configId: config.id,
                            url: urls.join(','),
                            status: result.success ? 'success' : 'failed',
                            response: JSON.stringify(result.response || {}),
                        },
                    });

                    // Update last push time
                    await db.sEOPushConfig.update({
                        where: { id: config.id },
                        data: { lastPushAt: new Date() },
                    });

                    return {
                        platform: config.platform,
                        ...result,
                    };
                } catch (error: any) {
                    return {
                        platform: config.platform,
                        success: false,
                        message: error.message,
                    };
                }
            })
        );

        return NextResponse.json({ results });
    } catch (error) {
        console.error('Error pushing URLs:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
