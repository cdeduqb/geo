import { db } from './src/lib/db';

async function main() {
    const templates = await db.pageTemplate.findMany({
        select: { id: true, name: true, moduleType: true, content: true }
    });
    console.log(JSON.stringify(templates, null, 2));
}

main().catch(console.error);
