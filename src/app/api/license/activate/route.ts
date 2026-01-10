import { NextRequest, NextResponse } from 'next/server';
import { LicenseCache } from '@/lib/license/core/cache';

import { LICENSE_CONFIG } from '@/lib/license/config';

const LICENSE_SERVER_URL = LICENSE_CONFIG.SERVER_URL;

/**
 * POST /api/license/activate
 * 代理到远程授权服务器进行激活
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { licenseCode, domain } = body;

        if (!licenseCode) {
            return NextResponse.json(
                { error: '授权码不能为空' },
                { status: 400 }
            );
        }

        // 获取当前域名
        const currentDomain = domain || process.env.NEXT_PUBLIC_SITE_URL || request.headers.get('host');

        // 调用远程授权服务器
        const response = await fetch(`${LICENSE_SERVER_URL}/api/license/activate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                licenseCode,
                domain: currentDomain,
                deviceInfo: {
                    platform: process.platform,
                    version: process.env.npm_package_version || '1.0.0'
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.error || '激活失败', message: data.message },
                { status: response.status }
            );
        }

        // 保存授权信息到本地缓存
        if (data.success && data.license) {
            try {
                LicenseCache.save(data.license);
            } catch (cacheError) {
                console.warn('保存授权缓存失败:', cacheError);
            }
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error('License activation error:', error);
        return NextResponse.json(
            { error: '激活失败', message: error instanceof Error ? error.message : '网络错误' },
            { status: 500 }
        );
    }
}
