import BaseLayout from '@/components/layout/BaseLayout';
import { locales, Locale, defaultLocale } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import { LocaleSync } from '@/components/layout/LocaleSync';

export async function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale: localeParam } = await params;

    // 检测路径中的语言标识符。如果不是支持的语言，则作为 slug 路径处理，布局回退到默认语言。
    const isSupported = locales.includes(localeParam as any);

    // 安全检查：如果访问的是非默认语言前缀（如 /en），但系统未开启多语言，直接返回 404
    if (isSupported && localeParam !== defaultLocale) {
        const { getI18nSettings } = await import('@/lib/system-settings');
        const i18nSettings = await getI18nSettings();
        if (!i18nSettings?.enableMultiLanguage) {
            notFound();
        }
    }

    const locale = isSupported ? (localeParam as Locale) : defaultLocale;

    return (
        <>
            <LocaleSync locale={locale} />
            <BaseLayout locale={locale}>{children}</BaseLayout>
        </>
    );
}
