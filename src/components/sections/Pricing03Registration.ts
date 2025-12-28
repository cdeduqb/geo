import { registerSection } from '@/lib/sections/registry';
import { Pricing03Section } from './Pricing03Section';

registerSection({
    type: 'pricing-03', name: '卡片价格表', description: '圆角卡片定价', category: 'marketing',
    component: Pricing03Section,
    defaultData: {
        title: '灵活的定价', subtitle: '选择最适合您的方案',
        plans: [
            { name: '基础版', icon: '🚀', price: '¥49', period: '月', features: ['3个项目', '5GB空间', '基础分析'], buttonText: '免费试用' },
            { name: '增长版', icon: '⚡', price: '¥149', period: '月', features: ['10个项目', '50GB空间', '高级分析', '优先支持'], buttonText: '立即升级' },
            { name: '专业版', icon: '💎', price: '¥399', period: '月', features: ['无限项目', '无限空间', '所有功能', '专属客服'], buttonText: '联系我们' }
        ]
    },
    defaultStyle: { backgroundColor: '#f9fafb', textColor: '#111827', accentColor: '#10b981' },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' },
            plans: { type: 'list', label: '定价方案', itemSchema: { name: { type: 'text', label: '方案名' }, icon: { type: 'text', label: '图标' }, price: { type: 'text', label: '价格' }, period: { type: 'text', label: '周期' }, features: { type: 'textarea', label: '功能列表' }, buttonText: { type: 'text', label: '按钮文字' } } } as any
        },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
