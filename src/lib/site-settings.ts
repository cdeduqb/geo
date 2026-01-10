import { db } from './db';

interface SiteSettings {
    primaryColor: string;
    siteName: string;
    logo: string | null;
    favicon: string | null;
    headerSections: any[] | null;
    footerSections: any[] | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    copyright: string | null;
}

/**
 * 默认站点设置，作为系统最后一道防线
 */
const DEFAULT_SITE_SETTINGS: SiteSettings = {
    primaryColor: '#2563eb',
    siteName: '企业官网',
    logo: null,
    favicon: null,
    headerSections: null,
    footerSections: null,
    phone: null,
    email: null,
    address: null,
    copyright: null,
};

// 英语默认页眉数据
const EN_HEADER_DEFAULT = {
    id: 'default-header-en',
    type: 'header',
    data: {
        logo: null,
        logoText: '企业官网',
        navItems: [
            { label: 'Home', link: '/' },
            { label: 'Products', link: '/products' },
            { label: 'About', link: '/about' },
            { label: 'Contact', link: '/contact' }
        ],
        ctaButtonText: 'Admin',
        ctaButtonLink: '/admin'
    },
    style: {
        layout: 'default',
        backgroundColor: '#ffffff',
        textColor: '#111827',
        sticky: 'sticky top-0',
        height: 'h-16'
    }
};

// 英语默认页脚数据
const EN_FOOTER_DEFAULT = {
    id: 'default-footer-en',
    type: 'footer-14',
    data: {
        logo: null,
        logoText: '企业官网',
        col1Title: 'Products',
        col1Links: [
            { label: 'Features', link: '/features' },
            { label: 'Pricing', link: '/pricing' }
        ],
        col2Title: 'Support',
        col2Links: [
            { label: 'Help Center', link: '/docs' },
            { label: 'Contact Us', link: '/contact' }
        ],
        col3Title: 'Company',
        col3Links: [
            { label: 'About Us', link: '/about' },
            { label: 'Careers', link: '/careers' }
        ],
        copyright: `© ${new Date().getFullYear()} 企业官网. All rights reserved.`
    },
    style: {
        backgroundColor: '#ffffff',
        textColor: '#111827'
    }
};

export async function getSiteSettings(locale: string = 'zh'): Promise<SiteSettings> {
    // 1. 获取基础设置（永远从中文/主设置中获取，作为基准）
    let settings: SiteSettings = { ...DEFAULT_SITE_SETTINGS };

    // 优先尝试从通用的 SystemSetting 键值对获取
    const baseUnifiedSetting = await db.systemSetting.findUnique({
        where: { key: 'site_settings' }
    });

    if (baseUnifiedSetting?.value) {
        try {
            const parsed = JSON.parse(baseUnifiedSetting.value);
            settings = { ...settings, ...parsed };
        } catch (e) {
            console.error('Failed to parse site_settings JSON:', e);
        }
    } else {
        // 兼容模式：尝试从专属 SiteSettings 表获取
        const legacySettings = await db.siteSettings.findFirst();
        if (legacySettings) {
            settings = {
                ...settings,
                ...legacySettings,
                siteName: legacySettings.siteName || settings.siteName,
                headerSections: legacySettings.headerSections as any[] | null,
                footerSections: legacySettings.footerSections as any[] | null
            };
        }
    }

    // 2. 如果请求的是非中文语言，尝试获取特定语言的设置并覆盖
    if (locale !== 'zh') {
        const localeKey = `site_settings_${locale}`; // 例如 site_settings_en
        const localeUnifiedSetting = await db.systemSetting.findUnique({
            where: { key: localeKey }
        });

        if (localeUnifiedSetting?.value) {
            try {
                const parsedLocale = JSON.parse(localeUnifiedSetting.value);
                settings = { ...settings, ...parsedLocale };
            } catch (e) {
                console.error(`Failed to parse ${localeKey} JSON:`, e);
            }
        }
    }

    // 2.5 尝试从 Page 表中获取标记为 isDefault 的 HEADER/FOOTER 页面
    if (!settings.headerSections || settings.headerSections.length === 0) {
        const defaultHeaderPage = await (db.page as any).findFirst({
            where: { type: 'HEADER', lang: locale, isDefault: true, status: 'PUBLISHED' },
            select: { sections: true }
        });
        if (defaultHeaderPage?.sections) {
            settings.headerSections = defaultHeaderPage.sections as any[];
        }
    }

    if (!settings.footerSections || settings.footerSections.length === 0) {
        const defaultFooterPage = await (db.page as any).findFirst({
            where: { type: 'FOOTER', lang: locale, isDefault: true, status: 'PUBLISHED' },
            select: { sections: true }
        });
        if (defaultFooterPage?.sections) {
            settings.footerSections = defaultFooterPage.sections as any[];
        }
    }

    // 3. 智能兜底：如果没有配置页眉页脚，自动生成默认配置
    const isEn = locale === 'en';

    if (!settings.headerSections || (Array.isArray(settings.headerSections) && settings.headerSections.length === 0)) {
        if (isEn) {
            // 英文默认
            settings.headerSections = [{
                ...EN_HEADER_DEFAULT,
                data: { ...EN_HEADER_DEFAULT.data, logo: settings.logo, logoText: settings.siteName } // 使用全局 Logo/Name
            }];
        } else {
            // 中文默认 (原逻辑)
            settings.headerSections = [{
                id: 'default-header',
                type: 'header',
                data: {
                    logo: settings.logo,
                    logoText: settings.siteName,
                    navItems: [
                        { label: '首页', link: '/' },
                        { label: '产品', link: '/products' },
                        { label: '关于', link: '/about' },
                        { label: '联系', link: '/contact' }
                    ],
                    ctaButtonText: '后台管理',
                    ctaButtonLink: '/admin'
                },
                style: {
                    layout: 'default',
                    backgroundColor: '#ffffff',
                    textColor: '#111827',
                    sticky: 'sticky top-0',
                    height: 'h-16'
                }
            }];
        }
    }

    if (!settings.footerSections || (Array.isArray(settings.footerSections) && settings.footerSections.length === 0)) {
        if (isEn) {
            // 英文默认
            settings.footerSections = [{
                ...EN_FOOTER_DEFAULT,
                data: { ...EN_FOOTER_DEFAULT.data, logo: settings.logo, logoText: settings.siteName, copyright: `© ${new Date().getFullYear()} ${settings.siteName}. All rights reserved.` }
            }];
        } else {
            // 中文默认
            settings.footerSections = [{
                id: 'default-footer',
                type: 'footer-14',
                data: {
                    logo: settings.logo,
                    logoText: settings.siteName,
                    col1Title: '产品',
                    col1Links: [
                        { label: '功能特性', link: '/features' },
                        { label: '定价方案', link: '/pricing' }
                    ],
                    col2Title: '支持',
                    col2Links: [
                        { label: '帮助中心', link: '/docs' },
                        { label: '联系我们', link: '/contact' }
                    ],
                    col3Title: '关于',
                    col3Links: [
                        { label: '公司介绍', link: '/about' },
                        { label: '加入我们', link: '/careers' }
                    ],
                    copyright: `© ${new Date().getFullYear()} ${settings.siteName}. All rights reserved.`
                },
                style: {
                    backgroundColor: '#ffffff',
                    textColor: '#111827'
                }
            }];
        }
    }

    return settings;
}
