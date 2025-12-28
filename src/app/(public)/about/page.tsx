import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import { getSiteSettings } from '@/lib/site-settings';
import { getLocale } from '@/lib/locale-server';
import { t } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();

    const page = await db.page.findFirst({
        where: { slug: 'about', lang: locale },
        include: { template: true }
    });

    const alternates = {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/about`,
        languages: {
            'zh-CN': `${process.env.NEXT_PUBLIC_SITE_URL || ''}/about`,
            'en-US': `${process.env.NEXT_PUBLIC_SITE_URL || ''}/en/about`,
        },
    };

    // 如果找不到页面，尝试查找激活的模板作为回退（兼容旧逻辑）
    if (!page) {
        const template = await db.pageTemplate.findFirst({
            where: { moduleType: 'ABOUT_PAGE', isActive: true },
        });
        return {
            title: template?.name || t(locale, 'about.title'),
            description: template?.description || t(locale, 'about.ourMission'),
            alternates
        };
    }

    return {
        title: page.title,
        description: (page as any).template?.description || t(locale, 'about.ourMission'),
        alternates
    };
}

export default async function AboutPage() {
    const locale = await getLocale();

    // 1. 获取页面配置
    const page = await db.page.findFirst({
        where: { slug: 'about', lang: locale },
        include: {
            headerTemplate: true,
            footerTemplate: true,
            template: true, // 内容模板
        }
    });

    // 2. 获取站点设置 (全局页眉页脚)
    const siteSettings = await getSiteSettings();

    // 3. 确定最终使用的模板
    // 如果页面不存在，尝试直接查找激活的内容模板（兼容旧逻辑）
    let contentTemplate = (page as any)?.template;
    if (!page) {
        contentTemplate = await db.pageTemplate.findFirst({
            where: { moduleType: 'ABOUT_PAGE', isActive: true }
        });
    }

    if (!contentTemplate && !page?.content && (!page?.sections || (Array.isArray(page.sections) && page.sections.length === 0))) {
        notFound();
    }

    const headerTemplate = (page as any)?.headerTemplate;
    const footerTemplate = (page as any)?.footerTemplate;

    // Visual Mode Logic
    const isVisualMode = (page as any)?.editorMode === 'VISUAL' || ((page as any)?.editorMode === null && page?.sections && Array.isArray(page.sections) && page.sections.length > 0);

    if (isVisualMode && page?.sections) {
        const { getSystemSettings } = await import('@/lib/system-settings');
        const { PageRenderer } = await import('@/components/PageRenderer');
        const systemSettings = await getSystemSettings();

        return (
            <PageLayout
                headerTemplate={headerTemplate}
                footerTemplate={footerTemplate}
                headerSections={(siteSettings as any)?.headerSections as any[]}
                footerSections={(siteSettings as any)?.footerSections as any[]}
            >
                <PageRenderer sections={page.sections as any} systemSettings={systemSettings} />
            </PageLayout>
        );
    }

    return (
        <PageLayout
            headerTemplate={headerTemplate}
            footerTemplate={footerTemplate}
            headerSections={(siteSettings as any)?.headerSections as any[]}
            footerSections={(siteSettings as any)?.footerSections as any[]}
        >
            {/* 注入内容模板样式 */}
            {contentTemplate?.style && (
                <style dangerouslySetInnerHTML={{ __html: contentTemplate.style }} />
            )}

            {/* 渲染内容：优先使用模板内容，其次使用页面自定义内容 */}
            <div
                className="template-content"
                dangerouslySetInnerHTML={{
                    __html: contentTemplate?.content || page?.content || ''
                }}
            />
        </PageLayout>
    );
}
