import React from 'react';
import { LicenseManager } from '@/lib/license';
import AIProtectWall from '@/components/admin/AIProtectWall';

export const dynamic = 'force-dynamic';

export default async function KnowledgeBaseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 检查是否有 AI 特性授权
    const hasAI = LicenseManager.hasFeature('ai');

    if (!hasAI) {
        return <AIProtectWall />;
    }

    return <>{children}</>;
}
