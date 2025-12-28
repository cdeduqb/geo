import { createPage } from '../actions';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import CreatePageClient from './_components/CreatePageClient';
import { db } from '@/lib/db';
import { getI18nSettings } from '@/lib/system-settings';

export default async function CreatePagePage() {
    const [headerTemplates, footerTemplates, contentTemplates, existingPages, i18nSettings] = await Promise.all([
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
        }),
        getI18nSettings()
    ]);

    // 序列化数据以避免传递 Date 对象给客户端组件
    const serializedHeaderTemplates = JSON.parse(JSON.stringify(headerTemplates));
    const serializedFooterTemplates = JSON.parse(JSON.stringify(footerTemplates));
    const serializedContentTemplates = JSON.parse(JSON.stringify(contentTemplates));
    const serializedExistingPages = JSON.parse(JSON.stringify(existingPages));

    // Fetch translation groups if multi-language is enabled
    let translationGroups: { id: string; label: string; lang: string }[] = [];
    if (i18nSettings.enableMultiLanguage) {
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
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/admin/pages"
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">新建页面</h1>
                        <p className="text-sm text-gray-500">选择您喜欢的方式开始创建页面</p>
                    </div>
                </div>
            </div>

            <CreatePageClient
                createPageAction={createPage}
                headerTemplates={serializedHeaderTemplates}
                footerTemplates={serializedFooterTemplates}
                contentTemplates={serializedContentTemplates}
                existingPages={serializedExistingPages}
                enableMultiLanguage={i18nSettings.enableMultiLanguage}
                translationGroups={translationGroups}
            />
        </div>
    );
}
