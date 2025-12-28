import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createPushService } from '@/lib/seo/push-service';

/**
 * POST /api/admin/seo/test
 * 测试SEO推送配置
 */
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { platform, apiUrl, token, siteId } = body;

        if (!platform || !apiUrl || !token) {
            return NextResponse.json(
                { error: '平台、API地址和Token都是必填项' },
                { status: 400 }
            );
        }

        // 生成测试URL
        const testUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}/test-connection-${Date.now()}`;

        try {
            const service = createPushService(platform, apiUrl, token, siteId);
            const result = await service.push([testUrl]);

            return NextResponse.json({
                success: result.success,
                message: result.success
                    ? '✅ 测试成功！配置有效，可以正常推送。'
                    : `❌ 测试失败：${result.message}`,
                details: {
                    platform,
                    testUrl,
                    response: result.response,
                    timestamp: new Date().toISOString()
                }
            });
        } catch (error: any) {
            // 详细的错误分析
            let errorType = '未知错误';
            let suggestion = '请检查配置';

            if (error.message.includes('fetch') || error.message.includes('network')) {
                errorType = '网络错误';
                suggestion = '请检查API地址是否正确，或者网络连接是否正常';
            } else if (error.message.includes('401') || error.message.includes('403')) {
                errorType = '认证错误';
                suggestion = '请检查Token是否正确，或者是否已过期';
            } else if (error.message.includes('404')) {
                errorType = 'API地址错误';
                suggestion = '请检查API地址是否正确';
            } else if (error.message.includes('timeout')) {
                errorType = '超时错误';
                suggestion = '请求超时，请稍后重试或检查网络连接';
            }

            return NextResponse.json({
                success: false,
                message: `❌ 测试失败：${errorType}`,
                details: {
                    error: error.message,
                    suggestion,
                    platform,
                    apiUrl,
                    timestamp: new Date().toISOString()
                }
            });
        }
    } catch (error: any) {
        console.error('Test SEO push error:', error);
        return NextResponse.json(
            {
                error: '测试失败',
                message: error.message
            },
            { status: 500 }
        );
    }
}
