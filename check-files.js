
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const recentFiles = await prisma.file.findMany({
        where: {
            createdAt: {
                gt: tenMinutesAgo
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    console.log(JSON.stringify(recentFiles, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
