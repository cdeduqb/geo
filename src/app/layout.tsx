import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";



const inter = Inter({ subsets: ["latin"] });

import { getSEOSettings, getGEOSettings } from '@/lib/system-settings';
import { getSiteSettings } from '@/lib/site-settings';
import { OrganizationStructuredData, WebSiteStructuredData } from '@/components/geo/StructuredData';
import LicenseFooter from '@/components/license/LicenseFooter';
import { getLocale } from '@/lib/locale-server';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await getSEOSettings();

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
      verification: {
        google: (await getGEOSettings()).googleOptimization?.verificationId,
      }
    };
  } catch (error) {
    // 数据库不可用时返回默认元数据
    console.warn('Failed to generate metadata from database, using defaults');
    return {
      title: {
        default: 'GeoCMS',
        template: '%s | GeoCMS',
      },
      description: 'Enterprise Content Management System',
      icons: {
        icon: '/favicon.ico',
      },
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const seo = await getSEOSettings();
  const geo = await getGEOSettings();
  const siteSettings = await getSiteSettings(locale);
  const primaryColor = siteSettings?.primaryColor || '#2563eb';

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
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
      </body>
    </html>
  );
}

// Helper to convert hex to rgb for opacity-based tailwind-like classes if needed
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ?
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
    '37, 99, 235';
}
