// SEO平台配置模板和文档

export interface PlatformConfig {
    id: string;
    name: string;
    description: string;
    apiTemplates: {
        normal?: string;
        fast?: string;
    };
    documentUrl: string;
    tokenGuide: string;
    requiresSiteId: boolean;
    rateLimit?: {
        perDay: number;
        perMinute?: number;
    };
}

export const SEO_PLATFORMS: Record<string, PlatformConfig> = {
    baidu: {
        id: 'baidu',
        name: '百度',
        description: '百度搜索引擎推送',
        apiTemplates: {
            normal: 'http://data.zz.baidu.com/urls?site={siteId}&token={token}',
            fast: 'http://data.zz.baidu.com/urls?site={siteId}&token={token}&type=daily'
        },
        documentUrl: 'https://ziyuan.baidu.com/linksubmit/index',
        tokenGuide: '登录百度站长平台 → 资源提交 → API提交 → 获取Token',
        requiresSiteId: true,
        rateLimit: {
            perDay: 10000,
            perMinute: 100
        }
    },
    '360': {
        id: '360',
        name: '360搜索',
        description: '360搜索引擎推送',
        apiTemplates: {
            normal: 'https://zhanzhang.so.com/api/push'
        },
        documentUrl: 'https://zhanzhang.so.com/',
        tokenGuide: '登录360站长平台 → 数据提交 → API提交 → 获取Token和站点ID',
        requiresSiteId: true,
        rateLimit: {
            perDay: 5000
        }
    },
    sogou: {
        id: 'sogou',
        name: '搜狗',
        description: '搜狗搜索引擎推送',
        apiTemplates: {
            normal: 'http://zhanzhang.sogou.com/push'
        },
        documentUrl: 'http://zhanzhang.sogou.com/',
        tokenGuide: '登录搜狗站长平台 → 验证站点 → API提交 → 获取Token',
        requiresSiteId: false,
        rateLimit: {
            perDay: 3000
        }
    },
    toutiao: {
        id: 'toutiao',
        name: '头条搜索',
        description: '头条搜索引擎推送',
        apiTemplates: {
            normal: 'https://zhanzhang.toutiao.com/push/urls'
        },
        documentUrl: 'https://zhanzhang.toutiao.com/',
        tokenGuide: '登录头条搜索站长平台 → 数据提交 → 获取Token',
        requiresSiteId: false,
        rateLimit: {
            perDay: 10000
        }
    },
    indexnow: {
        id: 'indexnow',
        name: 'IndexNow (Bing/Yandex)',
        description: '通用 IndexNow 协议推送，支持 Bing, Yandex, Seznam 等',
        apiTemplates: {
            normal: 'https://api.indexnow.org/indexnow'
        },
        documentUrl: 'https://www.indexnow.org/documentation',
        tokenGuide: '在 IndexNow 官网或 Bing 站长平台生成 API Key',
        requiresSiteId: true, // 这里 siteId 代表 Host/Domain
        rateLimit: {
            perDay: 10000
        }
    }
};

/**
 * 获取平台配置
 */
export function getPlatformConfig(platformId: string): PlatformConfig | null {
    return SEO_PLATFORMS[platformId] || null;
}

/**
 * 填充API模板
 */
export function fillApiTemplate(template: string, siteId?: string, token?: string): string {
    let url = template;
    if (siteId) {
        url = url.replace('{siteId}', siteId);
    }
    if (token) {
        url = url.replace('{token}', token);
    }
    return url;
}

/**
 * 验证配置完整性
 */
export function validateConfig(platformId: string, apiUrl: string, token: string, siteId?: string): {
    valid: boolean;
    errors: string[];
} {
    const errors: string[] = [];
    const config = getPlatformConfig(platformId);

    if (!config) {
        errors.push(`未知的平台: ${platformId}`);
        return { valid: false, errors };
    }

    if (!apiUrl || !apiUrl.startsWith('http')) {
        errors.push('API地址格式错误，必须以http或https开头');
    }

    if (!token || token.trim().length === 0) {
        errors.push('Token不能为空');
    }

    if (config.requiresSiteId && (!siteId || siteId.trim().length === 0)) {
        errors.push(`${config.name}平台需要提供站点ID`);
    }

    return {
        valid: errors.length === 0,
        errors
    };
}
