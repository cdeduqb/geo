import { db } from '@/lib/db';
import { updatePage } from '../actions';
import { ArrowLeft, FileEdit } from 'lucide-react';
import Link from 'next/link';
import PageForm from '../_components/PageForm';
import { notFound } from 'next/navigation';
import { getI18nSettings } from '@/lib/system-settings';

export const dynamic = 'force-dynamic';

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const page = await db.page.findUnique({
        where: { id },
        include: { seo: true },
    });

    if (!page) {
        notFound();
    }

    const [headerTemplates, footerTemplates, contentTemplates] = await Promise.all([
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
    const serializedPage = JSON.parse(JSON.stringify(page));
    const serializedHeaderTemplates = JSON.parse(JSON.stringify(headerTemplates));
    const serializedFooterTemplates = JSON.parse(JSON.stringify(footerTemplates));
    const serializedContentTemplates = JSON.parse(JSON.stringify(contentTemplates));

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
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                        <FileEdit className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">编辑页面</h1>
                        <p className="text-[13px] text-gray-500 font-medium">
                            {page.title}
                        </p>
                    </div>
                </div>
            </div>

            <PageForm
                page={serializedPage}
                action={updatePage}
                headerTemplates={serializedHeaderTemplates}
                footerTemplates={serializedFooterTemplates}
                contentTemplates={serializedContentTemplates}
                enableMultiLanguage={enableMultiLanguage}
                translationGroups={translationGroups}
                supportedLocales={supportedLocales}
            />
        </div >
    );
}
