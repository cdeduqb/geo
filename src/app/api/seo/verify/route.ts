import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    console.log('[Verify API] Request URL:', request.url);
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    console.log('[Verify API] Search Params:', searchParams);

    let filename = request.nextUrl.searchParams.get('filename');

    // Fallback: Process header from middleware
    if (!filename) {
        const headerFilename = request.headers.get('x-verify-filename');
        if (headerFilename) {
            console.log('[Verify API] Using filename from header:', headerFilename);
            filename = headerFilename;
        }
    }

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

        // 1. 在通用验证文件中查找
        const file = files.find((f: any) => f.filename === filename);

        if (file) {
            return new NextResponse(file.content, {
                headers: {
                    'Content-Type': filename.endsWith('.txt') ? 'text/plain; charset=utf-8' : 'text/html; charset=utf-8',
                    'Cache-Control': 'public, max-age=86400, stale-while-revalidate=86400'
                }
            });
        }

        // 2. 如果是 .txt 文件，在搜索引擎推送配置中查找 (IndexNow 验证)
        if (filename.endsWith('.txt')) {
            const token = filename.replace('.txt', '');
            const pushConfig = await db.sEOPushConfig.findFirst({
                where: {
                    platform: 'indexnow',
                    token: token,
                    isActive: true
                }
            });

            if (pushConfig) {
                return new NextResponse(token, {
                    headers: {
                        'Content-Type': 'text/plain; charset=utf-8',
                        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=86400'
                    }
                });
            }
        }
    } catch (e) {
        console.error('Verify API Error', e);

        return new NextResponse('Internal Server Error', { status: 500 });
    }

    return new NextResponse('Verification File Not Found', { status: 404 });
}
