import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// 获取页面的区块配置
export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuth();
        const params = await props.params;

        const page = await db.page.findUnique({
            where: { id: params.id },
            select: { sections: true }
        });

        if (!page) {
            return NextResponse.json({ error: '页面不存在' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            sections: page.sections || []
        });
    } catch (error) {
        console.error('获取页面区块失败:', error);
        return NextResponse.json({ error: '获取失败' }, { status: 500 });
    }
}

// 更新页面的区块配置
// 更新页面的区块配置
export async function PUT(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuth();
        const params = await props.params;

        const body = await request.json();
        const { sections } = body;

        console.log('收到保存请求，页面 ID:', params.id);
        console.log('Sections 数据类型:', Array.isArray(sections) ? 'Array' : typeof sections);
        console.log('Sections 数量:', sections?.length);

        if (!Array.isArray(sections)) {
            console.error('无效的 sections 数据:', sections);
            return NextResponse.json({ error: '无效的区块数据' }, { status: 400 });
        }

        console.log('准备更新数据库...');

        // 强制清洗数据，移除任何可能的 undefined 或非 JSON 兼容值
        // 这也能解决可能的 Turbopack 模块引用问题
        const sanitizedSections = JSON.parse(JSON.stringify(sections));

        const page = await db.page.update({
            where: { id: params.id },
            data: {
                sections: sanitizedSections as any,
                editorMode: 'VISUAL'
            }
        });

        console.log('保存成功，页面 ID:', page.id);
        return NextResponse.json({
            success: true,
            page
        });
    } catch (error) {
        console.error('保存页面区块失败:', error);
        console.error('错误详情:', error instanceof Error ? error.message : error);
        console.error('错误堆栈:', error instanceof Error ? error.stack : 'No stack');
        return NextResponse.json({
            error: '保存失败',
            details: error instanceof Error ? error.message : '未知错误'
        }, { status: 500 });
    }
}
