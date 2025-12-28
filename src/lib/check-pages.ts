import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPages() {
    const pages = await prisma.page.findMany({
        where: {
            slug: {
                in: ['test-grid', 'test-list', 'test-magazine']
            }
        }
    });

    console.log('Found pages:', pages);
}

checkPages()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
