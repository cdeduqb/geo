import { headers } from 'next/headers';
import { defaultLocale, Locale } from './i18n';

export async function getLocale(): Promise<Locale> {
    return await getRequestLocale();
}

/**
 * 如果确实需要在服务端组件中获取当前请求的语言（会使该页面变为动态渲染）
 */
export async function getRequestLocale(): Promise<Locale> {
    try {
        const headerList = await headers();
        const locale = headerList.get('x-locale') as Locale || defaultLocale;
        return locale;
    } catch {
        return defaultLocale;
    }
}
