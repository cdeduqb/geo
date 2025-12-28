import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CopilotWizard from './_components/CopilotWizard';

export default function CopilotPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/admin/articles"
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">AI 智能创作 (Co-pilot)</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            人机协作工作流：大纲生成 → 人工修订 → 智能撰写
                        </p>
                    </div>
                </div>
            </div>

            <CopilotWizard />
        </div>
    );
}
