/**
 * 授权系统类型定义
 */

// 授权套餐类型
export type LicensePlan = 'TRIAL' | 'BASIC' | 'PRO' | 'ENTERPRISE';

// 授权状态
export type LicenseStatus = 'active' | 'suspended' | 'expired' | 'revoked';

// 授权数据结构
export interface LicenseData {
    licenseId: string;
    licenseCode: string;
    customerId?: string;
    customerEmail?: string;
    plan: LicensePlan;

    // 授权范围
    domains: string[];
    fingerprint?: string;

    // 功能配置
    features: LicenseFeatures;

    // 激活限制
    maxActivations: number;
    currentActivations: number;

    // 时间管理
    issuedAt: number;
    expiresAt: number;

    // 状态
    status: LicenseStatus;

    // 签名（RSA）
    signature: string;
    version: string;
}

// 功能配置
export interface LicenseFeatures {
    // 页面管理
    pages?: boolean | number;  // true=无限, number=数量限制

    // 高级功能
    ai?: boolean;
    seo?: boolean;
    geo?: boolean;

    // API访问
    apiAccess?: boolean;

    // 自定义
    customDomain?: boolean;
    customBranding?: boolean;

    // 技术支持
    support?: 'community' | 'email' | 'phone' | 'dedicated';
}

// 验证选项
export interface VerifyOptions {
    // 是否检查域名
    checkDomain?: boolean;
    currentDomain?: string;

    // 是否检查硬件指纹
    checkFingerprint?: boolean;

    // 是否检查过期时间
    checkExpiration?: boolean;

    // 离线模式
    allowOffline?: boolean;
    offlineGracePeriod?: number; // 毫秒

    // 严格模式
    strictMode?: boolean;
}

// 验证结果
export interface VerifyResult {
    valid: boolean;
    license?: LicenseData;

    // 错误信息
    error?: LicenseError;
    errorMessage?: string;

    // 警告信息
    warnings?: string[];

    // 详细信息
    details?: {
        domainMatch?: boolean;
        fingerprintMatch?: boolean;
        signatureValid?: boolean;
        notExpired?: boolean;
        statusActive?: boolean;
    };

    // 元数据
    verifiedAt: number;
    isOnline: boolean;
}

// 错误类型
export enum LicenseError {
    // 授权码错误
    INVALID_LICENSE_CODE = 'INVALID_LICENSE_CODE',
    INVALID_SIGNATURE = 'INVALID_SIGNATURE',

    // 过期相关
    LICENSE_EXPIRED = 'LICENSE_EXPIRED',
    LICENSE_NOT_YET_VALID = 'LICENSE_NOT_YET_VALID',

    // 绑定错误
    DOMAIN_MISMATCH = 'DOMAIN_MISMATCH',
    FINGERPRINT_MISMATCH = 'FINGERPRINT_MISMATCH',

    // 状态错误
    LICENSE_SUSPENDED = 'LICENSE_SUSPENDED',
    LICENSE_REVOKED = 'LICENSE_REVOKED',

    // 激活错误
    MAX_ACTIVATIONS_EXCEEDED = 'MAX_ACTIVATIONS_EXCEEDED',

    // 网络错误
    NETWORK_ERROR = 'NETWORK_ERROR',
    SERVER_ERROR = 'SERVER_ERROR',

    // 缓存错误
    CACHE_CORRUPTED = 'CACHE_CORRUPTED',

    // 时间错误
    TIME_TAMPERING = 'TIME_TAMPERING',

    // 未知错误
    UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// 缓存数据
export interface CachedLicense {
    license: LicenseData;
    cachedAt: number;
    expiresAt: number;
    lastVerifiedAt: number;
    offlineUntil?: number; // 离线宽限期截止时间
}

// 心跳数据
export interface HeartbeatData {
    licenseId: string;
    fingerprint: string;
    domain?: string;

    // 系统信息
    platform: string;
    version: string;

    // 运行状态
    uptime?: number;
    cpuUsage?: number;
    memoryUsage?: number;

    // 时间戳
    timestamp: number;
}

// 心跳响应
export interface HeartbeatResponse {
    success: boolean;
    serverTime: number;

    // 授权状态更新
    licenseStatus?: LicenseStatus;
    shouldRevalidate?: boolean;

    // 消息
    message?: string;
    warnings?: string[];
}

// 激活数据
export interface ActivationData {
    licenseCode: string;
    fingerprint: string;
    domain?: string;

    // 设备信息
    deviceInfo?: {
        platform: string;
        cpuModel: string;
        hostname: string;
    };
}

// 激活响应
export interface ActivationResponse {
    success: boolean;
    license?: LicenseData;
    instanceId?: string;
    error?: string;
}
