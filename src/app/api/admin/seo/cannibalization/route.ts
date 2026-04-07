import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { keywords, excludeArticleId } = body;

        if (!keywords || typeof keywords !== 'string') {
            return NextResponse.json({ safe: true, conflicts: [] });
        }

        // 提取输入的关键词并标准化
        const normalize = (str: string) => str.toLowerCase().replace(/[,，、|;-]/g, ' ').split(/\s+/).filter(Boolean);
        const inputTokens = new Set(normalize(keywords));

        if (inputTokens.size === 0) {
            return NextResponse.json({ safe: true, conflicts: [] });
        }

        // 获取全部已有文章的 SEO 关键词 (排除自身)
        const allSeoSettings = await db.sEOSetting.findMany({
            where: {
                articleId: { not: null, notIn: excludeArticleId ? [excludeArticleId] : [] },
                keywords: { not: '', notIn: ['null'] }
            },
            include: {
                article: {
                    select: { id: true, title: true, slug: true }
                }
            }
        });

        const conflicts: Array<{ article: any, keywords: string, overlapScore: number }> = [];

        for (const seo of allSeoSettings) {
            if (!seo.keywords || !seo.article) continue;
            
            const existingTokens = new Set(normalize(seo.keywords));
            if (existingTokens.size === 0) continue;

            // 计算交集
            let intersectNum = 0;
            for (const t of inputTokens) {
                if (existingTokens.has(t)) intersectNum++;
            }

            // 计算重合度 (针对输入词的覆盖率，如果输入词有80%以上跟某篇文章一样，说明内耗)
            const overlapScore = intersectNum / inputTokens.size;

            // 若重合度超过 75% (定义为高风险内耗)
            if (overlapScore >= 0.75) {
                conflicts.push({
                    article: seo.article,
                    keywords: seo.keywords,
                    overlapScore
                });
            }
        }

        // 按冲突率高低排序
        conflicts.sort((a, b) => b.overlapScore - a.overlapScore);

        return NextResponse.json({
            safe: conflicts.length === 0,
            conflicts: conflicts.slice(0, 5) // 返回前5个最严重的冲突
        });

    } catch (error: any) {
        console.error('Cannibalization check error:', error);
        return NextResponse.json({ error: 'Failed to check keyword cannibalization' }, { status: 500 });
    }
}
