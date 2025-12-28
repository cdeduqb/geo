import { registerSection } from '@/lib/sections/registry';
import { CTA04Section } from './CTA04Section';

registerSection({
    type: 'cta-04', name: '卡片号召', description: '卡片式双列布局', category: 'marketing',
    component: CTA04Section,
    defaultData: { title: '开始您的免费试用', subtitle: '体验所有高级功能', buttonText: '免费试用14天', buttonUrl: '#', features: ['无需信用卡', '随时取消', '完整功能', '7×24支持'] },
    defaultStyle: { backgroundColor: '#f9fafb', textColor: '#111827', accentColor: '#8b5cf6' },
    schema: {
        data: { title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' }, buttonText: { type: 'text', label: '按钮文字' }, buttonUrl: { type: 'link', label: '按钮链接' }, features: { type: 'textarea', label: '功能列表' } },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
