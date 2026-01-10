/**
 * 企业官网 授权系统主入口
 * 提供统一的授权管理接口
 */

export * from './types';
export * from './core/verifier';
export * from './core/cache';
export * from './core/heartbeat';
export * from './core/timestamp';
export * from './crypto/rsa';
export * from './crypto/aes';
export * from './crypto/hash';
export * from './fingerprint/generator';

import { LicenseVerifier } from './core/verifier';
import { LicenseCache } from './core/cache';
import { HeartbeatService } from './core/heartbeat';
import { TimestampProtection } from './core/timestamp';
import { FingerprintGenerator } from './fingerprint/generator';
import { LicenseData, VerifyOptions, VerifyResult, ActivationData } from './types';

/**
 * 授权管理器
 * 提供高层API封装
 */
export class LicenseManager {
    private static heartbeatService?: HeartbeatService;

    /**
     * 初始化授权系统
     */
    static async initialize(licenseCode?: string): Promise<void> {
        // 检查时间篡改
        const timeCheck = await TimestampProtection.checkTimeTampering();
        if (timeCheck.tampering) {
            console.error('时间篡改检测:', timeCheck.reason);
            throw new Error(timeCheck.reason);
        }

        // 清理过期缓存
        LicenseCache.cleanupExpired();

        // 如果有授权码，尝试激活
        if (licenseCode) {
            await this.activate(licenseCode);
        }
    }

    /**
     * 激活授权
     */
    static async activate(licenseCode: string): Promise<LicenseData> {
        const fingerprint = await FingerprintGenerator.generate();

        // 准备激活数据
        const activationData: ActivationData = {
            licenseCode,
            fingerprint,
            domain: process.env.NEXT_PUBLIC_SITE_URL,
            deviceInfo: {
                platform: process.platform,
                cpuModel: require('os').cpus()[0]?.model || 'unknown',
                hostname: require('os').hostname()
            }
        };

        const { LICENSE_CONFIG } = await import('./config');
        const LICENSE_SERVER_URL = LICENSE_CONFIG.SERVER_URL;

        // 调用激活API
        const response = await fetch(`${LICENSE_SERVER_URL}/api/license/activate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(activationData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || '激活失败');
        }

        const { license } = await response.json();

        // 保存到缓存
        LicenseCache.save(license);

        // 启动心跳
        this.startHeartbeat(license.licenseId);

        return license;
    }

    /**
     * 验证当前授权
     */
    static async verify(options?: VerifyOptions): Promise<VerifyResult> {
        // 先从缓存加载
        const cachedLicense = LicenseCache.getLicense();

        if (!cachedLicense) {
            return {
                valid: false,
                errorMessage: '未找到授权信息',
                verifiedAt: Date.now(),
                isOnline: false
            };
        }

        // 验证授权
        const result = await LicenseVerifier.verify(cachedLicense, {
            checkDomain: true,
            checkFingerprint: true,
            checkExpiration: true,
            currentDomain: process.env.NEXT_PUBLIC_SITE_URL,
            ...options
        });

        // 如果需要重新验证
        if (LicenseCache.needsRevalidation()) {
            try {
                await this.revalidateOnline();
            } catch (error) {
                // 忽略在线验证失败，使用缓存
                console.warn('在线验证失败，使用缓存:', error);
            }
        }

        return result;
    }

    /**
     * 在线重新验证
     */
    private static async revalidateOnline(): Promise<void> {
        const license = LicenseCache.getLicense();
        if (!license) return;

        const { LICENSE_CONFIG } = await import('./config');
        const LICENSE_SERVER_URL = LICENSE_CONFIG.SERVER_URL;

        const response = await fetch(`${LICENSE_SERVER_URL}/api/license/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                licenseCode: license.licenseCode,
                fingerprint: await FingerprintGenerator.generate()
            })
        });

        if (response.ok) {
            const { license: updatedLicense } = await response.json();
            LicenseCache.save(updatedLicense);
        }
    }

    /**
     * 启动心跳服务
     */
    static startHeartbeat(licenseId: string): void {
        if (!this.heartbeatService) {
            this.heartbeatService = HeartbeatService.getInstance();
        }
        this.heartbeatService.start(licenseId);
    }

    /**
     * 停止心跳服务
     */
    static stopHeartbeat(): void {
        this.heartbeatService?.stop();
    }

    /**
     * 获取授权信息
     */
    static getLicense(): LicenseData | null {
        return LicenseCache.getLicense();
    }

    /**
     * 检查功能权限
     */
    static hasFeature(feature: keyof LicenseData['features']): boolean {
        const license = this.getLicense();
        if (!license) return false;
        return LicenseVerifier.hasFeature(license, feature);
    }

    /**
     * 获取授权摘要
     */
    static getSummary() {
        const license = this.getLicense();
        if (!license) return null;
        return LicenseVerifier.getSummary(license);
    }

    /**
     * 清除授权
     */
    static deactivate(): void {
        this.stopHeartbeat();
        LicenseCache.clear();
        TimestampProtection.clear();
    }
}
