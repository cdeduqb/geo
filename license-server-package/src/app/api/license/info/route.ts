import { NextResponse } from 'next/server';
import { PrismaClient as LicenseClient } from '@prisma/client-license';
import { FingerprintGenerator } from '@/lib/license/fingerprint/generator';

const licenseDb = new LicenseClient();

/**
 * GET /api/license/info
 * 获取当前授权信息（从数据库查询，不依赖缓存）
 */
export async function GET() {
    try {
        // 生成硬件指纹
        const fingerprint = await FingerprintGenerator.generate();

        // 通过硬件指纹查询激活的实例
        const instance = await licenseDb.licenseInstance.findUnique({
            where: { fingerprint },
            include: {
                license: {
                    include: {
                        customer: true
                    }
                }
            }
        });

        if (!instance || !instance.license) {
            return NextResponse.json({
                licensed: false,
                message: '未找到授权信息'
            });
        }

        const license = instance.license;

        // 检查授权状态
        const isActive = license.status === 'active';
        const notExpired = new Date(license.expiresAt) > new Date();
        const isValid = isActive && notExpired;

        if (!isValid) {
            return NextResponse.json({
                licensed: false,
                message: license.status !== 'active' ? '授权已被禁用' : '授权已过期'
            });
        }

        // 计算剩余天数
        const daysRemaining = Math.ceil(
            (new Date(license.expiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000)
        );

        // 提取功能列表
        const features = license.features as any || {};
        const featureList = Object.entries(features)
            .filter(([_, value]) => value === true || typeof value === 'number')
            .map(([key]) => key);

        return NextResponse.json({
            licensed: true,
            license: {
                licenseId: license.id,
                licenseCode: license.licenseCode,
                plan: license.plan,
                status: license.status,
                domains: license.domains as string[] || [],
                features: featureList,
                expiresAt: new Date(license.expiresAt).getTime(),
                daysRemaining,
                issuedAt: new Date(license.issuedAt).getTime()
            },
            cache: {
                source: 'database',
                instanceId: instance.id,
                activatedAt: instance.activatedAt,
                lastSeenAt: instance.lastSeenAt
            }
        });

    } catch (error) {
        console.error('License info error:', error);
        return NextResponse.json(
            {
                licensed: false,
                error: '获取授权信息失败'
            },
            { status: 500 }
        );
    }
}
