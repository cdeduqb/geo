import { headers } from 'next/headers';
import { defaultLocale, Locale } from './i18n';

export async function getLocale(): Promise<Locale> {
    // 为了支持完全静态生成 (SSG)，我们避免在顶级 Layout 中调用 headers()
    // 在生产环境下，Middleware 会处理语言重定向和路径。
    // 这里我们返回默认语言作为静态基准。
    return defaultLocale;
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
