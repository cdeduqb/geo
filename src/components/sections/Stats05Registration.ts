import { registerSection } from '@/lib/sections/registry';
import { Stats05Section } from './Stats05Section';

registerSection({
    type: 'stats-05',
    name: '边框统计',
    description: '左边框强调的统计',
    category: 'data',
    component: Stats05Section,
    defaultData: {
        title: '关键指标',
        subtitle: '',
        stats: [
            { value: '99.9%', label: '系统可用性', subtitle: 'SLA保障' },
            { value: '<50ms', label: '响应时间', subtitle: '平均延迟' },
            { value: '100万+', label: '日处理量', subtitle: '峰值能力' },
            { value: '256位', label: '数据加密', subtitle: '安全保障' },
            { value: '3地', label: '数据中心', subtitle: '异地备份' },
            { value: '7×24', label: '监控服务', subtitle: '实时监控' }
        ]
    },
    defaultStyle: { backgroundColor: '#ede9fe', textColor: '#111827', accentColor: '#8b5cf6' },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            stats: { type: 'list', label: '统计项', itemSchema: { value: { type: 'text', label: '数值' }, label: { type: 'text', label: '标签' }, subtitle: { type: 'text', label: '副标签' } } } as any
        },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
