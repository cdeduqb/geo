'use client';

import { useEffect } from 'react';

/**
 * 客户端组件：用于在静态页面中纠正 html 标签的 lang 属性
 * 因为 Root Layout 在静态构建时由于没有 headers() 而默认使用 zh
 */
export default function ClientLangFixer({ locale }: { locale: string }) {
    useEffect(() => {
        if (locale && document.documentElement.lang !== locale) {
            document.documentElement.lang = locale;
        }
    }, [locale]);

    return null;
}
