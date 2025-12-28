import { registerSection } from '@/lib/sections/registry';
import { Countdown02Section } from './Countdown02Section';

registerSection({
    type: 'countdown-02', name: '暗色倒计时', description: '暗色横向布局', category: 'marketing',
    component: Countdown02Section,
    defaultData: { title: '限时特惠', subtitle: '优惠即将结束', targetDate: new Date(Date.now() + 86400000 * 3).toISOString(), buttonText: '立即抢购', buttonUrl: '#' },
    defaultStyle: { backgroundColor: '#0f172a', textColor: '#f1f5f9', accentColor: '#f59e0b' },
    schema: {
        data: { title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' }, targetDate: { type: 'text', label: '目标日期' }, buttonText: { type: 'text', label: '按钮文字' }, buttonUrl: { type: 'link', label: '按钮链接' } },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
