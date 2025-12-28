import { registerSection } from '@/lib/sections/registry';
import { CountdownSection } from './CountdownSection';

registerSection({
    type: 'countdown',
    name: '倒计时',
    description: '活动倒计时或限时优惠',
    category: 'marketing',
    component: CountdownSection,
    defaultData: {
        headline: '限时优惠即将结束',
        subheadline: '把握最后机会，立即升级您的会员权益，享受 5 折优惠。',
        targetDate: '2025-12-31T23:59:59'
    },
    defaultStyle: {
        backgroundColor: 'bg-blue-600',
        textColor: 'text-white',
        padding: 'py-20'
    },
    schema: {
        data: {
            headline: { type: 'text', label: '主标题' },
            subheadline: { type: 'text', label: '副标题' },
            targetDate: { type: 'text', label: '目标时间 (ISO格式)' }
        },
        style: {
            backgroundColor: {
                type: 'select',
                label: '背景颜色',
                options: [
                    { label: '品牌蓝', value: 'bg-blue-600' },
                    { label: '深色', value: 'bg-gray-900' },
                    { label: '紫色', value: 'bg-purple-600' },
                    { label: '红色', value: 'bg-red-600' }
                ]
            },
            textColor: {
                type: 'select',
                label: '文字颜色',
                options: [
                    { label: '白色', value: 'text-white' },
                    { label: '黑色', value: 'text-gray-900' }
                ]
            }
        }
    }
});
