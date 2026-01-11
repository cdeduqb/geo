import { locales } from '@/lib/i18n';
import { db } from '@/lib/db';
import HomePage, { generateMetadata as generateHomeMetadata } from '@/app/page';
import { DynamicPageContent, generateDynamicMetadata } from '@/app/DynamicPageHandler';
import { Metadata } from 'next';

// 强制动态渲染
export const dynamic = 'force-dynamic';

interface ParamsProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ParamsProps): Promise<Metadata> {
    const { locale } = await params;
    if (locales.includes(locale as any)) {
        return generateHomeMetadata();
    }
    // Otherwise it's a slug. Check if it exists in any language.
    const targetPage = await db.page.findFirst({
        where: { slug: locale, status: 'PUBLISHED' }
    });
    const targetLocale = targetPage?.lang || 'zh';
    const slugParams = { slug: locale, locale: targetLocale };
    return generateDynamicMetadata({ params: Promise.resolve(slugParams) });
}

export default async function CombinedPage({ params }: ParamsProps) {
    const { locale } = await params;
    if (locales.includes(locale as any)) {
        return <HomePage />;
    }
    // Otherwise it's a slug. Check if it exists in any language.
    const targetPage = await db.page.findFirst({
        where: { slug: locale, status: 'PUBLISHED' }
    });

    const targetLocale = targetPage?.lang || 'zh';
    const slugParams = { slug: locale, locale: targetLocale };
    // @ts-ignore
    return <DynamicPageContent params={Promise.resolve(slugParams)} />;
}
