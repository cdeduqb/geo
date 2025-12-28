import { db } from '@/lib/db';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import TemplateForm from '../_components/TemplateForm';
import { notFound } from 'next/navigation';

export default async function EditTemplatePage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    const template = await db.pageTemplate.findUnique({
        where: { id },
    });

    if (!template) {
        notFound();
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Link
                    href="/admin/templates"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">编辑模板</h1>
            </div>

            <TemplateForm template={template} isEdit />
        </div>
    );
}
