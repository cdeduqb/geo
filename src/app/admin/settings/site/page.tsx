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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Globe className="w-8 h-8 text-blue-600" />
                        站点设置
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        配置全站通用的页眉、页脚、品牌和联系信息，所有页面将自动继承这些设置
                    </p>
                </div>
            </div>

            <SiteSettingsClient initialData={serializedData} />
        </div>
    );
}
