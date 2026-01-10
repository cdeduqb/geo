/**
 * Hero 组件注册
 * 
 * 导入并注册中文和英文版本的 Hero 组件
 */

import { registerLocalizedComponent } from '@/lib/i18n/localized-components';
import HeroZh from './Hero.zh';
import HeroEn from './Hero.en';

// 注册组件
registerLocalizedComponent('Hero', 'zh', HeroZh);
registerLocalizedComponent('Hero', 'en', HeroEn);

// 导出组件（可选，用于直接引用）
export { HeroZh, HeroEn };

// 默认导出（用于便捷引用）
export default {
    zh: HeroZh,
    en: HeroEn,
};
