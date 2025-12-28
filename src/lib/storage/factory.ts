import { db } from '@/lib/db';
import { StorageProvider } from './types';
import { LocalStorageProvider } from './local-provider';
import { AliyunOSSProvider } from './aliyun-provider';
import { TencentCOSProvider } from './tencent-provider';

/**
 * 获取当前激活的存储提供商
 */
export async function getActiveStorageProvider(): Promise<StorageProvider> {
    try {
        // 查找激活的存储配置
        const config = await db.storageConfig.findFirst({
            where: { isActive: true },
        });

        if (!config) {
            // 如果没有配置，使用默认的本地存储
            console.log('No active storage config found, using local storage');
            return new LocalStorageProvider();
        }

        return createStorageProvider(config.provider, config.config as Record<string, any>);
    } catch (error) {
        console.error('Failed to get active storage provider:', error);
        // 出错时返回本地存储
        return new LocalStorageProvider();
    }
}

/**
 * 根据配置创建存储提供商
 */
export function createStorageProvider(
    provider: string,
    config: Record<string, any>
): StorageProvider {
    switch (provider) {
        case 'ALIYUN_OSS':
            return new AliyunOSSProvider({
                accessKeyId: config.accessKeyId,
                accessKeySecret: config.accessKeySecret,
                region: config.region,
                bucket: config.bucket,
                endpoint: config.endpoint,
            });

        case 'TENCENT_COS':
            return new TencentCOSProvider({
                secretId: config.secretId,
                secretKey: config.secretKey,
                region: config.region,
                bucket: config.bucket,
            });

        case 'LOCAL':
        default:
            return new LocalStorageProvider({
                uploadDir: config.uploadDir,
                baseUrl: config.baseUrl,
            });
    }
}

/**
 * 生成唯一的文件key
 */
export function generateFileKey(filename: string, folder?: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const ext = filename.split('.').pop();
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');

    // 清理文件名
    const cleanName = nameWithoutExt
        .replace(/[^a-zA-Z0-9\u4e00-\u9fa5-_]/g, '-')
        .substring(0, 50);

    const key = `${cleanName}-${timestamp}-${random}.${ext}`;

    return folder ? `${folder}/${key}` : key;
}

/**
 * 获取文件MIME类型的分类
 */
export function getFileCategory(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('msword')) {
        return 'document';
    }
    return 'other';
}
