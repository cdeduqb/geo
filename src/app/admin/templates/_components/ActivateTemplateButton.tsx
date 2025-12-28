'use client';

import { activateTemplate } from '../actions';
import { useTransition } from 'react';

export default function ActivateTemplateButton({
    templateId,
    moduleType
}: {
    templateId: string;
    moduleType: string;
}) {
    const [isPending, startTransition] = useTransition();

    const handleActivate = () => {
        startTransition(async () => {
            await activateTemplate(templateId, moduleType);
        });
    };

    return (
        <button
            onClick={handleActivate}
            disabled={isPending}
            className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
            {isPending ? '启用中...' : '启用'}
        </button>
    );
}
