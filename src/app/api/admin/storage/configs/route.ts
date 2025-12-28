import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

// GET /api/admin/storage/configs - 获取所有存储配置
export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: '未授权' }, { status: 401 });
        }

        const configs = await db.storageConfig.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ configs });
    } catch (error) {
        console.error('Get storage configs error:', error);
        return NextResponse.json(
            { error: '获取存储配置失败' },
            { status: 500 }
        );
    }
}

// POST /api/admin/storage/configs - 创建存储配置
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: '未授权' }, { status: 401 });
        }

        const body = await request.json();
        const { name, provider, config, isActive } = body;

        if (!name || !provider) {
            return NextResponse.json(
                { error: '缺少必填字段' },
                { status: 400 }
            );
        }

        // 如果设置为激活，先将其他配置设为非激活
        if (isActive) {
            await db.storageConfig.updateMany({
                where: { isActive: true },
                data: { isActive: false },
            });
        }

        const storageConfig = await db.storageConfig.create({
            data: {
                name,
                provider,
                config,
                isActive: isActive || false,
            },
        });

        return NextResponse.json({ config: storageConfig });
    } catch (error) {
        console.error('Create storage config error:', error);
        return NextResponse.json(
            { error: '创建存储配置失败', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
