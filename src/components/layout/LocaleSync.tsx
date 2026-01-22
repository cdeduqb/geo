'use client';

import { useEffect } from 'react';
import { Locale } from '@/lib/i18n';

/**
 * 客户端组件，用于在非根布局中同步 html lang 属性
 * 避免嵌套 html/body 标签导致的 hydration 错误
 */
export function LocaleSync({ locale }: { locale: Locale }) {
    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.lang = locale;
        }
    }, [locale]);

    return null;
}
