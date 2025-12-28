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
    siteName: 'GeoCMS',
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
        logoText: 'GeoCMS',
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
        logoText: 'GeoCMS',
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
        copyright: `© ${new Date().getFullYear()} GeoCMS. All rights reserved.`
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
                // 递归合并太复杂，这里做简单的浅层覆盖。
                // 注意：如果 localized setting 只存了 headerSections，那么其他字段（如 siteName）将保持 base 的值，这是符合预期的继承逻辑。
                settings = { ...settings, ...parsedLocale };
            } catch (e) {
                console.error(`Failed to parse ${localeKey} JSON:`, e);
            }
        } else {
            // 如果只有基础设置，且基础设置有 header/footer，但当前是英文环境
            // 我们不能简单地把中文菜单给英文用户（除非用户明确配置了）。
            // 此时，如果用户没有配置 site_settings_en，我们应该根据 locale 清空 header/footer 
            // 从而触发下方的“智能兜底”逻辑生成英文默认值。
            // 策略：如果没找到 locale 设置，就把 settings 里继承来的 header/footer 视为无效（因为它们是中文的）
            // 除非... 用户真的想展示中文？
            // 假设：site_settings_en 不存在意味着“尚未配置英语”。我们应该提供 Defaults (En)。

            // 下面的逻辑会检查 headerSections 是否存在。
            // 我们在这里强制重置它们为 null，以便触发兜底
            settings.headerSections = null;
            settings.footerSections = null;
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
