import { registerSection } from '@/lib/sections/registry';
import { Compare02Section } from './Compare02Section';

registerSection({
    type: 'compare-02', name: '卡片对比表', description: '卡片式版本对比', category: 'data',
    component: Compare02Section,
    defaultData: {
        title: '定价方案', subtitle: '',
        columns: [{ name: '入门版', price: '免费' }, { name: '专业版', price: '¥199/月' }, { name: '企业版', price: '¥599/月' }],
        features: [
            { name: '项目数量', values: ['3个', '无限', '无限'] },
            { name: '团队成员', values: ['2人', '10人', '无限'] },
            { name: '高级功能', values: ['✗', '✓', '✓'] }
        ]
    },
    defaultStyle: { backgroundColor: '#f9fafb', textColor: '#111827', accentColor: '#10b981' },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' },
            columns: { type: 'list', label: '版本列', itemSchema: { name: { type: 'text', label: '版本名' }, price: { type: 'text', label: '价格' } } } as any,
            features: { type: 'list', label: '功能行', itemSchema: { name: { type: 'text', label: '功能名' }, values: { type: 'textarea', label: '各版本值' } } } as any
        },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
