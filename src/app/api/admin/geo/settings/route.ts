import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

const GEO_SETTINGS_KEY = 'geo_settings';

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 从系统设置中获取 GEO 设置
        const setting = await db.systemSetting.findUnique({
            where: { key: GEO_SETTINGS_KEY }
        });

        if (!setting) {
            return NextResponse.json({ settings: null });
        }

        try {
            const settings = JSON.parse(setting.value);
            return NextResponse.json({ settings });
        } catch {
            return NextResponse.json({ settings: null });
        }
    } catch (error) {
        console.error('Failed to fetch GEO settings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { settings } = await request.json();

        if (!settings) {
            return NextResponse.json({ error: 'Settings are required' }, { status: 400 });
        }

        // 保存到系统设置
        await db.systemSetting.upsert({
            where: { key: GEO_SETTINGS_KEY },
            update: { value: JSON.stringify(settings) },
            create: {
                key: GEO_SETTINGS_KEY,
                value: JSON.stringify(settings),
                description: 'GEO 优化设置（AI 爬虫控制、结构化数据等）'
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to save GEO settings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
