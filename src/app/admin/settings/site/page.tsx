import { db } from '@/lib/db';
import SiteSettingsClient from './_components/SiteSettingsClient';
import { Globe } from 'lucide-react';

export default async function SiteSettingsPage() {
    // 获取系统设置
    const systemSettings = await db.systemSetting.findMany();
    const settingsObject: Record<string, string> = {};
    systemSettings.forEach(setting => {
        settingsObject[setting.key] = setting.value;
    });

    // 获取站点设置 (页眉/页脚配置)
    let siteSettings = await db.siteSettings.findFirst();
    if (!siteSettings) {
        siteSettings = await db.siteSettings.create({
            data: {
                primaryColor: '#2563eb',
                siteName: settingsObject.site_name || '企业官网',
            }
        });
    }

    // 获取可用的页眉模板
    const headerTemplates = await db.pageTemplate.findMany({
        where: { moduleType: 'HEADER' },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            description: true,
            preview: true,
            sections: true,
            content: true,
        },
    });

    // 获取可用的页脚模板
    const footerTemplates = await db.pageTemplate.findMany({
        where: { moduleType: 'FOOTER' },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            description: true,
            preview: true,
            sections: true,
            content: true,
        },
    });

    // 序列化数据
    const serializedData = {
        systemSettings: settingsObject,
        siteSettings: JSON.parse(JSON.stringify(siteSettings)),
        headerTemplates: JSON.parse(JSON.stringify(headerTemplates)),
        footerTemplates: JSON.parse(JSON.stringify(footerTemplates)),
    };

    return <SiteSettingsClient initialData={serializedData} />;
}
