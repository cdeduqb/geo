import { NextResponse } from 'next/server';
import { PrismaClient as LicenseClient } from '@prisma/client-license';

const licenseDb = new LicenseClient();

/**
 * GET /api/license-admin/domains  
 * 获取所有安装GeoCMS的域名及授权状态
 */
export async function GET() {
    try {
        // 获取所有已激活的实例
        const instances = await licenseDb.licenseInstance.findMany({
            include: {
                license: true
            },
            orderBy: {
                activatedAt: 'desc'
            }
        });

        // 构建域名列表
        const domains = instances.map(instance => ({
            domain: instance.domain || 'localhost',
            isLicensed: instance.license?.status === 'active' && new Date(instance.license.expiresAt) > new Date(),
            licenseCode: instance.license?.licenseCode || null,
            plan: instance.license?.plan || null,
            activatedAt: instance.activatedAt,
            expiresAt: instance.license?.expiresAt || null,
            status: instance.status,
            fingerprint: instance.fingerprint,
            platform: instance.platform
        }));

        // 统计信息
        const stats = {
            total: domains.length,
            licensed: domains.filter(d => d.isLicensed).length,
            unlicensed: domains.filter(d => !d.isLicensed).length
        };

        return NextResponse.json({
            domains,
            stats
        });

    } catch (error) {
        console.error('Get domains error:', error);
        return NextResponse.json(
            { error: '获取域名列表失败' },
            { status: 500 }
        );
    }
}
