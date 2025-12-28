import { StorageProvider } from './types';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';

/**
 * 本地存储提供商
 * 文件存储在 public/uploads 目录
 */
export class LocalStorageProvider implements StorageProvider {
    private uploadDir: string;
    private baseUrl: string;

    constructor(config?: { uploadDir?: string; baseUrl?: string }) {
        this.uploadDir = config?.uploadDir || path.join(process.cwd(), 'public', 'uploads');
        this.baseUrl = config?.baseUrl || '/uploads';

        // 确保上传目录存在
        this.ensureUploadDir();
    }

    private async ensureUploadDir() {
        try {
            if (!existsSync(this.uploadDir)) {
                await fs.mkdir(this.uploadDir, { recursive: true });
            }
        } catch (error) {
            console.error('Failed to create upload directory:', error);
        }
    }

    async upload(buffer: Buffer, key: string, mimeType: string): Promise<{ url: string; key: string }> {
        const filePath = path.join(this.uploadDir, key);
        const fileDir = path.dirname(filePath);

        // 确保目录存在
        if (!existsSync(fileDir)) {
            await fs.mkdir(fileDir, { recursive: true });
        }

        // 写入文件
        await fs.writeFile(filePath, buffer);

        const url = `${this.baseUrl}/${key}`;
        return { url, key };
    }

    async delete(key: string): Promise<void> {
        const filePath = path.join(this.uploadDir, key);

        try {
            if (existsSync(filePath)) {
                await fs.unlink(filePath);
            }
        } catch (error) {
            console.error('Failed to delete file:', error);
            throw error;
        }
    }

    async getUrl(key: string): Promise<string> {
        return `${this.baseUrl}/${key}`;
    }

    async exists(key: string): Promise<boolean> {
        const filePath = path.join(this.uploadDir, key);
        return existsSync(filePath);
    }
}
