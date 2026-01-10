import { RSACrypto, PUBLIC_KEY } from '../crypto/rsa';
import { FingerprintGenerator } from '../fingerprint/generator';
import {
    LicenseData,
    VerifyOptions,
    VerifyResult,
    LicenseError,
    LicenseStatus
} from '../types';

/**
 * 授权验证引擎
 * 核心职责：验证授权码的合法性和有效性
 */
export class LicenseVerifier {
    /**
     * 验证授权数据
     */
    static async verify(
        licenseData: LicenseData,
        options: VerifyOptions = {}
    ): Promise<VerifyResult> {
        const result: VerifyResult = {
            valid: false,
            verifiedAt: Date.now(),
            isOnline: false,
            details: {
                signatureValid: false,
                statusActive: false,
                notExpired: false,
                domainMatch: false,
                fingerprintMatch: false
            },
            warnings: []
        };

        try {
            // 确保 details 存在（兼容 TypeScript 可选属性）
            if (!result.details) {
                result.details = {};
            }

            // 1. 验证签名
            const signatureValid = this.verifySignature(licenseData);
            result.details.signatureValid = signatureValid;

            if (!signatureValid) {
                result.error = LicenseError.INVALID_SIGNATURE;
                result.errorMessage = '授权签名无效';
                return result;
            }

            // 2. 验证状态
            const statusValid = this.verifyStatus(licenseData);
            result.details.statusActive = statusValid;

            if (!statusValid) {
                if (licenseData.status === 'expired') {
                    result.error = LicenseError.LICENSE_EXPIRED;
                    result.errorMessage = '授权已过期';
                } else if (licenseData.status === 'suspended') {
                    result.error = LicenseError.LICENSE_SUSPENDED;
                    result.errorMessage = '授权已被暂停';
                } else if (licenseData.status === 'revoked') {
                    result.error = LicenseError.LICENSE_REVOKED;
                    result.errorMessage = '授权已被吊销';
                }
                return result;
            }

            // 3. 验证过期时间
            if (options.checkExpiration !== false) {
                const notExpired = this.verifyExpiration(licenseData);
                result.details.notExpired = notExpired;

                if (!notExpired) {
                    result.error = LicenseError.LICENSE_EXPIRED;
                    result.errorMessage = `授权已过期，有效期至：${new Date(licenseData.expiresAt).toLocaleString('zh-CN')}`;
                    return result;
                }

                // 检查是否即将过期（30天内）
                const daysLeft = Math.ceil((licenseData.expiresAt - Date.now()) / (24 * 60 * 60 * 1000));
                if (daysLeft <= 30) {
                    result.warnings?.push(`授权即将过期（剩余${daysLeft}天），请及时续费`);
                }
            }

            // 4. 验证域名
            if (options.checkDomain && options.currentDomain) {
                const domainMatch = this.verifyDomain(licenseData, options.currentDomain);
                result.details.domainMatch = domainMatch;

                if (!domainMatch) {
                    result.error = LicenseError.DOMAIN_MISMATCH;
                    result.errorMessage = `域名不匹配。授权域名：${licenseData.domains.join(', ')}，当前域名：${options.currentDomain}`;
                    return result;
                }
            }

            // 5. 验证硬件指纹
            if (options.checkFingerprint && licenseData.fingerprint) {
                const fingerprintMatch = await this.verifyFingerprint(licenseData);
                result.details.fingerprintMatch = fingerprintMatch;

                if (!fingerprintMatch && options.strictMode) {
                    result.error = LicenseError.FINGERPRINT_MISMATCH;
                    result.errorMessage = '硬件指纹不匹配，授权可能已被转移';
                    return result;
                } else if (!fingerprintMatch) {
                    result.warnings?.push('硬件指纹不匹配，建议重新激活');
                }
            }

            // 6. 检查激活数量
            if (licenseData.currentActivations > licenseData.maxActivations) {
                result.error = LicenseError.MAX_ACTIVATIONS_EXCEEDED;
                result.errorMessage = `超出最大激活数量（${licenseData.maxActivations}）`;
                return result;
            }

            // 所有验证通过
            result.valid = true;
            result.license = licenseData;

            return result;
        } catch (error) {
            result.error = LicenseError.UNKNOWN_ERROR;
            result.errorMessage = `验证过程出错：${(error as Error).message}`;
            return result;
        }
    }

