import type { Metadata } from "next";
import "@/app/globals.css";
import { getSEOSettings, getGEOSettings } from '@/lib/system-settings';
import { getSiteSettings } from '@/lib/site-settings';
import { OrganizationStructuredData, WebSiteStructuredData } from '@/components/geo/StructuredData';
import { Locale } from '@/lib/i18n';
import SEOScripts from './SEOScripts';
import LicensePing from './LicensePing';

interface BaseLayoutProps {
    children: React.ReactNode;
    locale: Locale;
}

/**
 * 基础布局组件 (内容部分)
 * 不包含 <html> 和 <body> 标签，避免嵌套冲突
 */
export default async function BaseLayout({
    children,
    locale,
}: BaseLayoutProps) {
    const seo = await getSEOSettings();
    const geo = await getGEOSettings();
    const siteSettings = await getSiteSettings(locale);
    const primaryColor = siteSettings?.primaryColor || '#2563eb';

    return (
        <>
            {/* 客户端动态注入 SEO 脚本 */}
            <SEOScripts />
            {/* 授权信息上报 */}
            <LicensePing />
            {geo.enableStructuredData && (
                <>
                    <WebSiteStructuredData
                        name={seo.siteName}
                        url={seo.siteUrl}
                        description={seo.siteDescription}
                    />
                    <OrganizationStructuredData
                        name={seo.siteName}
                        url={seo.siteUrl}
                        logo={seo.siteLogo || undefined}
                        sameAs={geo.entityInfo?.sameAs}
                    />
                </>
            )}
            <style dangerouslySetInnerHTML={{
                __html: `
                :root {
                    --primary-color: ${primaryColor};
                    --primary-color-rgb: ${hexToRgb(primaryColor)};
                }
                .text-primary { color: var(--primary-color); }
                .bg-primary { background-color: var(--primary-color); }
                .border-primary { border-color: var(--primary-color); }
            `}} />
            {children}
        </>
    );
}

function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ?
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
        '37, 99, 235';
}

