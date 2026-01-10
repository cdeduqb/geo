/**
 * 多语言组件动态加载系统
 * 
 * 允许根据语言加载不同的组件实现
 * 使用方式：
 * 1. 在 components/localized 下创建语言特定组件
 * 2. 使用 getLocalizedComponent 动态加载
 */

import { Locale } from '@/lib/i18n';
import { ComponentType, lazy } from 'react';

/**
 * 组件路径映射
 * key: 组件名称
 * value: 语言特定的组件路径
 */
type LocalizedComponentMap = {
    [componentName: string]: {
        [locale: string]: ComponentType<any>;
    };
};

/**
 * 组件注册表
 */
const componentRegistry: LocalizedComponentMap = {};

/**
 * 注册多语言组件
 * 
 * @example
 * ```ts
 * // 注册中文组件
 * registerLocalizedComponent('Hero', 'zh', HeroZh);
 * 
 * // 注册英文组件
 * registerLocalizedComponent('Hero', 'en', HeroEn);
 * ```
 */
export function registerLocalizedComponent(
    name: string,
    locale: Locale,
    component: ComponentType<any>
) {
    if (!componentRegistry[name]) {
        componentRegistry[name] = {};
    }
    componentRegistry[name][locale] = component;
}

/**
 * 获取指定语言的组件
 * 
 * @param name 组件名称
 * @param locale 语言代码
 * @param fallback 如果找不到组件，使用的回退组件
 * 
 * @example
 * ```tsx
 * const HeroComponent = getLocalizedComponent('Hero', 'zh', DefaultHero);
 * return <HeroComponent {...props} />;
 * ```
 */
export function getLocalizedComponent<P = any>(
    name: string,
    locale: Locale,
    fallback?: ComponentType<P>
): ComponentType<P> | null {
    const localeComponents = componentRegistry[name];

    if (!localeComponents) {
        console.warn(`Component "${name}" not found in registry`);
        return fallback || null;
    }

    // 尝试获取指定语言的组件
    if (localeComponents[locale]) {
        return localeComponents[locale] as ComponentType<P>;
    }

    // 尝试使用中文作为回退
    if (locale !== 'zh' && localeComponents['zh']) {
        console.warn(`Component "${name}" not found for locale "${locale}", using "zh" fallback`);
        return localeComponents['zh'] as ComponentType<P>;
    }

    // 返回任何可用的组件
    const availableLocales = Object.keys(localeComponents);
    if (availableLocales.length > 0) {
        console.warn(`Component "${name}" not found for locale "${locale}", using "${availableLocales[0]}" fallback`);
        return localeComponents[availableLocales[0]] as ComponentType<P>;
    }

    return fallback || null;
}

/**
 * 批量注册多语言组件
 * 
 * @example
 * ```ts
 * const components = {
 *   Hero: {
 *     zh: HeroZh,
 *     en: HeroEn,
 *   },
 *   Footer: {
 *     zh: FooterZh,
 *     en: FooterEn,
 *   }
 * };
 * 
 * registerComponents(components);
 * ```
 */
export function registerComponents(components: LocalizedComponentMap) {
    Object.entries(components).forEach(([name, localeMap]) => {
        Object.entries(localeMap).forEach(([locale, component]) => {
            registerLocalizedComponent(name, locale as Locale, component);
        });
    });
}

/**
 * 异步加载多语言组件（用于代码分割）
 * 
 * @example
 * ```ts
 * const HeroZh = lazy(() => import('./Hero.zh'));
 * const HeroEn = lazy(() => import('./Hero.en'));
 * 
 * registerLocalizedComponentAsync('Hero', {
 *   zh: () => import('./Hero.zh'),
 *   en: () => import('./Hero.en'),
 * });
 * ```
 */
export function registerLocalizedComponentAsync(
    name: string,
    loaders: Record<Locale, () => Promise<{ default: ComponentType<any> }>>
) {
    Object.entries(loaders).forEach(([locale, loader]) => {
        const LazyComponent = lazy(loader);
        registerLocalizedComponent(name, locale as Locale, LazyComponent);
    });
}

/**
 * 获取所有已注册的组件名称
 */
export function getRegisteredComponents(): string[] {
    return Object.keys(componentRegistry);
}

/**
 * 检查组件是否已注册特定语言版本
 */
export function hasLocalizedComponent(name: string, locale: Locale): boolean {
    return !!(componentRegistry[name]?.[locale]);
}
