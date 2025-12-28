
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const tech = await prisma.category.findUnique({ where: { slug: 'technology' } });
    const news = await prisma.category.findUnique({ where: { slug: 'news' } });

    console.log('Technology ID:', tech?.id);
    console.log('News ID:', news?.id);

    // Expected UUIDs
    const EXPECTED_TECH_ID = '550e8400-e29b-41d4-a716-446655440001';
    const EXPECTED_NEWS_ID = '550e8400-e29b-41d4-a716-446655440002';

    if (tech?.id !== EXPECTED_TECH_ID) {
        console.log('MISMATCH: Technology ID is not the fixed UUID.');
    } else {
        console.log('MATCH: Technology ID is correct.');
    }

    if (news?.id !== EXPECTED_NEWS_ID) {
        console.log('MISMATCH: News ID is not the fixed UUID.');
    } else {
        console.log('MATCH: News ID is correct.');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
