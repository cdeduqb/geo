import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const filename = request.nextUrl.searchParams.get('filename');

    if (!filename) {
        return new NextResponse('File Not Found', { status: 404 });
    }

    try {
        const setting = await db.systemSetting.findUnique({
            where: { key: 'site_verification_files' }
        });

        if (!setting || !setting.value) {
            return new NextResponse('Configuration Not Found', { status: 404 });
        }

        let files: any[] = [];
        try {
            files = JSON.parse(setting.value);
        } catch (e) {
            return new NextResponse('Configuration Error', { status: 500 });
        }

        if (!Array.isArray(files)) {
            return new NextResponse('Invalid Configuration', { status: 500 });
        }

        // 精确匹配文件名
        const file = files.find((f: any) => f.filename === filename);

        if (file) {
            return new NextResponse(file.content, {
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Cache-Control': 'public, max-age=3600' // 适当缓存
                }
            });
        }
    } catch (e) {
        console.error('Verify API Error', e);
        return new NextResponse('Internal Server Error', { status: 500 });
    }

    return new NextResponse('Verification File Not Found', { status: 404 });
}
