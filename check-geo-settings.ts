
import { db } from './src/lib/db';

async function checkSettings() {
    try {
        const setting = await db.systemSetting.findUnique({
            where: { key: 'geo_settings' }
        });
        console.log('GEO Settings:', setting);

        const count = await db.systemSetting.count();
        console.log('Total SystemSettings:', count);
    } catch (e) {
        console.error(e);
    }
}

checkSettings();
