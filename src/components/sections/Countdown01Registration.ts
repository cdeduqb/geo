import { registerSection } from '@/lib/sections/registry';
import { Countdown01Section } from './Countdown01Section';

registerSection({
    type: 'countdown-01', name: '简约倒计时', description: '居中倒计时展示', category: 'marketing',
    component: Countdown01Section,
    defaultData: { title: '距离活动开始还有', subtitle: '千万不要错过这次机会', targetDate: new Date(Date.now() + 86400000 * 7).toISOString(), buttonText: '立即报名', buttonUrl: '#' },
    defaultStyle: { backgroundColor: '#3b82f6', textColor: '#ffffff' },
    schema: {
        data: { title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' }, targetDate: { type: 'text', label: '目标日期(ISO格式)' }, buttonText: { type: 'text', label: '按钮文字' }, buttonUrl: { type: 'link', label: '按钮链接' } },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' } }
    }
});
