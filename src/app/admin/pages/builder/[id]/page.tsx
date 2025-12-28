import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import PageBuilder from '../../_components/PageBuilder';
import EditorModeSelector from '../_components/EditorModeSelector';
import CodeEditor from '../_components/CodeEditor';

export default async function PageBuilderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const page = await db.page.findUnique({
        where: { id },
    });

    if (!page) {
        notFound();
    }

    // If no mode is selected, show selector
    // We treat 'null' as no selection. The default in DB is VISUAL but for existing pages it might be null if we didn't backfill?
    // Actually schema says @default(VISUAL), so it should be VISUAL.
    // But we want to give user a choice for new pages or if they want to switch?
    // Let's assume if it's VISUAL but sections are empty, maybe show selector?
    // No, let's stick to the plan: if we want to force selector, we might need a way.
    // For now, let's assume we want to show selector if user explicitly asks or if it's a new page (how to detect?).
    // Actually, let's just check the mode.

    // Wait, if default is VISUAL, then all existing pages are VISUAL.
    // If I want to test the selector, I might need to manually set one to null?
    // Or maybe I should change the default to null?
    // Schema: editorMode EditorMode @default(VISUAL)
    // So it will be VISUAL.

    // Let's implement a client component wrapper to handle state if we want to switch modes dynamically?
    // For now, let's just respect the DB value.

    // But wait, the user request says "three options".
    // If I just default to VISUAL, they never see the options.
    // Maybe I should change the default to null in the schema?
    // Too late, migration done.

    // I can wrap the logic in a client component that checks if "mode selected".
    // But the mode is in DB.

    // Let's create a Client Component wrapper that handles the view.
    return <PageBuilderClient page={page} />;
}

import PageBuilderClient from './client';
