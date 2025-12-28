'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function LicenseFooter() {
    const [licenseInfo, setLicenseInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/license/info')
            .then(res => res.json())
            .then(data => setLicenseInfo(data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    // 如果已授权，不显示任何内容
    if (licenseInfo?.licensed) {
        return null;
    }

    // 加载中
    if (loading) {
        return null;
    }

    // 未授权时显示简单提示
    return (
        <div className="fixed bottom-4 right-4 bg-amber-50 border border-amber-200 rounded-lg p-3 shadow-lg z-50 max-w-xs">
            <div className="flex items-start gap-2 text-sm">
                <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="font-medium text-amber-900">未授权使用</p>
                    <div className="mt-1 flex gap-2 text-xs">
                        <Link href="/admin/license" className="text-blue-600 hover:underline">
                            激活授权
                        </Link>
                        <span className="text-gray-400">|</span>
                        <a href="https://moli123.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            购买授权
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
