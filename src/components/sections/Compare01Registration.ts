import { registerSection } from '@/lib/sections/registry';
import { Compare01Section } from './Compare01Section';

registerSection({
    type: 'compare-01', name: '简约对比表', description: '基础功能对比表', category: 'data',
    component: Compare01Section,
    defaultData: {
        title: '版本对比', subtitle: '选择适合您的方案',
        columns: [{ name: '基础版', price: '¥99/月' }, { name: '专业版', price: '¥299/月' }, { name: '企业版', price: '¥999/月' }],
        features: [
            { name: '用户数量', values: ['5人', '50人', '无限'] },
            { name: '存储空间', values: ['10GB', '100GB', '1TB'] },
            { name: '技术支持', values: ['✗', '✓', '✓'] },
            { name: '定制开发', values: ['✗', '✗', '✓'] }
        ]
    },
    defaultStyle: { backgroundColor: '#ffffff', textColor: '#111827', accentColor: '#3b82f6' },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' },
            columns: { type: 'list', label: '版本列', itemSchema: { name: { type: 'text', label: '版本名' }, price: { type: 'text', label: '价格' } } } as any,
            features: { type: 'list', label: '功能行', itemSchema: { name: { type: 'text', label: '功能名' }, values: { type: 'textarea', label: '各版本值（逗号分隔）' } } } as any
        },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
