// 统一导出国际化模块
export {
    t,
    locales,
    localeNames,
    defaultLocale,
    getLocalePath,
    getLocaleFromPath,
    type Locale,
    type Translations,
} from './i18n/index';

// 客户端 hook (需要单独导入以避免服务端组件问题)
// import { useTranslation } from '@/lib/i18n/use-translation';

// 保持向后兼容
import { locales as _locales, Locale as _Locale } from './i18n/index';

/**
 * 判断是否为支持的语言
 */
export function isSupportedLocale(locale: string): locale is _Locale {
    return _locales.includes(locale as _Locale);
}
