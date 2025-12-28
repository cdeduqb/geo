import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

// GET - 获取引用列表
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('articleId');
    const platform = searchParams.get('platform');
    const limit = parseInt(searchParams.get('limit') || '50');

    try {
        const citations = await prisma.aICitation.findMany({
            where: {
                ...(articleId && { articleId }),
                ...(platform && { platform }),
            },
            include: {
                article: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                    },
                },
            },
            orderBy: { citedAt: 'desc' },
            take: limit,
        });

        return NextResponse.json({ citations });
    } catch (error) {
        console.error('获取引用数据失败:', error);
        return NextResponse.json(
            { error: '获取引用数据失败' },
            { status: 500 }
        );
    }
}

// POST - 添加引用记录
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { articleId, platform, query, position, context, citationType } = body;

        // 获取文章标题
        const article = await prisma.article.findUnique({
            where: { id: articleId },
            select: { title: true },
        });

        if (!article) {
            return NextResponse.json(
                { error: '文章不存在' },
                { status: 404 }
            );
        }

        const citation = await prisma.aICitation.create({
            data: {
                articleId,
                articleTitle: article.title,
                platform,
                query,
                position: position || 0,
                context,
                citationType: citationType || 'mention',
            },
        });

        return NextResponse.json({ citation });
    } catch (error) {
        console.error('创建引用记录失败:', error);
        return NextResponse.json(
            { error: '创建引用记录失败' },
            { status: 500 }
        );
    }
}
