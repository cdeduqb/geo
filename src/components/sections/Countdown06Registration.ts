import { registerSection } from '@/lib/sections/registry';
import { Countdown06Section } from './Countdown06Section';

registerSection({
    type: 'countdown-06', name: '渐变倒计时', description: '渐变双列布局', category: 'marketing',
    component: Countdown06Section,
    defaultData: { title: '新品发布', subtitle: '敬请期待我们的全新产品', targetDate: new Date(Date.now() + 86400000 * 10).toISOString(), features: ['全新设计', '性能提升', '更多功能', '限时优惠'] },
    defaultStyle: { backgroundColor: '#ec4899', textColor: '#ffffff' },
    schema: {
        data: { title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' }, targetDate: { type: 'text', label: '目标日期' }, features: { type: 'textarea', label: '功能列表' } },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' } }
    }
});
