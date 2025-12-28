import { headers } from 'next/headers';
import { defaultLocale, Locale } from './i18n';

/**
 * 从请求头中获取当前语言 (由 Middleware 注入)
 */
export async function getLocale(): Promise<Locale> {
    const headerList = await headers();
    const locale = headerList.get('x-locale') as Locale || defaultLocale;
    return locale;
}
