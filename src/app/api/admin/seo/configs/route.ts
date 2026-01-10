import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { SEO_PLATFORMS, AVAILABLE_PLATFORMS } from '@/lib/seo/platform-config';

// GET /api/admin/seo/configs - List all configs
export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const configs = await db.sEOPushConfig.findMany({
            orderBy: { platform: 'asc' },
            include: {
                _count: {
                    select: { pushLogs: true }
                }
            }
        });

        return NextResponse.json(configs);
    } catch (error) {
        console.error('Error fetching SEO configs:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST /api/admin/seo/configs - Create new config
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { platform, apiUrl, token, siteId, script, isActive } = body;

        // 验证平台是否在支持列表中
        if (!platform || !AVAILABLE_PLATFORMS.includes(platform)) {
            return NextResponse.json({
                error: '无效的平台类型',
                message: `支持的平台: ${AVAILABLE_PLATFORMS.join(', ')}`
            }, { status: 400 });
        }

        const platformConfig = SEO_PLATFORMS[platform];

        // 根据平台类型验证必填字段
        if (platformConfig.pushType === 'api' || platformConfig.pushType === 'both') {
            if (platformConfig.requiresToken && !token) {
                return NextResponse.json({
                    error: `${platformConfig.name} 平台需要提供 Token`
                }, { status: 400 });
            }
            if (platformConfig.requiresSiteId && !siteId) {
                return NextResponse.json({
                    error: `${platformConfig.name} 平台需要提供站点 ID`
                }, { status: 400 });
            }
        }

        const config = await db.sEOPushConfig.create({
            data: {
                platform,
                apiUrl: apiUrl || null,
                token: token || null,
                siteId: siteId || null,
                script: script || null,
                isActive: isActive ?? true,
            },
        });

        return NextResponse.json(config);
    } catch (error: any) {
        console.error('Error creating SEO config:', error);

        // 处理唯一约束冲突
        if (error.code === 'P2002') {
            return NextResponse.json({
                error: '该平台配置已存在',
                message: '每个平台只能有一个配置'
            }, { status: 400 });
        }

        return NextResponse.json({
            error: error.message || 'Internal Server Error',
            message: '创建配置失败'
        }, { status: 500 });
    }
}

// PUT /api/admin/seo/configs - Update config
export async function PUT(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, platform, apiUrl, token, siteId, script, isActive } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const config = await db.sEOPushConfig.update({
            where: { id },
            data: {
                platform,
                apiUrl: apiUrl || null,
                token: token || null,
                siteId: siteId || null,
                script: script || null,
                isActive,
            },
        });

        return NextResponse.json(config);
    } catch (error: any) {
        console.error('Error updating SEO config:', error);
        return NextResponse.json({
            error: error.message || 'Internal Server Error',
            message: '更新配置失败'
        }, { status: 500 });
    }
}

// DELETE /api/admin/seo/configs - Delete config
export async function DELETE(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await db.sEOPushConfig.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting SEO config:', error);
        return NextResponse.json({
            error: error.message || 'Internal Server Error',
            message: '删除配置失败'
        }, { status: 500 });
    }
}
