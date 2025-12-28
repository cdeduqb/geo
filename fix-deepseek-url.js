
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const config = await prisma.aIConfig.findFirst({
            where: { provider: 'deepseek' }
        });

        if (config) {
            console.log('Found DeepSeek config:', config);
            if (config.baseUrl && config.baseUrl.includes('/v1')) {
                const newUrl = config.baseUrl.replace('/v1', '');
                await prisma.aIConfig.update({
                    where: { id: config.id },
                    data: { baseUrl: newUrl }
                });
                console.log(`Updated DeepSeek URL from ${config.baseUrl} to ${newUrl}`);
            } else {
                console.log('DeepSeek URL does not contain /v1, no update needed.');
            }
        } else {
            console.log('DeepSeek config not found.');
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
