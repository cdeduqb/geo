import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import PageBuilder from '@/app/admin/pages/_components/PageBuilder';
import { requireAuth } from '@/lib/auth';

interface Props {
    params: Promise<{ tempPageId: string }>;
    searchParams: Promise<{ moduleType?: string }>;
}

export default async function TemplateBuilderPage({ params, searchParams }: Props) {
    // Require authentication but don't use admin layout
    await requireAuth();

    const { tempPageId } = await params;
    const { moduleType } = await searchParams;

    const page = await db.page.findUnique({
        where: { id: tempPageId },
    });

    if (!page) {
        notFound();
    }

    const initialSections = (page.sections as any) || [];

    return <PageBuilder pageId={page.id} initialSections={initialSections} moduleType={moduleType} pageType={page.type} />;
}
