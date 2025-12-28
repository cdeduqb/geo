import { registerSection } from '@/lib/sections/registry';
import { Compare03Section } from './Compare03Section';

registerSection({
    type: 'compare-03', name: '暗色对比表', description: '暗色主题对比', category: 'data',
    component: Compare03Section,
    defaultData: {
        title: '产品对比', subtitle: '',
        columns: [{ name: '我们' }, { name: '竞品A' }, { name: '竞品B' }],
        features: [
            { name: '性能', values: ['极速', '普通', '较慢'] },
            { name: '价格', values: ['实惠', '昂贵', '中等'] },
            { name: '支持', values: ['7×24', '工作日', '仅邮件'] }
        ]
    },
    defaultStyle: { backgroundColor: '#0f172a', textColor: '#f1f5f9', accentColor: '#f59e0b' },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' },
            columns: { type: 'list', label: '对比列', itemSchema: { name: { type: 'text', label: '名称' } } } as any,
            features: { type: 'list', label: '对比项', itemSchema: { name: { type: 'text', label: '功能名' }, values: { type: 'textarea', label: '各列值' } } } as any
        },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
