import { registerSection } from '@/lib/sections/registry';
import { CTA02Section } from './CTA02Section';

registerSection({
    type: 'cta-02', name: '双按钮号召', description: '左文右按钮布局', category: 'marketing',
    component: CTA02Section,
    defaultData: { title: '今天就开始您的旅程', subtitle: '加入数千满意客户的行列', primaryButtonText: '立即开始', primaryButtonUrl: '#', secondaryButtonText: '了解更多', secondaryButtonUrl: '#' },
    defaultStyle: { backgroundColor: '#0f172a', textColor: '#f1f5f9', accentColor: '#f59e0b' },
    schema: {
        data: { title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' }, primaryButtonText: { type: 'text', label: '主按钮文字' }, primaryButtonUrl: { type: 'link', label: '主按钮链接' }, secondaryButtonText: { type: 'text', label: '次按钮文字' }, secondaryButtonUrl: { type: 'link', label: '次按钮链接' } },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
