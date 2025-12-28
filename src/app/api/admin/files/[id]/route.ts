import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { getActiveStorageProvider } from '@/lib/storage/factory';

// PUT /api/admin/files/[id] - 更新文件信息
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { description } = body;

        const file = await db.file.update({
            where: { id },
            data: {
                description,
            },
        });

        return NextResponse.json({ file });
    } catch (error) {
        console.error('Update file error:', error);
        return NextResponse.json(
            { error: 'Failed to update file' },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/files/[id] - 删除文件
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: '未授权' }, { status: 401 });
        }

        const file = await db.file.findUnique({
            where: { id },
        });

        if (!file) {
            return NextResponse.json({ error: '文件不存在' }, { status: 404 });
        }

        // 从存储中删除文件
        try {
            const storage = await getActiveStorageProvider();
            await storage.delete(file.storageKey);
        } catch (error) {
            console.error('Failed to delete file from storage:', error);
            // 继续删除数据库记录，即使存储删除失败
        }

        // 删除数据库记录
        await db.file.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete file error:', error);
        return NextResponse.json(
            { error: '删除文件失败' },
            { status: 500 }
        );
    }
}
