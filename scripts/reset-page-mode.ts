import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const pageId = 'cmipa5vxv0001p7l5nolmzqkg'; // About Us page ID
    await prisma.page.update({
        where: { id: pageId },
        data: { editorMode: null },
    });
    console.log(`Reset editorMode for page ${pageId}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
