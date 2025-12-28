import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { getActiveStorageProvider } from '@/lib/storage/factory';

// GET /api/admin/files - 获取文件列表
export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: '未授权' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const folder = searchParams.get('folder');

        const skip = (page - 1) * limit;

        // 构建查询条件
        const where: any = {};

        if (category) {
            where.category = category;
        }

        if (folder) {
            where.folder = folder;
        }

        if (search) {
            where.filename = {
                contains: search,
            };
        }

        // 查询文件
        const [files, total] = await Promise.all([
            db.file.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: {
                    uploadedBy: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            }),
            db.file.count({ where }),
        ]);

        return NextResponse.json({
            files,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get files error:', error);
        return NextResponse.json(
            { error: '获取文件列表失败' },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/files?ids=1,2,3 - 批量删除文件
export async function DELETE(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: '未授权' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const ids = searchParams.get('ids')?.split(',').filter(Boolean);

        if (!ids || ids.length === 0) {
            return NextResponse.json({ error: '无效的请求' }, { status: 400 });
        }

        const files = await db.file.findMany({
            where: {
                id: { in: ids },
            },
        });

        // Delete from storage
        const storage = await getActiveStorageProvider();

        await Promise.all(
            files.map(async (file) => {
                try {
                    await storage.delete(file.storageKey);
                } catch (error) {
                    console.error(`Failed to delete file ${file.id} from storage:`, error);
                }
            })
        );

        // Delete from database
        await db.file.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        return NextResponse.json({ success: true, count: files.length });
    } catch (error) {
        console.error('Batch delete files error:', error);
        return NextResponse.json(
            { error: '批量删除失败' },
            { status: 500 }
        );
    }
}
