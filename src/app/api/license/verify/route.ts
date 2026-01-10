import { NextRequest, NextResponse } from 'next/server';
import { LicenseCache } from '@/lib/license/core/cache';
import { LicenseVerifier } from '@/lib/license/core/verifier';

import { LICENSE_CONFIG } from '@/lib/license/config';

const LICENSE_SERVER_URL = LICENSE_CONFIG.SERVER_URL;

/**
 * POST /api/license/verify
 * 验证授权有效性
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { licenseCode, domain } = body;

        // 首先检查本地缓存
        const cachedLicense = LicenseCache.getLicense();

        if (cachedLicense) {
            // 本地验证签名和有效期
            const localResult = await LicenseVerifier.verify(cachedLicense, {
                checkDomain: !!domain,
                currentDomain: domain || process.env.NEXT_PUBLIC_SITE_URL,
                checkExpiration: true
            });

            // 如果本地验证通过且不需要重新验证，直接返回
            if (localResult.valid && !LicenseCache.needsRevalidation()) {
                return NextResponse.json({
                    valid: true,
                    license: cachedLicense,
                    message: '授权有效（本地验证）',
                    verifiedAt: Date.now(),
                    isOnline: false
                });
            }
        }

        // 需要在线验证
        try {
            const response = await fetch(`${LICENSE_SERVER_URL}/api/license/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    licenseCode: licenseCode || cachedLicense?.licenseCode,
                    domain: domain || process.env.NEXT_PUBLIC_SITE_URL
                })
            });

            const data = await response.json();

            // 更新本地缓存
            if (data.valid && data.license) {
                try {
                    LicenseCache.save(data.license);
                } catch (cacheError) {
                    console.warn('更新授权缓存失败:', cacheError);
                }
            }

            return NextResponse.json(data);

        } catch (networkError) {
            // 网络失败时使用本地缓存
            if (cachedLicense && LicenseCache.isInGracePeriod()) {
                return NextResponse.json({
                    valid: true,
                    license: cachedLicense,
                    message: '授权有效（离线模式）',
                    verifiedAt: Date.now(),
                    isOnline: false
                });
            }

            throw networkError;
        }

    } catch (error) {
        console.error('License verification error:', error);
        return NextResponse.json({
            valid: false,
            error: 'VERIFICATION_FAILED',
            message: '验证失败'
        }, { status: 500 });
    }
}

/**
 * GET /api/license/verify
 * 快速验证
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const licenseCode = searchParams.get('licenseCode');
    const domain = searchParams.get('domain');

    // 首先检查本地缓存
    const cachedLicense = LicenseCache.getLicense();

    if (cachedLicense) {
        const isValid = LicenseVerifier.quickVerify(cachedLicense);
        const daysRemaining = LicenseVerifier.getDaysRemaining(cachedLicense);

        return NextResponse.json({
            valid: isValid,
            license: {
                licenseId: cachedLicense.licenseId,
                plan: cachedLicense.plan,
                status: cachedLicense.status,
                expiresAt: cachedLicense.expiresAt,
                daysRemaining
            }
        });
    }

    return NextResponse.json({
        valid: false,
        error: 'NO_LICENSE',
        message: '未找到授权信息'
    });
}
