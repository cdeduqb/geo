import { registerSection } from '@/lib/sections/registry';
import { Pricing02Section } from './Pricing02Section';

registerSection({
    type: 'pricing-02', name: '暗色价格表', description: '暗色主题定价', category: 'marketing',
    component: Pricing02Section,
    defaultData: {
        title: '选择您的方案', subtitle: '',
        plans: [
            { name: '入门版', description: '适合个人用户', price: '免费', features: ['基础功能', '社区支持'], buttonText: '免费开始' },
            { name: '专业版', description: '适合团队使用', price: '¥199', featured: true, features: ['全部功能', '优先支持', 'API访问', '团队协作'], buttonText: '立即订阅' },
            { name: '企业版', description: '定制化服务', price: '定制', features: ['无限扩展', '专属顾问', 'SLA保障'], buttonText: '联系销售' }
        ]
    },
    defaultStyle: { backgroundColor: '#0f172a', textColor: '#f1f5f9', accentColor: '#f59e0b' },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' },
            plans: { type: 'list', label: '定价方案', itemSchema: { name: { type: 'text', label: '方案名' }, description: { type: 'text', label: '描述' }, price: { type: 'text', label: '价格' }, featured: { type: 'boolean', label: '推荐' }, features: { type: 'textarea', label: '功能列表' }, buttonText: { type: 'text', label: '按钮文字' } } } as any
        },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
