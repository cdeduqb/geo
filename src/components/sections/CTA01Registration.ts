import { registerSection } from '@/lib/sections/registry';
import { CTA01Section } from './CTA01Section';

registerSection({
    type: 'cta-01', name: '简约号召', description: '简洁居中号召', category: 'marketing',
    component: CTA01Section,
    defaultData: { title: '准备好开始了吗？', subtitle: '立即加入我们，开启您的数字化转型之旅', buttonText: '免费试用', buttonUrl: '#' },
    defaultStyle: { backgroundColor: '#3b82f6', textColor: '#ffffff', accentColor: '#1d4ed8' },
    schema: {
        data: { title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' }, buttonText: { type: 'text', label: '按钮文字' }, buttonUrl: { type: 'link', label: '按钮链接' } },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
