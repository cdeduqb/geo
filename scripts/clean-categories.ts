
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Deleting existing categories to allow re-seeding with UUIDs...');

    // Delete by slug if they exist
    await prisma.category.deleteMany({
        where: {
            slug: {
                in: ['technology', 'news']
            }
        }
    });

    console.log('Deleted successfully.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
