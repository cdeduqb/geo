import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createPushService } from '@/lib/seo/push-service';

import { fillApiTemplate } from '@/lib/seo/platform-config';
import { getSiteUrl } from '@/lib/system-settings';

// POST /api/admin/seo/test - Test connection to search engine API
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { platform, apiUrl, token, siteId } = body;

        if (!platform || !apiUrl || !token) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 填充模板中的变量
        const finalApiUrl = fillApiTemplate(apiUrl, siteId, token);

        // 创建服务并进行测试推送（推送网站首页作为测试）
        // 注意：有些平台可能不支持推送首页，或者已经推送过。
        // 一个更好的办法是调用该平台的特定的查询余额或查询站点信息的 API（如果存在）。
        // 目前我们简单地尝试推送首页。
        // 使用配置的站点 URL 进行测试，这比 request.nextUrl.origin 更准确
        const baseUrl = await getSiteUrl();
        const testUrl = [baseUrl];

        const service = createPushService(platform, finalApiUrl, token, siteId);

        // 我们尝试推送，捕获详情错误
        const result = await service.push(testUrl);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Error testing SEO push:', error);
        return NextResponse.json({
            success: false,
            message: '测试失败: ' + (error.message || '未知错误')
        }, { status: 500 });
    }
}
