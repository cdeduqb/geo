import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import AuthorForm from '../_components/AuthorForm';

export default async function EditAuthorPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/admin/authors"
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">编辑作者信息</h1>
                </div>
            </div>

            <AuthorForm authorId={id} />
        </div>
    );
}
