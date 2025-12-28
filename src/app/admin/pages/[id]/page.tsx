import { db } from '@/lib/db';
import { updatePage } from '../actions';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PageForm from '../_components/PageForm';
import { notFound } from 'next/navigation';
import { getI18nSettings } from '@/lib/system-settings';

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const page = await db.page.findUnique({
        where: { id },
        include: { seo: true },
    });

    if (!page) {
        notFound();
    }

    const [headerTemplates, footerTemplates, contentTemplates, i18nSettings] = await Promise.all([
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
        getI18nSettings()
    ]);

    // 序列化数据以避免传递 Date 对象给客户端组件
    const serializedPage = JSON.parse(JSON.stringify(page));
    const serializedHeaderTemplates = JSON.parse(JSON.stringify(headerTemplates));
    const serializedFooterTemplates = JSON.parse(JSON.stringify(footerTemplates));
    const serializedContentTemplates = JSON.parse(JSON.stringify(contentTemplates));

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
                    <h1 className="text-2xl font-bold text-gray-900">编辑页面</h1>
                </div>
            </div>

            <PageForm
                page={serializedPage}
                action={updatePage}
                headerTemplates={serializedHeaderTemplates}
                footerTemplates={serializedFooterTemplates}
                contentTemplates={serializedContentTemplates}
                enableMultiLanguage={i18nSettings.enableMultiLanguage}
                translationGroups={translationGroups}
            />
        </div>
    );
}
