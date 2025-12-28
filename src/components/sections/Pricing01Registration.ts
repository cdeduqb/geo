import { registerSection } from '@/lib/sections/registry';
import { Pricing01Section } from './Pricing01Section';

registerSection({
    type: 'pricing-01', name: '简约价格表', description: '三列简约定价', category: 'marketing',
    component: Pricing01Section,
    defaultData: {
        title: '定价方案', subtitle: '选择适合您的方案',
        plans: [
            { name: '基础版', price: '¥99', period: '月', features: ['5个项目', '10GB存储', '邮件支持'], buttonText: '开始使用' },
            { name: '专业版', price: '¥299', period: '月', featured: true, features: ['无限项目', '100GB存储', '7×24支持', 'API访问'], buttonText: '立即升级' },
            { name: '企业版', price: '¥999', period: '月', features: ['无限一切', '专属客服', '定制开发', 'SLA保障'], buttonText: '联系我们' }
        ]
    },
    defaultStyle: { backgroundColor: '#ffffff', textColor: '#111827', accentColor: '#3b82f6' },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' },
            plans: { type: 'list', label: '定价方案', itemSchema: { name: { type: 'text', label: '方案名' }, price: { type: 'text', label: '价格' }, period: { type: 'text', label: '周期' }, featured: { type: 'boolean', label: '推荐' }, features: { type: 'textarea', label: '功能列表' }, buttonText: { type: 'text', label: '按钮文字' } } } as any
        },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
