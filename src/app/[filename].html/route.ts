import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// 强制动态渲染
export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: { filename: string } }
) {
    // 路由 [filename].html 捕获到的参数不包含 .html 后缀
    // 例如访问 /baidu_verify_123.html，params.filename 为 "baidu_verify_123"
    const targetFilename = `${params.filename}.html`;

    try {
        const setting = await db.systemSetting.findUnique({
            where: { key: 'site_verification_files' }
        });

        if (!setting || !setting.value) {
            return new NextResponse('Not Found', { status: 404 });
        }

        let files: any[] = [];
        try {
            files = JSON.parse(setting.value);
        } catch (e) {
            files = [];
        }

        if (!Array.isArray(files)) {
            return new NextResponse('Not Found', { status: 404 });
        }

        const file = files.find((f: any) => f.filename === targetFilename);

        if (file) {
            return new NextResponse(file.content, {
                headers: {
                    // 百度等验证文件通常是纯HTML内容
                    'Content-Type': 'text/html; charset=utf-8',
                },
            });
        }

        return new NextResponse('Not Found', { status: 404 });
    } catch (error) {
        console.error('Error serving verification file:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
