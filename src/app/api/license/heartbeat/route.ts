import { NextRequest, NextResponse } from 'next/server';
import { LicenseCache } from '@/lib/license/core/cache';

import { LICENSE_CONFIG } from '@/lib/license/config';

const LICENSE_SERVER_URL = LICENSE_CONFIG.SERVER_URL;

/**
 * POST /api/license/heartbeat
 * 发送心跳到远程授权服务器
 */
export async function POST(request: NextRequest) {
    // 检查是否禁用心跳
    if (process.env.DISABLE_LICENSE_HEARTBEAT === 'true') {
        return NextResponse.json({
            success: true,
            message: '心跳已禁用',
            serverTime: Date.now()
        });
    }

    try {
        const body = await request.json();
        const cachedLicense = LicenseCache.getLicense();

        if (!cachedLicense) {
            return NextResponse.json({
                success: false,
                error: 'NO_LICENSE',
                message: '未找到授权信息'
            }, { status: 404 });
        }

        // 发送心跳到远程服务器
        const response = await fetch(`${LICENSE_SERVER_URL}/api/license/heartbeat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                licenseId: cachedLicense.licenseId,
                licenseCode: cachedLicense.licenseCode,
                fingerprint: cachedLicense.fingerprint,
                domain: process.env.NEXT_PUBLIC_SITE_URL,
                platform: process.platform,
                version: process.env.npm_package_version || '1.0.0',
                ...body
            })
        });

        const data = await response.json();

        // 如果需要重新验证，刷新缓存
        if (data.shouldRevalidate) {
            LicenseCache.refresh();
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error('Heartbeat error:', error);

        // 设置离线宽限期
        try {
            LicenseCache.setOfflineGracePeriod();
        } catch (e) {
            // 忽略
        }

        return NextResponse.json({
            success: true,
            message: '心跳发送失败，进入离线模式',
            serverTime: Date.now()
        });
    }
}
