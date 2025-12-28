import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// PUT /api/admin/storage/configs/[id] - 更新存储配置
export async function PUT(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: '未授权' }, { status: 401 });
        }

        const { id } = await params;

        const body = await request.json();
        const { name, provider, config, isActive } = body;

        const existingConfig = await db.storageConfig.findUnique({
            where: { id },
        });

        if (!existingConfig) {
            return NextResponse.json({ error: '配置不存在' }, { status: 404 });
        }

        // 如果设置为激活，先将其他配置设为非激活
        if (isActive) {
            await db.storageConfig.updateMany({
                where: {
                    isActive: true,
                    id: { not: id }
                },
                data: { isActive: false },
            });
        }

        const storageConfig = await db.storageConfig.update({
            where: { id },
            data: {
                name,
                provider,
                config,
                isActive,
            },
        });

        return NextResponse.json({ config: storageConfig });
    } catch (error) {
        console.error('Update storage config error:', error);
        return NextResponse.json(
            { error: '更新存储配置失败' },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/storage/configs/[id] - 删除存储配置
export async function DELETE(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: '未授权' }, { status: 401 });
        }

        const { id } = await params;

        const config = await db.storageConfig.findUnique({
            where: { id },
        });

        if (!config) {
            return NextResponse.json({ error: '配置不存在' }, { status: 404 });
        }

        if (config.isActive) {
            return NextResponse.json(
                { error: '无法删除激活的配置' },
                { status: 400 }
            );
        }

        await db.storageConfig.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete storage config error:', error);
        return NextResponse.json(
            { error: '删除存储配置失败' },
            { status: 500 }
        );
    }
}
