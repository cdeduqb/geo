import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { getActiveStorageProvider, getFileCategory, generateFileKey } from '@/lib/storage/factory';
import sharp from 'sharp';

// POST /api/admin/files/upload - 上传文件
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: '未授权' }, { status: 401 });
        }

        // 获取表单数据
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const category = formData.get('category') as string | null;
        const folder = formData.get('folder') as string | null;
        const description = formData.get('description') as string | null;


        if (!file) {
            return NextResponse.json({ error: '未提供文件' }, { status: 400 });
        }

        // 文件大小限制 (10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json({ error: '文件大小超过限制 (10MB)' }, { status: 400 });
        }

        // 读取文件buffer
        const arrayBuffer = await file.arrayBuffer();
        let buffer: any = Buffer.from(arrayBuffer);

        // 如果是图片，获取尺寸并可选压缩
        let width: number | undefined;
        let height: number | undefined;

        if (file.type.startsWith('image/')) {
            try {
                const metadata = await sharp(buffer).metadata();
                width = metadata.width;
                height = metadata.height;

                // 如果图片太大，进行压缩
                if (width && height && (width > 2000 || height > 2000)) {
                    const resizedBuffer = await sharp(buffer)
                        .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
                        .jpeg({ quality: 85 })
                        .toBuffer();
                    buffer = resizedBuffer as Buffer;
                }
            } catch (error) {
                console.error('Failed to process image:', error);
            }
        }

        // 生成文件key
        const key = generateFileKey(file.name, folder || undefined);

        // 获取存储提供商并上传
        const storage = await getActiveStorageProvider();
        const storageConfig = await db.storageConfig.findFirst({
            where: { isActive: true },
        });

        const uploadResult = await storage.upload(buffer, key, file.type);

        // 保存文件记录到数据库
        const fileRecord = await db.file.create({
            data: {
                filename: file.name,
                storageKey: uploadResult.key,
                mimeType: file.type,
                size: buffer.length,
                url: uploadResult.url,
                category: category || getFileCategory(file.type),
                folder: folder || undefined,
                width,
                height,
                uploadedById: user.id,
                storageId: storageConfig?.id,
                description: description || undefined,
            },
        });

        return NextResponse.json({
            file: {
                id: fileRecord.id,
                filename: fileRecord.filename,
                url: fileRecord.url,
                size: fileRecord.size,
                mimeType: fileRecord.mimeType,
                category: fileRecord.category,
                width: fileRecord.width,
                height: fileRecord.height,
                description: fileRecord.description,
            },
        });
    } catch (error) {
        console.error('File upload error:', error);
        return NextResponse.json(
            { error: '文件上传失败', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
