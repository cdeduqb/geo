'use client';

import { useState } from 'react';
import TemplateCreationModeSelector from './_components/TemplateCreationModeSelector';
import VisualTemplateBuilder from './_components/VisualTemplateBuilder';
import AITemplateGenerator from './_components/AITemplateGenerator';

export default function CreateTemplatePage() {
    const [mode, setMode] = useState<'VISUAL' | 'AI' | null>(null);

    if (!mode) {
        return <TemplateCreationModeSelector onSelect={setMode} />;
    }

    if (mode === 'VISUAL') {
        return <VisualTemplateBuilder onBack={() => setMode(null)} />;
    }

    if (mode === 'AI') {
        return <AITemplateGenerator onBack={() => setMode(null)} />;
    }

    return null;
}
