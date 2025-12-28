import { registerSection } from '@/lib/sections/registry';
import { CTA03Section } from './CTA03Section';

registerSection({
    type: 'cta-03', name: '大气号召', description: '大字体居中号召', category: 'marketing',
    component: CTA03Section,
    defaultData: { title: '让我们一起创造奇迹', subtitle: '加入超过10万用户的社区，体验前所未有的效率提升', buttonText: '免费开始', buttonUrl: '#', backgroundImage: '' },
    defaultStyle: { backgroundColor: '#10b981', textColor: '#ffffff', accentColor: '#059669' },
    schema: {
        data: { title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' }, buttonText: { type: 'text', label: '按钮文字' }, buttonUrl: { type: 'link', label: '按钮链接' }, backgroundImage: { type: 'image', label: '背景图片' } },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
