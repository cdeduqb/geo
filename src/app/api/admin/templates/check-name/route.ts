import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const name = searchParams.get('name');
        const excludeId = searchParams.get('excludeId');

        if (!name) {
            return NextResponse.json(
                { error: '模板名称不能为空' },
                { status: 400 }
            );
        }

        const where: any = { name };
        if (excludeId) {
            where.id = { not: excludeId };
        }

        const existingTemplate = await db.pageTemplate.findFirst({
            where,
            select: { id: true, name: true },
        });

        return NextResponse.json({
            exists: !!existingTemplate,
            available: !existingTemplate,
        });
    } catch (error) {
        console.error('Check template name error:', error);
        return NextResponse.json(
            { error: '检查模板名称失败' },
            { status: 500 }
        );
    }
}
