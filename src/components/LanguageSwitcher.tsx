'use client';

import { usePathname, useRouter } from 'next/navigation';
import { locales, localeNames, Locale } from '@/lib/i18n';
import { Globe } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LanguageSwitcher() {
    const pathname = usePathname();
    const router = useRouter();
    const [enableMultiLanguage, setEnableMultiLanguage] = useState<boolean | null>(null);

    // 从 API 获取多语言设置
    useEffect(() => {
        fetch('/api/i18n/settings')
            .then(res => res.json())
            .then(data => setEnableMultiLanguage(data.enableMultiLanguage ?? false))
            .catch(() => setEnableMultiLanguage(false));
    }, []);

    // 提取当前语言
    const segments = pathname.split('/');
    const currentLocale = locales.includes(segments[1] as any) ? segments[1] as Locale : 'zh';

    const handleSwitch = (newLocale: Locale) => {
        if (newLocale === currentLocale) return;

        let newPath = pathname;

        // 移除旧的语言前缀
        if (locales.includes(segments[1] as any)) {
            newPath = '/' + segments.slice(2).join('/');
        }

        // 添加新的语言前缀 (默认 zh 不加前缀，保持 URL 简洁)
        if (newLocale !== 'zh') {
            newPath = `/${newLocale}${newPath === '/' ? '' : newPath}`;
        }

        router.push(newPath);
    };

    // 如果多语言功能未启用或还在加载，不渲染任何内容
    if (enableMultiLanguage === null || enableMultiLanguage === false) {
        return null;
    }

    return (
        <div className="flex items-center gap-2 group">
            <Globe className="w-4 h-4 text-gray-500 group-hover:text-blue-500 transition-colors" />
            <select
                value={currentLocale}
                onChange={(e) => handleSwitch(e.target.value as Locale)}
                className="bg-transparent text-xs font-medium text-gray-600 focus:outline-none cursor-pointer hover:text-blue-600 transition-colors"
            >
                {locales.map((loc) => (
                    <option key={loc} value={loc}>
                        {localeNames[loc]}
                    </option>
                ))}
            </select>
        </div>
    );
}
