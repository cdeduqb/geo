import { MetadataRoute } from 'next';
import { getSiteUrl, getI18nSettings } from '@/lib/system-settings';
import { locales, defaultLocale } from '@/lib/i18n';
import { db } from '@/lib/db';

// 强制动态渲染，确保机器人规则实时反映后台配置
export const dynamic = 'force-dynamic';

// AI 爬虫列表 (核心内置列表)
const AI_CRAWLERS = [
    // 国际 AI 平台
    'GPTBot', 'ChatGPT-User', 'OAI-SearchBot', 'ClaudeBot', 'anthropic-ai',
    'Google-Extended', 'Googlebot', 'PerplexityBot', 'Meta-ExternalAgent',
    'FacebookBot', 'Applebot', 'Applebot-Extended', 'Bingbot', 'Amazonbot',
    'CCBot',
    // 中国 AI 平台
    'Bytespider', 'Baiduspider', 'DeepSeekBot', 'DeepSeek-Bot', 'MoonshotBot',
    'Moonshot-Bot', 'QwenBot', 'TencentBot', 'ZhipuBot', 'Zhipu-Bot',
    '360Spider', 'Sogou-spider', 'YisouSpider', 'BaiChuanBot', 'BaiChuan-Bot',
    'MiniMaxBot', 'MiniMax-Bot', 'PetalBot', 'Alibaba-Agent'
];

interface GEOSettings {
    crawlerConfig?: { [key: string]: 'allow' | 'disallow' };
}

export default async function robots(): Promise<MetadataRoute.Robots> {
    // 获取 GEO 设置
    let geoSettings: GEOSettings = {};
    try {
        const setting = await db.systemSetting.findUnique({
            where: { key: 'geo_settings' }
        });
        if (setting?.value) {
            geoSettings = JSON.parse(setting.value);
        }
    } catch (error) {
        console.error('Failed to load GEO settings for robots.txt:', error);
    }

    // 基础规则
    const i18nSettings = await getI18nSettings();
    const enableMultiLanguage = i18nSettings?.enableMultiLanguage;

    const disallowPaths = ['/admin/', '/api/'];

    // 如果禁用多语言，将所有非默认语言路径加入禁止访问列表
    if (!enableMultiLanguage) {
        locales.forEach(locale => {
            if (locale !== defaultLocale) {
                disallowPaths.push(`/${locale}/`);
            }
        });
    }

    const rules: MetadataRoute.Robots['rules'] = [
        {
            userAgent: '*',
            allow: '/',
            disallow: disallowPaths
        }
    ];

    // 已经处理过的爬虫（去重）
    const processedCrawlers = new Set<string>();

    /**
     * 合并逻辑：
     * 1. 优先处理内置列表中的爬虫
     * 2. 然后处理数据库配置中存在但内置列表没有的爬虫
     */

    // 获取配置中的所有爬虫 ID
    const configCrawlerIds = geoSettings.crawlerConfig ? Object.keys(geoSettings.crawlerConfig) : [];
    const allCrawlerIds = Array.from(new Set([...AI_CRAWLERS, ...configCrawlerIds]));

    allCrawlerIds.forEach(crawler => {
        // 关键修复：如果没有显式配置，则默认取 'allow' (一键允许所有)
        // 这解决了不同服务器因为数据库历史状态不同导致 robots.txt 展现列表不一致的问题
        const config = geoSettings.crawlerConfig?.[crawler] || 'allow';

        if (config === 'disallow') {
            rules.push({
                userAgent: crawler,
                disallow: '/'
            });
        } else {
            // 只要不是明确 Disallow，一律显式 Allow，确保列表完整性
            rules.push({
                userAgent: crawler,
                allow: '/'
            });
        }
        processedCrawlers.add(crawler);
    });

    // 获取网站域名
    const baseUrl = await getSiteUrl();
    const sitemapUrl = `${baseUrl}/sitemap.xml`;

    return {
        rules,
        sitemap: [sitemapUrl, `${baseUrl}/llms.txt`],
    };
}
