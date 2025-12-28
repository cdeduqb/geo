import { registerSection } from '@/lib/sections/registry';
import { Pricing04Section } from './Pricing04Section';

registerSection({
    type: 'pricing-04', name: '横向价格表', description: '横向排列定价', category: 'marketing',
    component: Pricing04Section,
    defaultData: {
        title: '简单透明的定价', subtitle: '',
        plans: [
            { name: '个人版', description: '适合个人使用', price: '¥29', period: '月', buttonText: '开始使用' },
            { name: '团队版', description: '适合小型团队', price: '¥99', period: '月', buttonText: '免费试用' },
            { name: '企业版', description: '定制化解决方案', price: '联系我们', buttonText: '获取报价' }
        ]
    },
    defaultStyle: { backgroundColor: '#ede9fe', textColor: '#111827', accentColor: '#8b5cf6' },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' },
            plans: { type: 'list', label: '定价方案', itemSchema: { name: { type: 'text', label: '方案名' }, description: { type: 'text', label: '描述' }, price: { type: 'text', label: '价格' }, period: { type: 'text', label: '周期' }, buttonText: { type: 'text', label: '按钮文字' } } } as any
        },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
