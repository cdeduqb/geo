import { db } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditTemplatePage({ params }: Props) {
    const { id } = await params;

    const template = await db.pageTemplate.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            description: true,
            content: true,
            sections: true,
            style: true,
            type: true,
            moduleType: true,
        },
    });

    if (!template) {
        notFound();
    }

    // If template has sections (visual template), redirect to visual editor
    if (template.sections) {
        redirect(`/admin/templates/edit-visual/${id}`);
    }

    // Otherwise redirect to code editor
    redirect(`/admin/templates/${id}`);
}