    /**
     * 验证RSA签名
     */
    private static verifySignature(licenseData: LicenseData): boolean {
        try {
            // 提取签名
            const { signature, ...dataWithoutSignature } = licenseData;

            // 使用公钥验证签名
            return RSACrypto.verifyLicense(dataWithoutSignature, signature, PUBLIC_KEY);
        } catch (error) {
            console.error('签名验证失败:', error);
            return false;
        }
    }

    /**
     * 验证授权状态
     */
    private static verifyStatus(licenseData: LicenseData): boolean {
        return licenseData.status === 'active';
    }

    /**
     * 验证过期时间
     */
    private static verifyExpiration(licenseData: LicenseData): boolean {
        const now = Date.now();
        return now >= licenseData.issuedAt && now < licenseData.expiresAt;
    }

    /**
     * 验证域名
     */
    private static verifyDomain(licenseData: LicenseData, currentDomain: string): boolean {
        if (!licenseData.domains || licenseData.domains.length === 0) {
            return true; // 没有域名限制
        }

        // 规范化域名
        const normalizedCurrent = this.normalizeDomain(currentDomain);

        for (const allowedDomain of licenseData.domains) {
            const normalized = this.normalizeDomain(allowedDomain);

            // 精确匹配
            if (normalized === normalizedCurrent) {
                return true;
            }

            // 通配符匹配（*.example.com）
            if (normalized.startsWith('*.')) {
                const baseDomain = normalized.substring(2);
                if (normalizedCurrent.endsWith(baseDomain)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * 规范化域名
     */
    private static normalizeDomain(domain: string): string {
        return domain
            .toLowerCase()
            .replace(/^https?:\/\//, '')
            .replace(/^www\./, '')
            .replace(/:\d+$/, '')
            .replace(/\/$/, '');
    }

    /**
     * 验证硬件指纹
     */
    private static async verifyFingerprint(licenseData: LicenseData): Promise<boolean> {
        if (!licenseData.fingerprint) {
            return true; // 没有指纹限制
        }

        try {
            const currentFingerprint = await FingerprintGenerator.generate();
            return currentFingerprint === licenseData.fingerprint;
        } catch (error) {
            console.error('指纹验证失败:', error);
            return false;
        }
    }

    /**
     * 快速验证（验证状态和过期时间，可选验证签名）
     * 对于从可信授权服务器获取的缓存数据，可以跳过签名验证
     */
    static quickVerify(licenseData: LicenseData, skipSignature: boolean = true): boolean {
        // 对于本地缓存的授权数据，跳过签名验证（因为已从服务器验证过）
        if (skipSignature) {
            return (
                this.verifyStatus(licenseData) &&
                this.verifyExpiration(licenseData)
            );
        }
        return (
            this.verifySignature(licenseData) &&
            this.verifyStatus(licenseData) &&
            this.verifyExpiration(licenseData)
        );
    }

    /**
     * 检查功能权限
     */
    static hasFeature(licenseData: LicenseData, feature: keyof LicenseData['features']): boolean {
        if (!licenseData.features) {
            return false;
        }

        const featureValue = licenseData.features[feature];

        if (typeof featureValue === 'boolean') {
            return featureValue;
        }

        if (typeof featureValue === 'number') {
            return featureValue > 0;
        }

        return !!featureValue;
    }

    /**
     * 获取功能限制值
     */
    static getFeatureLimit(licenseData: LicenseData, feature: keyof LicenseData['features']): number | boolean {
        if (!licenseData.features) {
            return false;
        }

        const value = licenseData.features[feature];
        if (typeof value === 'string') {
            return false; // 字符串类型（如 support）不属于数值限制
        }

        return (value ?? false) as number | boolean;
    }

    /**
     * 检查是否为试用版
     */
    static isTrial(licenseData: LicenseData): boolean {
        return licenseData.plan === 'TRIAL';
    }

    /**
     * 获取剩余天数
     */
    static getDaysRemaining(licenseData: LicenseData): number {
        const now = Date.now();
        const remaining = licenseData.expiresAt - now;
        return Math.max(0, Math.ceil(remaining / (24 * 60 * 60 * 1000)));
    }

    /**
     * 获取授权摘要信息
     */
    static getSummary(licenseData: LicenseData): {
        plan: string;
        status: string;
        daysRemaining: number;
        domains: string[];
        features: string[];
    } {
        const features: string[] = [];
        if (licenseData.features) {
            Object.entries(licenseData.features).forEach(([key, value]) => {
                if (value) {
                    features.push(key);
                }
            });
        }

        return {
            plan: licenseData.plan,
            status: licenseData.status,
            daysRemaining: this.getDaysRemaining(licenseData),
            domains: licenseData.domains || [],
            features
        };
    }
}
