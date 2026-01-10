import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/system-settings';
import { db } from '@/lib/db';

// AI 爬虫列表
const AI_CRAWLERS = [
    // 国际 AI 平台
    'GPTBot',
    'OAI-SearchBot',
    'Google-Extended',
    'anthropic-ai',
    'PerplexityBot',
    'CCBot',
    'Amazonbot',
    'FacebookBot',
    'Bingbot',
    'Applebot-Extended',
    // 中国 AI 平台
    'Bytespider',       // 豆包
    'Baiduspider',      // 百度文心一言
    'Sogou-spider',     // 搜狗
    '360Spider',        // 360
    'YisouSpider',      // 神马
    'Alibaba-Agent',    // 通义千问
    'TencentBot',       // 腾讯元宝
    'Moonshot-Bot',     // Kimi
    'DeepSeek-Bot',     // DeepSeek
    'Zhipu-Bot',        // 智谱 AI
    'BaiChuan-Bot',     // 百川
    'MiniMax-Bot',      // MiniMax
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
    const rules: MetadataRoute.Robots['rules'] = [
        {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/']
        }
    ];

    // 为每个配置的 AI 爬虫显式添加规则
    AI_CRAWLERS.forEach(crawler => {
        const config = geoSettings.crawlerConfig?.[crawler];
        if (config === 'disallow') {
            rules.push({
                userAgent: crawler,
                disallow: '/'
            });
        } else if (config === 'allow') {
            // 显式允许，有些 AI 爬虫在有通用 Disallow 时需要显式 Allow
            rules.push({
                userAgent: crawler,
                allow: '/'
            });
        }
    });

    // 获取网站域名
    const baseUrl = await getSiteUrl();
    const sitemapUrl = `${baseUrl}/sitemap.xml`;

    return {
        rules,
        sitemap: sitemapUrl,
    };
}
