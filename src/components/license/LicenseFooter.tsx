'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, AlertTriangle } from 'lucide-react';

export default function LicenseFooter() {
    const [licenseInfo, setLicenseInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLicenseInfo();
        // 每5分钟检查一次
        const interval = setInterval(fetchLicenseInfo, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const fetchLicenseInfo = async () => {
        try {
            const res = await fetch('/api/license/info');
            const data = await res.json();
            setLicenseInfo(data);
        } catch (error) {
            console.error('获取授权信息失败:', error);
        } finally {
            setLoading(false);
        }
    };

    // 如果已授权，不显示任何版权信息
    if (licenseInfo?.licensed) {
        return null;
    }

    // 未授权时显示版权信息（低调样式）
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-gray-300 py-2 px-4 shadow-lg z-50 border-t border-gray-700">
            <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3 flex-shrink-0 opacity-60" />
                    <span className="opacity-75">
                        未授权使用 GeoCMS 企业授权系统
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href="/admin/license"
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-200 transition-colors"
                    >
                        激活授权
                    </Link>
                    <a
                        href="https://moli123.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-gray-400 hover:text-gray-200 transition-colors"
                    >
                        购买
                    </a>
                </div>
            </div>
        </div>
    );
}
