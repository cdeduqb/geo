'use client';

import { useState } from 'react';
import PageBuilder from '../../_components/PageBuilder';
import EditorModeSelector from '../_components/EditorModeSelector';
import CodeEditor from '../_components/CodeEditor';

interface PageBuilderClientProps {
    page: any; // Using any for now to avoid strict type issues with Prisma JSON
}

export default function PageBuilderClient({ page }: PageBuilderClientProps) {
    const [editorMode, setEditorMode] = useState<'VISUAL' | 'CODE' | null>(page.editorMode as any);

    if (editorMode === 'CODE') {
        return <CodeEditor pageId={page.id} initialContent={page.content || ''} />;
    }

    if (editorMode === 'VISUAL') {
        const initialSections = (page.sections as any) || [];
        return <PageBuilder pageId={page.id} initialSections={initialSections} pageType={page.type} />;
    }

    return (
        <EditorModeSelector
            pageId={page.id}
            onSelect={(mode) => setEditorMode(mode)}
        />
    );
}
