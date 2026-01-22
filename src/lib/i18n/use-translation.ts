'use client';

import { usePathname } from 'next/navigation';
import { t, Locale, locales, defaultLocale, getLocalePath as getLocalePathBase, getLocaleFromPath } from './index';

/**
 * 客户端翻译 hook
 * 通过 pathname 自动检测当前语言
 */
export function useTranslation() {
    const pathname = usePathname();

    // 从 pathname 提取当前语言
    const locale = getLocaleFromPath(pathname);

    // 返回翻译函数和工具
    return {
        locale,
        t: (key: string, params?: Record<string, string>) => t(locale, key, params),
        getLocalePath: (path: string) => getLocalePathBase(path, locale),
        isEn: locale === 'en',
    };
}

/**
 * 获取语言前缀
 */
export function useLocalePrefix() {
    const pathname = usePathname();
    const locale = getLocaleFromPath(pathname);
    return locale === defaultLocale ? '' : `/${locale}`;
}
