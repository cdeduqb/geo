import { db } from '@/lib/db';

/**
 * 获取网站完整 URL（包含协议和域名）
 * 优先从数据库系统设置中获取 'site_url'
 * 如果未设置，则回退到环境变量 NEXT_PUBLIC_SITE_URL
 * 如果环境变量也未设置，则回退到 http://localhost:3000
 */
export async function getSiteUrl(): Promise<string> {
    try {
        const setting = await db.systemSetting.findUnique({
            where: { key: 'site_url' },
        });

        if (setting?.value) {
            // 确保 URL 不以斜杠结尾
            return setting.value.replace(/\/$/, '');
        }
    } catch (error) {
        console.warn('Failed to fetch site_url from database, falling back to env:', error);
    }

    const envUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    return envUrl.replace(/\/$/, '');
}

/**
 * 获取所有系统设置
 * 如果数据库不可用，返回空对象以确保应用继续运行
 */
export async function getSystemSettings(): Promise<Record<string, string>> {
    try {
        const settings = await db.systemSetting.findMany();
        const config: Record<string, string> = {};
        settings.forEach(s => config[s.key] = s.value);
        return config;
    } catch (error) {
        // 静默处理数据库连接错误，避免应用崩溃
        // 在开发环境记录警告，生产环境静默
        if (process.env.NODE_ENV === 'development') {
            console.warn('⚠️ Database unavailable, using default settings');
        }
        return {};
    }
}

/**
 * 获取全局 SEO 设置（带完整默认值控制）
 */
export async function getSEOSettings() {
    try {
        const settings = await getSystemSettings();
        let siteConfig: any = {};
        try {
            if (settings.site_settings) {
                siteConfig = JSON.parse(settings.site_settings);
            }
        } catch(e) {}

        return {
            siteName: settings.site_name || '企业官网',
            siteDescription: settings.site_description || '企业官网内容管理系统',
            siteUrl: settings.site_url || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
            siteKeywords: settings.site_keywords || '',
            siteLogo: settings.site_logo || null,
            siteIcon: settings.site_icon || '/favicon.ico',
            enableMultiLanguage: settings.enable_multi_language === 'true',
            address: siteConfig.address || settings.contact_address || null,
            phone: siteConfig.phone || settings.contact_phone || null,
            email: siteConfig.email || settings.contact_email || null,
            latitude: siteConfig.latitude || null,
            longitude: siteConfig.longitude || null,
            openingHours: siteConfig.openingHours || null,
        };
    } catch (error) {
        return {
            siteName: '企业官网',
            siteDescription: '企业官网内容管理系统',
            siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
            siteKeywords: '',
            siteLogo: null,
            siteIcon: '/favicon.ico',
            enableMultiLanguage: false,
        };
    }
}

export interface EntityInfo {
    alternateName?: string;
    sameAs?: string[];
}

export interface GEOSettings {
    enableStructuredData?: boolean;
    entityInfo?: EntityInfo;
    googleOptimization?: {
        enabled?: boolean;
        verificationId?: string; // google-site-verification
    };
    baiduOptimization?: {
        enabled?: boolean;
        verificationCode?: string; // baidu-site-verification
    };
    amazonOptimization?: {
        enabled?: boolean;
        amazonbotAllowed?: boolean;
    };
    // 注意：自动收录脚本配置已迁移到 SEO 推送配置 (SEOPushConfig) 数据库中
    [key: string]: any;
}

/**
 * 获取 GEO 优化设置 (增强鲁棒性)
 */
export async function getGEOSettings(): Promise<GEOSettings> {
    const DEFAULT_GEO: GEOSettings = {
        enableStructuredData: false,
        entityInfo: {
            alternateName: '',
            sameAs: []
        },
        googleOptimization: {
            enabled: true,
        },
        baiduOptimization: {
            enabled: true,
        },
        amazonOptimization: {
            enabled: true,
            amazonbotAllowed: true
        }
    };

    try {
        const setting = await db.systemSetting.findUnique({
            where: { key: 'geo_settings' }
        });

        if (setting?.value) {
            return { ...DEFAULT_GEO, ...JSON.parse(setting.value) };
        }
    } catch (error) {
        console.warn('[GEOSettings] Using defaults due to error:', error);
    }
    return DEFAULT_GEO;
}

export interface I18nSettings {
    enableMultiLanguage: boolean;
    defaultLocale: string;
    supportedLocales: string[];
}

/**
 * 获取多语言设置
 * enableMultiLanguage: 是否启用多语言功能
 * 当关闭时，系统中所有多语言相关功能应隐藏
 */
export async function getI18nSettings(): Promise<I18nSettings> {
    const DEFAULT_I18N: I18nSettings = {
        enableMultiLanguage: false,
        defaultLocale: 'zh',
        supportedLocales: ['zh', 'en'],
    };

    try {
        const [i18nSetting, enableMultiLangSetting] = await Promise.all([
            db.systemSetting.findUnique({ where: { key: 'i18n_settings' } }),
            db.systemSetting.findUnique({ where: { key: 'enable_multi_language' } })
        ]);

        let settings = { ...DEFAULT_I18N };

        if (i18nSetting?.value) {
            settings = { ...settings, ...JSON.parse(i18nSetting.value) };
        }

        if (enableMultiLangSetting?.value) {
            settings.enableMultiLanguage = enableMultiLangSetting.value === 'true';
        }

        return settings;
    } catch (error) {
        console.warn('[I18nSettings] Using defaults due to error:', error);
    }
    return DEFAULT_I18N;
}
