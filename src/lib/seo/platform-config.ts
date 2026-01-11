// SEO平台配置模板和文档

export type PushType = 'api' | 'script' | 'both';

export interface PlatformConfig {
    id: string;
    name: string;
    description: string;
    pushType: PushType; // 推送类型：api=API推送, script=JS脚本注入, both=两者都支持
    apiTemplates?: {
        normal?: string;
        fast?: string;
    };
    documentUrl: string;
    keyGenerationUrl?: string; // 密钥获取/生成的 URL
    tokenGuide?: string;
    scriptGuide?: string; // JS脚本获取指引
    requiresSiteId: boolean;
    requiresToken: boolean; // 是否需要 Token
    requiresScript?: boolean; // 是否需要 JS 脚本
    rateLimit?: {
        perDay: number;
        perMinute?: number;
    };
}

export const SEO_PLATFORMS: Record<string, PlatformConfig> = {
    baidu: {
        id: 'baidu',
        name: '百度',
        description: '中国最大的搜索引擎，支持 API 主动推送方式。API 推送可精确控制提交时机，确保内容第一时间被发现。',
        pushType: 'api',
        apiTemplates: {
            normal: 'http://data.zz.baidu.com/urls?site={siteId}&token={token}',
            fast: 'http://data.zz.baidu.com/urls?site={siteId}&token={token}&type=daily'
        },
        documentUrl: 'https://ziyuan.baidu.com/linksubmit/index',
        tokenGuide: '百度站长平台 → 资源提交 → API提交 → 复制 Token 和站点地址',
        requiresSiteId: true,
        requiresToken: true,
        rateLimit: {
            perDay: 10000,
            perMinute: 100
        }
    },
    toutiao: {
        id: 'toutiao',
        name: '头条搜索',
        description: '字节跳动旗下搜索引擎，覆盖今日头条、抖音等亿级用户。采用 JS 自动收录方式，用户浏览页面时自动向头条提交链接。',
        pushType: 'script',
        documentUrl: 'https://zhanzhang.toutiao.com/',
        scriptGuide: '头条站长平台 → 工具 → 自动收录 → JS提交 → 复制代码（仅需 script 标签内的内容）',
        requiresSiteId: false,
        requiresToken: false,
        requiresScript: true,
        rateLimit: {
            perDay: 10000
        }
    },
    indexnow: {
        id: 'indexnow',
        name: 'IndexNow (Bing/Yandex)',
        description: '开放协议，一次提交同时通知 Bing、Yandex、Seznam 等多个搜索引擎。是最快速通知搜索引擎内容更新的方式，强烈推荐配置。',
        pushType: 'api',
        apiTemplates: {
            normal: 'https://api.indexnow.org/indexnow'
        },
        documentUrl: 'https://www.indexnow.org/documentation',
        keyGenerationUrl: 'https://www.indexnow.org/documentation',
        tokenGuide: '1. 访问 indexnow.org 生成 Key → 2. 将 Key 填入 Token 字段 → 3. 站点ID 填写完整域名（如 https://www.example.com）',
        requiresSiteId: true,
        requiresToken: true,
        rateLimit: {
            perDay: 10000
        }
    },
    google: {
        id: 'google',
        name: 'Google Indexing',
        description: 'Google 官方 Indexing API，仅适用于 JobPosting（招聘）和 BroadcastEvent（直播活动）类型的结构化数据页面。普通网页建议使用 Sitemap。',
        pushType: 'api',
        apiTemplates: {
            normal: 'https://indexing.googleapis.com/v3/urlNotifications:publish'
        },
        documentUrl: 'https://developers.google.com/search/apis/indexing-api/v3/quickstart',
        tokenGuide: '⚠️ 需要 OAuth Access Token (非 API Key)。运行 `gcloud auth print-access-token` 获取。注意：Token 有效期仅 1 小时，适合临时测试。长期使用请寻找支持 Service Account 的自动化方案。',
        requiresSiteId: false,
        requiresToken: true,
        rateLimit: {
            perDay: 200,
            perMinute: 10
        }
    }
};

// 获取所有可用平台 ID 列表
export const AVAILABLE_PLATFORMS = Object.keys(SEO_PLATFORMS);

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
export function validateConfig(platformId: string, config: {
    apiUrl?: string;
    token?: string;
    siteId?: string;
    script?: string;
}): {
    valid: boolean;
    errors: string[];
} {
    const errors: string[] = [];
    const platformConfig = getPlatformConfig(platformId);

    if (!platformConfig) {
        errors.push(`未知的平台: ${platformId}`);
        return { valid: false, errors };
    }

    // API 推送类型的验证
    if (platformConfig.pushType === 'api' || platformConfig.pushType === 'both') {
        if (platformConfig.requiresToken && (!config.token || config.token.trim().length === 0)) {
            errors.push('Token不能为空');
        }

        if (platformConfig.requiresSiteId && (!config.siteId || config.siteId.trim().length === 0)) {
            errors.push(`${platformConfig.name}平台需要提供站点ID`);
        }

        if (config.apiUrl && !config.apiUrl.startsWith('http')) {
            errors.push('API地址格式错误，必须以http或https开头');
        }
    }

    // JS 脚本类型的验证（仅在 script 或 both 类型时，如果提供了脚本则进行简单校验）
    // 注意：脚本不是强制的，用户可以选择只用 API 或只用脚本

    return {
        valid: errors.length === 0,
        errors
    };
}
