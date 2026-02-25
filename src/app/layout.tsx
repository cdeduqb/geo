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
  // 根布局使用默认语言
  return (
    <html lang={defaultLocale} suppressHydrationWarning>
      <body className="bg-gray-50 text-gray-900 antialiased" suppressHydrationWarning>
        <BaseLayout locale={defaultLocale}>{children}</BaseLayout>
      </body>
    </html>
  );
}
