import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient as LicenseClient } from '@prisma/client-license';
import { FingerprintGenerator } from '@/lib/license/fingerprint/generator';

const licenseDb = new LicenseClient();

/**
 * POST /api/license/activate
 * 激活授权（一码一域名，只能使用一次）
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

        if (!domain) {
            return NextResponse.json(
                { error: '域名不能为空' },
                { status: 400 }
            );
        }

        // 查询授权
        const license = await licenseDb.license.findUnique({
            where: { licenseCode },
            include: {
                customer: true
            }
        });

        if (!license) {
            return NextResponse.json(
                { error: '授权码无效' },
                { status: 404 }
            );
        }

        // 检查是否已经被使用（查询已有实例）
        const existingInstances = await licenseDb.licenseInstance.findMany({
            where: { licenseId: license.id }
        });

        if (existingInstances.length > 0) {
            return NextResponse.json(
                { error: '此授权码已被使用，每个授权码只能激活一次' },
                { status: 403 }
            );
        }

        // 检查状态
        if (license.status !== 'active') {
            return NextResponse.json(
                { error: `授权状态异常：${license.status}` },
                { status: 403 }
            );
        }

        // 检查过期
        if (new Date(license.expiresAt) < new Date()) {
            return NextResponse.json(
                { error: '授权已过期' },
                { status: 403 }
            );
        }

        // 验证域名匹配
        const licenseDomains = license.domains as string[] || [];
        if (licenseDomains.length > 0) {
            const domainMatch = licenseDomains.some(licenseDomain => {
                // 去除协议和端口，只比较域名
                const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/:\d+$/, '').split('/')[0];
                const cleanLicenseDomain = licenseDomain.replace(/^https?:\/\//, '').replace(/:\d+$/, '').split('/')[0];
                return cleanDomain === cleanLicenseDomain || cleanDomain.endsWith('.' + cleanLicenseDomain);
            });

            if (!domainMatch) {
                return NextResponse.json(
                    { error: `域名不匹配。授权域名：${licenseDomains.join(', ')}` },
                    { status: 403 }
                );
            }
        }

        // 生成硬件指纹
        const fingerprint = await FingerprintGenerator.generate();
        const deviceInfo = await FingerprintGenerator.getDeviceInfo();

        // 创建实例（第一次也是唯一一次激活）
        const instance = await licenseDb.licenseInstance.create({
            data: {
                licenseId: license.id,
                fingerprint,
                domain: domain || null,
                platform: deviceInfo.system.platform,
                version: process.env.npm_package_version || '1.0.0',
                isVirtual: deviceInfo.isVirtualMachine,
                isContainer: deviceInfo.isContainer,
                status: 'online',
                activatedAt: new Date(),
                lastSeenAt: new Date()
            }
        });

        // 更新授权状态
        await licenseDb.license.update({
            where: { id: license.id },
            data: {
                currentActivations: 1,  // 固定为1
                lastActivatedAt: new Date()
            }
        });

        return NextResponse.json({
            success: true,
            license: {
                licenseId: license.id,
                plan: license.plan,
                expiresAt: license.expiresAt,
                domain: domain
            },
            instanceId: instance.id,
            message: '授权激活成功'
        });

    } catch (error) {
        console.error('License activation error:', error);
        return NextResponse.json(
            { error: '激活失败' },
            { status: 500 }
        );
    }
}
