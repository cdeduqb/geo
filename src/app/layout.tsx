import type { Metadata } from "next";
import "@/app/globals.css";
import { getSEOSettings, getGEOSettings } from '@/lib/system-settings';
import BaseLayout from '@/components/layout/BaseLayout';
import { defaultLocale } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await getSEOSettings();
    const geo = await getGEOSettings();

    return {
      title: {
        default: seo.siteName,
        template: `%s | ${seo.siteName}`,
      },
      description: seo.siteDescription,
      icons: {
        icon: seo.siteIcon || '/favicon.ico',
        shortcut: seo.siteIcon || '/favicon.ico',
        apple: seo.siteIcon || '/favicon.ico',
      },
      metadataBase: new URL(seo.siteUrl),
      keywords: seo.siteKeywords || undefined,
      openGraph: {
        title: seo.siteName,
        description: seo.siteDescription,
        url: seo.siteUrl,
        siteName: seo.siteName,
        locale: defaultLocale,
        type: 'website',
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      verification: {
        google: geo.googleOptimization?.verificationId,
        other: {
          ...(geo.baiduOptimization?.verificationCode ? { 'baidu-site-verification': geo.baiduOptimization.verificationCode } : {}),
        }
      },
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
    };
  } catch (error) {
    return {
      title: {
        default: '企业官网',
        template: '%s | 企业官网',
      },
      description: 'Enterprise Content Management System',
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 根布局使用默认语言，子布局通过 LocaleSync 在客户端修正，避免破坏 SSG
  const seo = await getSEOSettings();
  return (
    <html lang={defaultLocale} suppressHydrationWarning>
      <body className="bg-gray-50 text-gray-900 antialiased" suppressHydrationWarning>
        <BaseLayout locale={defaultLocale}>{children}</BaseLayout>
        {/* 全局 JSON-LD 注入 (提升国内大模型及百度对站点的整体认知) */}
        {seo && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "WebSite",
                    "@id": `${seo.siteUrl}#website`,
                    "url": seo.siteUrl,
                    "name": seo.siteName,
                    "description": seo.siteDescription,
                    "inLanguage": defaultLocale
                  },
                  {
                    "@type": "Organization",
                    "@id": `${seo.siteUrl}#organization`,
                    "name": seo.siteName,
                    "url": seo.siteUrl,
                    "logo": seo.siteLogo ? {
                        "@type": "ImageObject",
                        "url": seo.siteLogo
                    } : undefined
                  }
                ]
              })
            }}
          />
        )}
      </body>
    </html>
  );
}
