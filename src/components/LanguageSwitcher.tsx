'use client';

import { usePathname, useRouter } from 'next/navigation';
import { locales, localeNames, Locale } from '@/lib/i18n';
import { Globe } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LanguageSwitcher() {
    const pathname = usePathname();
    const router = useRouter();
    const [enableMultiLanguage, setEnableMultiLanguage] = useState<boolean | null>(null);
    const [supportedLocales, setSupportedLocales] = useState<string[]>(['zh', 'en']);

    // 从 API 获取多语言设置
    useEffect(() => {
        fetch('/api/i18n/settings')
            .then(res => res.json())
            .then(data => {
                setEnableMultiLanguage(data.enableMultiLanguage ?? false);
                if (data.supportedLocales && Array.isArray(data.supportedLocales)) {
                    setSupportedLocales(data.supportedLocales);
                }
            })
            .catch(() => setEnableMultiLanguage(false));
    }, []);

    // 提取当前语言
    const segments = pathname.split('/');
    const currentLocale = supportedLocales.includes(segments[1]) ? segments[1] : 'zh';

    const handleSwitch = async (newLocale: string) => {
        if (newLocale === currentLocale) return;

        // Try to find translation group ID in the page
        const layoutWrapper = document.querySelector('[data-translation-group-id]');
        const groupId = layoutWrapper?.getAttribute('data-translation-group-id');

        let targetSlug = null;

        if (groupId) {
            try {
                const res = await fetch(`/api/i18n/resolve-slug?groupId=${groupId}&lang=${newLocale}`);
                const data = await res.json();
                if (data.slug) {
                    targetSlug = data.slug;
                }
            } catch (e) {
                console.error('Failed to resolve translated slug:', e);
            }
        }

        let newPath = pathname;

        if (targetSlug) {
            // If it's a home page (e.g. slug is 'home' or similar, but check if user wants root)
            // But usually if it's a specific page, we go to /[locale]/[slug]
            newPath = newLocale === 'zh' ? `/${targetSlug}` : `/${newLocale}/${targetSlug}`;

            // Special case: if targetSlug is a known home page slug or root
            if (targetSlug === 'home' || targetSlug === 'index') {
                newPath = newLocale === 'zh' ? '/' : `/${newLocale}`;
            }
        } else {
            // Default logic: just swap locale prefix
            // 移除旧的语言前缀 (check against all supported locales ideally, but lib locales is a good proxy for structure)
            const firstSegment = segments[1];
            // 简单的 heuristic: 如果当前路径以某个支持的非默认语言开头，则替换之
            if (supportedLocales.includes(firstSegment as any)) {
                newPath = '/' + segments.slice(2).join('/');
            }

            // 添加新的语言前缀 (默认 zh 不加前缀)
            if (newLocale !== 'zh') {
                newPath = `/${newLocale}${newPath === '/' ? '' : newPath}`;
            }
        }

        router.push(newPath);
    };

    // 如果多语言功能未启用或还在加载，不渲染任何内容
    if (enableMultiLanguage === null || enableMultiLanguage === false) {
        return null;
    }

    const getLocaleLabel = (code: string) => {
        const names: Record<string, string> = {
            zh: '简体中文',
            en: 'English',
            ja: '日本語',
            ko: '한국어',
            fr: 'Français',
            de: 'Deutsch',
            es: 'Español',
            ru: 'Русский',
            pt: 'Português',
            ar: 'العربية'
        };
        return names[code] || code;
    };

    return (
        <div className="flex items-center gap-2 group">
            <Globe className="w-4 h-4 text-gray-500 group-hover:text-blue-500 transition-colors" />
            <select
                value={currentLocale}
                onChange={(e) => handleSwitch(e.target.value)}
                className="bg-transparent text-xs font-medium text-gray-600 focus:outline-none cursor-pointer hover:text-blue-600 transition-colors"
            >
                {supportedLocales.map((loc) => (
                    <option key={loc} value={loc}>
                        {getLocaleLabel(loc)}
                    </option>
                ))}
            </select>
        </div>
    );
}
