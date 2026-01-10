import ArticlePage from '@/app/articles/[slug]/page';
import { db } from '@/lib/db';

export default ArticlePage;
export { generateMetadata } from '@/app/articles/[slug]/page';

export async function generateStaticParams() {
    try {
        const articles = await db.article.findMany({
            where: { status: 'PUBLISHED' },
            select: { slug: true, lang: true }
        });

        return articles.map(article => ({
            slug: article.slug,
            locale: article.lang
        }));
    } catch (error) {
        console.error('Error generating static params for localized articles:', error);
        return [];
    }
}
