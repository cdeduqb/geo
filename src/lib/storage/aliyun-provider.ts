import { StorageProvider } from './types';
import OSS from 'ali-oss';

/**
 * 阿里云OSS存储提供商
 */
export class AliyunOSSProvider implements StorageProvider {
    private client: OSS;
    private bucket: string;

    constructor(config: {
        accessKeyId: string;
        accessKeySecret: string;
        region: string;
        bucket: string;
        endpoint?: string;
    }) {
        this.bucket = config.bucket;
        this.client = new OSS({
            accessKeyId: config.accessKeyId,
            accessKeySecret: config.accessKeySecret,
            region: config.region,
            bucket: config.bucket,
            endpoint: config.endpoint,
        });
    }

    async upload(buffer: Buffer, key: string, mimeType: string): Promise<{ url: string; key: string }> {
        try {
            const result = await this.client.put(key, buffer, {
                headers: {
                    'Content-Type': mimeType,
                },
            });

            return {
                url: result.url,
                key: result.name,
            };
        } catch (error) {
            console.error('Aliyun OSS upload error:', error);
            throw new Error(`Failed to upload file to Aliyun OSS: ${error}`);
        }
    }

    async delete(key: string): Promise<void> {
        try {
            await this.client.delete(key);
        } catch (error) {
            console.error('Aliyun OSS delete error:', error);
            throw new Error(`Failed to delete file from Aliyun OSS: ${error}`);
        }
    }

    async getUrl(key: string): Promise<string> {
        try {
            // 生成签名URL（有效期1小时）
            const url = this.client.signatureUrl(key, {
                expires: 3600,
            });
            return url;
        } catch (error) {
            console.error('Aliyun OSS getUrl error:', error);
            // 如果签名失败，返回公共URL
            return `https://${this.bucket}.oss-cn-${this.client.options.region}.aliyuncs.com/${key}`;
        }
    }

    async exists(key: string): Promise<boolean> {
        try {
            await this.client.head(key);
            return true;
        } catch (error: any) {
            if (error.code === 'NoSuchKey') {
                return false;
            }
            throw error;
        }
    }
}
