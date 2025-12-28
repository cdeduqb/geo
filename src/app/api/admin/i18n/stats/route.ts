import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Articles Stats
        const totalZhArticles = await db.article.count({ where: { lang: 'zh' } });
        // Find ZH articles that have a translation group ID
        // Harder to count "missing EN" efficiently in Prisma without raw query or iteration.
        // Approximate method: Count EN articles.
        const totalEnArticles = await db.article.count({ where: { lang: 'en' } });

        // 2. Pages Stats
        const totalZhPages = await db.page.count({ where: { lang: 'zh', status: { not: 'ARCHIVED' } } });
        const totalEnPages = await db.page.count({ where: { lang: 'en', status: { not: 'ARCHIVED' } } });

        // 3. Products Stats
        const totalZhProducts = await db.product.count({ where: { lang: 'zh' } });
        const totalEnProducts = await db.product.count({ where: { lang: 'en' } });

        // 4. Categories Stats (Article)
        const totalZhCategories = await db.category.count({ where: { lang: 'zh' } });
        const totalEnCategories = await db.category.count({ where: { lang: 'en' } });

        // 5. Site Settings
        const siteSettingsEn = await db.systemSetting.findUnique({ where: { key: 'site_settings_en' } });

        return NextResponse.json({
            articles: { zh: totalZhArticles, en: totalEnArticles },
            pages: { zh: totalZhPages, en: totalEnPages },
            products: { zh: totalZhProducts, en: totalEnProducts },
            categories: { zh: totalZhCategories, en: totalEnCategories },
            siteSettings: { hasEn: !!siteSettingsEn }
        });

    } catch (error: any) {
        console.error('Stats error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
