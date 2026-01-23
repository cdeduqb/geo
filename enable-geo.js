
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const settings = {
        crawlerConfig: {},
        enableStructuredData: true,
        enableEntityExtraction: true,
        defaultSchemaOrg: true,
        entityInfo: {
            alternateName: 'MoliAI Test',
            sameAs: ['https://twitter.com/molicms']
        }
    };

    await prisma.systemSetting.upsert({
        where: { key: 'geo_settings' },
        update: { value: JSON.stringify(settings) },
        create: {
            key: 'geo_settings',
            value: JSON.stringify(settings),
            description: 'GEO Optimization Settings'
        }
    });

    console.log('GEO Settings updated successfully.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
