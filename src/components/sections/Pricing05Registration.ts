import { registerSection } from '@/lib/sections/registry';
import { Pricing05Section } from './Pricing05Section';

registerSection({
    type: 'pricing-05', name: '双列价格表', description: '两列对比定价', category: 'marketing',
    component: Pricing05Section,
    defaultData: {
        title: '选择您的计划', subtitle: '',
        plans: [
            { name: '标准版', price: '¥99', period: '月', features: ['所有基础功能', '5个用户', '10GB存储', '邮件支持'], buttonText: '开始试用' },
            { name: '高级版', price: '¥299', period: '月', featured: true, features: ['所有功能', '无限用户', '100GB存储', '7×24支持', 'API访问', '优先功能'], buttonText: '立即升级' }
        ]
    },
    defaultStyle: { backgroundColor: '#ecfdf5', textColor: '#111827', accentColor: '#10b981' },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' },
            plans: { type: 'list', label: '定价方案', itemSchema: { name: { type: 'text', label: '方案名' }, price: { type: 'text', label: '价格' }, period: { type: 'text', label: '周期' }, featured: { type: 'boolean', label: '推荐' }, features: { type: 'textarea', label: '功能列表' }, buttonText: { type: 'text', label: '按钮文字' } } } as any
        },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
