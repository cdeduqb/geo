import { registerSection } from '@/lib/sections/registry';
import { Pricing06Section } from './Pricing06Section';

registerSection({
    type: 'pricing-06', name: '渐变价格表', description: '渐变突出定价', category: 'marketing',
    component: Pricing06Section,
    defaultData: {
        title: '透明定价', subtitle: '无隐藏费用',
        plans: [
            { name: '基础', price: '¥0', period: '永久免费', features: ['1个项目', '基础功能', '社区支持'], buttonText: '免费使用' },
            { name: '专业', price: '¥199', period: '每月', features: ['无限项目', '全部功能', '优先支持', 'API访问'], buttonText: '开始试用' },
            { name: '企业', price: '定制', period: '按需定价', features: ['专属部署', '定制功能', '专属客服'], buttonText: '联系我们' }
        ]
    },
    defaultStyle: { backgroundColor: '#fdf2f8', textColor: '#111827', accentColor: '#ec4899' },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' },
            plans: { type: 'list', label: '定价方案', itemSchema: { name: { type: 'text', label: '方案名' }, price: { type: 'text', label: '价格' }, period: { type: 'text', label: '周期' }, features: { type: 'textarea', label: '功能列表' }, buttonText: { type: 'text', label: '按钮文字' } } } as any
        },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
