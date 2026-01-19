import { NextRequest, NextResponse } from 'next/server';
import { LicenseCache } from '@/lib/license/core/cache';
import { LICENSE_CONFIG } from '@/lib/license/config';
import fs from 'fs';
import path from 'path';

const LICENSE_SERVER_URL = LICENSE_CONFIG.SERVER_URL;

function logDebug(message: string, data?: any) {
    try {
        const logPath = path.join(process.cwd(), 'logs', 'license-debug.log');
        const logDir = path.dirname(logPath);
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${message} ${data ? JSON.stringify(data, null, 2) : ''}\n`;
        fs.appendFileSync(logPath, logMessage);
    } catch (e) {
        console.error('Logging failed', e);
    }
}

/**
 * POST /api/license/activate
 * 代理到远程授权服务器进行激活
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { licenseCode, domain } = body;

        logDebug('Activation request received', { licenseCode, domain });

        if (!licenseCode) {
            return NextResponse.json(
                { error: '授权码不能为空' },
                { status: 400 }
            );
        }

        // 获取当前域名
        const currentDomain = domain || process.env.NEXT_PUBLIC_SITE_URL || request.headers.get('host');

        logDebug('Calling server', { url: `${LICENSE_SERVER_URL}/api/license/activate`, currentDomain });

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

        logDebug('Server response', { status: response.status, success: data.success });

        if (!response.ok) {
            logDebug('Activation failed at server', data);
            return NextResponse.json(
                { error: data.error || '激活失败', message: data.message },
                { status: response.status }
            );
        }

        // 保存授权信息到本地缓存
        if (data.success && data.license) {
            try {
                logDebug('Saving to cache', data.license);
                LicenseCache.save(data.license);
                logDebug('Cache saved successfully');
            } catch (cacheError) {
                logDebug('Cache save failed', cacheError instanceof Error ? cacheError.message : cacheError);
                console.warn('保存授权缓存失败:', cacheError);
            }
        } else {
            logDebug('Data claim success but no license data found', data);
        }

        return NextResponse.json(data);

    } catch (error) {
        logDebug('Activation error (exception)', error instanceof Error ? error.message : error);
        console.error('License activation error:', error);
        return NextResponse.json(
            { error: '激活失败', message: error instanceof Error ? error.message : '网络错误' },
            { status: 500 }
        );
    }
}
