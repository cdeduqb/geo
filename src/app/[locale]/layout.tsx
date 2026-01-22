import BaseLayout from '@/components/layout/BaseLayout';
import { locales, Locale } from '@/lib/i18n';
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
    const { locale } = await params;

    // 验证语言是否支持
    if (!locales.includes(locale as any)) {
        notFound();
    }

    return (
        <>
            <LocaleSync locale={locale as Locale} />
            <BaseLayout locale={locale as Locale}>{children}</BaseLayout>
        </>
    );
}
