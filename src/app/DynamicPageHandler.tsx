import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import ArticleList from '@/components/ArticleList';
import { Metadata } from 'next';
import { getSystemSettings } from '@/lib/system-settings';
import { getSiteSettings } from '@/lib/site-settings';
import { getLocale } from '@/lib/locale-server';
import { getLocalePath } from '@/lib/i18n';
import { CustomHTML } from '@/components/security/SafeHTML';

// 强制动态渲染，确保每次请求都能获取最新数据
export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ slug: string, locale?: string }>;
}

export async function generateDynamicMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug, locale: paramLocale } = await params;
    const locale = paramLocale || await getLocale();

    let page = await (db.page as any).findFirst({
        where: { slug, lang: locale },
        include: { seo: true }
    });

    if (!page) {
        page = await (db.page as any).findFirst({
            where: { slug },
            include: { seo: true }
        });
    }

    if (!page) {
        return { title: 'Page Not Found' };
    }

    const alternates: any = {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || ''}${getLocalePath(`/${page.slug}`, 'zh')}`,
        languages: {
            'zh-CN': `${process.env.NEXT_PUBLIC_SITE_URL || ''}${getLocalePath(`/${page.slug}`, 'zh')}`,
            'en-US': `${process.env.NEXT_PUBLIC_SITE_URL || ''}${getLocalePath(`/${page.slug}`, 'en')}`,
        },
    };

    return {
        title: (page as any).seo?.title || page.title,
        description: (page as any).seo?.description,
        keywords: (page as any).seo?.keywords,
        alternates
    };
}

export async function DynamicPageContent({ params }: PageProps) {
    const { slug, locale: paramLocale } = await params;
    const locale = paramLocale || await getLocale();

    let page = await (db.page as any).findFirst({
        where: {
            slug,
            lang: locale,
            status: 'PUBLISHED'
        },
        include: {
            headerTemplate: true,
            footerTemplate: true,
            template: true, // Content Template
        },
    });

    if (!page) {
        // Fallback: search slug in any language
        const fallbackPage = await (db.page as any).findFirst({
            where: { slug, status: 'PUBLISHED' }
        });

        if (fallbackPage) {
            // Found it in another language! 
            // In a real localized app, we might redirect to /[fallbackPage.lang]/[slug]
            // But for now, let's just use it to avoid 404.
            page = await (db.page as any).findFirst({
                where: { id: fallbackPage.id },
                include: {
                    headerTemplate: true,
                    footerTemplate: true,
                    template: true,
                },
            });
        }
    }

    if (!page) {
        notFound();
    }

    // 获取站点设置 (全局页眉页脚)
    const siteSettings = await getSiteSettings();

    // @ts-ignore
    const templateSections = (page as any).template?.sections;
    const pageSections = page.sections;
    // @ts-ignore
    const hasPageSections = pageSections && Array.isArray(pageSections) && pageSections.length > 0;
    // @ts-ignore
    const hasTemplateSections = templateSections && Array.isArray(templateSections) && templateSections.length > 0;

    const effectiveSections = hasPageSections ? pageSections : (hasTemplateSections ? templateSections : null);

    // @ts-ignore
    const isVisualMode = (page as any).editorMode === 'VISUAL' ||
        ((page as any).editorMode === null && effectiveSections !== null);

    if (isVisualMode) {
        const { PageRenderer } = await import('@/components/PageRenderer');
        const systemSettings = await getSystemSettings();
        return (
            <PageLayout
                headerTemplate={(page as any).headerTemplate}
                footerTemplate={(page as any).footerTemplate}
                headerSections={(siteSettings as any)?.headerSections as any[]}
                footerSections={(siteSettings as any)?.footerSections as any[]}
                translationGroupId={page.translationGroupId}
                contentTemplate={null}
            >
                <PageRenderer sections={effectiveSections as any} systemSettings={systemSettings} />
            </PageLayout>
        );
    }

    // Code Mode or Legacy HTML Content
    const contentSource = page.content || ((page as any).template ? (page as any).template.content : '');

    // Check for ArticleList placeholder
    const articleListMatch = contentSource.match(/<div id="article-list" data-layout="([^"]+)"><\/div>/);

    if (articleListMatch) {
        const [fullMatch, layout] = articleListMatch;
        const [before, after] = contentSource.split(fullMatch);

        return (
            <PageLayout
                headerTemplate={(page as any).headerTemplate}
                footerTemplate={(page as any).footerTemplate}
                headerSections={(siteSettings as any)?.headerSections as any[]}
                footerSections={(siteSettings as any)?.footerSections as any[]}
                translationGroupId={page.translationGroupId}
                contentTemplate={null}
            >
                {(page as any).template?.style && (
                    <style dangerouslySetInnerHTML={{ __html: (page as any).template.style }} />
                )}
                <CustomHTML html={before} />
                <ArticleList layout={layout as 'grid' | 'list' | 'magazine'} locale={locale as any} />
                <CustomHTML html={after} />
            </PageLayout>
        );
    }

    // Use page.template for style, but override content with page.content
    const effectiveContentTemplate = (page as any).template ? {
        ...(page as any).template,
        content: page.content
    } : null;

    return (
        <PageLayout
            headerTemplate={(page as any).headerTemplate}
            footerTemplate={(page as any).footerTemplate}
            headerSections={(siteSettings as any)?.headerSections as any[]}
            footerSections={(siteSettings as any)?.footerSections as any[]}
            translationGroupId={page.translationGroupId}
            contentTemplate={effectiveContentTemplate}
        >
            {!effectiveContentTemplate && <CustomHTML html={page.content} />}
        </PageLayout>
    );
}
