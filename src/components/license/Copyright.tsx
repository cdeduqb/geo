'use client';

import { useEffect, useState } from 'react';

interface CopyrightProps {
    overrideText?: string;
    systemCopyright?: string;
    className?: string;
}

export default function Copyright({ overrideText, systemCopyright, className = "" }: CopyrightProps) {
    const [licenseInfo, setLicenseInfo] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetch('/api/license/info')
            .then(res => res.json())
            .then(data => setLicenseInfo(data))
            .catch(() => { });
    }, []);

    const isLicensed = licenseInfo?.licensed;

    // 如果没有授权，显示系统默认名称和链接
    if (isLicensed === false) {
        return (
            <a
                href="https://moli123.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`hover:opacity-100 transition-opacity ${className}`}
                title="全域魔力AI管理系统"
            >
                全域魔力AI管理系统
            </a>
        );
    }

    // 如果正在加载（isLicensed === null），暂时显示占位符或默认文本以避免闪烁
    if (isLicensed === null) {
        return <span className={className}>...</span>;
    }

    // 已授权状态：优先使用站点设置中的全局版权，其次是组件自身的版权设置
    const currentYear = mounted ? new Date().getFullYear() : '';
    const copyrightText = systemCopyright || overrideText || `© ${currentYear} All rights reserved.`;

    return (
        <span className={className}>
            {copyrightText}
        </span>
    );
}
