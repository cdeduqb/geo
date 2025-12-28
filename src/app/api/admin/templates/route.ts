import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const user = await requireAuth();

        if (user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: '需要管理员权限' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { name, description, content, style, moduleType, type, sections, isAIGenerated } = body;

        if (!name || !moduleType || !type) {
            return NextResponse.json(
                { error: '缺少必要字段' },
                { status: 400 }
            );
        }

        const template = await db.pageTemplate.create({
            data: {
                name,
                description: description || null,
                content: content || '',
                style: style || null,
                moduleType,
                type,
                sections: sections || null,
                version: 1,
                isDefault: false,
                isActive: false,
                isAIGenerated: isAIGenerated || false,
            },
        });

        return NextResponse.json({ template });
    } catch (error) {
        console.error('Create template error:', error);
        return NextResponse.json(
            { error: '创建模板失败', details: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const templates = await db.pageTemplate.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ templates });
    } catch (error) {
        console.error('Fetch templates error:', error);
        return NextResponse.json(
            { error: '获取模板列表失败' },
            { status: 500 }
        );
    }
}
