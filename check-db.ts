import { db } from './src/lib/db';

async function checkDB() {
    try {
        const configs = await db.aIConfig.findMany({
            orderBy: { provider: 'asc' }
        });

        console.log('\n===== Current AIConfig Records =====');
        console.log(`Total records: ${configs.length}\n`);

        configs.forEach(config => {
            console.log(`Provider: ${config.provider}`);
            console.log(`  - Active: ${config.isActive}`);
            console.log(`  - API Key: ${config.apiKey ? '***' + config.apiKey.slice(-4) : 'NOT SET'}`);
            console.log(`  - Base URL: ${config.baseUrl || 'NOT SET'}`);
            console.log(`  - Model: ${config.modelName || 'NOT SET'}`);
            console.log('');
        });

        await db.$disconnect();
    } catch (error) {
        console.error('Error:', error);
        await db.$disconnect();
        process.exit(1);
    }
}

checkDB();
