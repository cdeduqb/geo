import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * 许可证 Ping API
 * 向授权服务器上报站点信息，用于商业授权管理
 * 
 * 通过服务端执行，避免客户端 CSP 限制
 */
export async function POST(request: NextRequest) {
    try {
        // 获取授权服务器 URL
        const licenseServerUrl = await getLicenseServerUrl();

        if (!licenseServerUrl) {
            return NextResponse.json({ success: false, error: 'License server URL not configured' });
        }

        // 获取站点信息
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.headers.get('host') || 'unknown';
        const domain = new URL(siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`).hostname;

        // 获取版本信息
        const version = process.env.APP_VERSION || '1.0.0';

        // 获取更多站点信息
        let siteTitle = '';
        let adminEmail = '';

        try {
            // 从数据库获取站点标题
            const siteSetting = await db.systemSetting.findFirst({
                where: { key: 'site_name' }
            });
            siteTitle = siteSetting?.value || '';

            // 获取管理员邮箱（第一个管理员）
            const admin = await db.user.findFirst({
                where: { role: 'ADMIN' },
                select: { email: true }
            });
            adminEmail = admin?.email || '';
        } catch (e) {
            // 静默处理
        }

        // 服务器信息
        const serverInfo = JSON.stringify({
            nodeVersion: process.version,
            platform: process.platform,
            arch: process.arch
        });

        // 向授权服务器发送 ping
        const pingUrl = `${licenseServerUrl}/api/license/ping`;

        const response = await fetch(pingUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                domain,
                version,
                siteUrl: siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`,
                siteTitle,
                adminEmail,
                serverInfo,
                timestamp: new Date().toISOString()
            }),
            // 设置超时，避免阻塞
            signal: AbortSignal.timeout(5000)
        });

        if (response.ok) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, status: response.status });
        }
    } catch (error) {
        // 静默处理错误，不影响正常使用
        console.log('License ping failed (non-critical):', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json({ success: false, error: 'Ping failed' });
    }
}

/**
 * 获取授权服务器 URL
 * 优先从数据库读取，其次从环境变量
 */
async function getLicenseServerUrl(): Promise<string | null> {
    try {
        // 尝试从数据库获取
        const setting = await db.systemSetting.findFirst({
            where: { key: 'license_server_url' }
        });

        if (setting?.value) {
            return setting.value;
        }
    } catch (e) {
        // 数据库读取失败，使用环境变量
    }

    // 从环境变量获取
    return process.env.LICENSE_SERVER_URL || null;
}

