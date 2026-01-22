import zh, { Translations } from './locales/zh';
import en from './locales/en';

// 支持的语言
export const locales = ['zh', 'en'] as const;
export type Locale = typeof locales[number];

// 语言名称映射
export const localeNames: Record<Locale, string> = {
    zh: '简体中文',
    en: 'English',
};

// 默认语言
export const defaultLocale: Locale = 'zh';

// 翻译文件映射
const translations: Record<Locale, Translations> = {
    zh,
    en,
};

/**
 * 获取指定语言的翻译对象
 */
export function getTranslations(locale: Locale | string): Translations {
    const lang = locales.includes(locale as Locale) ? locale as Locale : defaultLocale;
    return translations[lang];
}

/**
 * 获取翻译文本
 * @param locale 语言代码
 * @param key 翻译键，使用点号分隔层级，如 'common.home'
 * @param params 替换参数，如 { n: 5, year: 2024 }
 */
export function t(locale: Locale | string, key: string, params?: Record<string, string | number>): string {
    const trans = getTranslations(locale);
    const keys = key.split('.');

    let value: any = trans;
    for (const k of keys) {
        value = value?.[k];
        if (value === undefined) {
            console.warn(`Translation key not found: ${key}`);
            return key;
        }
    }

    if (typeof value !== 'string') {
        console.warn(`Translation value is not a string: ${key}`);
        return key;
    }

    // 替换参数
    if (params) {
        return value.replace(/\{(\w+)\}/g, (_, paramKey) => {
            return params[paramKey]?.toString() ?? `{${paramKey}}`;
        });
    }

    return value;
}

/**
 * 根据 URL 路径提取当前语言
 */
export function getLocaleFromPath(pathname: string): Locale {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0 && locales.includes(segments[0] as Locale)) {
        return segments[0] as Locale;
    }
    return defaultLocale;
}

/**
 * 获取带语言前缀的路径
 */
export function getLocalePath(path: string, locale: Locale): string {
    // 处理空路径、外部链接、锚点和 javascript 链接
    if (!path || path.startsWith('http') || path.startsWith('#') || path.startsWith('javascript:')) {
        return path;
    }

    // 提取路径中已有的语言标识（如果有）
    const pathSegments = path.split('/').filter(Boolean);
    let cleanPath = path;
    if (pathSegments.length > 0 && locales.includes(pathSegments[0] as Locale)) {
        // 移除已有的语言前缀
        const existingLocale = pathSegments[0];
        if (path === `/${existingLocale}`) {
            cleanPath = '/';
        } else {
            cleanPath = path.replace(`/${existingLocale}/`, '/');
        }
    }

    // 默认语言不加前缀
    if (locale === defaultLocale) {
        return cleanPath;
    }

    // 避免双斜杠
    const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
    return `/${locale}${normalizedPath === '/' ? '' : normalizedPath}`;
}

// 导出类型
export type { Translations };
