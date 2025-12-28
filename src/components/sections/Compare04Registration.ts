import { registerSection } from '@/lib/sections/registry';
import { Compare04Section } from './Compare04Section';

registerSection({
    type: 'compare-04', name: '双列对比', description: '两产品直接对比', category: 'data',
    component: Compare04Section,
    defaultData: {
        title: '方案对比', subtitle: '',
        leftProduct: { name: '标准版', price: '¥99/月', features: ['5个项目', '基础功能', '邮件支持', '月度报告'] },
        rightProduct: { name: '高级版', price: '¥299/月', features: ['无限项目', '全部功能', '7×24支持', '实时报告', 'API访问', '定制开发'] }
    },
    defaultStyle: { backgroundColor: '#ede9fe', textColor: '#111827', accentColor: '#8b5cf6' },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' },
            leftProduct: { type: 'object', label: '左侧产品', properties: { name: { type: 'text', label: '名称' }, price: { type: 'text', label: '价格' }, features: { type: 'textarea', label: '功能列表' } } } as any,
            rightProduct: { type: 'object', label: '右侧产品', properties: { name: { type: 'text', label: '名称' }, price: { type: 'text', label: '价格' }, features: { type: 'textarea', label: '功能列表' } } } as any
        },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
