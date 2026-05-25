import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { LicenseManager } from '@/lib/license';
import { LicenseCache } from '@/lib/license/core/cache';
import { LicenseVerifier } from '@/lib/license/core/verifier';

/**
 * GET /api/license/info
 * 获取当前授权信息
 */
export async function GET() {
    try {
        // 从授权管理器获取授权信息（支持免授权虚拟数据）
        const license = LicenseManager.getLicense();

        if (!license) {
            return NextResponse.json({
                licensed: false,
                message: '未找到授权信息，请先激活授权'
            });
        }

        // 验证授权有效性
        const isValid = LicenseVerifier.quickVerify(license);
        const summary = LicenseVerifier.getSummary(license);

        return NextResponse.json({
            licensed: isValid,
            license: {
                licenseId: license.licenseId,
                licenseCode: license.licenseCode,
                plan: license.plan,
                status: license.status,
                domains: license.domains || [],
                features: summary.features,
                expiresAt: license.expiresAt,
                daysRemaining: summary.daysRemaining
            },
            cacheStats: LicenseCache.getStats()
        });

    } catch (error) {
        console.error('License info error:', error);
        return NextResponse.json({
            licensed: false,
            error: '获取授权信息失败'
        }, { status: 500 });
    }
}
