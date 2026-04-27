import { db } from '@/lib/db';
import DashboardUI from './DashboardUI';

async function getDashboardData() {
    try {
        const [
            articleCount,
            pageCount,
            productCount,
            fileCount,
            recentArticles,
            recentProducts,
            recentFiles
        ] = await Promise.all([
            db.article.count(),
            db.page.count(),
            db.product.count(),
            db.file.count(),
            db.article.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { author: { select: { name: true } } }
            }),
            db.product.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: { id: true, name: true, price: true, createdAt: true, coverImage: true }
            }),
            db.file.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { uploadedBy: { select: { name: true } } }
            })
        ]);

        return {
            stats: { articleCount, pageCount, productCount, fileCount },
            recent: { articles: recentArticles, products: recentProducts, files: recentFiles }
        };
    } catch (error) {
        console.warn('Database unavailable for dashboard stats, using defaults');
        return {
            stats: { articleCount: 0, pageCount: 0, productCount: 0, fileCount: 0 },
            recent: { articles: [], products: [], files: [] }
        };
    }
}

export default async function DashboardPage() {
    const data = await getDashboardData();
    return <DashboardUI stats={data.stats} recent={data.recent} />;
}
