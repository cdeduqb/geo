import { registerSection } from '@/lib/sections/registry';
import { Countdown04Section } from './Countdown04Section';

registerSection({
    type: 'countdown-04', name: '促销倒计时', description: '促销价格倒计时', category: 'marketing',
    component: Countdown04Section,
    defaultData: { title: '限时特惠', subtitle: '仅限今日', discount: '5折优惠', originalPrice: '¥999', salePrice: '¥499', targetDate: new Date(Date.now() + 86400000).toISOString() },
    defaultStyle: { backgroundColor: '#fef2f2', textColor: '#111827', accentColor: '#ef4444' },
    schema: {
        data: { title: { type: 'text', label: '主标题' }, subtitle: { type: 'text', label: '副标题' }, discount: { type: 'text', label: '折扣标签' }, originalPrice: { type: 'text', label: '原价' }, salePrice: { type: 'text', label: '促销价' }, targetDate: { type: 'text', label: '目标日期' } },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
