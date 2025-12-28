import { db } from './db';

async function checkCategories() {
    const categories = await db.category.findMany({
        include: {
            parent: true,
            _count: {
                select: { articles: true }
            }
        }
    });

    console.log('Categories found:', categories.length);
    console.log(JSON.stringify(categories, null, 2));
}

checkCategories()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
