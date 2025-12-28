import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// POST /api/admin/storage/configs/[id]/activate - 激活存储配置
export async function POST(
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

        // 将所有配置设为非激活
        await db.storageConfig.updateMany({
            data: { isActive: false },
        });

        // 激活当前配置
        const updatedConfig = await db.storageConfig.update({
            where: { id },
            data: { isActive: true },
        });

        return NextResponse.json({ config: updatedConfig });
    } catch (error) {
        console.error('Activate storage config error:', error);
        return NextResponse.json(
            { error: '激活存储配置失败' },
            { status: 500 }
        );
    }
}
