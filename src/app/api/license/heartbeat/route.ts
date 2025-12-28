import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient as LicenseClient } from '@prisma/client-license';
import { LicenseCache } from '@/lib/license/core/cache';

const licenseDb = new LicenseClient();

/**
 * POST /api/license/heartbeat
 * 接收客户端心跳
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            licenseId,
            fingerprint,
            domain,
            platform,
            version,
            cpuUsage,
            memoryUsage
        } = body;

        // 查找实例
        const instance = await licenseDb.licenseInstance.findUnique({
            where: { fingerprint },
            include: { license: true }
        });

        if (!instance) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'INSTANCE_NOT_FOUND',
                    message: '实例未找到'
                },
                { status: 404 }
            );
        }

        // 验证授权ID
        if (instance.licenseId !== licenseId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'LICENSE_MISMATCH',
                    message: '授权不匹配'
                },
                { status: 403 }
            );
        }

        // 更新实例状态
        await licenseDb.licenseInstance.update({
            where: { id: instance.id },
            data: {
                lastHeartbeat: new Date(),
                lastSeenAt: new Date(),
                status: 'online',
                domain: domain || instance.domain,
                version: version || instance.version
            }
        });

        // 记录心跳日志
        await licenseDb.licenseHeartbeat.create({
            data: {
                licenseId: instance.licenseId,
                instanceId: instance.id,
                status: 'success',
                cpuUsage: cpuUsage || null,
                memoryUsage: memoryUsage || null,
                timestamp: new Date()
            }
        });

        // 检查授权状态
        const shouldRevalidate =
            instance.license.status !== 'active' ||
            new Date(instance.license.expiresAt) < new Date();

        return NextResponse.json({
            success: true,
            serverTime: Date.now(),
            licenseStatus: instance.license.status,
            shouldRevalidate,
            message: shouldRevalidate ? '授权状态已更改，请重新验证' : undefined
        });
    } catch (error) {
        console.error('Heartbeat error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'INTERNAL_ERROR',
                message: '心跳处理失败'
            },
            { status: 500 }
        );
    }
}

/**
 * GET /api/license/heartbeat/status
 * 查询实例在线状态
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const licenseId = searchParams.get('licenseId');

        if (!licenseId) {
            return NextResponse.json(
                { error: '授权ID不能为空' },
                { status: 400 }
            );
        }

        const instances = await licenseDb.licenseInstance.findMany({
            where: { licenseId },
            select: {
                id: true,
                fingerprint: true,
                domain: true,
                platform: true,
                status: true,
                lastHeartbeat: true,
                activatedAt: true
            }
        });

        return NextResponse.json({
            instances,
            total: instances.length,
            online: instances.filter(i => i.status === 'online').length
        });
    } catch (error) {
        console.error('Status query error:', error);
        return NextResponse.json(
            { error: '查询失败' },
            { status: 500 }
        );
    }
}
