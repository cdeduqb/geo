import { createPage } from '../actions';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import CreatePageClient from './_components/CreatePageClient';
import { db } from '@/lib/db';
import { getI18nSettings } from '@/lib/system-settings';


export const dynamic = 'force-dynamic';

export default async function CreatePagePage() {
    const [headerTemplates, footerTemplates, contentTemplates, existingPages] = await Promise.all([
        db.pageTemplate.findMany({
            where: { moduleType: 'HEADER' },
            orderBy: { createdAt: 'desc' },
        }),
        db.pageTemplate.findMany({
            where: { moduleType: 'FOOTER' },
            orderBy: { createdAt: 'desc' },
        }),
        db.pageTemplate.findMany({
            where: {
                moduleType: {
                    notIn: ['HEADER', 'FOOTER']
                }
            },
            orderBy: { createdAt: 'desc' },
        }),
        db.page.findMany({
            select: { id: true, title: true, slug: true },
            orderBy: { updatedAt: 'desc' },
            take: 20,
        })
    ]);

    const enableMultiLanguageSetting = await db.systemSetting.findUnique({
        where: { key: 'enable_multi_language' }
    });
    const enableMultiLanguage = enableMultiLanguageSetting?.value === 'true';

    const i18nSettingsStr = await db.systemSetting.findUnique({ where: { key: 'i18n_settings' } });
    let supportedLocales = ['zh', 'en'];
    if (i18nSettingsStr?.value) {
        try {
            const config = JSON.parse(i18nSettingsStr.value);
            if (Array.isArray(config.supportedLocales)) {
                supportedLocales = config.supportedLocales;
            }
        } catch { }
    }

    // 序列化数据以避免传递 Date 对象给客户端组件
    const serializedHeaderTemplates = JSON.parse(JSON.stringify(headerTemplates));
    const serializedFooterTemplates = JSON.parse(JSON.stringify(footerTemplates));
    const serializedContentTemplates = JSON.parse(JSON.stringify(contentTemplates));
    const serializedExistingPages = JSON.parse(JSON.stringify(existingPages));

    // Fetch translation groups if multi-language is enabled
    let translationGroups: { id: string; label: string; lang: string }[] = [];
    if (enableMultiLanguage) {
        const pagesWithGroups = await db.page.findMany({
            where: {
                translationGroupId: { not: null },
                status: 'PUBLISHED'
            },
            select: { translationGroupId: true, title: true, lang: true },
            distinct: ['translationGroupId'],
        });
        translationGroups = pagesWithGroups
            .filter(p => p.translationGroupId)
            .map(p => ({
                id: p.translationGroupId!,
                label: `${p.title} (${p.lang})`,
                lang: p.lang
            }));
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* 页面头部 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/pages"
                        className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Link>
                    <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-100">
                        <Plus className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">新建页面</h1>
                        <p className="text-[13px] text-gray-500 font-medium">
                            选择您喜欢的方式开始创建页面
                        </p>
                    </div>
                </div>
            </div>

            <CreatePageClient
                createPageAction={createPage}
                headerTemplates={serializedHeaderTemplates}
                footerTemplates={serializedFooterTemplates}
                contentTemplates={serializedContentTemplates}
                existingPages={serializedExistingPages}
                enableMultiLanguage={enableMultiLanguage}
                translationGroups={translationGroups}
                supportedLocales={supportedLocales}
            />
        </div>
    );
}
