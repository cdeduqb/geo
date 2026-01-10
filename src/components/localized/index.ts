/**
 * 多语言组件统一注册入口
 * 
 * 导入此文件以自动注册所有多语言组件
 */

// 导入组件以触发注册
import './Hero';

// 再导出相关工具函数
export {
    registerLocalizedComponent,
    registerLocalizedComponentAsync,
    registerComponents,
    getLocalizedComponent,
    getRegisteredComponents,
    hasLocalizedComponent,
} from '@/lib/i18n/localized-components';

export {
    useLocalizedComponent,
    useLocale,
} from '@/lib/i18n/use-localized-component';
