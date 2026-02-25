import { db } from '@/lib/db';
import HeroSection from '@/components/public/HeroSection';
import FeaturedArticles from '@/components/public/FeaturedArticles';
import { Zap, Shield, Rocket } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { CustomHTML } from '@/components/security/SafeHTML';

import { getSEOSettings, getSystemSettings } from '@/lib/system-settings';
import { getSiteSettings } from '@/lib/site-settings';
import { getLocale } from '@/lib/locale-server';
import { t } from '@/lib/i18n';

import { cache } from 'react';

// 强制缓存一小时，启用ISR
export const revalidate = 3600;

// 使用 React Cache 复用数据库查询请求
// 这确保了 generateMetadata 和 HomePage 组件即便调用同样的逻辑，在一个请求周期内也只查一次数据库
const getHomePageData = cache(async (locale: string) => {
    // 1. 尝试查找配置为“首页”类型的已发布页面 (优先默认页)
    return await (db.page as any).findFirst({
        where: { type: 'HOME', status: 'PUBLISHED', lang: locale, isDefault: true },
        include: { seo: true, headerTemplate: true, footerTemplate: true, template: true }
    }) || await (db.page as any).findFirst({
        where: { type: 'HOME', status: 'PUBLISHED', lang: locale },
        include: { seo: true, headerTemplate: true, footerTemplate: true, template: true }
    });
});

export async function generateMetadata() {
    try {
        const locale = await getLocale();

        // 1. 获取首页数据 (使用缓存)
        const homePage = await getHomePageData(locale);

        const globalSEO = await getSEOSettings();

        const alternates = {
            canonical: process.env.NEXT_PUBLIC_SITE_URL || '/',
            languages: {
                'zh-CN': process.env.NEXT_PUBLIC_SITE_URL || '/',
                'en-US': `${process.env.NEXT_PUBLIC_SITE_URL || ''}/en`,
            },
        };

        // 如果有自定义首页且配置了 SEO
        if ((homePage as any)?.seo) {
            return {
                title: (homePage as any).seo.title || homePage?.title || globalSEO.siteName,
                description: (homePage as any).seo.description || globalSEO.siteDescription,
                icons: {
                    icon: globalSEO.siteIcon || '/favicon.ico',
                    shortcut: globalSEO.siteIcon || '/favicon.ico',
                    apple: globalSEO.siteIcon || '/favicon.ico',
                },
                alternates
            };
        }

        // 默认首页使用全局配置
        return {
            title: globalSEO.siteName,
            description: globalSEO.siteDescription,
            icons: {
                icon: globalSEO.siteIcon || '/favicon.ico',
                shortcut: globalSEO.siteIcon || '/favicon.ico',
                apple: globalSEO.siteIcon || '/favicon.ico',
            },
            alternates
        };
    } catch (error) {
        // 数据库不可用时返回默认元数据
        console.warn('Database unavailable in home page metadata');
        return {
            title: '企业官网',
            description: 'Enterprise Content Management System',
        };
    }
}

export default async function HomePage() {
    const locale = await getLocale();

    // 1. 获取首页数据 (使用缓存)
    const homePage = await getHomePageData(locale);

    // 获取站点设置 (全局页眉页脚)
    const siteSettings = await getSiteSettings(locale);

    // 2. 如果找到了动态首页配置，直接渲染
    if (homePage) {
        // ... (保持原有逻辑)
        const templateSections = (homePage as any).template?.sections;
        const pageSections = homePage.sections;
        // @ts-ignore
        const hasPageSections = pageSections && Array.isArray(pageSections) && pageSections.length > 0;
        // @ts-ignore
        const hasTemplateSections = templateSections && Array.isArray(templateSections) && templateSections.length > 0;

        const effectiveSections = hasPageSections ? pageSections : (hasTemplateSections ? templateSections : null);

        // @ts-ignore
        const isVisualMode = homePage.editorMode === 'VISUAL' ||
            (homePage.editorMode === null && effectiveSections !== null);

        if (isVisualMode) {
            const { PageRenderer } = await import('@/components/PageRenderer');
            const systemSettings = await getSystemSettings();
            return (
                // @ts-ignore
                <PageLayout
                    headerTemplate={(homePage as any).headerTemplate}
                    footerTemplate={(homePage as any).footerTemplate}
                    headerSections={(siteSettings as any)?.headerSections as any[]}
                    footerSections={(siteSettings as any)?.footerSections as any[]}
                    translationGroupId={(homePage as any).translationGroupId}
                >
                    <PageRenderer sections={effectiveSections as any} systemSettings={systemSettings} />
                </PageLayout>
            );
        }

        return (
            // @ts-ignore
            <PageLayout
                headerTemplate={(homePage as any).headerTemplate}
                footerTemplate={(homePage as any).footerTemplate}
                headerSections={(siteSettings as any)?.headerSections as any[]}
                footerSections={(siteSettings as any)?.footerSections as any[]}
                translationGroupId={(homePage as any).translationGroupId}
                contentTemplate={(homePage as any).template}
            >
                <CustomHTML html={homePage.content} />
            </PageLayout>
        );
    }

    // 3. 否则，渲染默认的硬编码首页
    const featuredArticles = await (db.article as any).findMany({
        where: {
            status: 'PUBLISHED',
            lang: locale,
        },
        include: {
            author: true,
            category: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 6,
    });

    return (
        // @ts-ignore
        <PageLayout
            headerTemplate={null}
            footerTemplate={null}
            headerSections={siteSettings?.headerSections as any[]}
            footerSections={siteSettings?.footerSections as any[]}
        >
            <HeroSection locale={locale} />
            <FeaturedArticles articles={featuredArticles as any} locale={locale} />

            {/* 功能特性 */}
            <section className="bg-gray-50 py-16 sm:py-24">
                <div className="container mx-auto px-4">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                            {t(locale, 'home.whyChoose')}
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            {t(locale, 'home.whyChooseSubtitle')}
                        </p>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                icon: Zap,
                                title: t(locale, 'home.featureAI'),
                                description: t(locale, 'home.featureAIDesc'),
                                color: 'blue',
                            },
                            {
                                icon: Rocket,
                                title: t(locale, 'home.featureSEO'),
                                description: t(locale, 'home.featureSEODesc'),
                                color: 'purple',
                            },
                            {
                                icon: Shield,
                                title: t(locale, 'home.featureEnterprise'),
                                description: t(locale, 'home.featureEnterpriseDesc'),
                                color: 'green',
                            },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md"
                            >
                                <div className={`mb-4 inline-flex rounded-lg bg-${feature.color}-100 p-3`}>
                                    <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-gray-900">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </PageLayout>
    );
}
