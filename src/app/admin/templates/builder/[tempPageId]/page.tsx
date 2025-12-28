import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import PageBuilder from '@/app/admin/pages/_components/PageBuilder';

interface Props {
    params: Promise<{ tempPageId: string }>;
}

export default async function TemplateBuilderPage({ params }: Props) {
    const { tempPageId } = await params;

    const page = await db.page.findUnique({
        where: { id: tempPageId },
    });

    if (!page) {
        notFound();
    }

    const initialSections = (page.sections as any) || [];

    return <PageBuilder pageId={page.id} initialSections={initialSections} />;
}
