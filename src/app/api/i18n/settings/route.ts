import { NextResponse } from 'next/server';
import { getI18nSettings } from '@/lib/system-settings';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const settings = await getI18nSettings();
        return NextResponse.json(settings);
    } catch (error) {
        console.error('Failed to fetch i18n settings:', error);
        return NextResponse.json({
            enableMultiLanguage: false,
            defaultLocale: 'zh',
            supportedLocales: ['zh', 'en']
        });
    }
}
