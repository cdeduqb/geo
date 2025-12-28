import * as fs from 'fs';
import * as path from 'path';
import { AESCrypto } from '../crypto/aes';
import { LicenseData, CachedLicense, LicenseError } from '../types';

/**
 * 授权缓存管理器
 * 负责授权信息的本地cached加密存储和管理
 */
export class LicenseCache {
    private static readonly CACHE_DIR = path.join(process.cwd(), '.license-cache');
    private static readonly CACHE_FILE = 'license.enc';
    private static readonly DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24小时
    private static readonly OFFLINE_GRACE_PERIOD = 7 * 24 * 60 * 60 * 1000; // 7天

    /**
     * 初始化缓存目录
     */
    private static ensureCacheDir(): void {
        if (!fs.existsSync(this.CACHE_DIR)) {
            fs.mkdirSync(this.CACHE_DIR, { recursive: true, mode: 0o700 });
        }
    }

    /**
     * 获取缓存文件路径
     */
    private static getCachePath(): string {
        return path.join(this.CACHE_DIR, this.CACHE_FILE);
    }

    /**
     * 保存授权到缓存
     */
    static save(license: LicenseData, ttl: number = this.DEFAULT_TTL): void {
        try {
            this.ensureCacheDir();

            const cached: CachedLicense = {
                license,
                cachedAt: Date.now(),
                expiresAt: Date.now() + ttl,
                lastVerifiedAt: Date.now()
            };

            // 加密缓存
            const encrypted = AESCrypto.encryptLicenseCache(cached);

            // 写入文件
            fs.writeFileSync(this.getCachePath(), encrypted, { mode: 0o600 });
        } catch (error) {
            console.error('保存授权缓存失败:', error);
            throw new Error('Failed to save license cache');
        }
    }

    /**
     * 从缓存加载授权
     */
    static load(): CachedLicense | null {
        try {
            const cachePath = this.getCachePath();

            if (!fs.existsSync(cachePath)) {
                return null;
            }

            // 读取加密文件
            const encrypted = fs.readFileSync(cachePath, 'utf-8');

            // 解密
            const cached = AESCrypto.decryptLicenseCache(encrypted);

            return cached.data as CachedLicense;
        } catch (error) {
            console.error('加载授权缓存失败:', error);
            // 缓存损坏，删除
            this.clear();
            return null;
        }
    }

    /**
     * 检查缓存是否有效
     */
    static isValid(allowExpired: boolean = false): boolean {
        const cached = this.load();
        if (!cached) {
            return false;
        }

        const now = Date.now();

        // 检查缓存是否过期
        if (!allowExpired && now > cached.expiresAt) {
            return false;
        }

        // 检查授权本身是否过期
        if (now > cached.license.expiresAt) {
            return false;
        }

        return true;
    }

    /**
     * 更新最后验证时间
     */
    static updateLastVerified(): void {
        const cached = this.load();
        if (!cached) {
            return;
        }

        cached.lastVerifiedAt = Date.now();

        // 重新加密保存
        const encrypted = AESCrypto.encryptLicenseCache(cached);
        fs.writeFileSync(this.getCachePath(), encrypted, { mode: 0o600 });
    }

    /**
     * 设置离线宽限期
     */
    static setOfflineGracePeriod(period: number = this.OFFLINE_GRACE_PERIOD): void {
        const cached = this.load();
        if (!cached) {
            return;
        }

        cached.offlineUntil = Date.now() + period;

        const encrypted = AESCrypto.encryptLicenseCache(cached);
        fs.writeFileSync(this.getCachePath(), encrypted, { mode: 0o600 });
    }

    /**
     * 检查是否在离线宽限期内
     */
    static isInGracePeriod(): boolean {
        const cached = this.load();
        if (!cached || !cached.offlineUntil) {
            return false;
        }

        return Date.now() < cached.offlineUntil;
    }

    /**
     * 获取缓存年龄（秒）
     */
    static getCacheAge(): number | null {
        const cached = this.load();
        if (!cached) {
            return null;
        }

        return Math.floor((Date.now() - cached.cachedAt) / 1000);
    }

    /**
     * 获取距离过期的时间（秒）
     */
    static getTimeUntilExpiration(): number | null {
        const cached = this.load();
        if (!cached) {
            return null;
        }

        const remaining = cached.license.expiresAt - Date.now();
        return Math.max(0, Math.floor(remaining / 1000));
    }

    /**
     * 清除缓存
     */
    static clear(): void {
        try {
            const cachePath = this.getCachePath();
            if (fs.existsSync(cachePath)) {
                fs.unlinkSync(cachePath);
            }
        } catch (error) {
            console.error('清除授权缓存失败:', error);
        }
    }

    /**
     * 获取缓存统计信息
     */
    static getStats(): {
        exists: boolean;
        valid: boolean;
        age?: number;
        timeUntilExpiration?: number;
        isInGracePeriod: boolean;
        cachedAt?: Date;
        expiresAt?: Date;
        lastVerifiedAt?: Date;
    } {
        const cached = this.load();

        if (!cached) {
            return {
                exists: false,
                valid: false,
                isInGracePeriod: false
            };
        }

        return {
            exists: true,
            valid: this.isValid(),
            age: this.getCacheAge() || undefined,
            timeUntilExpiration: this.getTimeUntilExpiration() || undefined,
            isInGracePeriod: this.isInGracePeriod(),
            cachedAt: new Date(cached.cachedAt),
            expiresAt: new Date(cached.expiresAt),
            lastVerifiedAt: new Date(cached.lastVerifiedAt)
        };
    }

    /**
     * 刷新缓存（延长TTL）
     */
    static refresh(ttl: number = this.DEFAULT_TTL): boolean {
        const cached = this.load();
        if (!cached) {
            return false;
        }

        cached.expiresAt = Date.now() + ttl;
        cached.lastVerifiedAt = Date.now();

        const encrypted = AESCrypto.encryptLicenseCache(cached);
        fs.writeFileSync(this.getCachePath(), encrypted, { mode: 0o600 });

        return true;
    }

    /**
     * 检查是否需要重新验证
     */
    static needsRevalidation(interval: number = 3600000): boolean {
        const cached = this.load();
        if (!cached) {
            return true;
        }

        const timeSinceLastVerification = Date.now() - cached.lastVerifiedAt;
        return timeSinceLastVerification > interval;
    }

    /**
     * 获取缓存的授权数据
     */
    static getLicense(): LicenseData | null {
        const cached = this.load();
        return cached ? cached.license : null;
    }

    /**
     *   检查并自动清理过期缓存
     */
    static cleanupExpired(): void {
        if (!this.isValid(true)) {
            this.clear();
        }
    }
}
