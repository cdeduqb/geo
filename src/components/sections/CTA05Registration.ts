import { registerSection } from '@/lib/sections/registry';
import { CTA05Section } from './CTA05Section';

registerSection({
    type: 'cta-05', name: '邮箱订阅号召', description: '邮箱输入框样式', category: 'marketing',
    component: CTA05Section,
    defaultData: { title: '获取最新资讯', subtitle: '订阅我们的新闻通讯，第一时间获取产品更新和优惠信息', emailPlaceholder: '输入您的邮箱', buttonText: '订阅' },
    defaultStyle: { backgroundColor: '#ede9fe', textColor: '#111827', accentColor: '#8b5cf6' },
    schema: {
        data: { title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' }, emailPlaceholder: { type: 'text', label: '输入框占位文字' }, buttonText: { type: 'text', label: '按钮文字' } },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
