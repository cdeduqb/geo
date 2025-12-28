import { StorageProvider } from './types';
import COS from 'cos-nodejs-sdk-v5';

/**
 * 腾讯云COS存储提供商
 */
export class TencentCOSProvider implements StorageProvider {
    private client: COS;
    private bucket: string;
    private region: string;

    constructor(config: {
        secretId: string;
        secretKey: string;
        region: string;
        bucket: string;
    }) {
        this.bucket = config.bucket;
        this.region = config.region;

        this.client = new COS({
            SecretId: config.secretId,
            SecretKey: config.secretKey,
        });
    }

    async upload(buffer: Buffer, key: string, mimeType: string): Promise<{ url: string; key: string }> {
        return new Promise((resolve, reject) => {
            this.client.putObject({
                Bucket: this.bucket,
                Region: this.region,
                Key: key,
                Body: buffer,
                ContentType: mimeType,
            }, (err, data) => {
                if (err) {
                    console.error('Tencent COS upload error:', err);
                    reject(new Error(`Failed to upload file to Tencent COS: ${err.message}`));
                    return;
                }

                const url = `https://${this.bucket}.cos.${this.region}.myqcloud.com/${key}`;
                resolve({ url, key });
            });
        });
    }

    async delete(key: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client.deleteObject({
                Bucket: this.bucket,
                Region: this.region,
                Key: key,
            }, (err) => {
                if (err) {
                    console.error('Tencent COS delete error:', err);
                    reject(new Error(`Failed to delete file from Tencent COS: ${err.message}`));
                    return;
                }
                resolve();
            });
        });
    }

    async getUrl(key: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.client.getObjectUrl({
                Bucket: this.bucket,
                Region: this.region,
                Key: key,
                Sign: true,
                Expires: 3600, // 1小时有效期
            }, (err, data) => {
                if (err) {
                    console.error('Tencent COS getUrl error:', err);
                    // 如果签名失败，返回公共URL
                    const url = `https://${this.bucket}.cos.${this.region}.myqcloud.com/${key}`;
                    resolve(url);
                    return;
                }
                resolve(data.Url);
            });
        });
    }

    async exists(key: string): Promise<boolean> {
        return new Promise((resolve) => {
            this.client.headObject({
                Bucket: this.bucket,
                Region: this.region,
                Key: key,
            }, (err) => {
                if (err) {
                    resolve(false);
                    return;
                }
                resolve(true);
            });
        });
    }
}
