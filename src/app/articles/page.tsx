import { db } from '@/lib/db';
import PageLayout from '@/components/PageLayout';
import ArticleList from '@/components/ArticleList';
import { getLocale } from '@/lib/locale-server';
import { getSiteSettings } from '@/lib/site-settings';
import { Metadata } from 'next';
import { t } from '@/lib/i18n';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const { getSiteUrl } = await import('@/lib/system-settings');
    const { locales, getLocalePath } = await import('@/lib/i18n');
    const baseUrl = await getSiteUrl();

    const languages: Record<string, string> = {};
    locales.forEach(l => {
        const langCode = l === 'zh' ? 'zh-CN' : l === 'en' ? 'en-US' : l;
        languages[langCode] = `${baseUrl}${getLocalePath('/articles', l as any)}`;
    });

    return {
        title: `${t(locale, 'article.list')} | 企业官网`,
        description: t(locale, 'article.stayUpdated'),
        alternates: {
            canonical: `${baseUrl}${getLocalePath('/articles', locale as any)}`,
            languages: Object.keys(languages).length > 1 ? languages : undefined,
        }
    };
}

export default async function ArticlesPage({
    searchParams
}: {
    searchParams: Promise<{ page?: string; category?: string }>;
}) {
    const locale = await getLocale();
    const siteSettings = await getSiteSettings(locale);
    const resolvedSearchParams = await searchParams;
    const currentPage = parseInt(resolvedSearchParams.page || '1');
    const categoryId = resolvedSearchParams.category;

    return (
        <PageLayout
            headerTemplate={null}
            footerTemplate={null}
            headerSections={siteSettings?.headerSections as any[]}
            footerSections={siteSettings?.footerSections as any[]}
        >
            <div className="bg-gray-50 py-12 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                        {t(locale, 'article.latestArticles')}
                    </h1>
                    <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
                        {t(locale, 'article.stayUpdated')}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <ArticleList
                    layout="grid"
                    limit={12}
                    page={currentPage}
                    categoryId={categoryId}
                    locale={locale}
                />
            </div>
        </PageLayout>
    );
}
