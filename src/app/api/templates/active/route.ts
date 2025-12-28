import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

/**
 * GET /api/templates/active
 * 根据模块类型获取激活的模板
 * 
 * Query Parameters:
 *   - moduleType: 模块类型 (ABOUT_PAGE, CONTACT_PAGE, 等)
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const moduleType = searchParams.get('moduleType');

        if (!moduleType) {
            return NextResponse.json(
                { success: false, error: '缺少 moduleType 参数' },
                { status: 400 }
            );
        }

        // 获取激活的模板
        const template = await db.pageTemplate.findFirst({
            where: {
                moduleType: moduleType as any,
                isActive: true,
            },
            select: {
                id: true,
                name: true,
                content: true,
                style: true,
                moduleType: true,
                description: true,
            },
        });

        if (!template) {
            return NextResponse.json(
                { success: false, error: '未找到激活的模板' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            template,
        });
    } catch (error) {
        console.error('获取激活模板失败:', error);
        return NextResponse.json(
            { success: false, error: '服务器错误' },
            { status: 500 }
        );
    }
}
