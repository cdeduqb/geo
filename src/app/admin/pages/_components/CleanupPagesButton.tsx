'use client';

import { RotateCw } from 'lucide-react'; // 尝试使用同类图标规避 HMR 异常
import Link from 'next/link';

export default function CleanupPagesButton() {
    return (
        <Link
            href="/admin/settings/cache"
            className="inline-flex items-center justify-center rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-600 hover:bg-amber-100 transition-colors"
            title="前往清理缓存与系统优化"
        >
            <RotateCw className="w-4 h-4 mr-2" />
            系统优化与清理
        </Link>
    );
}
