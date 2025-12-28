import CryptoJS from 'crypto-js';
import * as crypto from 'crypto';
import * as fs from 'fs';

/**
 * 哈希工具类
 * 用于数据哈希、文件完整性校验等
 */
export class HashUtils {
    /**
     * SHA-256 哈希
     */
    static sha256(data: string | Buffer): string {
        if (Buffer.isBuffer(data)) {
            return crypto.createHash('sha256').update(data).digest('hex');
        }
        return CryptoJS.SHA256(data).toString();
    }

    /**
     * SHA-512 哈希
     */
    static sha512(data: string): string {
        return CryptoJS.SHA512(data).toString();
    }

    /**
     * MD5 哈希（不推荐用于安全用途，仅用于完整性检查）
     */
    static md5(data: string | Buffer): string {
        if (Buffer.isBuffer(data)) {
            return crypto.createHash('md5').update(data).digest('hex');
        }
        return CryptoJS.MD5(data).toString();
    }

    /**
     * HMAC-SHA256
     */
    static hmacSha256(data: string, key: string): string {
        return CryptoJS.HmacSHA256(data, key).toString();
    }

    /**
     * 计算文件的哈希值
     */
    static async fileHash(filePath: string, algorithm: 'sha256' | 'md5' = 'sha256'): Promise<string> {
        return new Promise((resolve, reject) => {
            const hash = crypto.createHash(algorithm);
            const stream = fs.createReadStream(filePath);

            stream.on('data', (chunk) => {
                hash.update(chunk);
            });

            stream.on('end', () => {
                resolve(hash.digest('hex'));
            });

            stream.on('error', (error) => {
                reject(error);
            });
        });
    }

    /**
     * 批量计算文件哈希
     */
    static async batchFileHash(filePaths: string[]): Promise<Map<string, string>> {
        const results = new Map<string, string>();

        for (const filePath of filePaths) {
            try {
                const hash = await this.fileHash(filePath);
                results.set(filePath, hash);
            } catch (error) {
                console.error(`Failed to hash file ${filePath}:`, error);
                results.set(filePath, 'ERROR');
            }
        }

        return results;
    }

    /**
     * 生成唯一ID（基于时间戳和随机数）
     */
    static generateId(prefix: string = ''): string {
        const timestamp = Date.now().toString(36);
        const randomPart = Math.random().toString(36).substring(2, 15);
        const hash = this.sha256(`${timestamp}-${randomPart}`).substring(0, 8);

        return prefix ? `${prefix}-${timestamp}-${hash}` : `${timestamp}-${hash}`;
    }

    /**
     * 生成授权码
     */
    static generateLicenseCode(): string {
        const parts = [];

        for (let i = 0; i < 4; i++) {
            const part = Math.random().toString(36).substring(2, 8).toUpperCase();
            parts.push(part);
        }

        return `LIC-${parts.join('-')}`;
    }

    /**
     * 验证数据完整性
     */
    static verifyIntegrity(data: string, expectedHash: string, algorithm: 'sha256' | 'md5' = 'sha256'): boolean {
        const actualHash = algorithm === 'sha256' ? this.sha256(data) : this.md5(data);
        return actualHash === expectedHash;
    }

    /**
     * 创建带时间戳的哈希（防重放）
     */
    static createTimestampedHash(data: string, maxAge: number = 300000): {
        hash: string;
        timestamp: number;
        signature: string;
    } {
        const timestamp = Date.now();
        const combined = `${data}|${timestamp}`;
        const hash = this.sha256(combined);

        return {
            hash,
            timestamp,
            signature: this.sha256(`${hash}|${timestamp}`)
        };
    }

    /**
     * 验证带时间戳的哈希
     */
    static verifyTimestampedHash(
        data: string,
        timestampedHash: { hash: string; timestamp: number; signature: string },
        maxAge: number = 300000
    ): boolean {
        const now = Date.now();

        // 检查时间戳是否过期
        if (now - timestampedHash.timestamp > maxAge) {
            return false;
        }

        // 检查时间是否被回拨
        if (timestampedHash.timestamp > now + 60000) { // 允许1分钟误差
            return false;
        }

        // 重新计算哈希
        const combined = `${data}|${timestampedHash.timestamp}`;
        const expectedHash = this.sha256(combined);

        // 验证哈希
        if (expectedHash !== timestampedHash.hash) {
            return false;
        }

        // 验证签名
        const expectedSignature = this.sha256(`${expectedHash}|${timestampedHash.timestamp}`);
        return expectedSignature === timestampedHash.signature;
    }

    /**
     * 生成校验和（用于代码完整性检查）
     */
    static generateChecksum(files: string[]): string {
        const combined = files.sort().join('|');
        return this.sha256(combined);
    }

    /**
     * 密码哈希（使用 PBKDF2）
     */
    static hashPassword(password: string, salt?: string): { hash: string; salt: string } {
        const saltValue = salt || crypto.randomBytes(16).toString('hex');

        const hash = crypto.pbkdf2Sync(
            password,
            saltValue,
            100000, // 迭代次数
            64,     // 密钥长度
            'sha512'
        ).toString('hex');

        return { hash, salt: saltValue };
    }

    /**
     * 验证密码
     */
    static verifyPassword(password: string, hash: string, salt: string): boolean {
        const { hash: computedHash } = this.hashPassword(password, salt);
        return computedHash === hash;
    }

    /**
     * 生成随机盐值
     */
    static generateSalt(length: number = 16): string {
        return crypto.randomBytes(length).toString('hex');
    }

    /**
     * 生成随机令牌
     */
    static generateToken(length: number = 32): string {
        return crypto.randomBytes(length).toString('base64url');
    }
}
