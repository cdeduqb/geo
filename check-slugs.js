
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const articles = await prisma.article.findMany({
        select: {
            id: true,
            slug: true,
            title: true
        }
    });

    const slugs = {};
    const duplicates = [];

    articles.forEach(a => {
        if (slugs[a.slug]) {
            duplicates.push(a.slug);
        }
        slugs[a.slug] = (slugs[a.slug] || 0) + 1;
    });

    console.log('Total articles:', articles.length);
    console.log('Duplicates:', duplicates);
    if (duplicates.length > 0) {
        console.log('Articles with duplicate slugs:');
        articles.filter(a => duplicates.includes(a.slug)).forEach(a => {
            console.log(`- ${a.id}: ${a.slug} (${a.title})`);
        });
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
