import { registerSection } from '@/lib/sections/registry';
import { Countdown05Section } from './Countdown05Section';

registerSection({
    type: 'countdown-05', name: '圆形倒计时', description: '圆形玻璃风格', category: 'marketing',
    component: Countdown05Section,
    defaultData: { title: '即将上线', targetDate: new Date(Date.now() + 86400000 * 14).toISOString(), buttonText: '提前预约', buttonUrl: '#', backgroundImage: '' },
    defaultStyle: { backgroundColor: '#8b5cf6', textColor: '#ffffff' },
    schema: {
        data: { title: { type: 'text', label: '主标题' }, targetDate: { type: 'text', label: '目标日期' }, buttonText: { type: 'text', label: '按钮文字' }, buttonUrl: { type: 'link', label: '按钮链接' }, backgroundImage: { type: 'image', label: '背景图片' } },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' } }
    }
});
