import { registerSection } from '@/lib/sections/registry';
import { Countdown03Section } from './Countdown03Section';

registerSection({
    type: 'countdown-03', name: '大气倒计时', description: '大字体居中展示', category: 'marketing',
    component: Countdown03Section,
    defaultData: { title: '年度盛典', subtitle: '期待您的参与', eventName: '2024年度发布会', targetDate: new Date(Date.now() + 86400000 * 30).toISOString() },
    defaultStyle: { backgroundColor: '#10b981', textColor: '#ffffff' },
    schema: {
        data: { title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' }, eventName: { type: 'text', label: '活动名称' }, targetDate: { type: 'text', label: '目标日期' } },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' } }
    }
});
