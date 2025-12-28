import { NextRequest, NextResponse } from 'next/server';
import { LicenseVerifier } from '@/lib/license/core/verifier';
import { LicenseCache } from '@/lib/license/core/cache';
import { FingerprintGenerator } from '@/lib/license/fingerprint/generator';
import { LicenseData, VerifyOptions } from '@/lib/license/types';

/**
 * POST /api/license/verify
 * 验证授权有效性
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { licenseCode, fingerprint, domain, options } = body;

        // 从缓存加载授权
        let licenseData: LicenseData | null = LicenseCache.getLicense();

        // 如果提供了授权码但缓存不存在或不匹配，返回错误
        if (licenseCode && (!licenseData || licenseData.licenseCode !== licenseCode)) {
            return NextResponse.json(
                {
                    valid: false,
                    error: 'LICENSE_NOT_FOUND',
                    message: '授权未找到，请先激活'
                },
                { status: 404 }
            );
        }

        // 如果没有缓存，返回错误
        if (!licenseData) {
            return NextResponse.json(
                {
                    valid: false,
                    error: 'NO_LICENSE',
                    message: '未找到授权信息'
                },
                { status: 404 }
            );
        }

        // 验证选项
        const verifyOptions: VerifyOptions = {
            checkDomain: options?.checkDomain !== false,
            checkFingerprint: options?.checkFingerprint !== false,
            checkExpiration: options?.checkExpiration !== false,
            currentDomain: domain || request.headers.get('host') || undefined,
            allowOffline: options?.allowOffline ?? true,
            strictMode: options?.strictMode ?? false
        };

        // 执行验证
        const result = await LicenseVerifier.verify(licenseData, verifyOptions);

        // 如果验证成功，刷新缓存
        if (result.valid) {
            LicenseCache.updateLastVerified();
        }

        return NextResponse.json({
            valid: result.valid,
            license: result.valid ? {
                licenseId: licenseData.licenseId,
                plan: licenseData.plan,
                status: licenseData.status,
                expiresAt: licenseData.expiresAt,
                features: licenseData.features,
                domains: licenseData.domains
            } : undefined,
            error: result.error,
            message: result.errorMessage,
            warnings: result.warnings,
            details: result.details,
            verifiedAt: result.verifiedAt,
            isOnline: result.isOnline
        });
    } catch (error) {
        console.error('License verification error:', error);
        return NextResponse.json(
            {
                valid: false,
                error: 'INTERNAL_ERROR',
                message: '验证过程发生错误'
            },
            { status: 500 }
        );
    }
}

/**
 * GET /api/license/verify
 * 快速验证（仅检查缓存）
 */
export async function GET() {
    try {
        const licenseData = LicenseCache.getLicense();

        if (!licenseData) {
            return NextResponse.json({
                valid: false,
                error: 'NO_LICENSE',
                message: '未找到授权信息'
            });
        }

        const valid = LicenseVerifier.quickVerify(licenseData);

        return NextResponse.json({
            valid,
            license: valid ? {
                licenseId: licenseData.licenseId,
                plan: licenseData.plan,
                status: licenseData.status,
                expiresAt: licenseData.expiresAt,
                daysRemaining: LicenseVerifier.getDaysRemaining(licenseData)
            } : undefined
        });
    } catch (error) {
        console.error('Quick verification error:', error);
        return NextResponse.json(
            {
                valid: false,
                error: 'INTERNAL_ERROR',
                message: '验证失败'
            },
            { status: 500 }
        );
    }
}
