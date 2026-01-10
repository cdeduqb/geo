'use client';

/**
 * 多语言组件 Hook
 * 用于在客户端组件中动态获取语言特定的组件
 */

import { ComponentType } from 'react';
import { useParams } from 'next/navigation';
import { Locale, defaultLocale } from './index';
import { getLocalizedComponent } from './localized-components';

/**
 * 获取当前语言
 */
export function useLocale(): Locale {
    const params = useParams();
    const locale = params?.locale as string;

    // 验证是否为支持的语言
    if (locale === 'en' || locale === 'zh') {
        return locale;
    }

    return defaultLocale;
}

/**
 * 获取多语言组件的 Hook
 * 
 * @param name 组件名称
 * @param fallback 回退组件
 * 
 * @example
 * ```tsx
 * function Page() {
 *   const HeroComponent = useLocalizedComponent('Hero', DefaultHero);
 *   
 *   if (!HeroComponent) {
 *     return <div>Component not found</div>;
 *   }
 *   
 *   return <HeroComponent title="Welcome" />;
 * }
 * ```
 */
export function useLocalizedComponent<P = any>(
    name: string,
    fallback?: ComponentType<P>
): ComponentType<P> | null {
    const locale = useLocale();
    return getLocalizedComponent(name, locale, fallback);
}
